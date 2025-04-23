import { HttpStatusCode } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AiService } from 'app/core/ai/ai.service';
import { FileType, PDF } from 'app/core/ai/file.types';
import { Product } from 'app/core/server/product.types';
import { ServerService } from 'app/core/server/server.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';

@Component({
    selector: 'file-manager-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class FileManagerListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Item[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchControl: UntypedFormControl = new UntypedFormControl();

    currentFile?: File;
    fileName: string = 'Select File';
    user: User;
    content = FileType.CONTENT;
    catalog = FileType.CATALOG;
    fileType = FileType.CONTENT;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _aiService: AiService,
        private serverService: ServerService,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the user service
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                
            });
        
        // Subscribe to media query change
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // this.findProduct();
        this.getAllFile();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    aiUSerId() {
        return this.user.name + this.user.id;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
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

    selectFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const file: File = event.target.files[0];
            this.currentFile = file;
            this.fileName = this.currentFile.name;
        } else {
            this.fileName = 'Select File';
        }
    }

    getAllFile() {
        // this._aiService.getAllFile(this.aiUSerId()).subscribe(
        //     (next) => {
        //         console.log(next);
        //         this.items = next.data;
        //         this._changeDetectorRef.markForCheck();
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
        this.serverService.getProduct().subscribe(
            (next) => {
                console.log(next);
                this.items = next.data;
                this._changeDetectorRef.markForCheck();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    addProduct() {
            const product: Product = {
                sku: this.searchControl.value,
                name: this.searchControl.value + '- add by hand',
            };
            this.serverService.addProductAdm(product).subscribe({
                next: (response) => {
                    console.log(response);
                    switch (response['status']) {
                        case HttpStatusCode.Ok: {
                            console.log(response['data'][0]);
                            
                            this.uploadFile()
                            break;
                        }
                        
                    }
                    this.getAllFile();
                }, // nextHandler
                error: (error) => {
                    console.log(error);
                },
            });
        }

    uploadFile() {
        const pdf: PDF = {
            user_id: this.aiUSerId(),
            product: this.fileName.slice(0, -4),
            file: this.currentFile,
            type: this.fileType
        };
        this._aiService.uploadFile(pdf).subscribe(
            (next) => {
                console.log(next);
            },
            (error) => {
                console.log(error);
            }
        );
        console.log(pdf);
    }

    // findProduct() {
    //     this.searchControl.valueChanges
    //         .pipe(
    //             debounceTime(300),
    //             takeUntil(this._unsubscribeAll),
    //             map((value) => {
    //                 // Continue
    //                 return value;
    //             }),
    //             // Filter out undefined/null/false statements and also
    //             // filter out the values that are smaller than minLength
    //             filter((value) => value && value.length >= 2)
    //         )
    //         .subscribe((value) => {
    //             // this._httpClient
    //             //     .post('api/common/search', { query: value })
    //             //     .subscribe((resultSets: any) => {
    //             //         // Store the result sets
    //             //         this.resultSets = resultSets;
    //             //         console.log(resultSets);

    //             //         // Execute the event
    //             //         this.search.next(resultSets);
    //             //     });
    //             // this.fuseLoadingService._setLoadingStatus(
    //             //     true,
    //             //     'search alogla'
    //             // );

    //             this.serverService
    //                 .getProductBySku(value)
    //                 // .pipe(
    //                 //     finalize(() => {
    //                 //         // Set the status to false if there are any errors or the request is completed
    //                 //         this.fuseLoadingService._setLoadingStatus(
    //                 //             false,
    //                 //             'search alogla'
    //                 //         );
    //                 //     })
    //                 // )
    //                 .subscribe({
    //                     next: (response) => {
    //                         console.log(response);
    //                         if (response.status === HttpStatusCode.Ok) {
    //                             console.log('no need add file for this one');
    //                         } else {
    //                             console.log('add di');
    //                         }
    //                     },
    //                     error: (error) => {
    //                         console.log(error);
    //                     },
    //                 });
    //         });
    // }
}
