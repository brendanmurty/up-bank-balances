export async function UpBankAccountSummary(
  ApiUrl: string,
  EnvToken: string,
  CurrencySymbol: string,
): Promise<string[]> {
  // deno-lint-ignore prefer-const
  let FinalOutput: string[] = [];

  // Get a list of all open accounts
  const ApiResponse = await fetch(
    ApiUrl + "/accounts?page[size]=30",
    {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + EnvToken,
      },
    },
  );

  const ApiResponseJson = await ApiResponse.json();
  const ApiResponseJsonData = ApiResponseJson.data;

  for (const index in ApiResponseJsonData) {
    const AccountInfo = ApiResponseJsonData[index].attributes;

    // Remove all emojis from account names
    const AccountDisplayName = AccountInfo.displayName.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    ).trim();

    FinalOutput.push(AccountDisplayName + ": " + CurrencySymbol + AccountInfo.balance.value);
  }

  return FinalOutput;
}
