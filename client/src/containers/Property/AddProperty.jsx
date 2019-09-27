import React, { Component } from "react";

import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddBox from "@material-ui/icons/AddBox";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FileDrop from "react-file-drop";

import t from "../../constants/language";
import * as api from "service/Api";
import { isAuthenticated } from "service/authentication";
import {
  unitsCount,
  unitIdentificationList,
  buildingAttributesList,
  propertyTypeList,
  countryList
} from "constants/data.json";
import { Paper, Divider } from "@material-ui/core";
import { unitsCountList } from "constants/data.json";
import { Cancel } from "@material-ui/icons";
import { PhotoCamera } from "@material-ui/icons";

import DropBox from "components/DropBox/DropBox.jsx";
import config from "config/config";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar,
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 200
  },
  dropContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid black",
    borderStyle: "dashed",
    width: 200,
    height: 200,
    color: "black",
    padding: 10
  },
  dropStyle: {
    "$file-drop-target": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  }
});

class AddProperty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      photo: "",
      photoData: "",
      propertyType: "",
      unitsCount: "",
      unitsIdentification: "",

      buildingAttributesList:
        buildingAttributesList[this.props.lang ? this.props.lang : 0],
      buildingAttributes: [],
      morePhotos: [],
      morePhotosData: [],

      ownAttribute: "",
      photoUrl: "",
      morePhotosUrl: [],
      editMode: false,

      deletedExistingPhotos: []
    };
  }

  componentWillMount() {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.editMode
    ) {
      this.state = {
        ...this.state,
        ...this.props.location.state.property,
        photo: "",
        morePhotos: [],
        editMode: true
      };
      this.state.photoUrl = this.props.location.state.property.photo;
      this.state.morePhotosUrl = this.props.location.state.property.morePhotos;

      const array = buildingAttributesList[this.props.lang ? this.props.lang : 0];
      for (var i = 0; i < this.state.buildingAttributes.length; i++) {
        const item = this.state.buildingAttributes[i];
        if (array.indexOf(item) < 0) {
          array.push(item);
        }
      }
      this.setState({
        buildingAttributesList: array
      });
      console.log("333", this.state);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.lang && this.props.lang !== nextProps.lang) {
      const array = buildingAttributesList[nextProps.lang ? nextProps.lang : 0];
      for (var i = 0; i < this.state.buildingAttributes.length; i++) {
        const item = this.state.buildingAttributes[i];
        if (array.indexOf(item) < 0) {
          array.push(item);
        }
      }
      this.setState({
        buildingAttributesList: array
      });

      return true;
    }
    return false;
  }
  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleCheckboxBuildingAttributes = event => {
    const { buildingAttributes } = this.state;
    var flag = false;
    for (var i = 0; i < buildingAttributes.length; i++) {
      if (buildingAttributes[i] === event.target.value) {
        buildingAttributes.splice(i, 1);
        flag = true;
        break;
      }
    }
    if (!flag) {
      buildingAttributes.push(event.target.value);
    }

    this.setState({ buildingAttributes: buildingAttributes });
  };

  getCheckStatus = value => {
    const { buildingAttributes } = this.state;
    for (var i = 0; i < buildingAttributes.length; i++) {
      if (buildingAttributes[i] === value) {
        return true;
      }
    }
    return false;
  };

  handleAddAttribute = () => {
    if (!this.state.ownAttribute) return;
    const { buildingAttributesList } = this.state;
    for (var i = 0; i < buildingAttributesList.length; i++) {
      if (buildingAttributesList[i] === this.state.ownAttribute) {
        return;
      }
    }
    buildingAttributesList.push(this.state.ownAttribute);
    this.setState({
      buildingAttributesList: buildingAttributesList,
      ownAttribute: ""
    });
  };

  handleChooseImages = event => {
    if (event.target.files.length === 0) {
      return;
    }
    const files = Object.keys(event.target.files).map((item, index) => {
      return event.target.files[item];
    });
    console.log("a", files);
    this.addSelectedImages(files);
  };

  addSelectedImages = files => {
    console.log("b", this.state.morePhotos);
    files.map(item => {
      this.state.morePhotos.push(item);
    });

    this.setState({ morePhotos: this.state.morePhotos });

    var imagesurl = this.state.morePhotosData;
    files.map((item, index) => {
      var freader = new FileReader();
      freader.readAsDataURL(item);
      freader.onload = _event => {
        imagesurl.push(freader.result);
        this.setState({ morePhotosData: imagesurl });
      };
    });
  };
  deleteSelectedImages = (index, isUrl = false) => {
    if (!isUrl) {
      this.state.morePhotos.splice(index, 1);
      this.state.morePhotosData.splice(index, 1);

      this.setState({
        morePhotos: this.state.morePhotos,
        morePhotosData: this.state.morePhotosData
      });
    } else {
      this.state.deletedExistingPhotos.push(
        this.state.morePhotosUrl.splice(index, 1)
      );
      this.setState({ morePhotosUrl: this.state.morePhotosUrl });
    }
  };

  handleChoosePhoto = event => {
    if (event.target.files.length === 0) {
      return;
    }
    this.addSelectedPhoto(event.target.files[0]);
  };

  addSelectedPhoto = file => {
    this.setState({ photo: file });
    var freader = new FileReader();
    freader.readAsDataURL(file);
    freader.onload = _event => {
      this.setState({ photoData: freader.result });
    };
  };
  deleteSelectedPhoto = () => {
    this.setState({
      photo: null,
      photoData: "",
      photoUrl: ""
    });
  };

  handleBack = () => {
    this.props.history.push("/property");
  };

  handleCreate = async () => {
    const {
      name,
      address,
      city,
      state,
      zipcode,
      country,
      photo,
      photoData,
      propertyType,
      unitsCount,
      unitsIdentification,
      buildingAttributes,
      morePhotos,
      morePhotosData,
      ownAttribute
    } = this.state;
    if (!name) {
      NotificationManager.warning("Required Fields");
      return;
    }

    const propertyInfo = {
      name: name,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      country: country,
      propertyType: propertyType,
      unitsCount: unitsCount,
      unitsIdentification: unitsIdentification,
      buildingAttributes: buildingAttributes
    };

    const result = await api.createProperty(propertyInfo);
    if (result.status) {
      const property_id = result.property_id;
      if (photo || (morePhotos && morePhotos.length > 0)) {
        const form_data = new FormData();
        if (this.state.photo) {
          form_data.append("images", this.state.photo);
          form_data.append("coverImage_on", true);
        }
        if (this.state.morePhotos && this.state.morePhotos.length > 0) {
          for (var i = 0; i < morePhotos.length; i++) {
            form_data.append("images", morePhotos[i]);
          }
        }
        form_data.append("property_id", property_id);

        const result_img = await api.uploadPropertyImages(form_data);
        if (result_img.status) {
          NotificationManager.success("Success");
        } else {
          NotificationManager.warning("Failed");
        }
        return;
      }
      NotificationManager.success("Success");
    } else {
      NotificationManager.warning("Failed");
    }
  };

  handleEdit = async () => {
    const {
      name,
      address,
      city,
      state,
      zipcode,
      country,
      photo,
      photoData,
      propertyType,
      unitsCount,
      unitsIdentification,
      buildingAttributes,
      morePhotos,
      morePhotosData,
      ownAttribute,
      photoUrl,
      morePhotosUrl,
      deletedExistingPhotos
    } = this.state;
    if (!name) {
      NotificationManager.warning("Required Fields");
      return;
    }

    const propertyInfo = {
      name: name,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      country: country,
      propertyType: propertyType,
      unitsCount: unitsCount,
      unitsIdentification: unitsIdentification,
      buildingAttributes: buildingAttributes,

      property_id: this.state._id
    };

    const result = await api.EditProperty(propertyInfo);
    if (result.status) {
      const property_id = result.property_id;
      if (
        photo ||
        (morePhotos && morePhotos.length > 0) ||
        photoUrl ||
        (morePhotosUrl && morePhotosUrl.length > 0)
      ) {
        const form_data = new FormData();
        if (this.state.photo) {
          form_data.append("images", this.state.photo);
          form_data.append("coverImage_on", true);
        }
        if (!photoUrl) form_data.append("coverImage_none", true);
        if (this.state.morePhotos && this.state.morePhotos.length > 0) {
          for (var i = 0; i < morePhotos.length; i++) {
            form_data.append("images", morePhotos[i]);
          }
        }
        if (deletedExistingPhotos && deletedExistingPhotos.length > 0) {
          form_data.append("deleted", deletedExistingPhotos);
        }
        form_data.append("property_id", property_id);

        const result_img = await api.uploadPropertyImages_Edit(form_data);
        if (result_img.status) {
          NotificationManager.success("Success");
        } else {
          NotificationManager.warning("Failed");
        }
        return;
      }
      NotificationManager.success("Success");
    } else {
      NotificationManager.warning("Failed");
    }
  };

  render() {
    const { classes } = this.props;
    const {
      name,
      address,
      city,
      state,
      zipcode,
      country,
      photo,
      photoData,
      propertyType,
      unitsCount,
      unitsIdentification,
      buildingAttributes,
      buildingAttributesList,
      morePhotos,
      morePhotosData,
      ownAttribute,
      photoUrl,
      morePhotosUrl,
      editMode
    } = this.state;

    
    return (
      <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <h1>{t[this.props.lang].property}</h1>
          </Grid>
          <Grid
            item
            xs={4}
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Button variant="text" color="secondary" onClick={this.handleBack}>
              {t[this.props.lang].back}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="id-property-name"
              label={t[this.props.lang].full_name}
              className={classes.textField}
              margin="normal"
              fullWidth
              value={name}
              onChange={this.handleInput("name")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="id-address"
              label={t[this.props.lang].adress}
              className={classes.textField}
              margin="normal"
              fullWidth
              value={address}
              onChange={this.handleInput("address")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="id-city"
              label={t[this.props.lang].city}
              className={classes.textField}
              margin="normal"
              fullWidth
              value={city}
              onChange={this.handleInput("city")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="id-state"
              label="State"
              className={classes.textField}
              margin="normal"
              fullWidth
              value={state}
              onChange={this.handleInput("state")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="id-zipcode"
              label={t[this.props.lang].postcode}
              className={classes.textField}
              margin="normal"
              fullWidth
              value={zipcode}
              onChange={this.handleInput("zipcode")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl
              className={classes.formControl}
              fullWidth
              required
              // error={errors.country}
            >
              <InputLabel>{t[this.props.lang].country}</InputLabel>
              <Select value={country} onChange={this.handleInput("country")}>
                {countryList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.name[0]}>
                      {item.name[this.props.lang]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          {/* Propertry Photo */}

          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="">
                {t[this.props.lang].property_type}
              </InputLabel>
              <Select
                value={propertyType}
                onChange={this.handleInput("propertyType")}
              >
                {propertyTypeList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="">
                {t[this.props.lang].number_of_units}
              </InputLabel>
              <Select
                value={unitsCount}
                onChange={this.handleInput("unitsCount")}
              >
                {unitsCountList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="">
                {t[this.props.lang].unit_identification}
              </InputLabel>
              <Select
                value={unitsIdentification}
                onChange={this.handleInput("unitsIdentification")}
              >
                {unitIdentificationList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} container justify="center" alignItems="center">
            {photo || photoUrl ? (
              <div
                style={{
                  backgroundColor: "rgb(0,0,0,0.1)",
                  borderWidth: 2,
                  borderCollapse: "#aaa",
                  borderStyle: "dashed",
                  position: "relative"
                }}
              >
                <Cancel
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    width: 30,
                    height: 30
                  }}
                  onClick={() => this.deleteSelectedPhoto()}
                />
                <img
                  alt="..."
                  src={
                    photoUrl ? config.apiBaseUrl + "/" + photoUrl : photoData
                  }
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "contain"
                  }}
                />
              </div>
            ) : (
              <DropBox
                title={t[this.props.lang].photo_property}
                instruction={t[this.props.lang].drop_some_files_here}
                or={t[this.props.lang].or}
                accept="Image/*"
                buttonName={t[this.props.lang].choose}
                onDrop={this.handleDropPhoto}
                onChange={this.handleChoosePhoto}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>
              {t[this.props.lang].attributes}
            </h3>
          </Grid>
          <Grid item xs={12}>
            <p style={{ color: "#0B9444", marginTop: 0, marginBottom: 0 }}>
              {t[this.props.lang].b_atributes}
            </p>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            {buildingAttributesList.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <FormControlLabel
                    className={classes.checkbox}
                    control={
                      <Checkbox
                        checked={this.getCheckStatus(item)}
                        onChange={this.handleCheckboxBuildingAttributes}
                        value={item}
                        color="primary"
                      />
                    }
                    label={item}
                  />
                </Grid>
              );
            })}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  flexDirection: "row",
                  height: 44
                }}
              >
                <TextField
                  id="id-add-own"
                  label="Add your own"
                  className={classes.textField}
                  style={{ height: 48 }}
                  margin="normal"
                  value={ownAttribute}
                  onChange={this.handleInput("ownAttribute")}
                />
                <Button onClick={this.handleAddAttribute}>
                  <AddBox />
                </Button>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>
              {t[this.props.lang].more_photos}
            </h3>
          </Grid>
          <Grid item xs={12} container justify="flex-start" alignItems="center">
            <Grid item>
              <p style={{ color: "#777", marginTop: 0, marginBottom: 0 }}>
                {t[this.props.lang].upload_txt}
              </p>
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            {editMode &&
              morePhotosUrl.map((item, index) => {
                var imgPath = item;
                return (
                  <Grid item key={index}>
                    <div
                      style={{
                        backgroundColor: "rgb(0,0,0,0.1)",
                        borderWidth: 2,
                        borderCollapse: "#aaa",
                        borderStyle: "dashed",
                        position: "relative"
                      }}
                    >
                      <Cancel
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 10,
                          width: 30,
                          height: 30
                        }}
                        onClick={() => this.deleteSelectedImages(index, true)}
                      />
                      <img
                        alt="..."
                        src={config.apiBaseUrl + "/" + imgPath}
                        style={{
                          width: 240,
                          height: 240,
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  </Grid>
                );
              })}
            {this.state.morePhotosData.map((item, index) => {
              var imgPath = item;
              return (
                <Grid item key={index}>
                  <div
                    style={{
                      backgroundColor: "rgb(0,0,0,0.1)",
                      borderWidth: 2,
                      borderCollapse: "#aaa",
                      borderStyle: "dashed",
                      position: "relative"
                    }}
                  >
                    <Cancel
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        width: 30,
                        height: 30
                      }}
                      onClick={() => this.deleteSelectedImages(index)}
                    />
                    <img
                      alt="..."
                      src={imgPath}
                      style={{
                        width: 240,
                        height: 240,
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </Grid>
              );
            })}
            <Grid item>
              <DropBox
                // title={t[this.props.lang].photo_property}
                instruction={t[this.props.lang].drop_some_files_here}
                or={t[this.props.lang].or}
                accept="Image/*"
                buttonName={t[this.props.lang].choose}
                onDrop={this.handleDrop}
                onChange={this.handleChooseImages}
                multiple
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} container justify="center" alignItems="center">
            <Button
              variant="contained"
              color={editMode ? "secondary" : "primary" }
              onClick={editMode ? this.handleEdit : this.handleCreate}
            >
              {editMode ? "Save Edit" : t[this.props.lang].create_button}
            </Button>
          </Grid>
        </Grid>
      </Paper>
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
)(withStyles(styles)(AddProperty));
