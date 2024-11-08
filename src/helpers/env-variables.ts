import { loadSync } from "@std/dotenv";

export function GetEnvVariable(VariableName: string): string {
  // Load variables from ".env"
  loadSync({ export: true });

  const EnvVariableValue = Deno.env.get(VariableName);

  if (EnvVariableValue == undefined) {
    console.log(`Could not find ${VariableName} in .env file.`);
    return "";
  }

  return EnvVariableValue;
}
