const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

const jobQueue = new Queue('job-importer', { connection });

async function addJobToQueue(url, fileName) {
  await jobQueue.add('fetch', { url, fileName });
}

module.exports = { jobQueue, addJobToQueue };
