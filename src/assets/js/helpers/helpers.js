import { TIMEOUT_SEC } from './config.js';

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
