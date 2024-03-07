const notifier = require("node-notifier");
const fs = require("fs").promises;
const { exec } = require("child_process");

const scrapeCurrWebData = require("./src/scrapeCurrWebData");
const readOldDataFile = require("./src/readOldDataFile");
const compareData = require("./src/compareData");

const url =
  "https://www.canstar.com.au/savings-accounts/best-savings-account-interest-rates/";

function saveData(currData) {
  try {
    const jsonStr = JSON.stringify(currData, null, 2);
    fs.writeFile("data.json", jsonStr);
    console.log("JSON file has been saved.");
  } catch (err) {
    console.error("An error occurred: ", err);
  }
}

notifier.on("click", function (notifierObject, options, event) {
  if (!options.message.includes("no changes")) {
    exec(`open "${url}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error opening URL: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error opening URL: ${stderr}`);
        return;
      }
      console.log(`URL opened successfully: ${url}`);
    });
  }
});

async function main() {
  const currData = await scrapeCurrWebData();
  const oldData = await readOldDataFile();

  let isSame = true;
  if (currData !== null && oldData !== null) {
    isSame = compareData(currData, oldData);
  } else {
    console.log("Error in getting the data.");
  }

  if (!isSame) {
    saveData(currData);
  }
}

main();
