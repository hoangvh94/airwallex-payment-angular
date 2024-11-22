export interface PDF {
    user_id: string;
    type: FileType;
    file: File;
    product: string;
}

export enum FileType {
    DEFAULT, CATALOG, CONTENT
}
