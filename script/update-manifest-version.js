const fs = require("fs");

const filePath = "./public/manifest.json";
const newVersion = process.argv[2];

const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
jsonData.version = newVersion;

fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
