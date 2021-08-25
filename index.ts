import "https://deno.land/x/dotenv/load.ts";

const EnvToken: string = Deno.env.get("UP_PERSONAL_ACCESS_TOKEN") || "";

if (EnvToken == '') { 
  console.log('Could not find token in .env, exiting.');
  Deno.exit(1);
}

const ApiUrl: string = 'https://api.up.com.au/api/v1';

console.log("\nAccounts:\n");

await fetch(
  ApiUrl + '/accounts',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + EnvToken 
    }
  }
)
.then(response => response.json())
.then(data => {
  for (const index in data.data) {
    let AccountId = data.data[index].id;  
    let AccountInfo = data.data[index].attributes;  

    console.log(" - " + AccountInfo.displayName.trim() + ": $" + AccountInfo.balance.value);
  }
});

console.log("\nTransactions:\n");

await fetch(
  ApiUrl + '/transactions?page[size]=5',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + EnvToken 
    }
  }
)
.then(response => response.json())
.then(data => {
  for (const index in data.data) {
    let TransactionInfo = data.data[index].attributes
    let TransactionAmount = ("$" + TransactionInfo.amount.value).replace("$-", "-$");

    console.log(" - " + TransactionInfo.description.trim() + ": " + TransactionAmount);
  }
})

console.log("\n");
