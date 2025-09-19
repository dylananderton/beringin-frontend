import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [RouterOutlet, RouterModule],
    templateUrl: './user-layout.component.html',
    styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {}

