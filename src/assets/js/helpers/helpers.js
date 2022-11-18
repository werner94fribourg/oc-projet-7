import { TIMEOUT_SEC } from './config.js';

/**
 * Function used to create a Promise that will automatically reject/resolve after a certain specified time. It promisify the timeout behavior
 * @param {number} seconds number of seconds that will pass before the Promise rejects/resolves
 * @param {boolean} toReject boolean value used to specify if the Promise will reject (true) or resolve (false) after the time that was specified
 * @returns {Promise} a Promise that will automatically reject/resolve after the time that was specified
 * @author Werner Schmid
 */
export const timeout = (seconds, toReject = true) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      toReject
        ? reject(
            new Error(
              `Request took too long ! Timeout after ${seconds} seconds`
            )
          )
        : resolve();
    }, seconds * 1000);
  });

/**
 * Function used to fetch data from a specific url. It used the retry pattern so that it retries the fetch operation if it fails to retrieve the data
 * @param {string} url the url where we want to get the data
 * @returns {Object} the data fetched by calling the url
 * @author Werner Schmid
 */
export const AJAX_GET = async url => {
  let nbFails = 0;
  while (true) {
    try {
      const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${res.status}: ${data.message}`);
      }
      return data;
    } catch (err) {
      nbFails++;
      console.error(`Failed attempt ${nbFails}`);
      if (nbFails >= 3) {
        throw err;
      }
    }
    await timeout(0.5, false);
  }
};
