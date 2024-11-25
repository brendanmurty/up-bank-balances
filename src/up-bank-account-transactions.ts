export async function UpBankAccountGetTransactions(
  ApiUrl: string,
  EnvToken: string,
  CurrencySymbol: string,
  BankAccountId: string,
): Promise<string[]> {
  // deno-lint-ignore prefer-const
  let TransactionList: string[] = [];

  const ApiResponse = await fetch(
    ApiUrl + "/accounts/" + BankAccountId + "/transactions?page[size]=20",
    {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + EnvToken,
      },
    },
  );

  const ApiResponseJson = await ApiResponse.json();
  const ApiResponseJsonData = ApiResponseJson.data;

  for (const index in ApiResponseJsonData) {
    const TransactionInfo = ApiResponseJsonData[index].attributes;

    // Fix the output of debit transactions
    let TransactionAmount = (CurrencySymbol + TransactionInfo.amount.value).replace(
      CurrencySymbol + "-",
      "-" + CurrencySymbol,
    );

    if (TransactionAmount.indexOf("-" + CurrencySymbol) == -1) {
      // This transaction is a credit
      TransactionAmount = "+" + TransactionAmount;
    }

    TransactionList.push(TransactionAmount + " - " + TransactionInfo.description.trim());
  }

  return TransactionList;
}
