export type BookmarkItem = {
    id : Number;
    session_id : string;
    text : string;
    xpath : string;
    created_at : string;
    note ?: string;
    parent_bookmark ?: Number;
}