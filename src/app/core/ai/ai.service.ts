import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { User } from 'app/core/user/user.types';
import { Observable, ReplaySubject, of, switchMap } from 'rxjs';
import { ChatBot } from './chatbot.types';
import { PDF } from './file.types';

@Injectable({ providedIn: 'root' })
export class AiService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private url = environment.baseUrl;
    private apiUrl = environment.baseUrl + environment.apiUrl;

    private STREAM_OPTION: any = {
        observe: 'events',
        responseType: 'text',
        reportProgress: true,
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    // set user(value: User) {
    //     // Store the value
    //     this._user.next(value);
    // }

    // get user$(): Observable<User> {
    //     return this._user.asObservable();
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    // get(): Observable<User> {
    //     return this._httpClient.get<User>('api/common/user').pipe(
    //         tap((user) => {
    //             this._user.next(user);
    //         })
    //     );
    // }

    /**
     * Get the demo api
     */
    hello(): Observable<any> {
        return this._httpClient.get<any>(this.url).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    /**
     * Upload file
     */
    uploadFile(pdf: PDF): Observable<any> {
        // return this._httpClient.post<any>(this.apiUrl + 'upload-files', pdf);
        const formData: FormData = new FormData();
        formData.append('user_id', pdf.user_id);
        formData.append('product', pdf.product);
        formData.append('file', pdf.file);
        formData.append('type', pdf.type.toString());

        const req = new HttpRequest(
            'POST',
            this.apiUrl + 'upload-files',
            formData,
            {
                reportProgress: true,
                responseType: 'json',
            }
        );

        return this._httpClient.request(req);
    }

    /**
     * get all file
     */
    getAllFile() {
        return this._httpClient.get<any>(this.apiUrl + 'get-uploaded-files/E2');
    }

    /**
     * chatbot unified
     */
    chatbotUnified(chatBot: ChatBot) {
        return this._httpClient.post<any>(
            this.apiUrl + 'chatbot-unified',
            chatBot
        );
    }

    getOverview(chatBot: ChatBot): Observable<any> {
        // const headers = new HttpHeaders({
        //     // 'Content-Type': 'text/event-stream',
        // });
        return this._httpClient.post(
            this.apiUrl + 'overview',
            chatBot,
            this.STREAM_OPTION
        );
    }

    makeQuestion(chatBot: ChatBot): Observable<any> {
        // const headers = new HttpHeaders({
        //     // 'Content-Type': 'text/event-stream',
        // });
        return this._httpClient.post(
            this.apiUrl + 'chatbot',
            chatBot,
            this.STREAM_OPTION
        );
    }

    getSuggestion(chatBot: ChatBot) {
        return this._httpClient.post(this.apiUrl + 'get-suggestions', chatBot);
    }

    getImage(chatBot: ChatBot) {
        return this._httpClient.post(this.apiUrl + 'get-images', chatBot);
    }
}
