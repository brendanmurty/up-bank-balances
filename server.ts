import { ensureDirSync } from "std/fs/mod.ts";
import { posix, win32 } from "std/path/mod.ts";
import { Application } from "https://deno.land/x/oak@v12.1.0/mod.ts";

import { GetEnvVariable } from "./src/helpers/env-variables.ts";
import { GetScriptDirectory } from "./src/helpers/script-directory.ts";
import { UpBankAccountSummary } from "./src/up-bank-account-summary.ts";
import { UpBankGetMainAccount } from "./src/up-bank-main-account.ts";
import { UpBankAccountGetTransactions } from "./src/up-bank-account-transactions.ts";

const EnvToken: string = GetEnvVariable("UP_PERSONAL_ACCESS_TOKEN") || "";
const CurrencySymbol: string = GetEnvVariable("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";
const ApiUrl = "https://api.up.com.au/api/v1";

// Initialise the HTML content for the page

let HTMLcontent = '<html><head><title>Bank Accounts</title>';
HTMLcontent += '<link rel="icon" href="/favicon.svg" type="image/svg+xml">';
HTMLcontent += '<link rel="stylesheet" href="/styles.css">';
HTMLcontent += '</head><body>';

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

// Save the HTML content to the "public" directory and copy over required assets

const ScriptDirectory = GetScriptDirectory();
let AssetsFavicon = posix.join(ScriptDirectory, 'assets', 'favicon.svg');
let AssetsStyles = posix.join(ScriptDirectory, 'assets', 'styles.css');
let PublicDirectory = posix.join(ScriptDirectory, 'public');
let PublicIndex = posix.join(ScriptDirectory, 'public', 'index.html');
let PublicFavicon = posix.join(ScriptDirectory, 'public', 'favicon.svg');
let PublicStyles = posix.join(ScriptDirectory, 'public', 'styles.css');

if (Deno.build.os == "windows") {
  AssetsFavicon = win32.join(ScriptDirectory, 'assets', 'favicon.svg');
  AssetsStyles = win32.join(ScriptDirectory, 'assets', 'styles.css');
  PublicDirectory = win32.join(ScriptDirectory, 'public');
  PublicIndex = win32.join(ScriptDirectory, 'public', 'index.html');
  PublicFavicon = win32.join(ScriptDirectory, 'public', 'favicon.svg');
  PublicStyles = posix.join(ScriptDirectory, 'public', 'styles.css');
}

ensureDirSync(PublicDirectory);
Deno.writeTextFileSync(PublicIndex, HTMLcontent);
Deno.copyFileSync(AssetsFavicon, PublicFavicon);
Deno.copyFileSync(AssetsStyles, PublicStyles);

// Serve the request from the "public" directory at "http://localhost:8001"

const app = new Application();
app.use(async (context, next) => {
  try {
    await context.send({
      root: ScriptDirectory + '/public',
      index: 'index.html'
    });
  } catch (error) {
    if (error) {
      console.error(error);
    }

    next();
  }
});

await app.listen({ port: 8001 });
