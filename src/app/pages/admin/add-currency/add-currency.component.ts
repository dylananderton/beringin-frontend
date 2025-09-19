import { Component } from '@angular/core';
import { Currency } from '../../../models/currency.interface';
import { CurrencyService } from '../../../services/currency.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-currency',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-currency.component.html',
  styleUrl: './add-currency.component.css'
})
export class AddCurrencyComponent {

  currency: Currency = {
    code: '',
    name: '',
    amount: 0
  };

  constructor(
    private currencyService: CurrencyService,
    private router: Router
  ){}

  submitForm(){
    console.log('this currency',this.currency);
    this.currencyService.addCurrency(this.currency).subscribe(() => {
      this.router.navigate(['/currencies']);
    });
  }

}
