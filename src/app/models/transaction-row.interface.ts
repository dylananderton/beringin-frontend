export interface Transaction {
    // Transaction Date
    date: string;

    // Transaction Type
    type: string;

    //Currency Details
    currency_code?: string;

    // Buy Details
    buyAmount?: number;
    buyRate?: number;
    buyFee?: number;
    buyNote?: string;

    // Sell Details
    sellAmount?: number;
    sellRate?: number;
    sellFee?: number;
    sellNote?: string;

    // Nett Change
    nettChange?: number;
    profit?: number | string;

    // Used Batch, for sell only
    usedBatch?: string;

  }