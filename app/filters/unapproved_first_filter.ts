import {Reviewer} from '../services/models';

export function UnapprovedFirst() {
    return (reviewers: Reviewer[]): Reviewer[] => {
        return reviewers.sort((previousElement, currentElement) => {
            if (!previousElement.approved && currentElement.approved) {
                return -1;
            } else if (previousElement.approved && !currentElement.approved) {
                return 1;
            } else {
                return 0;
            }
        });
    };
}
