import { Component } from '@angular/core';
import { Currency } from '../../../models/currency.interface';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../services/currency.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-currencies-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './currencies-list.component.html',
  styleUrl: './currencies-list.component.css'
})
export class CurrenciesListComponent {

  currencies: Currency[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      console.log(this.currencies);
    });
  }

}
