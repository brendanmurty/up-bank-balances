import { GetEnvVariable } from "./src/helpers/env-variables.ts";
import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { UpBankAccountSummary } from "./src/up-bank-account-summary.ts";
import { UpBankGetMainAccount } from "./src/up-bank-main-account.ts";
import { UpBankAccountGetTransactions } from "./src/up-bank-account-transactions.ts";

const EnvToken: string = GetEnvVariable("UP_PERSONAL_ACCESS_TOKEN") || "";
const CurrencySymbol: string = GetEnvVariable("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";
const ApiUrl = "https://api.up.com.au/api/v1";

let HTMLcontent = "<html><head><title>UP Bank Accounts</title></head><body>";

// Get a summary of all account balances

const BankAccountsSummary = await UpBankAccountSummary(ApiUrl, EnvToken, CurrencySymbol);

HTMLcontent += "<h2>Account Summary</h2><ul>";

for (const BankAccountSummary of BankAccountsSummary) {
  HTMLcontent += "<li>" + BankAccountSummary + "</li>";
}

HTMLcontent += "</ul>";

// Get a list of the 10 most recent transactions on the main debit account

const MainBankAccountId = await UpBankGetMainAccount(ApiUrl, EnvToken);
const MainBankAccountTransactions = await UpBankAccountGetTransactions(ApiUrl, EnvToken, CurrencySymbol, MainBankAccountId);

HTMLcontent += "<h2>Recent Transactions</h2><ul>";

for (const MainBankAccountTransaction of MainBankAccountTransactions) {
  HTMLcontent += "<li>" + MainBankAccountTransaction + "</li>";
}

HTMLcontent += "<ul></body></html>";

const app = new Application();
app.use((context) => {
  context.response.body = HTMLcontent;
});

await app.listen({ port: 8001 });
