import { Component } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { CurrencyPrice } from '../../../models/currency.interface';
import { CurrentPriceService } from '../../../services/current-price.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-home',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {

  currencyPrices: CurrencyPrice[] = [];

  firstHalf: CurrencyPrice[] = [];
  secondHalf: CurrencyPrice[] = [];

  date: string = '';

  times = new Date();

  constructor(
    private currentPriceService: CurrentPriceService
  ){}

  ngOnInit(): void {
    this.currentPriceService.getCurrentPrice().subscribe((result) => {
      console.log(result);
      this.currencyPrices = result;
  
      // Split into two arrays (10 each)
      const mid = Math.ceil(this.currencyPrices.length / 2);
      this.firstHalf = this.currencyPrices.slice(0, mid);
      this.secondHalf = this.currencyPrices.slice(mid);
    })
    this.currentPriceService.getLastUpdated().subscribe((res) => {
      console.log(res.last_updated);

      this.date = this.formatDateTime(new Date(res.last_updated));
      // this.date = new Date(res.last_updated).toLocaleString();
      console.log('this date',this.date);
    })
  }

  private formatDateTime(dateObj: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dd = pad(dateObj.getDate());
    const mm = pad(dateObj.getMonth() + 1);
    const yyyy = dateObj.getFullYear();
    const HH = pad(dateObj.getHours());
    const MM = pad(dateObj.getMinutes());
    const SS = pad(dateObj.getSeconds());
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}:${SS}`;
  }
  

}
