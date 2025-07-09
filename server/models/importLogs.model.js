const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  fileName: String,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [String],
});

module.exports = mongoose.model('ImportLog', ImportLogSchema);
