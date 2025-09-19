import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CurrencyBatch, CurrencyBatches } from "../models/currency.interface";

@Injectable({
    providedIn: 'root'
})

export class CurrencyBatchService {
    private currencyBatchesUrl = 'https://beringin-backend.onrender.com/currency-batches';
    // private currencyBatchesUrl = 'http://localhost:3001/currency-batches';

    constructor(private http: HttpClient) {}

    getCurrencyBatches(){
        return this.http.get<CurrencyBatches[]>(this.currencyBatchesUrl);
    }

    getCurrencyBatchesWithOffset(limit: number, offset: number) {
        return this.http.get<CurrencyBatches[]>(`https://beringin-backend.onrender.com/currency-batches?limit=${limit}&offset=${offset}`);
        // return this.http.get<CurrencyBatches[]>(`http://localhost:3001/currency-batches?limit=${limit}&offset=${offset}`);
    }

    getSpecificCurrencyBatchAll(currency_code: string){
        return this.http.get<CurrencyBatches[]>(`${this.currencyBatchesUrl}/all/${currency_code}`);
    }

    getSpecificCurrencyBatchAllNonZero(currency_code: string){
        return this.http.get<CurrencyBatches[]>(`${this.currencyBatchesUrl}/all/${currency_code}?nonzero=true`);
    }

    getSpecificCurrencyBatch(currency_code: string){
        return this.http.get<CurrencyBatches[]>(`${this.currencyBatchesUrl}/${currency_code}`);
    }

    getSpecificCurrencyBatchWithOffset(currency_code: string, limit: number, offset: number){
        return this.http.get<CurrencyBatches[]>(`${this.currencyBatchesUrl}/${currency_code}?limit=${limit}&offset=${offset}`);
    }

    addCurrenciesBatch(currencyBatch: CurrencyBatch){
        return this.http.post<CurrencyBatch>(this.currencyBatchesUrl, currencyBatch)
    }

    editCurrenciesBatch(batch: CurrencyBatches){
        return this.http.put<CurrencyBatches>(this.currencyBatchesUrl, batch);
    }
}
