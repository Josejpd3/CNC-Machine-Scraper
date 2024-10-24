import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMultiplePages(config, progressCallback) {
  const { url, itemSelector, titleSelector, priceSelector, descriptionSelector, pageOption, pages } = config;
  let machines = [];

  try {
    // Set up the request configuration
    const axiosConfig = {
      headers: {
        'Cookie': 'PRICEVIEWING=50405',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    // Fetch the webpage content with the custom headers
    const response = await axios.get(url, axiosConfig);
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
