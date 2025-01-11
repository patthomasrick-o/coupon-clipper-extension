const fs = require("fs");

const newVersion = process.argv[2];

function updateManifestJson() {
  const filePath = "./public/manifest.json";
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  jsonData.version = newVersion;
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
}

function updateVersionFile() {
  const filePath = "./VERSION";
  fs.writeFileSync(filePath, newVersion);
}

updateManifestJson();
updateVersionFile();
