interface DataItem {
  sl: number;
  intPfLedgerId: number;
  intPfLedgerCode: string;
  intTypeId: number;
  strType: string;
  intReferenceId: number;
  intMaturityMonth: number;
  strReferenceCode: string;
  intInvestmentBankId: number | null;
  intInvestmentBankBranchId: number | null;
  dteTransactionDate: string;
  numAmount: number;
  isActive: boolean;
  isComplete: boolean;
  numRate: number | null;
  status: string;
}

function calculateTotalAmount(data: DataItem[]): number {
  let totalAmount = 0;

  for (const item of data) {
    if (item?.status === "Pending") {
      totalAmount += item?.numAmount || 0;
    }
  }

  return totalAmount;
}

export { calculateTotalAmount };
