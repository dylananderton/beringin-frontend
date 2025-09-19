export interface Currency {
    id?: number;
    code: string;
    name: string;
    amount: number;
}

export interface CurrencyBatch {
    currency_code?: string;
    batch_code?: string;
    original_amount?: number;
    amount_remaining?: number;
    buy_rate?: number;
    buy_date?: string;
  }

export interface CurrencyBatches {
    currency_code?: string;
    batch_code: string;
    original_amount?: number;
    amount_remaining?: number;
    buy_rate?: number;
    buy_date?: string;
}

export interface CurrencyPrice {
    code: string;
    buy: number;
    sell: number;
}