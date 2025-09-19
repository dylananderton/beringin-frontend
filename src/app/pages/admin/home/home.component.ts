import { Component, ViewChild } from '@angular/core';
import { Transaction } from '../../../models/transaction-row.interface';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  transactions: Transaction[] = [];
  dataSource = new MatTableDataSource<any>();

  page = 1;
  limit = 10;
  total?: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.getTransactionsPage();
  }

  getTransactionsPage(){
    this.transactionService.getTodayTransactions().subscribe((res: any) => {
      this.transactions = res.data;
      this.dataSource.data = res.data;
      this.total = res.total;
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    const offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.transactionService.getTodayTransactionsWithOffset(this.limit, offset).subscribe(res => {
      this.transactions = res.data;
      this.dataSource.data = res.data;
      this.total = res.total;
    });
  }

  isNumber(value: any): boolean {
    return typeof value === 'number'
  }
}
