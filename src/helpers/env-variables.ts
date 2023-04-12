import { config } from "dotenv/mod.ts";
import { posix, win32 } from "std/path/mod.ts";

import { GetScriptDirectory } from "./script-directory.ts";

export function GetEnvVariable(VariableName: string): string {
  // Load the configuration values from files in the same directory as the main scripts,
  // loading it this way allows for the script to be run from any directory instead
  // of just this directory.
  const ScriptDirectory = GetScriptDirectory();
  if (Deno.build.os == "windows") {
    config({
      path: win32.join(ScriptDirectory, ".env"),
      export: true,
      example: win32.join(ScriptDirectory, ".env.example"),
      defaults: win32.join(ScriptDirectory, ".env.example")
    });
  } else {
    config({
      path: posix.join(ScriptDirectory, ".env"),
      export: true,
      example: posix.join(ScriptDirectory, ".env.example"),
      defaults: posix.join(ScriptDirectory, ".env.example")
    });
  }

  const EnvVariableValue = Deno.env.get(VariableName);

  if (EnvVariableValue == undefined) {
    console.log(`Could not find ${VariableName} in .env file.`);
    return '';
  }

  return EnvVariableValue;
}
