import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { posix, win32, dirname } from "https://deno.land/std@0.147.0/path/mod.ts";

export function GetEnvVariable(VariableName: string): string {
  // Load the configuration values from files in the same directory as this script,
  // loading it this way allows for the script to be run from any directory instead of just this directory.
  if (Deno.build.os == "windows") {
    const ScriptDirectory = dirname(dirname(dirname(win32.fromFileUrl(import.meta.url))));
    config({
      path: win32.join(ScriptDirectory, ".env"),
      export: true,
      example: win32.join(ScriptDirectory, ".env.example"),
      defaults: win32.join(ScriptDirectory, ".env.example")
    });
  } else {
    const ScriptDirectory = dirname(dirname(dirname(posix.fromFileUrl(import.meta.url))));
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
