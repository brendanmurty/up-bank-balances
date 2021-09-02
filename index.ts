import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import makeloc from "https://deno.land/x/dirname@1.1.2/mod.ts";

const { __dirname, __filename } = makeloc(import.meta);

// Load the configuration values from a file called ".env"
// in the same directory as this script. Loading it this way
// allows for the run from any directory instead of just this directory.
await config({
  path: path.join(__dirname, ".env"),
  export: true,
  example: path.join(__dirname, ".env.example"),
  defaults: path.join(__dirname, ".env.example")
});

const EnvToken: string = Deno.env.get("UP_PERSONAL_ACCESS_TOKEN") || "";

const CurrencySymbol: string = Deno.env.get("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";

if (EnvToken == "") { 
  console.log("Could not find token in .env, exiting.");
  Deno.exit(1);
}

const ApiUrl: string = "https://api.up.com.au/api/v1";

const ColourReset: string = "\x1b[0m";
const ColourRed: string = "\x1b[31m";
const ColourGreen: string = "\x1b[32m";
const ColourYellow: string = "\x1b[33m";
const ColourBlue: string = "\x1b[34m";
const ColourMagenta: string = "\x1b[35m";
const ColourCyan: string = "\x1b[36m";

console.log("\nAll Accounts:\n");

// Get a list of all open accounts
await fetch(
  ApiUrl + "/accounts",
  {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + EnvToken 
    }
  }
)
.then(response => response.json())
.then(data => {
  for (const index in data.data) {
    let AccountId = data.data[index].id;  
    let AccountInfo = data.data[index].attributes;  

    // Default to showing accounts in magenta coloured text
    let AccountDisplayName = ColourMagenta + AccountInfo.displayName.trim() + ColourReset;

    if (AccountInfo.accountType == "SAVER") {
      // Show saver accounts in blue coloured text
      AccountDisplayName = ColourBlue + AccountInfo.displayName.trim() + ColourReset;
    }

    console.log(
      " - " + 
      AccountDisplayName + 
      ": " + 
      CurrencySymbol +
      AccountInfo.balance.value
    );
  }
});

console.log("\nRecent Transactions:\n");

// Get a list of the 10 most recent transactions on all accounts
await fetch(
  ApiUrl + "/transactions?page[size]=10",
  {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + EnvToken 
    }
  }
)
.then(response => response.json())
.then(data => {
  for (const index in data.data) {
    let TransactionInfo = data.data[index].attributes

    // Fix the output of debit transactions
    let TransactionAmount = (CurrencySymbol + TransactionInfo.amount.value).replace(CurrencySymbol + "-", "-" + CurrencySymbol);

    if (TransactionAmount.indexOf("-" + CurrencySymbol) > -1) {
      // This transaction is a debit
      TransactionAmount = ColourRed + TransactionAmount + ColourReset;
    } else {
      // This transaction is a credit
      TransactionAmount = ColourGreen + TransactionAmount + ColourReset;
    }

    console.log(
      " - " + 
      TransactionInfo.description.trim() + 
      ": " + 
      TransactionAmount
    );
  }
})

console.log("");
