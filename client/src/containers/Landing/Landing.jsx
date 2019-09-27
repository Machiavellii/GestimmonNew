/*!

=========================================================
* Material Kit React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import { connect } from "react-redux";
import t from '../../constants/language'

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Sections for this page
import CountryContainer from "./Sections/CountryContainer.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";

import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from '@material-ui/core/Input';
import { Search } from "@material-ui/icons";
import { whiteColor } from "assets/jss/material-dashboard-react.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import './landing.css'

const dashboardRoutes = [];

const styles = theme => ({
  radio: {
    '&$checked': {
      color: '#fff'
    }
  },
  checked: {}
})

class LandingPage extends React.Component {

  handleSwitch = e => {
    this.setState({ searchType: e.target.value });
  };

  constructor(props) {
    super(props);

    this.state = {
      searchType: "Rent"
    }
  }

  render() {
    const { classes, ...rest } = this.props;
    const { searchType } = this.state;
    return (
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <Parallax filter image={require("assets/img/landing-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <h1 className={classes.title}>{t[this.props.lang].find_your_property}</h1>

                <br />
                <form className="form-container">
                  <RadioGroup
                    aria-label="position"
                    name="position"
                    row
                    onChange={this.handleSwitch}
                    value={searchType}
                  >
                  <FormControlLabel
                    value="Rent"
                    control={<Radio  classes={{root: classes.radio, checked: classes.checked}} />}
                    label={t[this.props.lang].rent}
                    labelPlacement="start"
                   />
                  <FormControlLabel
                    value="Buy"
                    control={<Radio classes={{root: classes.radio, checked: classes.checked}} />}
                    label={t[this.props.lang].buy}
                    labelPlacement="start"
                  />
                </RadioGroup>

                <Grid item>
                <FormControl className={classes.margin} style={{marginRight:8}}>
                  {/* <InputLabel htmlFor="input-with-icon-adornment">
                    With a start adornment
                  </InputLabel> */}
                  <Input
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    }
                    onChange={this.handleSearchBar}
                    variant="outlined"
                    style={{backgroundColor: whiteColor, marginTop: 2}}
                  />
                </FormControl>
              </Grid>
              </form>

              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container} style={{ marginBottom: 10 }}>
            <CountryContainer style={{ margin: 10}} />
            {/*<TeamSection />*/}
            <WorkSection />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object
};

const mapStateToProps = state => {
  return {
    lang: state.menu.lang,
    loginOpen: state.menu.loginOpen
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
)(withStyles(landingPageStyle)(LandingPage));
