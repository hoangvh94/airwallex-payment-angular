import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Product } from './product.types';

@Injectable({ providedIn: 'root' })
export class ServerService {
    private _httpClient = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    public sessionSubscription = '';

    private buildHeader() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
        });
    }

    registerPlan(plan: string) {
        const headers = this.buildHeader();
        return this._httpClient.post(this.apiUrl + '/user/plan', plan, {
            headers: headers,
        });
    }

    addProduct(product: Product) {
        const headers = this.buildHeader();
        return this._httpClient.post(this.apiUrl + '/user/product', product, {
            headers: headers,
        });
    }

    addProductAdm(product: Product) {
        const headers = this.buildHeader();
        return this._httpClient.post(this.apiUrl + '/admin/product', product, {
            headers: headers,
        });
    }

    getProduct() {
        const headers = this.buildHeader();
        return this._httpClient.get<any>(this.apiUrl + '/user/product', {
            headers: headers,
        });
    }

    getProductBySku(sku: string) {
        const headers = this.buildHeader();
        let params = new HttpParams().set('sku', sku);

        return this._httpClient.get<any>(this.apiUrl + '/product', {
            headers: headers,
            params,
        });
    }
    cancel(sku: string) {
        const headers = this.buildHeader();
        let params = new HttpParams().set('sku', sku);

        return this._httpClient.get<any>(this.apiUrl + '/product/cancel', {
            headers: headers,
            params,
        });
    }
}
