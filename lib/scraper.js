import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMultiplePages(config, progressCallback) {
  const { url, itemSelector, titleSelector, priceSelector, descriptionSelector, pageOption, pages } = config;
  let machines = [];

  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract data from each item on the page
    $(itemSelector).each((index, element) => {
      const title = $(element).find(titleSelector).text().trim();
      const price = $(element).find(priceSelector).text().trim();
      const description = $(element).find(descriptionSelector).text().trim();

      machines.push({ title, price, description });
    });

    if (progressCallback) {
      progressCallback(100); // 100% progress
    }

    console.log(`Scraping completed. Scraped ${machines.length} machines.`);
    console.log('Sample machine:', machines[0]);

    return machines;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
}
