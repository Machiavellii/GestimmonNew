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

import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import * as api from "service/Api";
import { isAuthenticated } from "service/authentication";
import { legalFormList, countryList } from "constants/data.json";
import { Divider } from "@material-ui/core";
import { GridOnOutlined, GpsNotFixed } from "@material-ui/icons";
import { height } from "@material-ui/system";

import ContactPage from '../Contacts/ContactPage/ContactPage';

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar,
  formControl: {
    // margin: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
});
class CompanyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: "",
      legalForm: "",

      fullname: "",

      address: "",
      additionalAddress: "",
      zipcode: "",
      city: "",
      country: "",

      email: "",
      mobile: "",
      phone: "",
      fax: "",
      website: "",

      inboxName: "",
      inboxEmail: "",

      regNo: "",
      regDesc: ""
    };
  }

  componentWillMount() {
    this.getCompanyProfile();
  }

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  getCompanyProfile = async () => {
    const result = await api.getCompanyProfile();
    if(result.status){
        const companyProfile = result.companyProfile;
        this.state = companyProfile;
        this.setState({...this.state})
    }
  }
  handleSaveCompanyProfile = async () => {
    const {
      companyName,
      legalForm,

      fullname,

      address,
      additionalAddress,
      zipcode,
      city,
      country,

      email,
      mobile,
      phone,
      fax,
      website,

      inboxName,
      inboxEmail,

      regNo,
      regDesc
    } = this.state;

    const data = {
      companyName: companyName,
      legalForm: legalForm,

      fullname: fullname,

      address: address,
      additionalAddress: additionalAddress,
      zipcode: zipcode,
      city: city,
      country: country,

      email: email,
      mobile: mobile,
      phone: phone,
      fax: fax,
      website: website,

      inboxName: inboxName,
      inboxEmail: inboxEmail,

      regNo: regNo,
      regDesc: regDesc,
    }

    const result = await api.saveCompanyProfile(data);
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
      companyName,
      legalForm,

      fullname,

      address,
      additionalAddress,
      zipcode,
      city,
      country,

      email,
      mobile,
      phone,
      fax,
      website,

      inboxName,
      inboxEmail,

      regNo,
      regDesc
    } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <GridContainer>
          <GridItem xs={12}>
            <GridContainer>
              <GridItem xs={12} md={6}>
                <h3>{t[this.props.lang].basic_information}</h3>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <TextField
                      id="id-companyname"
                      label={t[this.props.lang].company_name}
                      className={classes.textField}
                      margin="normal"
                      fullWidth
                      value={companyName}
                      onChange={this.handleInput("companyName")}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel htmlFor="">Legal Form</InputLabel>
                      <Select
                        value={legalForm}
                        onChange={this.handleInput("legalForm")}
                      >
                        {legalFormList.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} style={{ margin: 10 }}>
                    {/* <Divider /> */}
                  </GridItem>
                  <GridItem xs={6}>
                    <TextField
                      id="id-fullname"
                      label={t[this.props.lang].full_name}
                      className={classes.textField}
                      margin="normal"
                      fullWidth
                      value={fullname}
                      onChange={this.handleInput("fullname")}
                    />
                  </GridItem>
                  <GridItem xs={12} />
                  <GridItem xs={12} style={{ margin: 10 }}>
                    {/* <Divider /> */}
                  </GridItem>
                  <GridItem xs={12} sm={6}>
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
                  <GridItem xs={12} sm={6}>
                    <TextField
                      id="id-additionalAddress"
                      label={t[this.props.lang].additional_address}
                      className={classes.textField}
                      margin="normal"
                      fullWidth
                      value={additionalAddress}
                      onChange={this.handleInput("additionalAddress")}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={6}>
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
                  <GridItem xs={12} sm={6}>
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
                  <GridItem xs={12} sm={6}>
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
                </GridContainer>
              </GridItem>
              <GridItem xs={12} md={6}>
                <h3>{t[this.props.lang].inbox_email}</h3>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <TextField
                      id="id-inbox-name"
                      label={t[this.props.lang].short_name}
                      className={classes.textField}
                      margin="normal"
                      fullWidth
                      value={inboxName}
                      onChange={this.handleInput("inboxName")}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <TextField
                      id="id-inbox-email"
                      label={t[this.props.lang].inbox_email}
                      className={classes.textField}
                      margin="normal"
                      fullWidth
                      disabled
                      value={inboxEmail}
                      onChange={this.handleInput("inboxEmail")}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <div style={{ height: 20 }} />
                  </GridItem>
                  <GridItem xs={12} style={{ marginTop: 20 }}>
                    <strong>{t[this.props.lang].additional_information}</strong>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <TextField
                      id="id-reg-no"
                      label={t[this.props.lang].vat_reg}
                      className={classes.textField}
                      margin="normal"
                      fullWidth
                      value={regNo}
                      onChange={this.handleInput("regNo")}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <TextField
                      id="id-reg-desc"
                      label={t[this.props.lang].description}
                      className={classes.textField}
                      margin="normal"
                      value={regDesc}
                      fullWidth
                      multiline
                      rows={5}
                      rowsMax={8}
                      onChange={this.handleInput("regDesc")}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12}>
            <div style={{ height: 30 }}></div>
          </GridItem>
          <GridItem xs={12}>
            <GridContainer>
              <GridItem xs={12}>
                <h3>{t[this.props.lang].contact_information}</h3>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <TextField
                  id="id-email"
                  label={t[this.props.lang].email}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={email}
                  onChange={this.handleInput("email")}
                />
              </GridItem>
              <GridItem xs={12} sm={4}>
                <TextField
                  id="id-mobile"
                  label={t[this.props.lang].mobile_p}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={mobile}
                  onChange={this.handleInput("mobile")}
                />
              </GridItem>
              <GridItem xs={12} sm={4}>
                <TextField
                  id="id-phone"
                  label={t[this.props.lang].phone_number}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={phone}
                  onChange={this.handleInput("phone")}
                />
              </GridItem>
              <GridItem xs={12} sm={4}>
                <TextField
                  id="id-fax"
                  label={t[this.props.lang].fax}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={fax}
                  onChange={this.handleInput("fax")}
                />
              </GridItem>
              <GridItem xs={12} sm={4}>
                <TextField
                  id="id-website"
                  label={t[this.props.lang].website}
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={website}
                  onChange={this.handleInput("website")}
                />
              </GridItem>
            </GridContainer>
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
                onClick={this.handleSaveCompanyProfile}
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
)(withStyles(styles)(CompanyProfile));
