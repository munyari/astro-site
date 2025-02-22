import { access } from "fs/promises";
import { config } from "dotenv";
import { constants } from "fs";

export async function loadEnv() {
  try {
    await access(".env", constants.R_OK);
    config();
  } catch (error) {
    // swallow any errors here so we can continue. If the environment is not setup right,
    // we'll blow up later.
  }
}