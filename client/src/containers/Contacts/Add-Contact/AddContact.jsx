import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import t from "../../../constants/language";
import Grid from "@material-ui/core/Grid";
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
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Divider } from "@material-ui/core";
import {
  countryList,
  correspondenceList,
  languageList,
  contactCategoryList
} from "constants/data.json";
import Header from "components/Header/Header";
import HeaderLinks from "components/Header/HeaderLinks";
import { NotificationManager } from "react-notifications";
import * as api from "service/Api";
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    overflowX: "auto"
  },

  toolbar: theme.mixins.toolbar,
  formControl: {
    marginTop: theme.spacing(2)
  }
});

class AddContact extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = input => e => {
      this.setState({ [input]: e.target.value });
    };

    this.state = {
      contactNo: "",
      contactType: "Company",
      companyName: "",
      nameSuffix: "",
      formOfAddress: "",
      title: "",
      lastName: "",
      firstName: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      email: "",
      email2: "",
      phone: "",
      phone2: "",
      mobile: "",
      fax: "",
      website: "",
      skype: "",
      contactPartner: "",
      owner: "",
      correspondenceType: "",
      language: "",
      remarks: "",
      category: "",
      sector: "",
      numberOfEmployees: "",
      commercialRegisterNo: "",
      vatNo: "",
      vatRegNo: ""
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSwitch = e => {
    this.setState({ contactType: e.target.value });
  };

  handleAddNewContact = async () => {
    const {
      contactNo,
      contactType,
      companyName,
      nameSuffix,
      formOfAddress,
      title,
      lastName,
      firstName,
      address,
      postcode,
      city,
      country,
      email,
      email2,
      phone,
      phone2,
      mobile,
      fax,
      website,
      skype,
      contactPartner,
      owner,
      correspondenceType,
      language,
      remarks,
      category,
      sector,
      numberOfEmployees,
      commercialRegisterNo,
      vatNo,
      vatRegNo
    } = this.state;

    const data = {
      contactNo: contactNo,
      contactType: contactType,
      companyName: companyName,
      nameSuffix: nameSuffix,
      formOfAddress: formOfAddress,
      title: title,
      lastName: lastName,
      firstName: firstName,
      address: address,
      postcode: postcode,
      city: city,
      country: country,
      email: email,
      email2: email2,
      phone: phone,
      phone2: phone2,
      mobile: mobile,
      fax: fax,
      website: website,
      skype: skype,
      contactPartner: contactPartner,
      owner: owner,
      correspondenceType: correspondenceType,
      language: language,
      remarks: remarks,
      category: category,
      sector: sector,
      numberOfEmployees: numberOfEmployees,
      commercialRegisterNo: commercialRegisterNo,
      vatNo: vatNo,
      vatRegNo: vatRegNo
    };

    const result = await api.addContact(data);
    if (result.status) {
      NotificationManager.success("Success");
      this.props.history.push("/contacts");
    } else {
      NotificationManager.warning("Failed");
    }
  };

  handleCancel = () => {
    this.props.history.push("/contacts");
  }
  render() {
    const { contactType } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Header
          color="secondary"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
        />
        <div className={classes.toolbar} />
        <Container>
          <form noValidate autoComplete="off">
            <div style={{ padding: 20 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <h3>{t[this.props.lang].master_data}</h3>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="contact-no"
                        label={t[this.props.lang].contact_no}
                        value={this.state.contactNo}
                        onChange={this.handleChange("contactNo")}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend" required>
                        {t[this.props.lang].contact_type}
                        </FormLabel>
                        <RadioGroup
                          aria-label="position"
                          name="position"
                          row
                          onChange={this.handleSwitch}
                          value={contactType}
                        >
                          <FormControlLabel
                            value="Company"
                            control={<Radio color="primary" />}
                            label={t[this.props.lang].company}
                            labelPlacement="start"
                          />
                          <FormControlLabel
                            value="Private"
                            control={<Radio color="primary" />}
                            label={t[this.props.lang].private}
                            labelPlacement="start"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <div>
                    {this.state.contactType === "Company" ? (
                      <div>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              id="company-name"
                              label={t[this.props.lang].company_name}
                              value={this.state.companyName}
                              onChange={this.handleChange("companyName")}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              id="name-suffix"
                              label={t[this.props.lang].name_sufix}
                              value={this.state.nameSuffix}
                              onChange={this.handleChange("nameSuffix")}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </div>
                    ) : (
                      <div>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              id="form-of-address"
                              label="Form of address"
                              value={this.state.formOfAddress}
                              onChange={this.handleChange("formOfAddress")}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              id="title"
                              label="Title"
                              value={this.state.title}
                              onChange={this.handleChange("title")}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              id="last-name"
                              label="Last Name"
                              value={this.state.lastName}
                              onChange={this.handleChange("lastName")}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              id="first-name"
                              label="First Name"
                              value={this.state.firstName}
                              onChange={this.handleChange("firstName")}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  </div>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="address"
                        label={t[this.props.lang].adress}
                        value={this.state.address}
                        onChange={this.handleChange("address")}
                        rows={4}
                        multiline
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6} container>
                      <Grid item xs={12}>
                        <TextField
                          id="postcode"
                          label={t[this.props.lang].postcode}
                          fullWidth
                          value={this.state.postcode}
                          onChange={this.handleChange("postcode")}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          id="city"
                          label={t[this.props.lang].city}
                          fullWidth
                          value={this.state.city}
                          onChange={this.handleChange("city")}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormHelperText>{t[this.props.lang].country}</FormHelperText>
                      <Select
                        value={this.state.country}
                        onChange={this.handleChange("country")}
                        label={t[this.props.lang].country}
                        required
                        fullWidth
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
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <h3>{t[this.props.lang].additional_information}</h3>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      {/* <FormHelperText>Contact partner*</FormHelperText>
                      <Select
                        value={"contactPartner"}
                        onChange={this.handleChange("contactPartner")}
                        label="Contact partner"
                        required
                        fullWidth
                      >
                        <MenuItem key={"1"} value={"123"}>
                          {"123"}
                        </MenuItem>
                      </Select> */}
                      <TextField
                        id="id-contactPartner"
                        label={t[this.props.lang].contant_partner}
                        fullWidth
                        value={this.state.contactPartner}
                        onChange={this.handleChange("contactPartner")}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* <FormHelperText>Owner*</FormHelperText>
                      <Select
                        value={"owner"}
                        onChange={this.handleChange("owner")}
                        label="Owner"
                        required
                        fullWidth
                      /> */}
                      <TextField
                        id="id-owner"
                        label={t[this.props.lang].owner}
                        fullWidth
                        value={this.state.owner}
                        onChange={this.handleChange("owner")}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormHelperText>{t[this.props.lang].correspondence_type}</FormHelperText>
                      <Select
                        value={this.state.correspondenceType}
                        onChange={this.handleChange("correspondenceType")}
                        label={t[this.props.lang].correspondence_type}
                        fullWidth
                      >
                        {correspondenceList.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormHelperText>Language</FormHelperText>
                      <Select
                        value={this.state.language}
                        onChange={this.handleChange("language")}
                        label="Language"
                        fullWidth
                      >
                        {languageList.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        id="remarks"
                        label={t[this.props.lang].remarks}
                        value={this.state.remarks}
                        onChange={this.handleChange("remarks")}
                        multiline
                        rows={4}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormHelperText>{t[this.props.lang].category}</FormHelperText>
                        <Select
                          value={this.state.category}
                          onChange={this.handleChange("category")}
                          label={t[this.props.lang].category}
                          required
                          fullWidth
                        >
                          {contactCategoryList.map((item, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={item}
                              >
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        id="sector"
                        label={t[this.props.lang].sector}
                        value={this.state.sector}
                        onChange={this.handleChange("sector")}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <h3>Communication</h3>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="email"
                        label={t[this.props.lang].email}
                        value={this.state.email}
                        onChange={this.handleChange("email")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="email2"
                        label={t[this.props.lang].email +"2"}
                        value={this.state.email2}
                        onChange={this.handleChange("email2")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="phone"
                        label={t[this.props.lang].phone_number}
                        value={this.state.phone}
                        onChange={this.handleChange("phone")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="phone2"
                        label={t[this.props.lang].phone_number2}
                        value={this.state.phone2}
                        onChange={this.handleChange("phone2")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="mobile"
                        label={t[this.props.lang].mobile_p}
                        value={this.state.mobile}
                        onChange={this.handleChange("mobile")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="fax"
                        label={t[this.props.lang].fax}
                        value={this.state.fax}
                        onChange={this.handleChange("fax")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="website"
                        label={t[this.props.lang].website}
                        value={this.state.website}
                        onChange={this.handleChange("website")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="skype"
                        label="Skype"
                        value={this.state.skype}
                        onChange={this.handleChange("skype")}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <h3>{t[this.props.lang].more_c_information}</h3>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="numberOfEmployees"
                        label={t[this.props.lang].number_of_employes}
                        value={this.state.numberOfEmployees}
                        onChange={this.handleChange("numberOfEmployees")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="commercialRegisterNo"
                        label={t[this.props.lang].comercial_register}
                        value={this.state.commercialRegisterNo}
                        onChange={this.handleChange("commercialRegisterNo")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="vatNo"
                        label={t[this.props.lang].vat_n}
                        value={this.state.vatNo}
                        onChange={this.handleChange("vatNo")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="vatRegNo"
                        label={t[this.props.lang].vat_reg}
                        value={this.state.vatRegNo}
                        onChange={this.handleChange("vatRegNo")}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex', justifyContent:'center', alignItems:'flex-end'}}>
                <Button
                  variant="contained"
                  color="primary"
                  component="label"
                  style={{ marginTop: 16, marginBottom: 16 }}
                  onClick={this.handleAddNewContact}
                >
                  {t[this.props.lang].save_changes}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  component="label"
                  style={{ marginTop: 16, marginBottom: 16, marginLeft:20 }}
                  onClick={this.handleCancel}
                >
                  {t[this.props.lang].cancel}
                </Button>
                </Grid>
              </Grid>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mobileOpen: state.mobileOpen,
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(AddContact));
