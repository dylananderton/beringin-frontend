import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode }     from 'jwt-decode';

interface JwtPayload {
    exp: number; // expiry timestamp in seconds
    iat: number; // issued at
    id: number;
    username: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiUrl = 'https://beringin-backend.onrender.com/login';
    // private apiUrl = 'http://localhost:3001/login';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}
    
   isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if(!token) return false;

    try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);
        if(decoded.exp < now){
            this.logout();
            return false;
        }
        return true;
    } catch (e) {
        this.logout();
        return false;
    }
   }

    login(username: string, password: string){
        this.http.post<{token: string}>(this.apiUrl, {username, password}).subscribe({
            next: (res) => {
                localStorage.setItem('token',res.token);
                const decoded: JwtPayload = jwtDecode<JwtPayload>(res.token);
                const expiresInMs = decoded.exp * 1000 - Date.now();

                setTimeout(() => {
                    this.logout();
                }, expiresInMs);
                
                this.router.navigate(['/admin']);
            },
            error: () => alert('Invalid Credentials')
        })
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
