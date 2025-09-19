import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Currency, CurrencyBatch, CurrencyBatches } from '../../../models/currency.interface';
import { CurrencyService } from '../../../services/currency.service';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction-row.interface';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyBatchService } from '../../../services/currency-batch.service';
import { max } from 'rxjs';

@Component({
  selector: 'app-add-transaction',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
  standalone: true
})
export class AddTransactionComponent {

  currencies: Currency[] = [];
  currencyBatches: CurrencyBatches[] = [];
  nextBatchCode?: string;
  selectedCurrency?: Currency = {
    code: '',
    name: '',
    amount: 0
  };

  transaction: Transaction = {
    date: '',
    type: '',
    currency_code: '',
    buyAmount: null!,
    buyRate: null!,
    buyFee: null!,
    buyNote: '',
    sellAmount: null!,
    sellRate: null!,
    sellFee: null!,
    sellNote: '',
    nettChange: 0,
    profit: 0,
    usedBatch: ''
  };

  currencyBatch: CurrencyBatch = {
    currency_code: '',
    batch_code: '',
    original_amount: null!,
    amount_remaining: null!,
    buy_rate: null!,
    buy_date: ''
  };

  selectedBatch: CurrencyBatches = {
    batch_code: '',
    amount_remaining: 0,
  }

  rupiah?: Currency = {
    code: '',
    name: '',
    amount: 0
  }

  constructor(
    private currencyService: CurrencyService,
    private currencyBatchService: CurrencyBatchService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currencyService.getAllCurrencies().subscribe((currencies) => {
      this.rupiah = currencies.find(c => c.code === "IDR");
      this.currencies = currencies.filter(currency => currency.code != 'IDR');
      console.log('this rupiah',this.rupiah);
      console.log('this currencies',this.currencies);
    });
  }

  submitForm(){
    console.log('this transaction',this.transaction);
    if(this.transaction.type === 'sell' && this.transaction.sellAmount){
      this.checkBatchAvailability();
    }
    this.transaction = this.nettChangeAndProfit(this.transaction);
    
    this.transactionService.addTransaction(this.transaction).subscribe(() => {
      if(this.transaction.type === 'sell' && this.selectedCurrency && this.transaction.sellAmount){
        console.log('sell');
        // this.checkBatchAvailability();
        this.selectedCurrency.amount -= this.transaction.sellAmount;
        this.currencyBatchService.editCurrenciesBatch(this.selectedBatch).subscribe(() => {
          this.addTransaction();
        })
      }
      else if (this.transaction.type === 'buy' && this.selectedCurrency && this.transaction.buyAmount){
        console.log('buy');
        this.selectedCurrency.amount += this.transaction.buyAmount;
        this.currencyBatchService.addCurrenciesBatch(this.currencyBatch).subscribe(() => {
          this.addTransaction();
        })
      }
      else {
        console.log('buy and sell');
        this.addTransaction();
      }
    });
  }

  nettChangeAndProfit(transaction: Transaction){
    console.log('transaction in nett change and profit',transaction);
    console.log(transaction.type === 'sell' && transaction.sellRate && transaction.sellAmount && this.selectedBatch.buy_rate)

    if(transaction.type === 'buy'){
      console.log('buy is exec');
      this.currencyBatch = {
        currency_code: transaction.currency_code,
        batch_code: this.nextBatchCode,
        original_amount: transaction.buyAmount,
        amount_remaining: transaction.buyAmount,
        buy_rate: transaction.buyRate,
        buy_date: transaction.date
      }
      transaction.profit = 0;
      transaction.nettChange = -(transaction?.buyAmount! * transaction?.buyRate!);
    } else if (transaction.type === 'sell' && transaction.sellRate && transaction.sellAmount && this.selectedBatch.buy_rate){
      console.log('sell is exec');
      console.log('transaction',transaction);
      console.log('this selected batch',this.selectedBatch);
      const priceDiff = transaction.sellRate - this.selectedBatch.buy_rate;
      transaction.profit = (transaction.sellAmount * priceDiff) + transaction.sellFee!;
      transaction.nettChange = (transaction?.sellAmount! * transaction?.sellRate!) + transaction.sellFee!;
      console.log('transaction profit',transaction.profit);
      console.log('transaction nett change',transaction.nettChange);
    } else {
      console.log('buy and sell is exec');
      transaction.profit = ((transaction?.sellAmount! * transaction?.sellRate!) + (transaction?.sellFee!)) - ((transaction?.buyAmount! * transaction?.buyRate!) + (transaction?.buyFee!));
      transaction.nettChange = transaction.profit;
    }
    console.log('final transaction in nett change and profit',this.transaction);
    return transaction;
  }

  getCurrencyBatches(){

    console.log('currency_code:', this.transaction.currency_code);
    console.log('type:', this.transaction.type);

    const currencyCode = this.transaction.currency_code;
    const type = this.transaction.type;

    console.log('this transaction currency code',currencyCode);
    if(!currencyCode || !type){
      return;
    }
    else{
      if(type === 'buy'){
        this.selectedCurrency = this.currencies.find(c => c.code === currencyCode);
        this.currencyBatchService.getSpecificCurrencyBatchAll(currencyCode!).subscribe((result: any) => {
          this.currencyBatches = result.data;

          let maxBatchNum = 0;
          this.currencyBatches.forEach(row => {
            const match = row.batch_code.match(/\d+$/);
            if (match) {
              const num = Number(match[0]);
              if (num > maxBatchNum) maxBatchNum = num;
            }
          });
          
          console.log('max batch num',maxBatchNum);
          const nextBatchNum = maxBatchNum + 1;
          console.log('next batch num',nextBatchNum);
          this.nextBatchCode = `${currencyCode}${nextBatchNum}`;
          console.log('this next batch code',this.nextBatchCode);
        })
      } else if (type ==='sell'){
        this.selectedCurrency = this.currencies.find(c => c.code === currencyCode);
        this.currencyBatchService.getSpecificCurrencyBatchAllNonZero(currencyCode!).subscribe((result: any) => {
          this.currencyBatches = result.data;
        })
      }
    }
  }

  checkBatchAvailability(){
    let selectedBatch = this.currencyBatches.find(batch => batch.batch_code === this.transaction.usedBatch);
    if(this.transaction.sellAmount && selectedBatch?.amount_remaining && this.transaction.sellAmount > selectedBatch.amount_remaining){
      alert('Sell amount cannot be more than the selected batch');
      return;
    }
    else if(this.transaction.sellAmount && selectedBatch?.amount_remaining && this.transaction.sellAmount <= selectedBatch.amount_remaining){
      selectedBatch.amount_remaining -= this.transaction.sellAmount;
      this.selectedBatch.batch_code = selectedBatch.batch_code;
      this.selectedBatch.amount_remaining = selectedBatch.amount_remaining;
      this.selectedBatch.buy_rate = selectedBatch.buy_rate;
      console.log('this selected batch',this.selectedBatch);
    }
  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('en-US'); // e.g., 1,234
  }
  
  onBuyAmountInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // Remove commas and parse to number
    const numericValue = Number(value.replace(/,/g, ''));
    this.transaction.buyAmount = isNaN(numericValue) ? null! : numericValue;
  }

  onFormattedNumberInput(event: Event, property: keyof Transaction) {
    const value = (event.target as HTMLInputElement).value;
    const numericValue = Number(value.replace(/,/g, ''));
    (this.transaction as any)[property] = isNaN(numericValue) ? null : numericValue;
  }

  addTransaction(){
    console.log('this selected currency',this.selectedCurrency);
    if (this.selectedCurrency && this.selectedCurrency?.code != 'IDR' && this.selectedCurrency?.code != '') {
      this.currencyService.editCurrency(this.selectedCurrency).subscribe(() => {
        this.editRupiah();
      });
    } else {
      this.editRupiah();
    }
  }

  editRupiah(){
    if(typeof this.transaction.nettChange === 'number' && this.rupiah && this.rupiah.amount){
      const totalRp = this.rupiah.amount + this.transaction.nettChange;
      console.log('total rp',totalRp);
      this.currencyService.editRupiah(totalRp).subscribe(() => {
        console.log('1 is executed');
        this.router.navigate(['admin/transactions']);
      })
    }
  }

}