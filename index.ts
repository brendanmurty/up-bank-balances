import "https://deno.land/x/dotenv/load.ts";

const EnvToken: string = Deno.env.get("UP_PERSONAL_ACCESS_TOKEN") || "";

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
    let AccountDisplayName = ColourMagenta + AccountInfo.displayName.trim() + ColourReset;

    if (AccountInfo.accountType == "SAVER") {
      AccountDisplayName = ColourBlue + AccountInfo.displayName.trim() + ColourReset;
    }

    console.log(
      " - " + 
      AccountDisplayName + 
      ": $" + 
      AccountInfo.balance.value
    );
  }
});

console.log("\nRecent Transactions:\n");

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
    let TransactionAmount = ("$" + TransactionInfo.amount.value).replace("$-", "-$");

    if (TransactionAmount.indexOf("-$") > -1) {
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
