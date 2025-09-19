import { Component, ViewChild } from '@angular/core';
import { Currency, CurrencyBatch } from '../../../models/currency.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CurrencyBatchService } from '../../../services/currency-batch.service';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../services/currency.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-details',
  imports: [CommonModule, MatPaginatorModule, FormsModule],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css'
})
export class StockDetailsComponent {

  currencies: Currency[] = [];
  currencyBatches: CurrencyBatch[] = [];
  selectedCurrencyCode = 'USD';
  dataSource = new MatTableDataSource<any>();

  page = 1;
  limit = 10;
  total?: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private currencyBatchService: CurrencyBatchService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies.filter(currency => currency.code !== 'IDR');
    });
    this.getSpecificCurrencyBatches(this.selectedCurrencyCode);
  }

  getSpecificCurrencyBatches(code: string){
    this.page = 1;
    this.currencyBatchService.getSpecificCurrencyBatch(code).subscribe((result: any) => {
      this.currencyBatches = result.data;
      this.dataSource.data = result.data;
      this.total = result.total;
    })
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    const offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.currencyBatchService.getSpecificCurrencyBatchWithOffset(this.selectedCurrencyCode!, this.limit, offset).subscribe((res: any) => {
      this.currencyBatches = res.data;
      this.dataSource.data = res.data;
      this.total = res.total;
    });
  }

  isNumber(value: any): boolean {
    return typeof value === 'number'
  }

}
