import fs from "fs-extra";
import glob from "glob";

const extensionDirectory = "data/homebrew";
const sourceDirectory = "node_modules/5etools/data";
const exportDirectory = "data/database";

import { mergeDeep } from "@/server/utility";

// glob all json files in the source directory
const sourceFiles = glob.sync(`${sourceDirectory}/**/*.json`);

// create output directory data and ensure its empty if it exists
if (fs.existsSync(exportDirectory)) {
  fs.emptyDirSync(exportDirectory);
} else {
  fs.mkdirSync(exportDirectory);
}

// for each source file, check if it exists in the extension directory, if so, merge the json objects recursively
sourceFiles.forEach((sourceFile: string) => {
  const extensionFile = sourceFile.replace(sourceDirectory, extensionDirectory);
  const sourceData = fs.readJsonSync(sourceFile);
  let resultData = sourceData;
  if (fs.existsSync(extensionFile)) {
    console.log(`Merging ${sourceFile} with ${extensionFile}`);
    const extensionData = fs.readJsonSync(extensionFile);
    const mergedData = mergeDeep(sourceData, extensionData);
    resultData = mergedData;
  }
  const outputFileName = sourceFile.replace(sourceDirectory, exportDirectory);
  fs.outputJsonSync(outputFileName, resultData);
});
