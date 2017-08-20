import {Project} from '../../models/project';

export class ProjectFactory {
    public static create(rawObject: any): Project {
        const project = new Project();
        if (rawObject.hasOwnProperty('name')) {
            project.name = rawObject.name;
        }
        if (rawObject.hasOwnProperty('fullName')) {
            project.fullName = rawObject.fullName;
        }

        return project;
    }
}
