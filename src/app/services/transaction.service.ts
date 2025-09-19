import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Transaction } from "../models/transaction-row.interface";

@Injectable({
    providedIn: 'root'
})

export class TransactionService {
    private apiUrl = 'https://beringin-backend.onrender.com/transactions';
    private addTransactionUrl = 'https://beringin-backend.onrender.com/transactions/add';
    // private apiUrl = 'http://localhost:3001/transactions';
    // private addTransactionUrl = 'http://localhost:3001/transactions/add';

    constructor(private http: HttpClient) {}
    
    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(this.apiUrl);
    }

    getTodayTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/today`);
    }

    getTransactionsWithOffset(limit: number, offset: number) {
        return this.http.get<any>(`https://beringin-backend.onrender.com/transactions?limit=${limit}&offset=${offset}`);
        // return this.http.get<any>(`http://localhost:3001/transactions?limit=${limit}&offset=${offset}`);
    }

    getTodayTransactionsWithOffset(limit: number, offset: number) {
        return this.http.get<any>(`https://beringin-backend.onrender.com/transactions/today?limit=${limit}&offset=${offset}`);
        // return this.http.get<any>(`http://localhost:3001/transactions/today?limit=${limit}&offset=${offset}`);
    }

    addTransaction(transaction: Transaction) {
        return this.http.post<Transaction>(this.addTransactionUrl, transaction);
    }

    // addBuyOrSellOnlyTransaction(){

    // }
}
