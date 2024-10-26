import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMultiplePages(config, progressCallback) {
  const { url, itemSelector, titleSelector, priceSelector, descriptionSelector, pageOption, pages } = config;
  let machines = [];

  try {
    const axiosConfig = {
      headers: {
        'Cookie': 'PRICEVIEWING=50405',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    // Loop through the specified number of pages
    for (let currentPage = 1; currentPage <= pages; currentPage++) {
      // Construct the URL for the current page
      let pageUrl;
      if (pageOption === 'specific') {
        pageUrl = currentPage === 1 ? url : `${url}page/${currentPage}/`;
      } else {
        pageUrl = currentPage === 1 ? url : `${url}${pageOption}${currentPage}`;
      }
      
      // Fetch the webpage content
      const response = await axios.get(pageUrl, axiosConfig);
      const $ = cheerio.load(response.data);

      // Extract data from each item on the page
      $(itemSelector).each((index, element) => {
        const title = $(element).find(titleSelector).text().trim();
        const price = $(element).find(priceSelector).text().trim();
        const description = $(element).find(descriptionSelector).text().trim();

        machines.push({ title, price, description });
      });

      // Calculate and report progress
      if (progressCallback) {
        const progress = Math.round((currentPage / pages) * 100);
        progressCallback(progress);
      }

      console.log(`Scraped page ${currentPage}/${pages}`);
    }

    console.log(`Scraping completed. Scraped ${machines.length} machines from ${pages} pages.`);
    console.log('Sample machine:', machines[0]);

    return machines;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
}
