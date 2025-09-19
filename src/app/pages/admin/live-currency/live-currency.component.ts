import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentPriceService } from '../../../services/current-price.service';
import { CurrencyPrice } from '../../../models/currency.interface';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-live-currency',
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './live-currency.component.html',
  styleUrl: './live-currency.component.css'
})
export class LiveCurrencyComponent {

  currencyPrices: CurrencyPrice[] = [];
  date: string = '';
  isEditing: boolean = false;
  editedPrices: CurrencyPrice[] = [];
  uploadedFileName: string | null = null;
  // parsedXlsxRows: any[][] = [];
  parsedXlsxRows: any[][] = [];
  data: any[][] = [];
  tidyUp: any[] = [];

  constructor(
    private currentPriceService: CurrentPriceService
  ){}

  ngOnInit(): void {
    this.currentPriceService.getCurrentPrice().subscribe((result) => {
      console.log(result);
      this.currencyPrices = result;
    })
    this.currentPriceService.getLastUpdated().subscribe((res) => {
      this.date = this.formatDateTime(new Date(res.last_updated));
      console.log('this date',this.date);
    })
  }

  onEditClick(): void {
    this.isEditing = true;
    // deep copy to avoid mutating the original until saved
    this.editedPrices = this.currencyPrices.map(p => ({ ...p }));
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    // const target: DataTransfer = <DataTransfer>(event.target);
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    this.handleFile(files[0]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.handleFile(input.files[0]);
    input.value = '';
  }

  private handleFile(file: File): void {
    if (!file.name.endsWith('.xlsx')) {
      console.error('Invalid file type. Please upload an .xlsx file.');
      return;
    }
    this.uploadedFileName = file.name;
    const reader: FileReader = new FileReader();
    reader.onerror = (err) => {
      console.error('FileReader error:', err);
    };
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const wb: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.parsedXlsxRows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        this.parsedXlsxRows = this.parsedXlsxRows.slice(1); // exclude header row

        // Map rows like [code, buy, sell] into objects
        const mapped: CurrencyPrice[] = this.parsedXlsxRows
          .filter(r => Array.isArray(r) && r.length >= 3 && r[0] != null)
          .map(r => ({
            code: String(r[0]).toLowerCase(),
            buy: Number(r[1]),
            sell: Number(r[2])
          }));

        // Put into editedPrices and enter edit mode for review
        if (mapped.length > 0) {
          this.editedPrices = mapped;
          this.isEditing = true;
        }

        console.log('mapped prices', mapped);
      } catch (parseErr) {
        console.error('Failed to parse XLSX:', parseErr);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  clearUploadedFile(): void {
    this.uploadedFileName = null;
    this.parsedXlsxRows = [];
  }

  saveUploadedFile(): void {
    // Use editedPrices (populated from XLSX) and persist
    if (!this.editedPrices || this.editedPrices.length === 0) return;
    this.currencyPrices = this.editedPrices.map(p => ({
      ...p,
      buy: typeof p.buy === 'string' ? Number(p.buy) : p.buy,
      sell: typeof p.sell === 'string' ? Number(p.sell) : p.sell,
    }));
    this.currentPriceService.updateCurrentPricesBulk(this.currencyPrices).subscribe({
      next: (res) => {
        this.isEditing = false;
        this.editedPrices = [];
        if (res?.last_updated) {
          this.date = this.formatDateTime(new Date(res.last_updated));
        } else {
          this.currentPriceService.getLastUpdated().subscribe((u) => {
            this.date = this.formatDateTime(new Date(u.last_updated));
          })
        }
      },
      error: (err) => {
        console.error('Failed to save current prices', err);
      }
    })
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editedPrices = [];
  }

  onSaveEdit(): void {
    // Ensure numeric fields are numbers
    this.currencyPrices = this.editedPrices.map(p => ({
      ...p,
      buy: typeof p.buy === 'string' ? Number(p.buy) : p.buy,
      sell: typeof p.sell === 'string' ? Number(p.sell) : p.sell,
    }));
    this.currentPriceService.updateCurrentPricesBulk(this.currencyPrices).subscribe({
      next: (res) => {
        this.isEditing = false;
        this.editedPrices = [];
        if (res?.last_updated) {
          this.date = this.formatDateTime(new Date(res.last_updated));
        } else {
          this.currentPriceService.getLastUpdated().subscribe((u) => {
            this.date = this.formatDateTime(new Date(u.last_updated));
          })
        }
      },
      error: (err) => {
        console.error('Failed to save current prices', err);
      }
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
