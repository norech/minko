import { isValidComponentName, Component } from '../Component';
import { parse, Tag } from './parser';
import { Minko } from '../Minko';
import * as esprima from 'esprima';
import { ExpressionStatement, FunctionExpression } from 'estree';

/**
 * Creates a component from Minko monofile source text
 * @param name Name of component
 * @param code Milk HTML code
 */
export function createComponentFromMonofileText(name: string, code: string, minkoInstance: Minko, file: string) {
    if (!isValidComponentName(name)) {
        throw `${name} > Invalid component name`;
    }

    const tags = parse(code);
    const component = new Component(name, minkoInstance);
    component.file = file;

    for (const tag of tags) {
        retrieveTemplateFromTag(component, tag);
    }
    component._updateTemplates();

    return component;
}

/**
 * Helper to simplify code of `createComponentFromText`
 */
function retrieveTemplateFromTag(component: Component, tag: Tag) {
    const templates = component.templates;

    switch (tag.name) {
    case 'script':
        if (typeof templates.scripts === 'undefined') {
            templates.scripts = {};
        }

        if ('src' in tag.props) {
            throw `${component.name} > Script src="" is not yet supported.`;
        }

        if (typeof tag.children === 'undefined') {
            throw `${component.name} > Script body expected.`;
        }

        try {

            let scriptFnc: () => Promise<void>;

            if (!isCodeValid(tag.children)) {
                throw new SyntaxError(`Invalid code in monofile:\n${tag.children}`);
            }

            if (typeof module !== 'undefined' && typeof component.file !== 'undefined') {
                const m = new (module.constructor as any)();
                m.paths = module.paths;
                // TODO: Find a better way to create a module function
                // Note: I removed the children eval() part because I wanted access to "await".
                m._compile(`
                module.exports = async function() {
                    ${tag.children}
                };
                `,         component.file);
                scriptFnc = m.exports;
            } else {
                // tslint:disable-next-line:no-function-constructor-with-string-args
                scriptFnc = new Function(`
                return (async function() {
                    ${tag.children}
                })();
                `) as () => Promise<void>;
            }

            if ('prerender' in tag.props) {
                templates.scripts.prerender = scriptFnc;
            } else {
                console.warn(`${component.name} > Unknown script kind. Assumed 'prerender'. Next time, `
                        + "please add 'prerender' property to component's script tag.");
                templates.scripts.prerender = scriptFnc;
            }

        } catch (ex) {
            const syntaxError = new SyntaxError(`${component.name} > ${ex instanceof Error ? ex.message : ex}`);
            const stack = (syntaxError.stack || '').split('\n');
            stack.splice(1, 0, `    at <script> (${component.file})`);
            syntaxError.stack = stack.join('\n');
            throw syntaxError;
        }
        break;

    case 'style':
        templates.style = tag.children;
        break;

    case 'template':
        templates.markup = tag.children;
        break;

    default:
        throw `${component.name} > Invalid tag name: ${tag.name}.`;
    }
}

function isCodeValid(js: string) {
    const programCode = `(async function() {${js.trim()}})`;

    const program = esprima.parseScript(programCode);

    if (program.body.length !== 1 || program.body[0].type !== 'ExpressionStatement') {
        return false;
    }

    const expression = program.body[0] as ExpressionStatement;

    if (expression.expression.type !== 'FunctionExpression') {
        return false;
    }

    const func = expression.expression as FunctionExpression;

    if (func.async === false) {
        return false;
    }

    return true;
}
