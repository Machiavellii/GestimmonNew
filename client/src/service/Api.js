import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import config from '../config/config';

const StatusCode = {
  SUCCESS: 200,
  REDIRECTION: 300,
  CLIENT_ERROR: 400,
  SERVER_ERROR: 500
};

export const register = async userData => {
  try {
    const res = await axios.request({
      url: '/api/users/register',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: userData
    });
    if (res.status === StatusCode.SUCCESS) {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      console.log('usertoken:', decoded);
      return { status: true, result: decoded };
    }
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return { status: false, message: response.data.message };
    }
  }
  return { status: false };
};

export const login = async userData => {
  try {
    const res = await axios.request({
      url: '/api/users/login',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: userData
    });

    const { token } = res.data;
    console.log('token', token);
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    console.log('usertoken:', decoded);
    return { status: true, result: decoded };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false,
        title: response.data.title,
        message: response.data.message
      };
    }
  }
  return { status: false };
};

export const logout = async () => {
  try {
    const res = await axios.request({
      url: '/api/users/logout',
      baseURL: config.apiBaseUrl,
      method: 'get'
    });

    setAuthToken(false);
    return { status: true };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false,
        title: response.data.title,
        message: response.data.message
      };
    }
  }
  setAuthToken(false);
  return { status: false };
};

export const searchSimpleAds = async searchOption => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/search-simple',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: searchOption
    });

    const { ads } = res.data;
    console.log('search result', ads);
    return { status: true, data: ads };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false
        // title: response.data.title,
        // message: response.data.message
      };
    }
  }
  return { status: false };
};

export const searchAds = async searchOption => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/search',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: searchOption
    });

    const { ads } = res.data;
    console.log('search result', ads);
    return { status: true, data: ads };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false
        // title: response.data.title,
        // message: response.data.message
      };
    }
  }
  return { status: false };
};

export const getTotalAdsCount = async searchOption => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/ads-count',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: searchOption
    });

    const { count } = res.data;
    console.log('search result', count);
    return { status: true, data: count };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false
        // title: response.data.title,
        // message: response.data.message
      };
    }
  }
  return { status: false };
};

export const getTotalAdsCountSimple = async searchOption => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/ads-count-simple',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: searchOption
    });

    const { count } = res.data;
    console.log('search result', count);
    return { status: true, data: count };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false
        // title: response.data.title,
        // message: response.data.message
      };
    }
  }
  return { status: false };
};

export const MyAds = async searchOption => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/my-ads',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: searchOption
    });

    const { ads } = res.data;
    console.log('search result', ads);
    return { status: true, data: ads };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false
        // title: response.data.title,
        // message: response.data.message
      };
    }
  }
  return { status: false };
};

export const AdsDetail = async searchOption => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/ads-detail',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: searchOption
    });

    const { ads } = res.data;
    console.log('adsdetail result', ads);
    return { status: true, data: ads };
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return {
        status: false
        // title: response.data.title,
        // message: response.data.message
      };
    }
  }
  return { status: false };
};

export const uploadAds = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/upload-ads',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: data
    });

    // const { ads } = res.data;
    console.log('post ads result', res.data);
    return { status: true, adsId: res.data.adsId };
  } catch (err) {
    console.log('uploadAds err:', err);
  }

  return { status: false };
};

export const uploadImages = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/upload-adsImages',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: data
    });

    // const { ads } = res.data;
    console.log('upload images result', res.data);
    return { status: true, adsId: res.data.ads_id };
  } catch (err) {
    console.log('uploadAds err:', err);
  }
  return { status: false };
};

export const getUserLanguage = async () => {
  try {
    const res = await axios.request({
      url: '/api/users/language',
      baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    console.log('get language', res.data);
    return { status: true, lang: res.data.language, user: res.data.user };
  } catch (err) {
    console.log('get language Error', err);
  }
  return { status: false };
};

export const setUserLanguage = async language => {
  try {
    const res = await axios.request({
      url: '/api/users/language',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { language: language }
    });
    console.log('set language', res.data);
    return { status: true };
  } catch (err) {
    console.log('set language Error', err);
  }
  return { status: false };
};

export const deleteAds = async ads_id => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/ads',
      baseURL: config.apiBaseUrl,
      method: 'DELETE',
      data: { ads_id: ads_id }
    });
    return { status: true };
  } catch (err) {
    console.log('delete ads err:', err);
  }
  return { status: false };
};

export const duplicateAds = async ads_id => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/duplicate-ads',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { ads_id: ads_id }
    });
    return { status: true, ads_id: res.data.ads_id };
  } catch (err) {
    console.log('duplicate ads err:', err);
  }
  return { status: false };
};

export const uploadAvatar = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/upload-avatar',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: data
    });

    const { avatarUrl } = res.data;
    console.log('upload avatar url', res.data);
    return { status: true, avatarUrl: avatarUrl };
  } catch (err) {
    console.log('upload avatar err:', err);
  }
  return { status: false };
};

export const uploadBasicProfile = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/upload-basic-profile',
      baseURL: config.apiBaseUrl,
      method: 'post',
      data: { basicProfile: data }
    });

    const { basicProfile } = res.data;
    console.log('upload basic profile', res.data);
    return { status: true, basicProfile: basicProfile };
  } catch (err) {
    console.log('upload basic profile err:', err);
  }
  return { status: false };
};

export const getBasicProfile = async () => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/basic-profile',
      baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    return { status: true, basicProfile: res.data.basicProfile };
  } catch (err) {
    console.log('get basic profile err:', err);
  }
  return { status: false };
};

export const saveCompanyProfile = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/company-profile',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { companyProfile: data }
    });
    return { status: true, companyProfile: res.data.companyProfile };
  } catch (err) {
    console.log('get company profile err:', err);
  }
  return { status: false };
};

export const getCompanyProfile = async () => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/company-profile',
      baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    return { status: true, companyProfile: res.data.companyProfile };
  } catch (err) {
    console.log('get company profile err:', err);
  }
  return { status: false };
};

export const addVisitedCount = async ads_id => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/visited',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { ads_id: ads_id }
    });

    return { status: true, visitedNum: res.data.visitedNum };
  } catch (err) {
    console.log('post visited count err:', err);
  }
  return { status: false };
};

export const quoromImport = async url => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/quorom-import',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { url: url }
    });

    return { status: true, importedNum: res.data.importedNum };
  } catch (err) {
    console.log('post visited count err:', err);
  }
  return { status: false };
};

export const addContact = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/new-contact',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { contactData: data }
    });

    const { contactData } = res.data;
    return { status: true, contactData: contactData };
  } catch (err) {
    console.log('Add contact error:', err);
  }
  return { status: false };
};

export const getContacts = async () => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/contacts',
      baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    return { status: true, contacts: res.data.contacts };
  } catch (err) {
    console.log('get contacts error', err);
  }
  return { status: false };
};

export const addComment = async comment_data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/add-comment',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { comment: comment_data }
    });

    return { status: true, comment: res.data.comment };
  } catch (err) {
    console.log('post comment err:', err);
  }
  return { status: false };
};

export const getComments = async ads_id => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/get-comments',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { ads_id: ads_id }
    });
    console.log('get comments', res.data.comments);
    return { status: true, comments: res.data.comments };
  } catch (err) {
    console.log('get comments err:', err);
  }
  return { status: false };
};

export const createProperty = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/property',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: { propertyData: data }
    });

    // const { ads } = res.data;
    console.log('property_id', res.data);
    return { status: true, property_id: res.data.property_id };
  } catch (err) {
    console.log('upload property err:', err);
  }
  return { status: false };
};

export const uploadPropertyImages = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/upload-property-images',
      baseURL: config.apiBaseUrl,
      method: 'POST',
      data: data
    });
    const { ads } = res.data;
    return { status: true, ads: ads };
  } catch (err) {
    console.log('upload propertyimg err:', err);
  }
  return { status: false };
};

export const EditProperty = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/property',
      baseURL: config.apiBaseUrl,
      method: 'PUT',
      data: { propertyData: data }
    });

    // const { ads } = res.data;
    console.log('property_id', res.data);
    return { status: true, property_id: res.data.property_id };
  } catch (err) {
    console.log('upload property err:', err);
  }
  return { status: false };
};

export const uploadPropertyImages_Edit = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/upload-property-images',
      baseURL: config.apiBaseUrl,
      method: 'PUT',
      data: data
    });
    const { ads } = res.data;
    return { status: true, ads: ads };
  } catch (err) {
    console.log('upload propertyimg err:', err);
  }
  return { status: false };
};

export const getProperties = async () => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/properties',
      baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    return { status: true, properties: res.data.properties };
  } catch (err) {
    console.log('get properties err:', err);
  }
  return { status: false };
};

//Writen by Matej - 9/12/2019
export const getContactProfile = async () => {
  try {
    const res = await axios.request({
      url: '/api/contacts/:id',
      baseURL: config.apiBaseUrl,
      method: 'GET'
    });
    return { status: true, contactProfile: res.data.contactProfile };
  } catch (err) {
    console.log('get contact profile err:', err);
  }
  return { status: false };
};

export const updateBasicContactProfile = async data => {
  try {
    const res = await axios.request({
      url: '/api/contact/upload-contact-profile/:id',
      baseUrl: config.apiBaseUrl,
      method: 'PUT',
      data: { contactProfile: data }
    });

    const { contactProfile } = res.data;
    return { status: true, contactProfile: contactProfile };
  } catch (err) {
    console.log('upload contact profile: ', err);
  }
  return { status: false };
};

export const uploadContactAvatar = async data => {
  try {
    const res = await axios.request({
      url: '/api/contact/upload-contact-avatar/:id',
      method: 'POST',
      data: data
    });

    const { avatarUrl } = res.data;
    return { status: true, avatarUrl: avatarUrl };
  } catch (err) {
    console.log('error', err);
  }
  return { status: false };
};

export const AdsCount = async data => {
  try {
    const res = await axios.request({
      url: '/api/dashboard/ads-count',
      method: 'POST',
      data: data
    });

    // const { count } = res.data;

    console.log(res);

    // return { status: true, count: count };
  } catch (err) {
    console.log('error', err);
  }
};
// End of that part
// AdsCount('VD');
