const xml2js = require('xml2js');

module.exports = async function (xmlData) {
  return await xml2js.parseStringPromise(xmlData, { explicitArray: false });
};
