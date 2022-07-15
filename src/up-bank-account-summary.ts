export async function UpBankAccountSummary(ApiUrl: string, EnvToken: string, CurrencySymbol: string): Promise<string[]> {
  let FinalOutput: string[] = [];

  // Get a list of all open accounts
  const ApiResponse = await fetch(
    ApiUrl + "/accounts",
    {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + EnvToken
      }
    }
  );

  const ApiResponseJson = await ApiResponse.json();
  const ApiResponseJsonData = ApiResponseJson.data;

  for (const index in ApiResponseJsonData) {
    const AccountInfo = ApiResponseJsonData[index].attributes;
    const AccountDisplayName = AccountInfo.displayName.trim();

    FinalOutput.push(" - " + AccountDisplayName + ": " + CurrencySymbol + AccountInfo.balance.value);
  }

  return FinalOutput;
}