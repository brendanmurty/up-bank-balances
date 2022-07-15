export async function UpBankGetMainAccount(ApiUrl: string, EnvToken: string): Promise<string> {
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
    if (AccountInfo.accountType == "TRANSACTIONAL" && AccountInfo.ownershipType == "INDIVIDUAL") {
      // This is the main individual debit account, use this ID
      return ApiResponseJsonData[index].id;
    }
  }

  return "";
}