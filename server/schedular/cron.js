const cron = require("node-cron");
const { addJobToQueue } = require("../queue/jobQueue");

const FEEDS = [
  { url: "https://jobicy.com/?feed=job_feed", fileName: "jobicy-all" },
  {
    url: "https://www.higheredjobs.com/rss/articleFeed.cfm",
    fileName: "highered",
  },
];

cron.schedule("0 * * * *", async () => {
  for (const feed of FEEDS) {
    await addJobToQueue(feed.url, feed.fileName);
  }
  console.log("🕒 Cron: Queued all job feeds");
});
