var schedule = require("node-schedule");

const Ads = require("../models/ads");

console.log("here is scheduler part");
// 0h3m33s for everyday
var j = schedule.scheduleJob("33 0 * * *", function() {
  console.log("schedule works!", Date.now());
  // deleteExpiredAds();
});

async function deleteExpiredAds() {
  const adsAll = await Ads.find({});
  if (adsAll) {
    var scheduleData = [];
    for (var i = 0; i < adsAll.length; i++) {
      const ads = adsAll[i];
      for (var j = 0; j < ads.adsArray.length; j++) {
        const expireDate = new Date(ads.adsArray[j].leaveDate);
        console.log("expireDate", expireDate);
        const now = Date.now();
        if (expireDate < now) {
          ads.adsArray.splice(j, 1);
          j--;
          console.log("delete An expired ads", j + 1);
        }
      }
      await ads.save();
    }
  }
}
