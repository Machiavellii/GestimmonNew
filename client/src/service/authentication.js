import axios from 'axios';

export const isAuthenticated = () => {
  let hasToken = localStorage.getItem('jwtToken');
  // console.log("curentToken", hasToken);
  if (hasToken) {
    axios.defaults.headers.common['Authorization'] = hasToken;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  if (hasToken) return true;
  return false;
};

export const saveLoginInfo = (email, password) => {
  localStorage.setItem('cur_email', email);
  localStorage.setItem('cur_password', password);
};

export const LoadLoginInfo = () => {
  const email = localStorage.getItem('cur_email');
  const password = localStorage.getItem('cur_password');

  return { email: email, password: password };
};

export const setUserInfo = user => {
  localStorage.setItem('user_info', JSON.stringify(user));
};

export const getUserInfo = () => {
  try {
    const user_json = localStorage.getItem('user_info');
    return JSON.parse(user_json);
  } catch (err) {
    console.log('get_user err:', err);
  }
  return null;
};
