import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, RouterModule],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
    time = new Date();

    constructor(
        private authService: AuthService
    ){}

    ngOnInit() {
        setInterval(() => {
            this.time = new Date();
        }, 1000);
    }

    logout(){
        this.authService.logout();
    }
}

