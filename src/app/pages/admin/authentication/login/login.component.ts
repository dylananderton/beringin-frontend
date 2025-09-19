import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  constructor(
    private router: Router,
    private authSerivice: AuthService
  ){}

  ngOnInit(){
    if(localStorage.getItem('token')){
      this.router.navigate(['/admin']);
    }
  }

  login(){
    this.authSerivice.login(this.username,this.password);
  }

}
