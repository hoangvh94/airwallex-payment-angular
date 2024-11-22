import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AirwallexService {
    private _httpClient = inject(HttpClient);
    private url = environment.baseUrl;
    private apiUrl = environment.baseUrl + environment.apiUrl;
    private airwallexUrl = environment.airwallex.apiUrl;

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
}
