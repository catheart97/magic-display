/**
 * This script reads the JSON schema for the 5etools database and generates
 * typescript fields for it.
 * node --stack-size=8192 --import tsx scripts/create-schema.ts
 */

import { mergeDeep } from "@/types/Utility";
import fs from "fs-extra";
import * as glob from "glob";

import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  FetchingJSONSchemaStore,
  quicktypeMultiFile,
} from "quicktype-core";

const databaseDirectory = "data/database";
const databaseFiles = glob.sync(`${databaseDirectory}/items.json`);
const output = `src/database/Item.ts`;

(async () => {
  const input = jsonInputForTargetLanguage("typescript");
  await input.addSource({
    name: "schema",
    samples: databaseFiles.map((file) => JSON.stringify(fs.readJSONSync(file))),
  });

  const inputData = new InputData();
  inputData.addInput(input);

  console.log("Creating types... (this may take a while)");
  const result = await quicktype({
    inputData,
    lang: "typescript",
    combineClasses: true,
  });
  console.log("Types created!");
  await fs.writeFile(output, result.lines.join("\n"));
})();
