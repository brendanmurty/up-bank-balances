import { posix, win32, dirname } from "https://deno.land/std@0.147.0/path/mod.ts";

export function GetScriptDirectory(): string {
  // Get a suitable absolute path string for the directory that the
  // top level scripts are in.
  if (Deno.build.os == "windows") {
    return dirname(dirname(dirname(win32.fromFileUrl(import.meta.url))));
  }

  return dirname(dirname(dirname(posix.fromFileUrl(import.meta.url))));
}
