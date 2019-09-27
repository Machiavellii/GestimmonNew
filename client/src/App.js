import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import DashBoard from './containers/dashboard';
import ForgotPassword from './containers/Auth/forgotpassword';
import ResetPassword from './containers/Auth/resetpassword';
import AdminPanel from './containers/Admin';
import Terms from './containers/Auth/Terms';

import './App.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

import LoginPage from 'containers/Auth/LoginPage/LoginPage.jsx';
import RegisterPage from 'containers/Auth/RegisterPage/RegisterPage.jsx';
import LandingPage from './containers/Landing/Landing.jsx';
import CreateAds from './containers/CreateAds/CreateAds.jsx';
import SearchAds from './containers/SearchAds/SearchAds.jsx';
import MyAds from './containers/MyAds/MyAds.jsx';
import AdsDetail from './containers/AdsDetail/AdsDetail.jsx';
import Profile from './containers/Profile/Profile.jsx';
import Property from 'containers/Property/Property.jsx';
import Contacts from 'containers/Contacts/Contacts.jsx';
import AddContact from 'containers/Contacts/Add-Contact/AddContact.jsx';

import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import frLocale from 'date-fns/locale/fr';
import enLocale from 'date-fns/locale/en-US';
import deLocale from 'date-fns/locale/de';
import itLocale from 'date-fns/locale/it';
import Categories from 'containers/Categories/Categories';
import ContactPage from 'containers/Contacts/ContactPage/ContactPage';

function App(props) {
  const locale = [enLocale, frLocale, deLocale, itLocale];
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale[props.lang]}>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/dashboard" component={DashBoard} />
          <Route path="/profile" component={Profile} />
          <Route path="/property" component={Property} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/add-contact" component={AddContact} />
          <Route path="/settings" component={Categories} />
          <Route path="/contactID" component={ContactPage} />

          <Route path="/createAds" component={CreateAds} />
          <Route path="/MyAds" component={MyAds} />
          <Route path="/search" component={SearchAds} />
          <Route path="/adsDetail" component={AdsDetail} />
          <Route path="/password_reset" component={ForgotPassword} />
          <Route path="/reset_password/:token" component={ResetPassword} />
          <Route path="/terms" component={Terms} />
          <Route path="/admin" component={AdminPanel} />
          <NotificationContainer />
        </Switch>
      </Router>
    </MuiPickersUtilsProvider>
  );
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
