import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../constants/language";
import Grid from "@material-ui/core/Grid";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { DatePicker } from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import {
  ArrowForward,
  ArrowBack,
  PhotoCamera,
  AccountCircle,
  Email,
  Phone
} from "@material-ui/icons";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import * as api from "service/Api";
import { isAuthenticated } from "service/authentication";
import { countryList } from "constants/data.json";
import default_avatar from "assets/profile_default.jpg";

import { Divider } from "@material-ui/core";
import config from "config/config";
const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar,
  formControl: {
    // margin: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  coverImg: {
    width: 240,
    // height: 180,
    objectFit: "contain",
    // backgroundColor: "rgb(0,0,0,0.1)"
  }
});
class BasicProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      fullname: "",
      phonenumber: "",

      country: "",
      city: "",
      address: "",
      zipcode: "",

      avatarUrl: ""
    };
  }

  componentDidMount() {
    this.getBasicProfile();
  }

  getBasicProfile = async() => {
    const result = await api.getBasicProfile();
    if(result.status){
        const basicProfile = result.basicProfile;
        this.state = basicProfile;
        this.setState({...this.state})
    }
  }

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleChooseAvatar = async event => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const data = new FormData();
    data.append("image", file);
    const result = await api.uploadAvatar(data);
    if (result.status) {
      this.setState({ avatarUrl: result.avatarUrl });
    }
  };

  handleSaveBasicProfile = async() => {
    const {
      email,
      fullname,
      phonenumber,

      country,
      city,
      address,
      zipcode
    } = this.state;
    const data = {
      email: email,
      fullname: fullname,
      phonenumber: phonenumber,

      country: country,
      city: city,
      address: address,
      zipcode: zipcode
    };
    const result = await api.uploadBasicProfile(data);
    if(result.status){
        NotificationManager.success("Success");
    }
    else{
        NotificationManager.warning("Failed");
    }
  };
  render() {
    const { classes } = this.props;
    const {
      email,
      fullname,
      phonenumber,

      country,
      city,
      address,
      zipcode,

      avatarUrl
    } = this.state;
    return (
      <div style={{ margin: 20 }}>
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <GridContainer style={{ maxWidth: 480 }}>
              <GridItem xs={12}>
                <TextField
                  id="id-email"
                  label={t[this.props.lang].email}
                  className={classes.textField}
                  margin="normal"
                  value={email}
                  fullWidth
                  onChange={this.handleInput("email")}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  id="id-fullname"
                  label={t[this.props.lang].full_name}
                  className={classes.textField}
                  margin="normal"
                  value={fullname}
                  fullWidth
                  onChange={this.handleInput("fullname")}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  id="id-phonenumber"
                  label={t[this.props.lang].phone_number}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={phonenumber}
                  onChange={this.handleInput("phonenumber")}
                />
              </GridItem>
              <GridItem xs={12}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel htmlFor="">
                    {t[this.props.lang].country}
                  </InputLabel>
                  <Select
                    value={country}
                    onChange={this.handleInput("country")}
                  >
                    {countryList.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={item.name[this.props.lang]}
                        >
                          {item.name[this.props.lang]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  id="id-city"
                  label={t[this.props.lang].city}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={city}
                  onChange={this.handleInput("city")}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  id="id-address"
                  label={t[this.props.lang].adress}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={address}
                  onChange={this.handleInput("address")}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  id="id-zipcode"
                  label={t[this.props.lang].postcode}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={zipcode}
                  onChange={this.handleInput("zipcode")}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <div>
              <img
                alt=""
                src={avatarUrl ? config.apiBaseUrl + avatarUrl : default_avatar}
                className={classes.coverImg}
              />
              <div
                style={{
                  width: 240,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Button
                  style={{ marginTop: 10 }}
                  variant="outlined"
                  component="label"
                >
                  <input
                    accept="Image/*"
                    style={{ display: "none" }}
                    type="file"
                    onChange={this.handleChooseAvatar}
                  />
                  {t[this.props.lang].change_photo}
                </Button>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Button
                style={{ marginTop: 10 }}
                variant="contained"
                color="primary"
                //   component="label"
                onClick={this.handleSaveBasicProfile}
              >
                {t[this.props.lang].save_changes}
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
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
)(withStyles(styles)(BasicProfile));
