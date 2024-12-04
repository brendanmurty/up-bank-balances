import { join } from "@std/path";
import { Application } from "@oak/oak/application";

import { GetEnvVariable } from "./helpers/env-variables.ts";
import { UpBankAccountSummary } from "./up-bank-account-summary.ts";
import { UpBankGetMainAccount } from "./up-bank-main-account.ts";
import { UpBankAccountGetTransactions } from "./up-bank-account-transactions.ts";

const EnvToken: string = GetEnvVariable("UP_PERSONAL_ACCESS_TOKEN") || "";
const CurrencySymbol: string = GetEnvVariable("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";
const ApiUrl = "https://api.up.com.au/api/v1";

// Initialise the HTML content for the page

let HTMLcontent = "<html><head><title>Bank Accounts</title>";
HTMLcontent += '<link rel="icon" href="/favicon.svg" type="image/svg+xml">';
HTMLcontent += '<link rel="stylesheet" href="/styles.css">';
HTMLcontent += "</head><body>";

// Get a summary of all account balances

const BankAccountsSummary = await UpBankAccountSummary(ApiUrl, EnvToken, CurrencySymbol);

HTMLcontent += "<h2>Account Summary</h2><ul>";

for (const BankAccountSummary of BankAccountsSummary) {
  HTMLcontent += "<li>" + BankAccountSummary + "</li>";
}

HTMLcontent += "</ul>";

// Get a list of the 10 most recent transactions on the main debit account

const MainBankAccountId = await UpBankGetMainAccount(ApiUrl, EnvToken);
const MainBankAccountTransactions = await UpBankAccountGetTransactions(
  ApiUrl,
  EnvToken,
  CurrencySymbol,
  MainBankAccountId,
);

HTMLcontent += "<h2>Recent Transactions</h2><ul>";

for (const MainBankAccountTransaction of MainBankAccountTransactions) {
  HTMLcontent += "<li>" + MainBankAccountTransaction + "</li>";
}

HTMLcontent += "<ul></body></html>";

// Save the HTML content to the "public" directory and copy over required assets

const ScriptDirectory = "./";
const AssetsFavicon = join(ScriptDirectory, "assets", "favicon.svg");
const AssetsStyles = join(ScriptDirectory, "assets", "styles.css");
const PublicDirectory = join(ScriptDirectory, "public");
const PublicIndex = join(ScriptDirectory, "public", "index.html");
const PublicFavicon = join(ScriptDirectory, "public", "favicon.svg");
const PublicStyles = join(ScriptDirectory, "public", "styles.css");

Deno.writeTextFileSync(PublicIndex, HTMLcontent);
Deno.copyFileSync(AssetsFavicon, PublicFavicon);
Deno.copyFileSync(AssetsStyles, PublicStyles);

// Serve the request from the "public" directory at "http://localhost:8001"

console.log(
  '%cServing "public" directory at %chttp://localhost:8001',
  "color: green",
  "color: blue",
);

const app = new Application();
app.use(async (context, next) => {
  try {
    await context.send({
      root: ScriptDirectory + "/public",
      index: "index.html",
    });
  } catch (error) {
    if (error) {
      console.error(error);
    }

    next();
  }
});

await app.listen({ port: 8001 });
