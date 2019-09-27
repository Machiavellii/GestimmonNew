const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/key');
const passport = require('passport');
var multer = require('multer');
const path = require('path');
var fs = require('fs');
// Load User model
const User = require('../models/User');
const Profile = require('../models/profile');
const CompanyProfile = require('../models/CompanyProfile');
const Ads = require('../models/ads');
const Photos = require('../models/Photo');
const Extra = require('../models/Extra');
const Advertiser = require('../models/Advertiser');
const Comment = require('../models/Comment');
const Contact = require('../models/Contact');
const Property = require('../models/Property');

const mongoose = require('mongoose');

function makeQuery(req) {
  const {
    city,
    country,
    canton,
    type,
    floor_min,
    floor_max,
    piece_min,
    piece_max,
    surface_min,
    surface_max,
    price_min,
    price_max,
    category,
    property,

    searchKey,

    anibis,
    unload
  } = req.body;
  var newQuery = {};
  if (city) newQuery.city = city;
  if (country) newQuery.country = country;
  if (canton) newQuery.canton = canton;
  if (type) newQuery.type = type;
  if (floor_min && floor_min > 0) {
    newQuery.floor = {};
    newQuery.floor.$gte = parseInt(floor_min);
  }
  if (floor_max && floor_max > 0) {
    if (typeof newQuery.floor === 'undefined') newQuery.floor = {};
    newQuery.floor.$lte = parseInt(floor_max);
  }
  if (piece_min && piece_min > 0) {
    newQuery.room = {};
    newQuery.room.$gte = parseInt(piece_min);
  }
  if (piece_max && piece_max > 0) {
    if (typeof newQuery.room === 'undefined') newQuery.room = {};
    newQuery.room.$lte = parseInt(piece_max);
  }

  if (surface_min && surface_min > 0) {
    newQuery.surface = {};
    newQuery.surface.$gte = parseInt(surface_min);
  }
  if (surface_max && surface_max > 0) {
    if (typeof newQuery.surface === 'undefined') newQuery.surface = {};
    newQuery.surface.$lte = parseInt(surface_max);
  }

  if (price_min && price_min > 0) {
    newQuery.price = {};
    newQuery.price.$gte = parseInt(price_min);
  }
  if (price_max && price_max > 0) {
    if (typeof newQuery.price === 'undefined') newQuery.price = {};
    newQuery.price.$lte = parseInt(price_max);
  }

  if (category && category > 0) newQuery.category = category;
  if (property && property > 0) newQuery.property = property;

  if (searchKey) {
    newQuery = {
      ...newQuery,
      $or: [{ city: searchKey }, { title: searchKey }]
    };
    var ref_1 = [];
    if (searchKey.includes('.')) {
      ref_1 = searchKey.split('.');
      console.log('ref1:', ref_1);
      newQuery = { ...newQuery, $or: [{ ref: ref_1 }] };
    } else if (!isNaN(searchKey)) {
      newQuery = { ...newQuery, $or: [{ zipcode: searchKey }] };
    }
  }

  var sourceNameArray = [];
  if (anibis === false || unload === false) {
    console.log('123');
    if (anibis === false) {
      sourceNameArray.push('Anibis');
    }
    if (unload === false) {
      sourceNameArray.push('immoscout');
    }
    console.log('1233333', sourceNameArray);
    newQuery.sourceName = { $nin: sourceNameArray };
  }

  return newQuery;
}

router.post(
  '/ads-count',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newQuery = makeQuery(req);

      console.log('searchOption:', newQuery);
      const now = Date.now();
      const ads = await Ads.find(newQuery);

      const now1 = Date.now();
      console.log('totalCnt- time: ', (now1 - now) / 1000, 's', ads.length);
      return res.status(200).json({ count: ads.length });
    } catch (err) {
      console.log('search err:', err);
    }
    return res.status(500).json();
  }
);

router.post('/ads-count-simple', async (req, res) => {
  try {
    const newQuery = makeQuery(req);

    newQuery.source = 0;

    console.log('searchOption:', newQuery);
    const now = Date.now();
    const ads = await Ads.find(newQuery);

    const now1 = Date.now();
    console.log('totalCnt- time: ', (now1 - now) / 1000, 's', ads.length);
    return res.status(200).json({ count: ads.length });
  } catch (err) {
    console.log('search err:', err);
  }
  return res.status(500).json();
});
router.post(
  '/search-simple',
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { pagination_limit, pagination_skip } = req.body;

      const newQuery = makeQuery(req);

      newQuery.source = 0;
      console.log('searchOption:', newQuery);
      const now = Date.now();
      console.log('pagination val:', pagination_skip, pagination_limit);
      const ads = await Ads.find(newQuery)
        .skip(pagination_skip)
        .limit(pagination_limit);
      // const ads = await Ads.aggregate([
      //   {
      //     $match: newQuery
      //   },
      //   {
      //     $lookup: {
      //       from: "photos",
      //       localField: "_id",
      //       foreignField: "adsId",
      //       as: "photos"
      //     }
      //   }
      // ]);
      const now1 = Date.now();
      console.log('time: ', (now1 - now) / 1000, 's', ads.length);
      return res.status(200).json({ ads: ads });
    } catch (err) {
      console.log('search err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/search',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { pagination_limit, pagination_skip } = req.body;

      const newQuery = makeQuery(req);

      console.log('searchOption:', newQuery);
      const now = Date.now();
      console.log('pagination val:', pagination_skip, pagination_limit);
      const ads = await Ads.find(newQuery)
        .skip(pagination_skip)
        .limit(pagination_limit);
      // const ads = await Ads.aggregate([
      //   {
      //     $match: newQuery
      //   },
      //   {
      //     $lookup: {
      //       from: "photos",
      //       localField: "_id",
      //       foreignField: "adsId",
      //       as: "photos"
      //     }
      //   }
      // ]);
      const now1 = Date.now();
      console.log('time: ', (now1 - now) / 1000, 's', ads.length);
      return res.status(200).json({ ads: ads });
    } catch (err) {
      console.log('search err:', err);
    }
    return res.status(500).json();
  }
);
router.delete(
  '/ads',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const ads_id = req.body.ads_id;
      await Photos.findOneAndDelete({ adsId: ads_id });
      await Extra.findOneAndDelete({ adsId: ads_id });
      await Ads.findByIdAndDelete(mongoose.Types.ObjectId(ads_id));
      return res.status(200).json();
    } catch (err) {
      console.log('delete ads err: ', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/duplicate-ads',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const ads_id = req.body.ads_id;

      const ads = await Ads.findById(mongoose.Types.ObjectId(ads_id));
      if (ads) {
        var newAds = new Ads(ads);
        newAds._id = mongoose.Types.ObjectId();
        newAds.title = newAds.title + '(duplicated)';
        newAds.isNew = true;
        await newAds.save();

        const photo = await Photos.findOne({ adsId: ads_id });
        if (photo) {
          const newPhoto = new Photos(photo);
          newPhoto._id = mongoose.Types.ObjectId();
          newPhoto.adsId = newAds._id;
          newPhoto.isNew = true;
          await newPhoto.save();
        }
        const extra = await Extra.findOne({ adsId: ads_id });
        if (extra) {
          const newExtra = new Extra(extra);
          newExtra._id = mongoose.Types.ObjectId();
          newExtra.adsId = newAds._id;
          newExtra.isNew = true;
          await newExtra.save();
        }

        return res.status(200).json({ ads_id: newAds._id });
      }
    } catch (err) {
      console.log('delete ads err: ', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/my-ads',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log('33', req.user._id);
      const now = Date.now();
      const ads = await Ads.aggregate([
        {
          $match: { user_id: req.user._id }
        },
        {
          $lookup: {
            from: 'photos',
            localField: '_id',
            foreignField: 'adsId',
            as: 'photos'
          }
        }
      ]);
      const now1 = Date.now();

      console.log('time: ', (now1 - now) / 1000, 's', ads.length);
      return res.status(200).json({ ads: ads });
    } catch (err) {
      console.log('my-ads err: ', err);
    }
  }
);

router.post(
  '/ads-detail',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log('fdf', req.body.ads_id);
      const now = Date.now();
      const ads = await Ads.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.body.ads_id) } //user_id: req.user._id
        },
        {
          $lookup: {
            from: 'photos',
            localField: '_id',
            foreignField: 'adsId',
            as: 'photos'
          }
        },
        {
          $lookup: {
            from: 'extras',
            localField: '_id',
            foreignField: 'adsId',
            as: 'extra'
          }
        },
        {
          $lookup: {
            from: 'advertisers',
            localField: 'advertiser_id',
            foreignField: '_id',
            as: 'advertiser'
          }
        }
      ]);
      const ads1 = await Ads.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body.ads_id),
        {
          $inc: { visitedNum: 1 }
        }
      );

      const now1 = Date.now();
      console.log('time: ', (now1 - now) / 1000, 's', ads.length, ads[0]);

      return res.status(200).json({ ads: ads[0] });
    } catch (err) {
      console.log('my-ads err: ', err);
    }
  }
);

router.post(
  '/upload-ads',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // console.log('123', req.body);
      const adsInfo = req.body;

      const advertiser = await Advertiser.findOneAndUpdate(
        { email: adsInfo.email },
        {
          fullname: adsInfo.fullname,
          phonenumber: adsInfo.phonenumber,
          email: adsInfo.email
        },
        {
          new: true,
          upsert: true
        }
      );

      const filterOption = adsInfo.ads_id
        ? { _id: mongoose.Types.ObjectId(adsInfo.ads_id) }
        : { title: adsInfo.title };

      // console.log('filterOption', filterOption);

      const newAds = await Ads.findOneAndUpdate(
        filterOption,
        {
          user_id: req.user._id,

          advertiser_id: advertiser._id,
          url: '',
          title: adsInfo.title,
          description: adsInfo.description,
          country: adsInfo.country +1,
          canton: adsInfo.canton +1,
          city: adsInfo.city,
          zipcode: adsInfo.zipcode,
          street: adsInfo.street,
          type: adsInfo.type,
          category: adsInfo.category + 1,
          property: adsInfo.property + 1,
          floor: adsInfo.floor,
          room: adsInfo.room,
          surface: adsInfo.surface,
          price: adsInfo.price,
          charge: adsInfo.charge,
          currency: adsInfo.priceType,
          dateType: adsInfo.dateType,
          availableDate: adsInfo.limitDate,
          source: 0,
          visit_name: adsInfo.visit_name,
          visit_phone: adsInfo.visit_phone,
          visit_email: adsInfo.visit_email,
          mand_name: adsInfo.mand_name,
          mand_phone: adsInfo.mand_phone,
          mand_email: adsInfo.mand_email,
          imgTitle: adsInfo.imgTitle
        },
        {
          new: true,
          upsert: true
        }
      );
      const newExtra = await Extra.findOneAndUpdate(
        {
          adsId: newAds._id
        },
        {
          adsId: newAds._id,
          extraList: adsInfo.extraList
        },
        {
          new: true,
          upsert: true
        }
      );
      await newExtra.save();

      return res.status(200).json({ adsId: newAds._id });
    } catch (err) {
      console.log('post upload-ads err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/upload-adsImages',
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      var storage = multer.diskStorage({
        destination: function(req, file, cb) {
          dirPath = './static/images/';
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
          }
          cb(null, dirPath);
        },
        filename: function(req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
      var upload = multer({ storage: storage }).array('images', 100);
      upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          console.log('err', err);
          return res.status(500).json(err);
        } else if (err) {
          console.log('err1', err);
          return res.status(500).json(err);
        }
        const photoUrls = req.files.map((item, index) => {
          return item.destination.replace('./static', '') + item.filename;
        });
        console.log('123', req.body.exist_images);
        const exist_images = req.body.exist_images.split(',');
        console.log('3333', exist_images);
        if (exist_images && exist_images.length > 0 && exist_images[0] != '') {
          exist_images.map(item => {
            photoUrls.unshift(item);
          });
        }

        const photo = await Photos.findOne({
          adsId: req.body.ads_id
        });
        if (photo) {
          photo.photos.map((item, index) => {
            const imgPath = './static' + item;
            fs.unlink(imgPath, err => {});
          });
        }
        var photos = await Photos.findOneAndUpdate(
          {
            adsId: req.body.ads_id
          },
          {
            adsId: req.body.ads_id,
            photos: photoUrls
          },
          {
            new: true,
            upsert: true
          }
        );
        const ads = await Ads.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(req.body.ads_id)
          },
          { photoThumbs: photoUrls },
          {
            new: true,
            upsert: true
          }
        );
        console.log('updated photos', photos);
      });

      return res.status(200).json();
    } catch (err) {
      console.log('post upload-ads err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/upload-avatar',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      var storage = multer.diskStorage({
        destination: function(req, file, cb) {
          dirPath = './static/images/';
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
          }
          cb(null, dirPath);
        },
        filename: function(req, file, cb) {
          cb(null, Date.now() + '-' + parseInt((Math.random() * 100) % 100));
        }
      });
      var upload = multer({ storage: storage }).single('image');
      upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          console.log('uploadimg err', err);
          return res.status(500).json(err);
        } else if (err) {
          console.log('uploadimg err1', err);
          return res.status(500).json(err);
        }
        var file = req.file;
        const avatarUrl =
          file.destination.replace('./static', '') + file.filename;
        const profile = await Profile.findOne({
          user_id: mongoose.Types.ObjectId(req.user._id)
        });
        if (profile) {
          const avatarUrl = './static' + profile.avatarUrl;
          fs.unlink(avatarUrl, err => {});
        }
        await Profile.findOneAndUpdate(
          { user_id: req.user._id },
          {
            avatarUrl: avatarUrl
          },
          {
            new: true,
            upsert: true
          }
        );
        return res.status(200).json({ avatarUrl: avatarUrl });
      });
    } catch (err) {
      console.log('create dish err:', err);
      return res.status(500).json();
    }
  }
);

router.post(
  '/upload-basic-profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { basicProfile } = req.body;
      const user = await User.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.user._id),
        {
          email: basicProfile.email,
          fullname: basicProfile.fullname,
          phonenumber: basicProfile.phonenumber
        }
      );
      const profile = await Profile.findOneAndUpdate(
        { user_id: req.user._id },
        {
          country: basicProfile.country,
          city: basicProfile.city,
          address: basicProfile.address,
          zipcode: basicProfile.zipcode
        },
        {
          new: true,
          upsert: true
        }
      );
      return res.status(200).json({ basicProfile: profile });
    } catch (err) {
      console.log('upload-basic-profile err:', err);
    }
    return res.status(500).json();
  }
);

router.get(
  '/basic-profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      var basicProfile = {};
      const user = await User.findById(mongoose.Types.ObjectId(req.user._id));
      if (user) {
        basicProfile.fullname = user.fullname;
        basicProfile.email = user.email;
        basicProfile.phonenumber = user.phonenumber;
        basicProfile.id = user._id;
        const profile = await Profile.findOne({ user_id: req.user._id });
        if (profile) {
          basicProfile.country = profile.country;
          basicProfile.city = profile.city;
          basicProfile.address = profile.address;
          basicProfile.zipcode = profile.zipcode;
          basicProfile.avatarUrl = profile.avatarUrl;
          console.log('33', basicProfile);
        }
        return res.status(200).json({ basicProfile: basicProfile });
      }

      return res.status(200).json({ basicProfile: {} });
    } catch (err) {
      console.log('get userinfo err', err);
      return res.status(500).json();
    }
  }
);

router.post(
  '/company-profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { companyProfile } = req.body;

      const profile = await CompanyProfile.findOneAndUpdate(
        { user_id: req.user._id },
        {
          companyName: companyProfile.companyName,
          legalForm: companyProfile.legalForm,

          fullname: companyProfile.fullname,

          address: companyProfile.address,
          additionalAddress: companyProfile.additionalAddress,
          zipcode: companyProfile.zipcode,
          city: companyProfile.city,
          country: companyProfile.country,

          inboxName: companyProfile.inboxName,
          inboxEmail: companyProfile.inboxEmail,

          regNo: companyProfile.regNo,
          regDesc: companyProfile.regDesc,

          email: companyProfile.email,
          mobile: companyProfile.mobile,
          phone: companyProfile.phone,
          fax: companyProfile.fax,
          website: companyProfile.website
        },
        {
          new: true,
          upsert: true
        }
      );
      return res.status(200).json({ companyProfile: profile });
    } catch (err) {
      console.log('upload-basic-profile err:', err);
    }
    return res.status(500).json();
  }
);

router.get(
  '/company-profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      var companyProfile = {};
      const profile = await CompanyProfile.findOne({ user_id: req.user._id });
      if (profile) {
        companyProfile.companyName = profile.companyName;
        companyProfile.legalForm = profile.legalForm;
        companyProfile.fullname = profile.fullname;
        companyProfile.address = profile.address;
        companyProfile.additionalAddress = profile.additionalAddress;
        companyProfile.zipcode = profile.zipcode;
        companyProfile.city = profile.city;
        companyProfile.country = profile.country;
        companyProfile.inboxName = profile.inboxName;
        companyProfile.inboxEmail = profile.inboxEmail;
        companyProfile.regNo = profile.regNo;
        companyProfile.regDesc = profile.regDesc;
        companyProfile.email = profile.email;
        companyProfile.mobile = profile.mobile;
        companyProfile.phone = profile.phone;
        companyProfile.fax = profile.fax;
        companyProfile.website = profile.website;
        console.log('33', companyProfile);
        return res.status(200).json({ companyProfile: companyProfile });
      }
      return res.status(200).json({ companyProfile: {} });
    } catch (err) {
      console.log('get userinfo err', err);
      return res.status(500).json();
    }
  }
);

router.post(
  '/visited',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { ads_id } = req.body;

      const ads = await Ads.findByIdAndUpdate(mongoose.Types.ObjectId(ads_id), {
        $inc: { visitedNum: 1 }
      });
      return res.status(200).json({ visitedNum: adsd.visitedNum });
    } catch (err) {
      console.log('visited add err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/quorom-import',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { url } = req.body;

      const dbController = require('../utils/DbControll');
      const result = await dbController.quoromImport(url, req.user._id);
      return res.status(200).json({ importedNum: result });
    } catch (err) {
      console.log('visited add err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/add-comment',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const comment_data = req.body.comment;
      const comment = new Comment(comment_data);
      comment.user_id = req.user._id;
      await comment.save();
      console.log('add comment', comment);
      return res.status(200).json({ comment: comment });
    } catch (err) {
      console.log('add-comment err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/get-comments',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const ads_id = req.body.ads_id;
      const comments = await Comment.find({ ads_id: ads_id });
      return res.status(200).json({ comments: comments });
    } catch (err) {
      console.log('add-comment err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/new-contact',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { contactData } = req.body;
      if (!contactData) return res.status(400).json('');

      const contact = new Contact(contactData);
      contact.user_id = req.user._id;
      await contact.save();

      return res.status(200).json({ contactData: contact });
    } catch (err) {
      console.log('add-contact err:', err);
    }
    return res.status(500).json();
  }
);

router.get(
  '/contacts',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const contacts = await Contact.find({ user_id: req.user._id });
      return res.status(200).json({ contacts: contacts });
    } catch (err) {
      console.log('get userinfo err', err);
      return res.status(500).json();
    }
  }
);

router.post(
  '/property',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log('property:', req.body);
      const propertyData = req.body.propertyData;
      const property = new Property(propertyData);
      await property.save();

      return res.status(200).json({ property_id: property._id });
    } catch (err) {
      console.log('post upload-ads err:', err);
    }
    return res.status(500).json();
  }
);

router.put(
  '/property',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log('property:', req.body);

      const propertyData = req.body.propertyData;
      const property_id = propertyData.property_id;
      const property = await Property.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(property_id)
        },
        { ...propertyData }
      );
      if (!property) return res.status(400).json({});
      return res.status(200).json({ property_id: property._id });
    } catch (err) {
      console.log('post upload-ads err:', err);
    }
    return res.status(500).json();
  }
);

router.post(
  '/upload-property-images',
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      var storage = multer.diskStorage({
        destination: function(req, file, cb) {
          dirPath = './static/images/';
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
          }
          cb(null, dirPath);
        },
        filename: function(req, file, cb) {
          cb(null, Date.now() + '-' + parseInt((Math.random() * 100) % 100));
        }
      });
      var upload = multer({ storage: storage }).array('images', 100);
      upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          console.log('err', err);
          return res.status(500).json(err);
        } else if (err) {
          console.log('err1', err);
          return res.status(500).json(err);
        }
        const photoUrls = req.files.map((item, index) => {
          return item.destination.replace('./static', '') + item.filename;
        });
        const property = await Property.findOneAndUpdate(
          { _id: req.body.property_id },
          {
            photo: photoUrls[0],
            morePhotos: photoUrls.filter((item, index) => {
              return index !== 0;
            })
          }
        );
        console.log('property images:', property);
      });
      return res.status(200).json();
    } catch (err) {
      console.log('post property-img err:', err);
    }
    return res.status(500).json();
  }
);

router.put(
  '/upload-property-images',
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      var storage = multer.diskStorage({
        destination: function(req, file, cb) {
          dirPath = './static/images/';
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
          }
          cb(null, dirPath);
        },
        filename: function(req, file, cb) {
          cb(null, Date.now() + '-' + parseInt((Math.random() * 100) % 100));
        }
      });
      var upload = multer({ storage: storage }).array('images', 100);
      upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          console.log('err', err);
          return res.status(500).json(err);
        } else if (err) {
          console.log('err1', err);
          return res.status(500).json(err);
        }
        console.log('99', req.body);
        const photoUrls = req.files.map((item, index) => {
          return item.destination.replace('./static', '') + item.filename;
        });
        const property = await Property.findOne({ _id: req.body.property_id });
        const coverImage_none = req.body.coverImage_none;
        if (property.photo && coverImage_none) {
          const imgPath = './static' + property.photo;
          console.log('delete photo: ', imgPath);
          fs.unlink(imgPath, err => {});
          property.photo = '';
        }
        const coverImage_on = req.body.coverImage_on;
        const coverImgUrl = coverImage_on
          ? photoUrls.slice(0, 1)[0]
          : property.photo;
        property.photo = coverImgUrl;

        const deleted = req.body.deleted && req.body.deleted.split(',');
        console.log('ddd', deleted);
        if (deleted && deleted.length > 0) {
          for (var i = 0; i < deleted.length; i++) {
            const item = deleted[i];
            property.morePhotos.splice(property.morePhotos.indexOf(item), 1);
            const imgPath = './static' + item;
            console.log('delete photos: ', imgPath);
            fs.unlink(imgPath, err => {});
          }
        }
        for (var i = 0; i < photoUrls.length; i++) {
          const item = photoUrls[i];
          if (i === 0 && coverImage_on) {
          } else {
            property.morePhotos.push(item);
          }
        }
        console.log('updated property: ', property);
        await property.save();
      });
      return res.status(200).json();
    } catch (err) {
      console.log('post property-img err:', err);
    }
    return res.status(500).json();
  }
);

router.get(
  '/properties',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const properties = await Property.find({ user_id: req.body._id });
      return res.status(200).json({ properties: properties });
    } catch (err) {
      console.log('get properties err:', err);
    }
    return res.status(500).json();
  }
);

module.exports = router;
