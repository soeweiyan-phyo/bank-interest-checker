const puppeteer = require("puppeteer");

// Best banks' interests comparison website
const url =
  "https://www.canstar.com.au/savings-accounts/best-savings-account-interest-rates/";

const scrapeWebsite = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const grabTables = await page.evaluate(() => {
    // Helper function
    function toCamelCase(str) {
      // Replace special characters with a space and trim excess spaces
      str = str
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => {
          if (char === "\\n") return " ";
          if (char === "\\t") return " ";
          return " " + char.toUpperCase();
        })
        .trim();

      // Split the string into an array of words
      let words = str.split(" ");

      // Convert the first word to lowercase
      let camelCaseString = words[0].toLowerCase();

      // Loop through the remaining words and capitalize the first letter
      for (let i = 1; i < words.length; i++) {
        let word = words[i];
        camelCaseString +=
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      return camelCaseString;
    }

    const usefulTables = 3;
    let savingsRateData = [];

    const tableTags = document.querySelectorAll(
      "div.table-responsive table tbody"
    );

    // For each table
    for (let i = 0; i < usefulTables; i++) {
      let tempTableData = [];

      // Extract features and convert to camelCase
      // table -> tr -> th.innerText
      let features = tableTags[i].children[0].innerText.split("\t");
      for (let j = 0; j < features.length; j++) {
        features[j] = toCamelCase(features[j]);
      }

      // Extract table data
      // For each rows
      for (let j = 1; j < tableTags[i].children.length; j++) {
        let tempObj = {};

        // For each columns
        for (let k = 0; k < features.length; k++) {
          // table -> tr -> td.innerText
          tempObj[features[k]] = tableTags[i].children[j].children[k].innerText
            .replace(/\+/g, "")
            .replace(/\n/g, " ")
            .trim();
        }

        // Store each table data
        tempTableData.push(tempObj);
      }

      // Store all tables data
      savingsRateData.push(tempTableData);
    }

    return savingsRateData;
  });

  console.log(grabTables);

  await browser.close();
};

scrapeWebsite();
