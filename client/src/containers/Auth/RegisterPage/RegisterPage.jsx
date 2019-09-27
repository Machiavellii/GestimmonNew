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
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import validator from "validator";

import image from "assets/img/cover.jpeg";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import * as api from "../../../service/Api"

import * as types from "../../../actions/types";
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",

      fullname: "",
      email: "",
      password: "",
      role: ""
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  validation = () => {
    const {
      fullname,
      // phonenumber,
      email,
      password,
      // password2
      role,
    } = this.state;

    const errors = {};
    let isError = false;
    if ( !role ) {
      isError = true;
      errors.role = "Required Role"
      NotificationManager.warning(errors.role)
    }
    if (fullname.length < 3) {
      isError = true;
      errors.fullname = "fullname must be more than 3 letters";
      NotificationManager.warning(errors.fullname)
    }
   
    if (!validator.isEmail(email)) {
      isError = true;
      errors.email = "Invalid email";
      NotificationManager.warning(errors.email)
    }
    // if (!validator.isMobilePhone(phonenumber)) {
    //   isError = true;
    //   errors.phonenumber = "Invalid phonenumber";
    // }
    if (password.length < 6) {
      isError = true;
      errors.password = "password must be more than 6 letters";
      NotificationManager.warning(errors.password)
    }
    // if (!validator.equals(password, password2) || password2.length < 1) {
    //   isError = true;
    //   errors.password2 = "password is not matched";
    // }

    // this.setState({ errors: errors });
    return !isError;
  };
  
  handleRegister = () => {
    if(!this.validation())
      return;
    const userData = {
      fullname: this.state.fullname,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role
    }
    this.requestRegister(userData, this.props.history);
  }

  requestRegister = async (userData, history) => {
    this.props.dispatch({ type: types.USER_LOADING, payload: true });
    const res = await api.register(userData);
    if(res.status){
        history.push("/search");
    }
    else{
      console.log("3333",res.message)

      if(res.message)
        NotificationManager.error("Email already exist"); // multi - language
    }
    this.props.dispatch({type: types.USER_LOADING, payload: false});
  };

  render() {
    const { classes, ...rest } = this.props;
    const { fullname, email, password, role } = this.state;
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h3>Register</h3>
                      {/* <div className={classes.socialLine}>
                        <Button
                          justIcon
                          href="#pablo"
                          target="_blank"
                          color="transparent"
                          onClick={e => e.preventDefault()}
                        >
                          <i className={"fab fa-twitter"} />
                        </Button>
                        <Button
                          justIcon
                          href="#pablo"
                          target="_blank"
                          color="transparent"
                          onClick={e => e.preventDefault()}
                        >
                          <i className={"fab fa-facebook"} />
                        </Button>
                        <Button
                          justIcon
                          href="#pablo"
                          target="_blank"
                          color="transparent"
                          onClick={e => e.preventDefault()}
                        >
                          <i className={"fab fa-google-plus-g"} />
                        </Button>
                      </div> */}
                    </CardHeader>
                    {/* <p className={classes.divider}>Or Be Classical</p> */}
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={6}>
                          <FormControl
                            component="fieldset"
                            className={classes.formControl}
                          >
                            <FormLabel component="legend">
                              Role
                            </FormLabel>
                            <RadioGroup
                              name="role"
                              className={classes.group}
                              value={role}
                              onChange={this.handleInput("role")}
                            >
                              <FormControlLabel
                                value="user"
                                control={<Radio color="primary" />}
                                label="As a user"
                                labelPlacement="end"
                              />
                              <p className={classes.roleContent}>User can search/create Ads.</p>
                              <FormControlLabel
                                value="landlord"
                                control={<Radio color="primary" />}
                                label="As a landlord"
                                labelPlacement="end"
                              />
                              <p className={classes.roleContent}>Landlord can add property</p>
                              <FormControlLabel
                                value="Agent"
                                control={<Radio color="primary" />}
                                label="As an Agent"
                                labelPlacement="end"
                              />
                              <p className={classes.roleContent}>Agent can see more ads</p>
                              <FormControlLabel
                                value="Agency"
                                control={<Radio color="primary" />}
                                label="As an Agency"
                                labelPlacement="end"
                              />
                              <p className={classes.roleContent}>Agent group</p>
                            </RadioGroup>
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={6}>
                          <CustomInput
                            labelText="Full Name..."
                            id="fullname"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: "text",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <People className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                              value: fullname,
                              onChange: this.handleInput("fullname")
                            }}
                          />
                          <CustomInput
                            labelText="Email..."
                            id="email"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: "email",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Email className={classes.inputIconsColor} />
                                </InputAdornment>
                              ),
                              value: email,
                              onChange: this.handleInput("email")
                            }}
                          />
                          <CustomInput
                            labelText="Password"
                            id="pass"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: "password",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              autoComplete: "off",
                              value: password,
                              onChange: this.handleInput("password")
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={this.handleRegister}
                      >
                        Register
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  lang: state.menu.lang
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(loginPageStyle)(RegisterPage));
