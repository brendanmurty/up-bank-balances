import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { posix, win32, dirname } from "https://deno.land/std@0.147.0/path/mod.ts";

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

if (EnvToken == "") { 
  console.log("Could not find token in .env, exiting.");
  Deno.exit(1);
}

const ApiUrl = "https://api.up.com.au/api/v1";

const ColourReset = "\x1b[0m";
const ColourRed = "\x1b[31m";
const ColourGreen = "\x1b[32m";
const ColourYellow = "\x1b[33m";
const ColourBlue = "\x1b[34m";
const ColourMagenta = "\x1b[35m";
const ColourCyan = "\x1b[36m";

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
    const AccountInfo = data.data[index].attributes;  

    // Default to showing accounts in magenta coloured text
    let AccountDisplayName = ColourCyan + AccountInfo.displayName.trim() + ColourReset;

    if (AccountInfo.accountType == "SAVER") {
      // Show saver accounts in blue coloured text
      AccountDisplayName = ColourYellow + AccountInfo.displayName.trim() + ColourReset;
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
    const TransactionInfo = data.data[index].attributes

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
