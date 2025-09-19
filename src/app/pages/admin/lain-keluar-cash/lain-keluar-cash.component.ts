import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LainKeluar } from '../../../models/lain-keluar.interface';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { TransactionService } from '../../../services/transaction.service';
import { LainKeluarService } from '../../../services/lain-keluar.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lain-keluar-cash',
  imports: [CommonModule, MatPaginatorModule, RouterModule],
  templateUrl: './lain-keluar-cash.component.html',
  styleUrl: './lain-keluar-cash.component.css',
  standalone: true
})
export class LainKeluarCashComponent {

  lainKeluar: LainKeluar[] = [];
  dataSource = new MatTableDataSource<any>();

  page = 1;
  limit = 10;
  total?: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private lainKeluarService: LainKeluarService) {}

  ngOnInit() {
    this.getLainKeluarPage();
  }

  getLainKeluarPage(){
    this.lainKeluarService.getLainKeluar().subscribe((res: any) => {
      this.lainKeluar = res.data;
      this.dataSource.data = res.data;
      this.total = res.total;
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    const offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.lainKeluarService.getLainKeluarWithOffset(this.limit, offset).subscribe(res => {
      this.lainKeluar = res.data;
      this.dataSource.data = res.data;
      this.total = res.total;
    });
  }

  isNumber(value: any): boolean {
    return typeof value === 'number'
  }

}
