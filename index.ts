import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { posix, win32, dirname } from "https://deno.land/std@0.147.0/path/mod.ts";
import { UpBankAccountSummary } from "./src/up-bank-account-summary.ts";
import { UpBankGetMainAccount } from "./src/up-bank-main-account.ts";
import { UpBankAccountGetTransactions } from "./src/up-bank-account-transactions.ts";

// Load the configuration values from files in the same directory as this script,
// loading it this way allows for the script to be run from any directory instead of just this directory.
if (Deno.build.os == "windows") {
  const ScriptDirectory = dirname(win32.fromFileUrl(import.meta.url));
  config({
    path: win32.join(ScriptDirectory, ".env"),
    export: true,
    example: win32.join(ScriptDirectory, ".env.example"),
    defaults: win32.join(ScriptDirectory, ".env.example")
  });
} else {
  const ScriptDirectory = dirname(posix.fromFileUrl(import.meta.url));
  config({
    path: posix.join(ScriptDirectory, ".env"),
    export: true,
    example: posix.join(ScriptDirectory, ".env.example"),
    defaults: posix.join(ScriptDirectory, ".env.example")
  });
}

const EnvToken: string = Deno.env.get("UP_PERSONAL_ACCESS_TOKEN") || "";
const CurrencySymbol: string = Deno.env.get("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";
const ApiUrl = "https://api.up.com.au/api/v1";

if (EnvToken == "") { 
  console.log("Could not find token in .env, exiting.");
  Deno.exit(1);
}

// Get a summary of all account balances

const BankAccountsSummary = await UpBankAccountSummary(ApiUrl, EnvToken, CurrencySymbol);

console.log("\nAccount Summary:\n");

for (const BankAccountSummary of BankAccountsSummary) {
  console.log(BankAccountSummary);
}


// Get a list of the 10 most recent transactions on the main debit account

const MainBankAccountId = await UpBankGetMainAccount(ApiUrl, EnvToken);
const MainBankAccountTransactions = await UpBankAccountGetTransactions(ApiUrl, EnvToken, CurrencySymbol, MainBankAccountId);

console.log("\nRecent Transactions:\n");

for (const MainBankAccountTransaction of MainBankAccountTransactions) {
  console.log(" - " + MainBankAccountTransaction);
}
