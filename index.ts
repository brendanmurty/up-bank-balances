import "https://deno.land/x/dotenv/load.ts";

const EnvToken: string = Deno.env.get("UP_PERSONAL_ACCESS_TOKEN") || "";

const ApiUrlAccounts: string = 'https://api.up.com.au/api/v1/accounts';

await fetch(ApiUrlAccounts, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + EnvToken 
    }
  })
.then(response => response.json())
.then(data => {
  for (const index in data.data) {
    let AccountInfo = data.data[index].attributes;  

    console.log(" - " + AccountInfo.displayName + ": " + AccountInfo.balance.currencyCode + " " + AccountInfo.balance.value);
  }
});
