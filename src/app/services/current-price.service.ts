import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CurrencyPrice } from "../models/currency.interface";

@Injectable({
    providedIn: 'root'
})

export class CurrentPriceService {
    private apiUrl = 'https://beringin-backend.onrender.com/current-price';
    // private apiUrl = 'http://localhost:3001/current-price';
    // private addLainKeluarUrl = 'http://localhost:3001/current-price/add';

    constructor(private http: HttpClient) {}
    
    getCurrentPrice(): Observable<CurrencyPrice[]> {
        return this.http.get<CurrencyPrice[]>(this.apiUrl);
    }

    updateCurrentPricesBulk(payload: CurrencyPrice[]): Observable<any> {
        return this.http.put(`${this.apiUrl}/bulk`, payload);
    }

    getLastUpdated(): Observable<{ last_updated: string }> {
        return this.http.get<{ last_updated: string }>(`${this.apiUrl}/last-updated`);
    }
}
