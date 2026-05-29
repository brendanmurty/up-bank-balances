import { load } from "@std/dotenv";

// Load variables from the ENV file

await load({
  envPath: ".up.env",
  export: true,
});

export const ApiToken: string = Deno.env.get("UP_PERSONAL_ACCESS_TOKEN") || "";
export const ApiUrl: string = Deno.env.get("UP_API_URL") || "https://api.up.com.au/api/v1";
export const CurrencySymbol: string = Deno.env.get("UP_ACCOUNTS_CURRENCY_SYMBOL") || "$";
