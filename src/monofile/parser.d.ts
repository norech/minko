export function parse(str: string): Tag[];

export interface Tag {
    name: string;
    props: { [key: string]: string; };
    children?: string;
}