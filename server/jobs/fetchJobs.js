const axios = require('axios');
const xmlToJson = require('../utils/xmlToJson');
const Job = require('../models/job.model');

async function fetchAndImportJobs(url, fileName) {
  const result = {
    fileName,
    totalFetched: 0,
    totalImported: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: [],
  };

  try {
    console.log(`📡 Fetching from URL: ${url}`);
    const { data: xmlData } = await axios.get(url);
    console.log("✅ XML Fetched");

    const json = await xmlToJson(xmlData);
    console.log("🧾 Converted JSON Preview:\n", JSON.stringify(json.rss?.channel, null, 2));

    // Normalize jobs to always be an array
    let jobs = json?.rss?.channel?.item || [];
    if (!Array.isArray(jobs)) jobs = [jobs];  // convert single object to array

    console.log(`📦 Jobs found: ${jobs.length}`);
    result.totalFetched = jobs.length;

    for (const job of jobs) {
      try {
        const updated = await Job.findOneAndUpdate(
          { jobId: job.guid },
          {
            jobId: job.guid,
            title: job.title,
            company: job['dc:creator'] || 'N/A',
            location: job.location || 'Remote',
            description: job.description,
            url: job.link,
          },
          { new: true, upsert: true }
        );
        updated ? result.updatedJobs++ : result.newJobs++;
        result.totalImported++;
      } catch (err) {
        console.error("❌ Insert error:", err.message);
        result.failedJobs.push(err.message);
      }
    }
  } catch (err) {
    console.error("❌ Fetch or parse failed:", err.message);
    result.failedJobs.push(err.message);
  }

  return result;
}

module.exports = fetchAndImportJobs;
