import {
    HttpDownloadProgressEvent,
    HttpEvent,
    HttpEventType,
} from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AiService } from 'app/core/ai/ai.service';
import { ChatBot } from 'app/core/ai/chatbot.types';
import { Subscription } from 'rxjs';

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class ExampleComponent implements OnInit {
    /**
     * Constructor
     */
    private streamSubscription: Subscription;
    @ViewChild('signInNgForm') chatbotNgForm: NgForm;
    overviewData = '';
    answer = '';
    suggestion:any = [];
    images:any = [];
    chatbotForm: UntypedFormGroup;

    constructor(
        private _aiService: AiService,
        private _formBuilder: UntypedFormBuilder
    ) {}
    ngOnInit(): void {
        this.initForm();
        this.getOverview();
    }

    initForm() {
        // Create the form
        this.chatbotForm = this._formBuilder.group({
            query: [''],
        });
    }

    getOverview1() {
        const chatBot: ChatBot = {
            action: 'overview',
            user_id: 'E2',
            list_retrievers: [
                {
                    collection_name: 'E2_CHATBOTV2_1',
                },
            ],
        };
        this._aiService.chatbotUnified(chatBot).subscribe(
            (next) => {
                console.log(next);
            },
            (error) => {
                console.log(error);
                // // Re-enable the form
                // this.signInForm.enable();

                // // Reset the form
                // this.signInNgForm.resetForm();

                // // Set the alert
                // this.alert = {
                //     type: 'error',
                //     message: 'Wrong email or password',
                // };

                // // Show the alert
                // this.showAlert = true;
            }
        );
    }

    getOverview() {
        // const chatBot: ChatBot = {
        //     action: 'overview',
        //     user_id: 'E2',
        //     list_retrievers: [
        //         {
        //             collection_name: 'E2_CHATBOTV2_6',
        //         },
        //     ],
        // };
        // this._aiService.getOverview(chatBot).subscribe({
        //     next: (event: HttpEvent<string>) => {
        //           if (event.type === HttpEventType.DownloadProgress) {
        //             this.overviewData = (
        //               event as HttpDownloadProgressEvent
        //             ).partialText + "…";
        //           } else if (event.type === HttpEventType.Response) {
        //             this.overviewData = event.body;
        //           }
        //     },
        //     error: () => {
        //         //   this.loadingResponse = false;
        //         console.log('event.type');
        //     },
        // });
    }

    ask() {
        // let query = 'Pull Image from Docker';
        let query = this.chatbotForm.controls.query.value;
        const chatBot: ChatBot = {
            action: 'chatbot',
            user_id: 'E2',
            query: query,
            history_id: 'E2_CHATBOTV2_2_HST',
            list_retrievers: [{ collection_name: 'E2_CHATBOTV2_2' }],
            num_docs: 3,
            num_top_docs: 5,
            mode: 1,
        };
        this._aiService.makeQuestion(chatBot).subscribe({
            next: (event: HttpEvent<string>) => {
                if (event.type === HttpEventType.DownloadProgress) {
                    this.answer =
                        (event as HttpDownloadProgressEvent).partialText + '…';
                } else if (event.type === HttpEventType.Response) {
                    this.answer = event.body;
                    this.addSuggestion(this.answer);
                    this.addImage(this.answer);
                }
            },
            error: () => {
                //   this.loadingResponse = false;
                console.log('event.type');
            },
        });
    }

    addSuggestion(awnser: string) {
        // let query = 'Pull Image from Docker';
        let query = this.chatbotForm.controls.query.value;
        const chatBot: ChatBot = {
            action: 'get_suggestions',
            user_id: 'E2',
            query: query,
            list_retrievers: [{ collection_name: 'E2_CHATBOTV2_2' }],
            answer: awnser,
        };
        this._aiService.getSuggestion(chatBot).subscribe(
            (next:any) => {
                console.log(next);
                this.suggestion = next.data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    addImage(awnser: string){
        const chatBot: ChatBot = {
            action: 'get_images',
            user_id: 'E2',
            list_retrievers: [{ collection_name: 'E2_CHATBOTV2_2' }],
            answer: awnser,
        };
        this._aiService.getImage(chatBot).subscribe(
            (next:any) => {
                console.log(next);
                this.images = next.data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    askBySugest(query: string){
        this.chatbotForm.controls.query.setValue(query);
        this.suggestion = [];
        this.answer = '';
        this.ask();
    }

      /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
      trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
