import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Currency } from "../models/currency.interface";

@Injectable({
    providedIn: 'root'
})

export class CurrencyService {
    private apiUrl = 'https://beringin-backend.onrender.com/currencies';
    private addCurrencyUrl = 'https://beringin-backend.onrender.com/currencies/add';
    // private apiUrl = 'http://localhost:3001/currencies';
    // private addCurrencyUrl = 'http://localhost:3001/currencies/add';

    constructor(private http: HttpClient) {}
    
    getCurrencies(): Observable<Currency[]> {
        return this.http.get<Currency[]>(this.apiUrl);
    }

    getAllCurrencies(): Observable<Currency[]> {
        return this.http.get<Currency[]>(this.apiUrl + '/all');
    }

    addCurrency(currency: Currency) {
        return this.http.post<Currency>(this.addCurrencyUrl, currency);
    }

    editCurrency(currency: Currency){
        return this.http.put<Currency>(this.apiUrl, currency);
    }

    editRupiah(amount: number){
       const currency = {
        code: 'IDR',
        amount: amount
        }
        return this.http.put<Currency>(this.apiUrl, currency);
    }  
}
