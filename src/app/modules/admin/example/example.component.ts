import { CommonModule } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { algoliasearch } from 'algoliasearch';
import { AiService } from 'app/core/ai/ai.service';
import { ChatBot } from 'app/core/ai/chatbot.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subscription } from 'rxjs';

interface Awnser {
    text: string;
    pages: number[];
}

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
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
    finalAnswer: any = [];
    suggestion: any = [];
    images: any = [];
    chatbotForm: UntypedFormGroup;
    collection_name: string;
    user: User;
    answered = false;
    isShowReference = false;
    sessionId = '';
    currentAwnser: Awnser = {
        text: '',
        pages: []
    };
    constructor(
        private _aiService: AiService,
        private _formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private _userService: UserService,
        private sanitizer: DomSanitizer
    ) {}
    ngOnInit(): void {
        this.initForm();
        this.getFile();
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
        });
        this.getSessionId();
        // this.showTest();
        // this.getOverview();
        console.log(this.finalAnswer);
    }

    getSessionId() {
        const now = new Date();
        this.sessionId = 'session-' + now.getTime();
    }

    async showTest() {
        const client = algoliasearch(
            '54LS5FUY20',
            '5f2f57fe8c729c85fa3e14b4055ae399'
        );
        const indexName = 'test-index';

        // Search for "test"
        const { results } = await client.search({
            requests: [
                {
                    indexName,
                    query: 'Honda Cb 750 Sc Nighthawk',
                },
            ],
        });

        console.log(JSON.stringify(results));
    }

    getFile() {
        this.route.queryParams.subscribe((params) => {
            console.log(params); // { order: "popular" }

            this.collection_name = params.file;
            // this.collection_name = 'admin1_CHATBOTV2_1';

            console.log(this.collection_name); // popular
        });
    }

    aiUSerId() {
        return this.user.name + this.user.id;
    }

    initForm() {
        // Create the form
        this.chatbotForm = this._formBuilder.group({
            query: [''],
        });
        // this.finalAnswer = [].push({
        //     text: '',
        //     pages: '',
        // });
    }

    showReference(page: string) {
        this.addImage(page + '');
        this.isShowReference = true;
    }

    getOverview() {
        this._aiService
            .getOverview(this.aiUSerId(), this.collection_name)
            .subscribe({
                next: (event: HttpEvent<string>) => {
                    if (event.type === HttpEventType.DownloadProgress) {
                        this.overviewData =
                            (event as HttpDownloadProgressEvent).partialText +
                            '…';
                    } else if (event.type === HttpEventType.Response) {
                        this.overviewData = event.body;
                    }
                },
                error: () => {
                    //   this.loadingResponse = false;
                    console.log('event.type');
                },
            });
    }

    ask() {
        // let query = 'Pull Image from Docker';
        let query = this.chatbotForm.controls.query.value;
        const now = new Date();
        const historyId = 'his-' + this.aiUSerId() + '-' + now.getTime();
        const userId = this.aiUSerId();
        const chatBot: ChatBot = {
            action: 'chatbot',
            user_id: userId,
            query: query,
            session_id: this.sessionId,
            history_id: historyId,
            list_retrievers: [
                { collection_name: this.collection_name, mode: 0 },
            ],
            num_docs: 5,
            num_top_docs: 3,
        };
        this.answered = false;
        this._aiService.makeQuestion(chatBot).subscribe({
            next: (event: HttpEvent<string>) => {
                const p =
                    '<br><h2 class="text-2xl mt-1"><b>' +
                    query +
                    '</h2></b></br>';

                if (event.type === HttpEventType.DownloadProgress) {
                    this.answer =
                        p +
                        (event as HttpDownloadProgressEvent).partialText +
                        '…';
                } else if (event.type === HttpEventType.Response) {
                    this.answer = '';
                    this.answered = true;
                    this.currentAwnser.text = p + event.body;
                    this.getHistory(userId, historyId);
                    this.addSuggestion(event.body);
                    // this.addImage('Pages: 2');
                }
            },
            error: () => {
                //   this.loadingResponse = false;
                console.log('event.type');
            },
        });
    }

    getHistory(userId: string, historyId: string) {
        this._aiService.getHistory(userId, historyId).subscribe({
            next: (res) => {
                // const pages = res['data'][0]['content'][0].pages[0];
                const history = res['data'][0]['content'].filter((content:any)=>content['history_id'] === historyId);
                console.log(history);
                // this.finalAnswer[this.current].pages = pages;
                this.currentAwnser.pages = history[0].pages;
                this.finalAnswer.push(Object.assign({}, this.currentAwnser));
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    addSuggestion(awnser: string) {
        // let query = 'Pull Image from Docker';
        let query = this.chatbotForm.controls.query.value;
        const chatBot: ChatBot = {
            action: 'get_suggestions',
            user_id: this.aiUSerId(),
            query: query,
            list_retrievers: [
                { collection_name: this.collection_name, mode: 0 },
            ],
            answer: awnser,
        };
        this._aiService.getSuggestion(chatBot).subscribe(
            (next: any) => {
                console.log(next);
                this.suggestion = next.data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    addImage(awnser: string) {
        const chatBot: ChatBot = {
            action: 'get_images',
            user_id: this.aiUSerId(),
            list_retrievers: [{ collection_name: this.collection_name }],
            answer: awnser,
            more_images: 0,
        };
        this._aiService.getImage(chatBot).subscribe(
            (next: any) => {
                console.log(next);
                this.images = next.data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    askBySugest(query: string) {
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
