export interface Trade {
  tradeId?: number;
  product?: string;
  portfolio?: string;
  book?: string;
  submitterId?: number;
  submitterDealId?: number;
  dealType?: string;
  bidType?: string;
  currentValue?: string; // Representing BigDecimal as string
  previousValue?: string; // Representing BigDecimal as string
  pl1?: string; // Representing BigDecimal as string
  pl2?: string; // Representing BigDecimal as string
  gainDx?: string; // Representing BigDecimal as string
  sxPx?: string; // Representing BigDecimal as string
  x99Out?: string; // Representing BigDecimal as string
  batch?: number;
  birthDate: string;
  isSold: boolean;
}
