import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MotorAiService } from 'app/core/ai/ai-motor.service';
import { Motor, MotorChatForm } from 'app/core/ai/motor-api.types';
import { MarkdownModule } from 'ngx-markdown';
import { getDiagnosticTroubleCodes } from './promt/diagnosticTroubleCodes';
import { getFluid } from './promt/fluid';
import { getLaborTimes } from './promt/laborTimes';
import { getMaintenanceSchedules } from './promt/maintenanceSchedules';
import { getProcedure } from './promt/procedure';
import { getSpecifications } from './promt/specification';
import { getTechnicalServiceBulletins } from './promt/technicalServiceBulletins';
import { getWiringDiagrams } from './promt/wiringDiagrams';

@Component({
    selector: 'app-product-chat',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, MarkdownModule],
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent
    implements AfterViewChecked, AfterViewInit, OnDestroy
{
    id: string = ''; // Store the VIN from the query parameters
    type: number = 0; //vin 1://select;
    messages: {
        text: string;
        type: string;
        metadata: any;
        print: boolean;
    }[] = []; // Store the chat messages
    chatForm: FormGroup; // Reactive form for chat input
    @ViewChild('chatBox', { static: false }) private chatBox: any;
    @ViewChild('reference', { static: false }) private reference: any;
    suggestionList = [];
    vehicleInfo: any;
    SESSION_ID = 'session-' + new Date().toDateString();
    showReference = false;
    makeName = '';
    loadQuestion = false;

    PROMT = {
        TECHNICAL_SERVICE_BULLETINS_INDEX: 1,
        SPECIFICATIONS_INDEX: 2,
        FLUID_INDEX: 3,
        MAINTENANCE_SCHEDULES_INDEX: 4,
        LABOR_TIMES_INDEX: 5,
        PROCEDURES_INDEX: 6,
        DIAGNOSTIC_TROUBLE_CODES_INDEX: 7,
        WIRING_DIAGRAMS_INDEX: 8,
    };
    isFullReference = false;
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private motorAiService: MotorAiService,
        private renderer: Renderer2
    ) {
        // Get VIN from the query parameters
        this.route.queryParams.subscribe((params) => {
            this.id = params['id'] || 'N/A';
            this.type = params['type'] || 'N/A';
        });

        // Initialize the form with a single control for the message input
        this.chatForm = this.fb.group({
            message: [''],
        });
    }

    isMobileScreen(): boolean {
        return window.innerWidth < 640; // 640px is Tailwind's 'sm' breakpoint
    }

    toggleReference() {
        this.showReference = false;
        this.isFullReference = false;
    }

    makeFullReference() {
        this.isFullReference = !this.isFullReference;
    }

    addTitle(title: string, html: string) {
        const displayTitle = title.replace(/-/g, '›').replace(/\s›\s/g, ' › ');
        const titleEl = document.createElement('h2');
        titleEl.className = 'text-lg font-semibold text-[#136EFB] mb-4';
        titleEl.textContent = displayTitle;

        // Step 3: Create wrapper and append title and content
        return titleEl.outerHTML.toString() + html;
    }

    attachImageErrorListeners() {
        if (!this.reference) return;
        const images =
            this.reference.nativeElement.querySelectorAll('img');
        images.forEach((img: HTMLImageElement) => {
            this.renderer.listen(img, 'error', () => this.onImageError(img));
        });
    }

    onImageError(img: HTMLImageElement) {
        // const docId = img.getAttribute('data-doc-id');
        // if (!docId) return;

        // this.refreshLink(docId).then((newHref) => {
        //     if (newHref) {
        //         img.onerror = null; // prevent infinite loop
        //         img.src = newHref;
        //     }
        // });
        // refresh link
        this.motorAiService.refreshLink(img.src).subscribe({
            next: (response: Motor<any>) => {
                if (response.status === HttpStatusCode.Ok) {
                    img.onerror = null; // prevent infinite loop
                    img.src = response.data;
                } else {
                    console.log(response.message);
                }
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    // refreshLink(url: string) {
    //     this.motorAiService.getSuggestion(body).subscribe({
    //         next: (response: Motor<any>) => {
    //             if (response.status === HttpStatusCode.Ok) {
    //                 this.suggestionList = response.data;
    //                 // const suggestion = this.suggestionList
    //                 //     .map((suggest: any) => {
    //                 //         return `<p><a href="#" class="suggestion-link p-2 no-underline inline-block leading-[20px] text-[#136EFB]" data-suggest="${suggest}">${suggest}</a></p>`;
    //                 //     })
    //                 //     .join('');
    //                 // systemMessage.text += `<hr class="my-[24px] border-t-0 border-[#E9EBEF]"><span class="text-[18px] font-semibold leading-[26px]">Suggested Questions:</span><div class="mt-[16px]">${suggestion}</div>`;
    //                 this.scrollToBottom(120);
    //             } else {
    //                 console.log(response.message);
    //             }
    //         },
    //         error: (err) => {
    //             console.error(err);
    //         },
    //     });
    // }

    handleObject(object: any, html: string) {
        const title = object['2'];
        const htmlString = this.addTitle(title, html);
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-6 p-4 bg-white border rounded shadow-sm';
        wrapper.innerHTML = htmlString;
        this.reference.nativeElement.appendChild(wrapper);
        this.attachImageErrorListeners();
    }

    referenceHtml(object: any) {
        if (!object || Object.keys(object).length === 0) {
            console.log('Object is null or empty');
            return;
        }
        this.reference.nativeElement.innerHTML = '';
        let html = '';
        switch (object['0']) {
            case this.PROMT.TECHNICAL_SERVICE_BULLETINS_INDEX:
                console.log('TECHNICAL_SERVICE_BULLETINS_INDEX');
                html = getTechnicalServiceBulletins(object['3']);
                this.handleObject(object, html);
                break;
            case this.PROMT.SPECIFICATIONS_INDEX:
                console.log('SPECIFICATIONS_INDEX');
                const item =
                    object['3']['Items'] || object['3']['ServiceProcedures'];
                // html = getSpecifications(object['3']['Items']);
                html = getSpecifications(item);
                this.handleObject(object, html);
                break;
            case this.PROMT.FLUID_INDEX:
                console.log('FLUID_INDEX');
                html = getFluid(object['3']);
                this.handleObject(object, html);
                break;
            case this.PROMT.MAINTENANCE_SCHEDULES_INDEX:
                console.log('MAINTENANCE_SCHEDULES_INDEX');
                html = getMaintenanceSchedules(object['3']['Items']);
                this.handleObject(object, html);
                break;
            case this.PROMT.LABOR_TIMES_INDEX:
                console.log('LABOR_TIMES_INDEX');
                html = getLaborTimes(object['3']['Items']);
                this.handleObject(object, html);
                break;
            case this.PROMT.PROCEDURES_INDEX:
                console.log('PROCEDURES_INDEX');
                html = getProcedure(object['3']['Items']);
                this.handleObject(object, html);
                break;
            case this.PROMT.DIAGNOSTIC_TROUBLE_CODES_INDEX:
                console.log('DIAGNOSTIC_TROUBLE_CODES_INDEX');
                html = getDiagnosticTroubleCodes(object['3']['Documents']);
                this.handleObject(object, html);
                break;
            case this.PROMT.WIRING_DIAGRAMS_INDEX:
                console.log('WIRING_DIAGRAMS_INDEX');
                html = getWiringDiagrams(object['3']);
                this.handleObject(object, html);
                //need ask
                break;
            default:
                console.log('general type');
        }
    }

    getReference(messageIndex: number, refNum: number) {
        const metadataList = this.messages[messageIndex].metadata;
        this.referenceHtml(
            metadataList.find((item) => item.reference_num === refNum)
        );
        this.showReference = true;
    }

    handleMessage(chunk: any, systemMessage: any, messageIndex: number) {
        const metadataObj = JSON.parse(chunk);
        const metadataList = metadataObj.metadata;

        // Build reference list with external links if available
        const references = metadataList
            .map((entry: any) => {
                const refNum = entry.reference_num;
                const title = entry['1'];
                return `<p><a href="#" class="reference-link p-2 inline-block no-underline leading-[20px] text-[#136EFB]" data-refer-index="${refNum}" data-message-index="${messageIndex}">${refNum}. (${this.makeName}) ${title}</a></p>`;
            })
            .join('');

        // Replace inline references like [1], [2] with anchor links
        systemMessage.metadata = metadataList;
        systemMessage.text = systemMessage.text.replace(
            /\[(\d+)]/g,
            (_, refNum) => {
                const meta = metadataList.find(
                    (m: any) => m.reference_num == refNum
                );
                const title = meta?.['1'] || '';
                return `<a href="#" class="reference-link tool-tip-link text-[#136EFB] no-underline" data-refer-index="${refNum}" data-message-index="${messageIndex}"  data-title="${title}">[${refNum}]</a>`;
            }
        );

        // Append references section
        if (metadataList.length > 0) {
            systemMessage.text += `<hr class="my-[24px] border-t-0 border-[#E9EBEF]"><span class="text-[18px] font-semibold leading-[26px]">References:</span><div class="mt-[16px]">${references}</div>`;
        }

        this.scrollToBottom(120);
    }

    sendMessage() {
        this.suggestionList = [];
        let isMeta = false;
        let metaChunk = '';
        this.loadQuestion = true;
        const hidtoryId = 'history' + new Date().toDateString();
        this.scrollToBottom();
        const messageText = this.chatForm.value.message.trim();
        if (!messageText) return;

        this.messages.push({
            text: messageText,
            type: 'user',
            metadata: {},
            print: false,
        });
        this.chatForm.reset();
        const systemMessage = {
            type: 'system',
            text: '',
            metadata: {},
            print: false,
        };
        let rawChunk = '';
        this.messages.push(systemMessage);
        const messageIndex = this.messages.length - 1;

        const payload: MotorChatForm = {
            user_id: 'admin',
            query: messageText,
            session_id: 'session_id',
            history_id: '',
            type: this.type,
            id: this.id,
        };
        this.motorAiService.streamChatbotResponse3(payload).subscribe({
            next: (chunk) => {
                this.loadQuestion = false;
                console.log('-------------', chunk);

                // if (chunk.trim().startsWith('{"metadata"')) {
                //     // this.handleMessage(chunk, systemMessage, messageIndex);
                //     isMeta = true;
                //     metaChunk += chunk;
                //     return;
                // }

                if (chunk.trim().includes('{"metadata"')) {
                    const chunkTrim = chunk.trim();
                    const metadataIndex = chunkTrim.indexOf('{"metadata"');
                    const firstPart = chunkTrim.substring(0, metadataIndex);
                    const secondPart = chunkTrim
                        .substring(metadataIndex)
                        .trim();
                    isMeta = true;
                    systemMessage.text += firstPart;
                    metaChunk += secondPart;
                    console.log('Second Part---', secondPart);
                    return;
                }

                if (!isMeta) {
                    systemMessage.text += chunk;
                    rawChunk += chunk;
                    this.scrollToBottom();
                } else {
                    metaChunk += chunk;
                }

                // Ensure change detection picks it up
            },
            error: (err) => {
                systemMessage.text += '\n\n⚠️ Error getting response.';
                console.error(err);
            },
            complete: () => {
                systemMessage.print = true;
                this.handleMessage(metaChunk, systemMessage, messageIndex);

                // this.getSuggestion(messageText, rawChunk);
                const body = {
                    action: 'suggestions',
                    user_id: 'user1',
                    query: messageText,
                    answer: rawChunk,
                    type: this.type,
                    id: this.id,
                };
                this.motorAiService.getSuggestion(body).subscribe({
                    next: (response: Motor<any>) => {
                        if (response.status === HttpStatusCode.Ok) {
                            this.suggestionList = response.data;
                            // const suggestion = this.suggestionList
                            //     .map((suggest: any) => {
                            //         return `<p><a href="#" class="suggestion-link p-2 no-underline inline-block leading-[20px] text-[#136EFB]" data-suggest="${suggest}">${suggest}</a></p>`;
                            //     })
                            //     .join('');
                            // systemMessage.text += `<hr class="my-[24px] border-t-0 border-[#E9EBEF]"><span class="text-[18px] font-semibold leading-[26px]">Suggested Questions:</span><div class="mt-[16px]">${suggestion}</div>`;
                            this.scrollToBottom(120);
                        } else {
                            console.log(response.message);
                        }
                    },
                    error: (err) => {
                        console.error(err);
                    },
                });
            },
        });
    }

    suggest(question: string) {
        this.chatForm.controls.message.setValue(question);
        this.sendMessage();
    }

    // Automatically scroll to the last message after every update
    ngAfterViewChecked() {
        // this.scrollToBottom();
    }

    initTooltipReference() {
        const tooltip = document.getElementById('custom-tooltip');

        document.addEventListener('mouseover', (event: any) => {
            const target = event.target.closest('.tool-tip-link');
            if (target) {
                const title = target.getAttribute('data-title');
                tooltip!.innerHTML = `<strong>${this.makeName} Data OEM</strong><br>${title}`;
                tooltip!.style.display = 'block';
            }
        });

        document.addEventListener('mousemove', (event: MouseEvent) => {
            if (tooltip!.style.display === 'block') {
                tooltip!.style.left = `${event.pageX + 15}px`;
                tooltip!.style.top = `${event.pageY - 35}px`;
            }
        });

        document.addEventListener('mouseout', (event: any) => {
            if (event.target.closest('.reference-link')) {
                tooltip!.style.display = 'none';
            }
        });
    }

    initFirstMessage() {
        const mess = localStorage.getItem('firstMessage');
        if (mess) {
            this.chatForm.controls.message.setValue(mess);
            this.sendMessage();
            localStorage.removeItem('firstMessage');
        }
    }

    initClickReference() {
        const chatContainer = document.querySelector('.chat-box'); // Replace with your real container
        if (chatContainer) {
            chatContainer.addEventListener('click', (event: any) => {
                const target = event.target;
                if (
                    target.matches('.reference-link') &&
                    target.dataset.referIndex &&
                    target.dataset.messageIndex
                ) {
                    event.preventDefault();
                    const refNum = parseInt(target.dataset.referIndex);
                    const msgIndex = parseInt(target.dataset.messageIndex);
                    this.getReference(msgIndex, refNum);
                }

                // if (
                //     target.matches('.suggestion-link') &&
                //     target.dataset.suggest
                // ) {
                //     event.preventDefault();
                //     const suggest = target.dataset.suggest;
                //     this.suggest(suggest);
                // }
            });
        }

        this.motorAiService.getVehicleInfo(this.type, this.id).subscribe({
            next: (response: Motor<any>) => {
                if (response.status === HttpStatusCode.Ok) {
                    this.vehicleInfo = response.data.vehicleInfo;
                    if (this.type == 0) {
                        this.makeName = this.vehicleInfo.find(
                            (item) => item.Variable === 'Make'
                        )?.Value;
                    }
                    if (this.type == 1) {
                        this.makeName =
                            this.vehicleInfo.Body.Attributes.Engines[0].Manufacturer;
                    }
                } else {
                    console.log(response.message);
                }
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    print(printContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) {
            alert('Popup blocked!');
            return;
        }

        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Section</title>
              <link rel="stylesheet" type="text/css" href="/styles.css">
            </head>
            <body class="p-4 bg-white">
              ${printContent}
              <div id="loading-message" style="margin-top: 20px; color: #4B5563; font-family: sans-serif;">
                Preparing print preview…
              </div>
              <script>
                (function(){
                  const images = document.images;
                  let loadedCount = 0;
                  const totalImages = images.length;
      
                  if (totalImages === 0) {
                    document.getElementById('loading-message').remove();
                    window.print();
                    window.close();
                    return;
                  }
      
                  for (let i = 0; i < totalImages; i++) {
                    images[i].addEventListener('load', onImageLoad, false);
                    images[i].addEventListener('error', onImageLoad, false);
                  }
      
                  function onImageLoad() {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                      document.getElementById('loading-message').remove();
                      window.print();
                      window.close();
                    }
                  }
                })();
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
    }

    printSection(sectionId: string) {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return;

        const printContent = sectionElement.innerHTML;
        this.print(printContent);
    }

    printMessage(index: number) {
        const userMess = document.getElementById('message-' + (index - 1));
        if (!userMess) return;
        const systemMess = document.getElementById('message-' + index);

        const printContent = userMess.innerHTML + systemMess.innerHTML;
        this.print(printContent);
    }

    ngAfterViewInit() {
        this.initClickReference();
        this.initTooltipReference();
        this.initFirstMessage();
    }

    private scrollToBottom(buffer: number = 0) {
        setTimeout(() => {
            if (this.chatBox?.nativeElement) {
                this.chatBox.nativeElement.scrollTop =
                    this.chatBox.nativeElement.scrollHeight + buffer;
            }
        }, 10);
    }

    ngOnDestroy(): void {
        localStorage.removeItem('firstMessage');
    }
}
