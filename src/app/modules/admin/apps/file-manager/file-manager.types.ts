export interface Items {
    files: Item[];
}

export interface Item {
    collection_name?: string;
    file_name: string;
    name: string;
    sku:string;
}
