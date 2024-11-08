import { GetEnvVariable } from "./helpers/env-variables.ts";
import { UpBankAccountSummary } from "./up-bank-account-summary.ts";
import { UpBankGetMainAccount } from "./up-bank-main-account.ts";
import { UpBankAccountGetTransactions } from "./up-bank-account-transactions.ts";

const EnvToken: string = GetEnvVariable("UP_PERSONAL_ACCESS_TOKEN") || "";
const CurrencySymbol: string = GetEnvVariable("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";
const ApiUrl = "https://api.up.com.au/api/v1";

// Get a summary of all account balances

const BankAccountsSummary = await UpBankAccountSummary(ApiUrl, EnvToken, CurrencySymbol);

console.log("\nAccount Summary:\n");

for (const BankAccountSummary of BankAccountsSummary) {
  console.log(BankAccountSummary);
}

// Get a list of the 10 most recent transactions on the main debit account

const MainBankAccountId = await UpBankGetMainAccount(ApiUrl, EnvToken);
const MainBankAccountTransactions = await UpBankAccountGetTransactions(
  ApiUrl,
  EnvToken,
  CurrencySymbol,
  MainBankAccountId,
);

console.log("\nRecent Transactions:\n");

for (const MainBankAccountTransaction of MainBankAccountTransactions) {
  console.log(MainBankAccountTransaction);
}
