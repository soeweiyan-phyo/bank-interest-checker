const puppeteer = require("puppeteer");

// Best banks' interests comparison website
const url =
  "https://www.canstar.com.au/savings-accounts/best-savings-account-interest-rates/";

const scrapeWebsite = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const grabTables = await page.evaluate(() => {
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

    let highPromoRate = [];
    let highBaseRate = [];
    let highBonusRate = [];

    const tableTags = document.querySelector(
      "div.table-responsive table tbody"
    );

    // For each table tag
    // for (let i = 0; i < 3; i++) {
    // Extract features and convert to camelCase
    let features = tableTags.children[0].innerText.split("\t");
    for (let i = 0; i < features.length; i++) {
      features[i] = toCamelCase(features[i]);
    }
    // }

    // Extract table data
    for (let i = 1; i < tableTags.children.length; i++) {
      // Initialise object
      let tempObj = {};
      for (let j = 0; j < features.length; j++) {
        tempObj[features[j]] = tableTags.children[i].children[
          j
        ].innerText.replace("\n", " ");
      }
      highPromoRate.push(tempObj);
    }

    return highPromoRate;
  });

  console.log(grabTables);

  await browser.close();
};

scrapeWebsite();
