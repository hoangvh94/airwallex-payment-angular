import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
    Item,
    Items,
} from 'app/modules/admin/apps/file-manager/file-manager.types';
import {
    BehaviorSubject,
    Observable,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileManagerService {
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);
    private apiUrl = environment.apiUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for items
     */
    get items$(): Observable<Items> {
        return this._items.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get items
     */
    getItems(folderId: string | null = null): Observable<Item[]> {

        return this._httpClient
            .get<Items>('api/apps/file-manager', { params: { folderId } })
            .pipe(
                tap((response: any) => {
                    this._items.next(response);
                })
            );
    }
    // getItems(sku: string | null = null): Observable<Item[]> {
    //     console.log(sku);

    //     return this._httpClient
    //         .get<Items>('api/apps/file-manager', { params: { sku } })
    //         .pipe(
    //             tap((response: any) => {
    //                 this._items.next(response);
    //             })
    //         );
    // }

    /**
     * Get item by id
     */
    getItemById(id: string): Observable<Item> {
        return  this.getProductBySku(id).pipe(
            map((res: any) => {
                // Find within the folders and files
                const item = res.data[0];
                console.log(item);
                
                // item.collection_name = "fake colectionnae";

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {
                if (!item) {
                    return throwError(
                        'Could not found the item with id of ' + id + '!'
                    );
                }

                return of(item);
            })
        );
        // this.getProductBySku(id)
    }

    getProductBySku(sku: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
        });
        let params = new HttpParams().set('sku', sku);

        return this._httpClient.get<any>(this.apiUrl + '/product', {
            headers: headers,
            params,
        });
    }
}
