export interface PDF {
    user_id: string;
    type: FileType;
    file?: File;
    product: string;
    url?: String;
    mode?: number
}

export enum FileType {
    DEFAULT, CATALOG, CONTENT
}
