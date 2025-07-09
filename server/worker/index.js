const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const ImportLog = require('../models/importLog.model');
const { connection } = require('../config/redis');
const fetchAndImportJobs = require('../jobs/fetchJobs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const worker = new Worker(
  'job-importer',
  async (job) => {
    const { url, fileName } = job.data;
    const result = await fetchAndImportJobs(url, fileName);
    await ImportLog.create(result);
  },
  { connection }
);

worker.on('completed', () => console.log('✅ Job completed'));
worker.on('failed', (job, err) => console.error('❌ Job failed:', err));
