export interface Motor<T> {
    status: number;
    message: string;
    data: T | T[];
}

export interface MotorChatForm {
    user_id: string;
    query: string;
    session_id: string;
    history_id: string;
    type: number;
    id: string;
}
