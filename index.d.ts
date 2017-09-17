declare module '*.html' {
    const content: string;
    export default content;
}

declare const PRODUCTION: boolean;
declare const DEV: boolean;
declare const TEST: boolean;
