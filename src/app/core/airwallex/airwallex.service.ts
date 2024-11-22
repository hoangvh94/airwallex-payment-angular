import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AirwallexService {
    private _httpClient = inject(HttpClient);
    private url = environment.baseUrl;
    private apiUrl = environment.baseUrl + environment.apiUrl;
    private airwallexUrl = environment.airwallex.apiUrl;

    buildHeader(airwallexAuth) {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${airwallexAuth.token}`,
        });
    }

    authen() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-api-key': environment.airwallex.apiKey,
            'x-client-id': environment.airwallex.clientId,
        });
        console.log(headers);
        const body = null;
        return this._httpClient.post(
            this.airwallexUrl + '/v1/authentication/login',
            body,
            { headers: headers }
        );
    }

    createCustomer(airwallexAuth: any) {
        const id = Math.floor(Math.random() * 100) + 1;
        const body = {
            email: 'john.doe@airwallex.com',
            first_name: 'Hoang',
            last_name: 'Vu',
            merchant_customer_id: 'hoang-vu-id-' + id,
            phone_number: '13800000000',
            request_id: 'test-id-' + id,
        };
        const headers = this.buildHeader(airwallexAuth);
        console.log(headers);
        return this._httpClient.post(
            this.airwallexUrl + '/v1/pa/customers/create',
            body,
            { headers: headers }
        );
    }

    getCustomer(airwallexAuth: any) {
        const headers = this.buildHeader(airwallexAuth);
        return this._httpClient.get(this.airwallexUrl + '/v1/pa/customers', {
            headers: headers,
        });
    }
}