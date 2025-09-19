import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LainKeluar } from "../models/lain-keluar.interface";

@Injectable({
    providedIn: 'root'
})

export class LainKeluarService {
    private apiUrl = 'https://beringin-backend.onrender.com/lain-keluar';
    private addLainKeluarUrl = 'https://beringin-backend.onrender.com/lain-keluar/add';
    // private apiUrl = 'http://localhost:3001/lain-keluar';
    // private addLainKeluarUrl = 'http://localhost:3001/lain-keluar/add';

    constructor(private http: HttpClient) {}
    
    getLainKeluar(): Observable<LainKeluar[]> {
        return this.http.get<LainKeluar[]>(this.apiUrl);
    }

    getLainKeluarWithOffset(limit: number, offset: number) {
        return this.http.get<any>(`https://beringin-backend.onrender.com/lain-keluar?limit=${limit}&offset=${offset}`);
        // return this.http.get<any>(`http://localhost:3001/lain-keluar?limit=${limit}&offset=${offset}`);
    }

    addLainKeluar(lainKeluar: LainKeluar) {
        return this.http.post<LainKeluar>(this.addLainKeluarUrl, lainKeluar);
    }
}
