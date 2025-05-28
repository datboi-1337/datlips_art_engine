'use strict';

const fs = require('fs');
const path = require('path');
const isLocal = typeof process.pkg === 'undefined';
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const dir = `${basePath}/build/images`;
const newDir = `${basePath}/build_new`

const renum = false;

// Create new directory if it doesn't already exist, clear if it does. 
if (!fs.existsSync(newDir)) {
  fs.mkdirSync(newDir);
  fs.mkdirSync(`${newDir}/json`);
  fs.mkdirSync(`${newDir}/images`);
} else {
  fs.rmdirSync(newDir, { recursive: true } );
  fs.mkdirSync(newDir);
  fs.mkdirSync(`${newDir}/json`);
  fs.mkdirSync(`${newDir}/images`);
}

// Read filenames of remaining images
let files = fs.readdirSync(dir);

// Sort filenames numerically. 
const sortFileNames = () => {
  let filenames  = [];
  files.forEach(file => {
    const str = file
    const filename = Number(str.split('.').slice(0, -1).join('.'));
    return filenames.push(filename);
  })
  filenames.sort(function(a, b) {
    return a - b;
  });
  return filenames;
}

let sortedFileNames = sortFileNames();

let allMetadata = [];

// Loop through filenames, renumber, and save images and json in build_new
for (let i = 0; i < sortedFileNames.length; i++) {
  let rawJson = fs.readFileSync(`${basePath}/build/json/${sortedFileNames[i]}.json`);
  let data = JSON.parse(rawJson);
  let newEdition = renum ? i+1 : data.edition;
  data.edition = newEdition;
  fs.writeFileSync(`${basePath}/build_new/json/${newEdition}.json`, JSON.stringify(data, null, 2));

  fs.copyFile(`${basePath}/build/images/${sortedFileNames[i]}.png`, `${basePath}/build_new/images/${newEdition}.png`, fs.constants.COPYFILE_EXCL, (err) => {
    if (err) {
      console.log("Error Found:", err);
    }
  });

  allMetadata.push(data);
}

fs.writeFileSync(`${basePath}/build_new/json/_metadata.json`, JSON.stringify(allMetadata, null, 2));

console.log(`Removed extra metadata files & re-numbered all editions in metadata as well as filenames. Saved in ${basePath}/build_new/json`);
