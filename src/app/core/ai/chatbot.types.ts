export interface ChatBot {
    action: string;
    user_id: string;
    query?: string;
    session_id?:string;
    history_id?: string;
    list_retrievers?: Collection[];
    answer?: string;
    num_docs?: number;
    num_top_docs?: number;
    mode?: number;
    more_images?: number;
}

interface Collection {
    collection_name: string;
    file_name?: string;
    product?: string;
    mode?: number
}
