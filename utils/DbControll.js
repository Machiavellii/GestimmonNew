const User = require('../models/User');
const Ads = require('../models/ads');
const Advertiser = require('../models/Advertiser');
const Photos = require('../models/Photo');
const Extra = require('../models/Extra');
var fs = require('fs').promises;
const csv = require('csvtojson');
const axios = require('axios');

function addFromAnibisCSV() {
  csv()
    .fromFile('data/anibis_2.csv')
    .then(jsonObj => {
      /**
       * [
       * 	{a:"1", b:"2", c:"3"},
       * 	{a:"4", b:"5". c:"6"}
       * ]
       */

      var counter = 0;
      const adsArray = jsonObj;
      adsArray.map(async (item, index) => {
        // if(item.photos){
        //   let photoArray = [];
        //   item.photos = item.photos.replace("['", "");
        //   item.photos = item.photos.replace("']", "");
        //   // item.photos = item.photos.replace("', '", "##");
        //   // photoArray = item.photos.split("##");
        //   console.log("afsd", item.photos.split("', '").length);
        // }
        //   return;

        // const advertiser = await Advertiser.findOneAndUpdate(
        //   { email: array[79] },
        //   {
        //     fullname: array[71],
        //     email: array[79],
        //     phonenumber: array[76],
        //     address: array[72],
        //     zipcode: array[73],
        //     city: array[74],
        //     country:array[75],
        //     tel1: array[78],
        //     agency: array[69],
        //   },
        //   {
        //     new: true,
        //     upsert: true
        //   }
        // );
        if (!item.surface) item.surface = 0;
        if (!item.room) item.room = 0;
        if (!item.price) item.price = 0;
        if (!item.floor) item.floor = 0;

        if (item.surface === '>undefined surface<') item.surface = 0;
        if (item.room === '>undefined room<') item.room = 0;
        if (item.category === '>undefined category<') item.category = 1;
        if (item.property === '>undefined property<') item.property = 1;

        var photoArray = [];
        if (item.photos && item.photos != '[]') {
          item.photos = item.photos.replace("['", '');
          item.photos = item.photos.replace("']", '');
          // item.photos = item.photos.replace("', '", "##");
          photoArray = item.photos.split("', '");
          if (photoArray == '[]') photoArray = [];
          if (photoArray && photoArray.length === 1 && photoArray[0] === '[]') {
            photoArray = [];
          }
        }
        const ads = await Ads.findOneAndUpdate(
          {
            title: item.title,
            floor: parseInt(item.floor),
            room: parseInt(item.room),
            price: parseInt(item.price),
            surface: parseInt(item.surface)
          },
          {
            description: item.description,
            country: item.country,
            zipcode: item.zipcode,
            canton: item.canton,
            // zone: array[13],
            city: item.city, //(parseInt(Math.random() * 100) % 3) + 1,//array[10],//item.city_id,
            street: item.street,
            category: item.category, //parseInt((Math.random() * 100) % 7) + 1, //item.main_category_id,
            property: item.property, //parseInt((Math.random() * 100) % 4) + 1, //item.sub_category_id,
            floor: parseInt(item.floor),
            room: parseInt(item.room),
            price: parseInt(item.price),
            surface: parseInt(item.surface),
            // charge: parseInt(item.charge),
            // netRent: ,
            currency:
              item.currency === '>undefined currency<' ? 'CHF' : item.currency,
            // advertiser_id: advertiser._id,
            type: item.type ? item.type.toLowerCase() : 'rent', //array[4] ? array[4].toLowerCase() : "rent",
            source: 1,
            sourceName: 'Anibis',
            // availableDate: item.availableDate===">undefined availableDate<" ? "" : item.availableDate,
            photoThumbs: photoArray
          },
          {
            new: true,
            upsert: true
          }
        );

        if (photoArray && photoArray.length > 0) {
          const photos = await Photos.findOneAndUpdate(
            { adsId: ads._id },
            {
              photos: photoArray,
              adsId: ads._id
            },
            { new: true, upsert: true }
          );
        }
        // var extraList = [];
        // item.extra
        if (item.extra) {
          var extraList = [];
          extraList.push(item.extra);
          const extra = await Extra.findOneAndUpdate(
            { adsId: ads._id },
            {
              extraList: extraList,
              adsId: ads._id
            },
            { new: true, upsert: true }
          );
        }
        counter++;
        console.log('addFromAnibis: ', counter);
      });
    });
}
function quoromImport(url, user_id) {
  try {
    const { StringDecoder } = require('string_decoder');
    const decoder = new StringDecoder('utf-8');

    const http = require('http');
    var fs1 = require('fs');
    const file = fs1.createWriteStream('data/quorum_1.txt');

    http.get(url, response => {
      response.pipe(file).on('finish', async function() {
        console.log('asdf');
        var dataText = await fs.readFile('data/quorum_1.txt', 'ascii');
        const dataArray = dataText.split('\r\n');
        var counter = 0;
        var amount = dataArray.length;
        const wait_map = dataArray.map(async (item, index) => {
          try {
            item = item.replace('\\n', '');
            var array = item.split('#');
            const advertiser = await Advertiser.findOneAndUpdate(
              { email: array[79] },
              {
                fullname: array[71],
                email: array[79],
                phonenumber: array[76],
                address: array[72],
                zipcode: array[73],
                city: array[74],
                country: array[75],
                tel1: array[78],
                agency: array[69]
              },
              {
                new: true,
                upsert: true
              }
            );

            if (!array[16]) {
              array[16] = array[17].substr(0, array[17].indexOf('.'));
            }

            let photoArray = [];
            for (var i = 46; i <= 50; i++) {
              if (array[i]) {
                photoArray.push('http://rpmc.koalito.com/gestimmo/' + array[i]);
              }
            }
            const ref = [];
            ref[0] = array[6];
            ref[1] = array[7];
            console.log('a', array[16]);
            const ads = await Ads.findOneAndUpdate(
              {
                ref: ref
              },
              {
                title: array[16],
                description: array[17],
                country: array[12],
                zipcode: array[9],
                canton: array[11],
                zone: array[13],
                city: array[10], //(parseInt(Math.random() * 100) % 3) + 1, //array[10],//item.city_id,
                street: array[8],
                category: parseInt((Math.random() * 100) % 7) + 1, //item.main_category_id,
                property: parseInt((Math.random() * 100) % 4) + 1, //item.sub_category_id,
                floor: array[24],
                room: array[25],
                price: array[19],
                surface: array[27],
                charge: array[20],
                netRent: array[18],
                currency: array[22],
                advertiser_id: advertiser._id,
                type: array[4] ? array[4].toLowerCase() : 'rent',
                source: 1,
                sourceName: 'immoscout',
                photoThumbs: photoArray,
                ref: ref,
                user_id: user_id,

                visit_name: array[81],
                visit_phone: array[82],
                visit_email: array[83],
                visit_remark: array[84]
              },
              {
                new: true,
                upsert: true
              }
            );

            if (photoArray && photoArray.length > 0) {
              const photos = await Photos.findOneAndUpdate(
                { adsId: ads._id },
                {
                  photos: photoArray,
                  adsId: ads._id
                },
                { new: true, upsert: true }
              );
            }

            var extraList = [];
            for (var i = 56; i <= 60; i++) {
              if (array[i]) {
                extraList.push(array[i]);
              }
            }
            if (extraList && extraList.length > 0) {
              const extra = Extra.findOneAndUpdate(
                { adsId: ads._id },
                {
                  extraList: extraList,
                  adsId: ads._id
                },
                { new: true, upsert: true }
              );
            }
            counter++;
            console.log('addFromunload: ', counter);
          } catch (err) {
            console.log('333');
          }
        });
        console.log('tag', counter);
        await Promise.all(wait_map);
        return counter;
      });
    });
  } catch (err) {
    console.log('addFromUnload err:', err);
    return -1;
  }
}

async function addFromUnLoad() {
  try {
    const { StringDecoder } = require('string_decoder');
    const decoder = new StringDecoder('utf8');

    const res = await axios.request({
      url: 'http://rpmc.koalito.com/gestimmo/unload2.txt',
      // baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    var dataText = decoder.write(res.data);
    // var dataText = await fs.readFile("data/unload.txt", "utf8");

    const dataArray = dataText.split('\r\n');
    var counter = 0;
    dataArray.map(async (item, index) => {
      item = item.replace('\\n', '');
      var array = item.split('#');
      const advertiser = await Advertiser.findOneAndUpdate(
        { email: array[79] },
        {
          fullname: array[71],
          email: array[79],
          phonenumber: array[76],
          address: array[72],
          zipcode: array[73],
          city: array[74],
          country: array[75],
          tel1: array[78],
          agency: array[69]
        },
        {
          new: true,
          upsert: true
        }
      );

      if (!array[16]) {
        array[16] = array[17].substr(0, array[17].indexOf('.'));
      }

      let photoArray = [];
      for (var i = 46; i <= 50; i++) {
        if (array[i]) {
          photoArray.push('http://rpmc.koalito.com/gestimmo/' + array[i]);
        }
      }
      const ref = [];
      ref[0] = array[6];
      ref[1] = array[7];
      const ads = await Ads.findOneAndUpdate(
        {
          ref: ref
        },
        {
          title: array[16],
          description: array[17],
          country: array[12],
          zipcode: array[9],
          canton: array[11],
          zone: array[13],
          city: (parseInt(Math.random() * 100) % 3) + 1, //array[10],//item.city_id,
          street: array[8],
          category: parseInt((Math.random() * 100) % 7) + 1, //item.main_category_id,
          property: parseInt((Math.random() * 100) % 4) + 1, //item.sub_category_id,
          floor: array[24],
          room: array[25],
          price: array[19],
          surface: array[27],
          charge: array[20],
          netRent: array[18],
          currency: array[22],
          advertiser_id: advertiser._id,
          type: array[4] ? array[4].toLowerCase() : 'rent',
          source: 1,
          sourceName: 'immoscout',
          photoThumbs: photoArray,
          ref: ref
        },
        {
          new: true,
          upsert: true
        }
      );

      if (photoArray && photoArray.length > 0) {
        const photos = await Photos.findOneAndUpdate(
          { adsId: ads._id },
          {
            photos: photoArray,
            adsId: ads._id
          },
          { new: true, upsert: true }
        );
      }

      var extraList = [];
      for (var i = 56; i <= 60; i++) {
        if (array[i]) {
          extraList.push(array[i]);
        }
      }
      if (extraList && extraList.length > 0) {
        const extra = await Extra.findOneAndUpdate(
          { adsId: ads._id },
          {
            extraList: extraList,
            adsId: ads._id
          },
          { new: true, upsert: true }
        );
      }
      counter++;
      console.log('addFromunload: ', counter);
    });
  } catch (err) {
    console.log('addFromUnload err:', err);
  }
}

async function addFromAnibis() {
  try {
    const dataText = await fs.readFile('data/anibis.txt', 'utf8');
    const dataJson = JSON.parse(dataText);
    // console.log("123",dataJson[1])
    // return;
    const data = dataJson;
    console.log('len:', data.length / 2);
    var counter = 0;
    data.map(async (item, index) => {
      if (index % 2 == 0) return;
      // const advertiser = await Advertiser.findOneAndUpdate(
      //   { email: item.broker_email },
      //   {
      //     fullname: item.broker_lastname,
      //     email: item.broker_email,
      //     phonenumber: item.broker_phone
      //   },
      //   {
      //     new: true,
      //     upsert: true
      //   }
      // );

      const ads = await Ads.findOneAndUpdate(
        {
          title: item.title
          // advertiser_id: advertiser._id
        },
        {
          title: item.title,
          description: item.description,
          country: item.country,
          city: item.city, //(parseInt(Math.random() * 100) % 3) + 1, //item.city_id,
          street: item.street === 'undefined' ? '' : item.street,
          category: parseInt((Math.random() * 100) % 7) + 1, //item.main_category_id,
          property: parseInt((Math.random() * 100) % 4) + 1, //item.sub_category_id,
          floor: typeof item.floor === 'undefined' ? 1 : item.floor,
          room: item.room,
          price: item.price,
          surface: item.surface,
          // advertiser_id: advertiser._id,
          type: item.type,
          source: 1
        },
        {
          new: true,
          upsert: true
        }
      );

      const photos = await Photos.findOneAndUpdate(
        { adsId: ads._id },
        {
          photos: item.photos,
          adsId: ads._id
        },
        { new: true, upsert: true }
      );
      counter++;
    });
  } catch (err) {
    console.log('addFromAnibis err:', err);
  }
}

async function addFromKoalito() {
  try {
    const dataText = await fs.readFile('data/koalito.txt', 'utf8');
    const dataJson = JSON.parse(dataText);
    const data = dataJson.properties;
    console.log('len:', data.length);
    var counter = 0;
    data.map(async (item, index) => {
      const advertiser = await Advertiser.findOneAndUpdate(
        { email: item.broker_email },
        {
          fullname: item.broker_lastname,
          email: item.broker_email,
          phonenumber: item.broker_phone
        },
        {
          new: true,
          upsert: true
        }
      );

      const ads = await Ads.findOneAndUpdate(
        {
          title: item.description.de.title
          // advertiser_id: advertiser._id
        },
        {
          title: item.description.de.title,
          description: item.description.de.description,
          country: item.country_id,
          city: (parseInt(Math.random() * 100) % 3) + 1, //item.city_id,
          street: item.district_id,
          category: parseInt((Math.random() * 100) % 7) + 1, //item.main_category_id,
          property: parseInt((Math.random() * 100) % 4) + 1, //item.sub_category_id,
          floor: typeof item.floor === 'undefined' ? 1 : item.floor,
          room: item.rooms,
          // photos: item.photos,
          price: item.price,
          surface: item.habitable,
          advertiser_id: advertiser._id,
          type: 'rent',
          source: 1
        },
        {
          new: true,
          upsert: true
        }
      );

      const photos = await Photos.findOneAndUpdate(
        { adsId: ads._id },
        {
          photos: item.photos,
          adsId: ads._id
        },
        { new: true, upsert: true }
      );
      counter++;
    });
  } catch (err) {
    console.log('addFromkoalito err:', err);
  }
}

async function addFromListe() {
  try {
    const dataText = await fs.readFile('data/liste-objet-20190810.txt', 'utf8');
    const dataArray = dataText.split('######');
    var counter = 0;
    dataArray.map(async (item1, index) => {
      const item = JSON.parse(item1);
      if (item.phone_number) {
        var advertiser = await Advertiser.findOneAndUpdate(
          {
            phonenumber: item.phone_number
          },
          {
            phonenumber: item.phone_number
          },
          {
            new: true,
            upsert: true
          }
        );

        var ads = await Ads.findOneAndUpdate(
          {
            title: item.title,
            advertiser_id: advertiser._id
          },
          {
            title: item.title,
            description: item.description,
            photos: item.pictures,
            price: item.price,
            surface: item.details.surface ? item.details.surface : '',
            advertiser_id: advertiser._id,
            type: 'sale',
            source: 1
          },
          {
            new: true,
            upsert: true
          }
        );
        counter++;
      }
    });
  } catch (err) {
    console.log('addFromListe err', err);
  }
}
module.exports = {
  addFromKoalito,
  addFromListe,
  addFromAnibis,
  addFromUnLoad,
  addFromAnibisCSV,
  quoromImport
};
