import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ChatBot } from './chatbot.types';
import { MotorChatForm } from './motor-api.types';

@Injectable({ providedIn: 'root' })
export class MotorAiService {
    private _httpClient = inject(HttpClient);
    private apiUrl = environment.motorAiUrl;

    private STREAM_OPTION: any = {
        observe: 'events',
        responseType: 'text',
        reportProgress: true,
    };
    constructor(private zone: NgZone) {}

    submitVin(vin: string): Observable<any> {
        return this._httpClient.post(this.apiUrl + '/submit-vin', {
            vin_id: vin,
        });
    }

    submitSelect(id: string, makeName: string): Observable<any> {
        return this._httpClient.post(this.apiUrl + '/submit-select', {
            select_id: id,
            make_name: makeName,
        });
    }

    chat1(motorCharForm: MotorChatForm): Observable<any> {
        return this._httpClient.post(
            this.apiUrl + '/chatbot',
            motorCharForm,
            this.STREAM_OPTION
        );
    }

    chat(motorCharForm: MotorChatForm) {
        return fetch(this.apiUrl + '/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(motorCharForm),
        });
    }

    streamChatbotResponse(motorCharForm: MotorChatForm): Observable<string> {
        return new Observable((observer) => {
            fetch(this.apiUrl + '/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motorCharForm),
            })
                .then((response) => {
                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();

                    const read = () => {
                        reader?.read().then(({ done, value }) => {
                            if (done) {
                                observer.complete();
                                return;
                            }
                            const chunk = decoder.decode(value, {
                                stream: true,
                            });
                            this.zone.run(() => {
                                observer.next(chunk); // Send each streamed chunk
                            });
                            read();
                        });
                    };

                    read();
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    getHistory(userId: string, historyId: string) {
        return this._httpClient.post(this.apiUrl + '/history', {
            user_id: userId,
            history_id: historyId,
        });
    }

    getSuggestion(chatBot: ChatBot) {
        return this._httpClient.post(this.apiUrl + '/get-suggestions', chatBot);
    }

    getImage(chatBot: ChatBot) {
        return this._httpClient.post(this.apiUrl + '/get-images', chatBot);
    }

    getVehicleInfo(type: number, id: string) {
        return this._httpClient.post(this.apiUrl + '/get-info', {
            type,
            id,
        });
    }

    //by select

    getYears() {
        return this._httpClient.get(this.apiUrl + '/get-year');
    }

    getMakes(year: string) {
        return this._httpClient.post(this.apiUrl + '/get-make', { year });
    }

    getModels(year: string, makeId: string) {
        return this._httpClient.post(this.apiUrl + '/get-model', {
            year,
            make_id: makeId,
        });
    }

    getEngines(year: string, makeId: string, modelId: string) {
        return this._httpClient.post(this.apiUrl + '/get-engine', {
            year,
            make_id: makeId,
            model_id: modelId,
        });
    }

    streamChatbotResponse2(payload: any): Observable<string> {
        return new Observable((observer) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.apiUrl + '/chatbot', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            let receivedText = '';

            xhr.onreadystatechange = () => {
                if (
                    xhr.readyState === XMLHttpRequest.LOADING ||
                    xhr.readyState === XMLHttpRequest.DONE
                ) {
                    const newText = xhr.responseText.substring(
                        receivedText.length
                    );
                    receivedText = xhr.responseText;

                    if (newText) {
                        observer.next(newText);
                    }
                }

                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status !== 200) {
                        observer.error(
                            `Error: ${xhr.status} - ${xhr.statusText}`
                        );
                    } else {
                        observer.complete();
                    }
                }
            };

            xhr.onerror = () => {
                observer.error('Network error');
            };

            xhr.timeout = 300000; // 5 minutes
            xhr.send(JSON.stringify(payload));
        });
    }

    streamChatbotResponse3(payload: any) {
        return new Observable<string>((observer) => {
            // Using fetch API for streaming responses
            fetch(this.apiUrl + '/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (!response.ok) {
                        observer.error(
                            `Stream text in UI Error: ${response.statusText}`
                        );
                        return;
                    }

                    // Get the reader from the response body stream
                    const reader = response.body?.getReader();
                    if (!reader) {
                        observer.error('Could not get reader from response');
                        return;
                    }

                    // Function to process the stream chunks
                    const processText = async () => {
                        try {
                            const decoder = new TextDecoder();

                            while (true) {
                                const { done, value } = await reader.read();

                                if (done) {
                                    observer.complete();
                                    break;
                                }

                                // Decode the chunk and emit it
                                const chunk = decoder.decode(value, {
                                    stream: true,
                                });
                                observer.next(chunk);
                            }
                        } catch (error) {
                            observer.error(
                                `Error in stream processing: ${error}`
                            );
                        }
                    };

                    processText();
                })
                .catch((error) => {
                    observer.error(`Error in call_chatbot_api: ${error}`);
                    observer.complete();
                });
        });
    }

    refreshLink(url: string) {
        return this._httpClient.post(this.apiUrl + '/refresh-link', {
            link: url,
        });
    }
}
