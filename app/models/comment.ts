import {CommentLinksInterface} from './comment_links_interface';
import {CommentContentInterface} from './comment_content_interface';

export class Comment {
    public id: number;
    public content: CommentContentInterface;
    public links: CommentLinksInterface;
}
