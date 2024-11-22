export interface ChatBot {
    action: string;
    user_id: string;
    query?: string;
    history_id?: string;
    list_retrievers?: Collection[];
    answer?: string;
    num_docs?: number;
    num_top_docs? :number
    mode?:  number
}

interface Collection {
    collection_name: string;
}