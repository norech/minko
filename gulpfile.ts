import { generate } from 'pegjs';
import { readFileSync, writeFileSync } from 'fs';
import gulp from 'gulp';
import gulpTypescript from 'gulp-typescript';
import merge2 from 'merge2';

const tsProject = gulpTypescript.createProject('tsconfig.json');

export async function buildParser() {
    const parser = generate(readFileSync(`${__dirname}/src/monofile/parser.pegjs`).toString(), {
        output: 'source',
        format: 'commonjs',
    });
    writeFileSync(`${__dirname}/build/monofile/parser.js`, parser);
}

export function buildTypescript() {
    const out = tsProject.src()
        .pipe(tsProject());

    return merge2([
        out.dts.pipe(gulp.dest('build')),
        out.js.pipe(gulp.dest('build')),
    ]);

}

export const build = gulp.series([
    buildTypescript,
    buildParser,
]);
