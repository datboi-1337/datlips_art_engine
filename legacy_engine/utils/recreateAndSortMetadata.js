'use strict';

const fs = require('fs');
const path = require('path');
const isLocal = typeof process.pkg === 'undefined';
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const dir = `${basePath}/build/json`;

// Create new directory if it doesn't already exist
const newDir = `${basePath}/build_new/json`;
if (!fs.existsSync(newDir)) {
	fs.mkdirSync(newDir, {
		recursive: true
	});
}

let files = fs.readdirSync(dir);

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

for (let i = 0; i < sortedFileNames.length; i++) {
  let rawFile = fs.readFileSync(`${basePath}/build/json/${sortedFileNames[i]}.json`);
  let data = JSON.parse(rawFile);
  fs.writeFileSync(`${basePath}/build_new/json/${data.edition}.json`, JSON.stringify(data, null, 2));
  allMetadata.push(data);
}

fs.writeFileSync(`${basePath}/build_new/json/_metadata.json`, JSON.stringify(allMetadata, null, 2));

console.log(`Rebuilt _metadata.json and ordered all items numerically. Saved in ${basePath}/build_new/json`);
