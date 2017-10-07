export class Project {
    public name: string = '';
    public fullName: string = '';

    public static deslugify(slug: string): string {
        return slug.replace(/__/g, '/');
    }

    public slugify(): string {
        return this.fullName.replace(/\//g, '__');
    }
}
