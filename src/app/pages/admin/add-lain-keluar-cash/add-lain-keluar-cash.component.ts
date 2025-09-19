import { Component } from '@angular/core';
import { LainKeluar } from '../../../models/lain-keluar.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../../services/currency.service';
import { Router } from '@angular/router';
import { Currency } from '../../../models/currency.interface';
import { LainKeluarService } from '../../../services/lain-keluar.service';

@Component({
  selector: 'app-add-lain-keluar-cash',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-lain-keluar-cash.component.html',
  styleUrl: './add-lain-keluar-cash.component.css',
  standalone: true
})
export class AddLainKeluarCashComponent {

  constructor(
    private lainKeluarService: LainKeluarService,
    private currencyService: CurrencyService,
    private router: Router
  ){}

  lainKeluar: LainKeluar = {
    date: '',
    rupiah: 0,
    description: ''
  }

  rupiah?: Currency = {
    code: '',
    name: '',
    amount: 0
  }

  ngOnInit() {
    this.currencyService.getAllCurrencies().subscribe((currencies) => {
      this.rupiah = currencies.find(c => c.code === "IDR");
    });
  }

  submitForm(){
    console.log('lain keluar',this.lainKeluar);
    this.lainKeluarService.addLainKeluar(this.lainKeluar).subscribe(() => {
      this.editRupiah();
    })
  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('en-US'); // e.g., 1,234
  }

  onFormattedNumberInput(event: Event, property: keyof LainKeluar) {
    const value = (event.target as HTMLInputElement).value;
    const numericValue = Number(value.replace(/,/g, ''));
    (this.lainKeluar as any)[property] = isNaN(numericValue) ? null : numericValue;
  }

  editRupiah(){
    if(typeof this.lainKeluar.rupiah === 'number' && this.rupiah && this.rupiah.amount){
      const totalRp = this.rupiah.amount + this.lainKeluar.rupiah;
      console.log('total rp',totalRp);
      this.currencyService.editRupiah(totalRp).subscribe(() => {
        console.log('1 is executed');
        this.router.navigate(['admin/lain-keluar']);
      })
    }
  }

}
