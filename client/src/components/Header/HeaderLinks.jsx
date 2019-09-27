/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import t from '../../constants/language';

// react components for routing our app without refresh
import { Link, withRouter } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';

// @material-ui/icons
import { Apps, Search } from '@material-ui/icons';

// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import headerLinksStyle from 'assets/jss/material-kit-react/components/headerLinksStyle.jsx';

import { isAuthenticated } from 'service/authentication';
import setAuthToken from 'utils/setAuthToken';
import * as types from 'actions/types';
import { setUserLanguage, getUserLanguage } from 'service/Api';
import { setUserInfo, getUserInfo } from 'service/authentication';

const handleLoginDlg = dispatch => {
  dispatch({ type: 'LOGIN_DIALOG' });
};

function HeaderLinks({ ...props }) {
  const { classes } = props;
  const isAuthed = isAuthenticated();

  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserLanguage().then(result => {
      if (result.status) {
        const user1 = result.user;
        props.dispatch({ type: types.CHANGE_LANG, payload: user1.language });
        // props.dispatch({ type: types.SET_USER, payload: user})
        setUserInfo(user1);
        const userInfo = user1; //getUserInfo();
        if (userInfo && user && userInfo.email === user.email) {
        } else {
          console.log('setUser : ', userInfo);
          setUser(userInfo);
        }
      }
    });
  }, []);
  const handleMenuClick = buttonName => {
    if (
      buttonName === 'Contacts' ||
      buttonName === 'Contacts' ||
      buttonName === 'Kontakte' ||
      buttonName === 'Contatti'
    ) {
      props.history.push('/contacts');
    }
    if (
      buttonName === 'Property' ||
      buttonName === 'Propriété' ||
      buttonName === 'Eigentum' ||
      buttonName === 'Proprietà'
    ) {
      props.history.push('/property');
    }
    if (
      buttonName === 'Me' ||
      buttonName === 'Moi' ||
      buttonName === 'Mich' ||
      buttonName === 'Me'
    ) {
      props.history.push('/profile');
    }
    if (
      buttonName === 'Create Ads' ||
      buttonName === 'Créer des annonces' ||
      buttonName === 'Anzeigen erstellen' ||
      buttonName === 'Crea annunci'
    ) {
      props.history.push('/createAds');
    }
    if (
      buttonName === 'My Ads' ||
      buttonName === 'Mes annonces' ||
      buttonName === 'Meine Anzeigen' ||
      buttonName === 'I miei annunci'
    ) {
      props.history.push('/myAds');
    }
    if (
      buttonName === 'Sign out' ||
      buttonName === 'Déconnexion' ||
      buttonName === 'Ausloggen' ||
      buttonName === 'Disconnessione'
    ) {
      localStorage.removeItem('jwtToken');
      setAuthToken(false);
      props.history.push('/login');
    }
  };

  const handleLanguageSelect = buttonName => {
    if (buttonName === 'English') {
      setUserLanguage(0);
      props.dispatch({ type: types.CHANGE_LANG, payload: 0 });
    }
    if (buttonName === 'French') {
      setUserLanguage(1);
      props.dispatch({ type: types.CHANGE_LANG, payload: 1 });
    }
    if (buttonName === 'German') {
      setUserLanguage(2);
      props.dispatch({ type: types.CHANGE_LANG, payload: 2 });
    }
    if (buttonName === 'Italian') {
      setUserLanguage(3);
      props.dispatch({ type: types.CHANGE_LANG, payload: 3 });
    }
  };

  const getLanguageNameByIndex = lang_index => {
    switch (lang_index) {
      case 0:
        return 'English';
      case 1:
        return 'Français';
      case 2:
        return 'German';
      case 3:
        return 'Italian';
    }
  };
  console.log(t[0].me);
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          left
          hoverColor="primary"
          buttonText={getLanguageNameByIndex(props.lang)}
          buttonProps={{
            className: classes.navLink + ' ' + classes.imageDropdownButton,
            color: 'transparent'
          }}
          buttonIcon={Apps}
          dropdownList={['English', 'French', 'German', 'Italian']}
          onClick={handleLanguageSelect}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link to="/search" className={classes.navLink}>
          <Search className={classes.icons} /> {t[props.lang].search}
        </Link>
      </ListItem>
      {!isAuthed && (
        <ListItem className={classes.listItem}>
          <Link to="/login" className={classes.navLink}>
            Login
          </Link>
        </ListItem>
      )}
      {!isAuthed && (
        <ListItem className={classes.listItem}>
          <Link to="/register" className={classes.navLink}>
            Sign-up
          </Link>
        </ListItem>
      )}
      {isAuthed && (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            left
            hoverColor="primary"
            dropdownHeader={
              user
                ? user.role.charAt(0).toUpperCase() + user.role.substr(1)
                : ''
            }
            buttonText={user ? user.fullname : 'User'}
            buttonProps={{
              className: classes.navLink + ' ' + classes.imageDropdownButton,
              color: 'transparent'
            }}
            dropdownList={[
              t[props.lang].me,
              t[props.lang].create_ads,
              t[props.lang].my_ads,
              t[props.lang].property,
              t[props.lang].contacts,
              t[props.lang].sign_out
            ]}
            onClick={handleMenuClick}
          />
        </ListItem>
      )}
    </List>
  );
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
    //user: state.menu.user,
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
)(withStyles(headerLinksStyle)(withRouter(HeaderLinks)));
