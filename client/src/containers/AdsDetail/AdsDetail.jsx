import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
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
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ScrollUpButton from "react-scroll-up-button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";

import SearchSidebar from "components/SearchSidebar/SearchSidebar.jsx";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import {
  ArrowForward,
  ArrowBack,
  Reorder,
  ViewQuilt,
  AspectRatio,
  DateRange,
  Whatshot,
  NearMe,
  AccountCircle,
  Email,
  Phone,
  Comment,
} from "@material-ui/icons";
import BusinessIcon from '@material-ui/icons/Business';
import NoteIcon from '@material-ui/icons/Note';
import ControlPointDuplicate from "@material-ui/icons/ControlPointDuplicate";
import Box from "@material-ui/core/Box";
import FileDrop from "react-file-drop";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import windowSize from "react-window-size";
import Fade from "@material-ui/core/Fade";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import { Divider, DialogTitle } from "@material-ui/core";
import { Carousel } from "react-responsive-carousel";

import config from "../../config/config";
import AdsCard from "components/adscard";
import * as api from "service/Api";
import { isAuthenticated } from "service/authentication";
import { AsyncMap } from "components/GoogleMap/GoogleMap.jsx";
import ProgressShow from "components/ProgressShow/ProgressShow";
import { formatDate } from "utils";
import { getUserInfo } from "service/authentication";
import { EventEmitter } from "events";
import VisitorComment from "./VisitorComment";
import { formatNumber } from "utils/index";
import OpenWithIcon from '@material-ui/icons/OpenWith';
const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar,
  fab: {
    margin: theme.spacing(1)
  },
  formControl: {
    // margin: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1)
    // width: 400,
  },

  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  contactForm: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: "rgb(221,221,221)",
    padding: 16,
    width: "240px"
  },
  detailElement: {
    maxWidth: 120,
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%"
    }
  }
  // carousel: {
  //     position: 'relative',

  //     '&carousel-slider': {
  //       height: 400,
  //         // '&slide':{
  //         //     '&img': {
  //         //         height: '100%',
  //         //         width: 'auto',
  //         //     }
  //         // }
  // }
  //}
});

const DEFAULT_SHOW_LIMIT = 100;
const SHOW_MORE_COUNT = 20;

function DetailElement({ ...props }) {
  const xxx = props.Icon ? 6 : 12;
  const justifyItem = props.justify ? props.justify : "flex-start";
  return (
    <div style={{ margin: 4 }}>
      <Grid container>
        {props.Icon && (
          <Grid item xs={3} container justify="center" alignItems="center">
            {props.Icon}
          </Grid>
        )}
        <Grid item xs={9} container>
          <GridItem
            xs={12}
            style={{ marginBottom: 0, paddingBottom: 0 }}
            container
            justify={justifyItem}
          >
            {props.title}
          </GridItem>
          <GridItem
            xs={12}
            container
            justify={justifyItem}
            style={{ wordWrap: "break-word" }}
            // className={props.className}
          >
            {props.value}
          </GridItem>
        </Grid>
      </Grid>
    </div>
  );
}



class AdsDetail extends Component {
  constructor(props) {
    super(props);
    console.log("fff", props);
    this.state = {
      adsInfo: [],
      showLimit: DEFAULT_SHOW_LIMIT,
      showLoadMoreBtn: false,
      isLoading: false,
      isDeleteDlg: false,

      user_fullname: "",
      user_email: "",
      user_phonenumber: "",
      user_message: "",

      user_role: "",
      isCommentDlg: false
    };
  }

  componentWillMount() {
    //this.handleSearch({ ads_id: this.props.history.location.state.ads_id });
    console.log("adsDetail WillMount ", this.props.ads_id);
   
    this.handleSearch({ ads_id: this.props.ads_id });
    
  }

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };


  handleSearch = async searchOption => {
    let result;
    if (!isAuthenticated()) {
      return;
    }
    this.setState({ isLoading: true });
    result = await api.AdsDetail(searchOption);
    this.setState({ isLoading: false });
    if (result.status) {
      this.setState({
        adsInfo: result.data
      });
      // NotificationManager.success(result.data.length);
      const userInfo = getUserInfo();
      this.setState({
        user_fullname: userInfo.fullname,
        user_email: userInfo.email,
        user_phonenumber: userInfo.phonenumber,

        user_role: userInfo.role
      });
    } else {
      NotificationManager.error("Failed");
    }
  };

  handleBack = () => {
    this.props.onBack();
  };

  handleDelete = async () => {
    const result = await api.deleteAds(this.props.ads_id);
    if (result.status) {
      // NotificationManager.success("Ads Deleted.");
      // this.props.history.replace("/myAds");
      window.location.reload();
    } else {
      NotificationManager.error("Failed");
    }
  };

  handleEdit = () => {
    // alert("Coming soon!");
    //this.handleSearch({ ads_id: this.props.history.location.state.ads_id });
    console.log("33333", this.state.adsInfo);
    this.props.history.push({
      pathname: "/createAds",
      state: { adsInfo: this.state.adsInfo }
    });
  };

  handleShowDeleteDlg = () => {
    this.setState({ isDeleteDlg: true });
  };
  handleCancelDeleteDlg = () => {
    this.setState({ isDeleteDlg: false });
  };
  handleInput = input => event => {
    this.setState({ [input]: event.target.value });
  };

  handleContact = () => {};

  handleDuplicate = async () => {
    const result = await api.duplicateAds(this.props.ads_id);
    if (result.status) {
      const ads_id = result.ads_id;
      NotificationManager.success("Duplicated");
      this.handleSearch({ ads_id: ads_id });
    } else {
      NotificationManager.warning("Failed");
    }
  };

  handleComment = () => {
    this.setState({ isCommentDlg: true });
  };
  render() {
    const { classes } = this.props;
    const {
      isLoading,
      isDeleteDlg,
      user_fullname,
      user_email,
      user_phonenumber,
      user_message,

      isCommentDlg
    } = this.state;
    const {
      title,
      ref,
      type,
      category,
      property,
      city,
      country,
      description,
      floor,
      price,
      charge,
      room,
      source,
      street,
      surface,
      availableDate,
      location,
      url,
      zipcode,
      zone,

      advertiser,
      extra,
      photos,

      visit_name,
      visit_phone,
      visit_email,
      visit_remark,
      mand_name,
      mand_phone,
      mand_email,
      imgTitle
    } = this.state.adsInfo;


    const PhotosView = (
      <div style={{ margin: 10 }}>
        {photos && photos.length > 0 && (
          <Carousel dynamicHeight swipeable={true} className={classes.carousel}>
            {photos[0].photos &&
              photos[0].photos.length > 0 &&
              photos[0].photos.map((item, index) => {
                var imgPath = "";
                if (item.startsWith("http")) {
                  imgPath = item;
                } else imgPath = config.apiBaseUrl + "/" + item;
                return (
                  <div key={index}>
                    <img src={imgPath} alt="..." />
                    {/* <p className="legend">Legend 1</p> */}
                  </div>
                );
              })}
          </Carousel>
        )}
      </div>
    );
    var totalPrice = 0;
    if (parseInt(price)) totalPrice += parseInt(price);
    if (parseInt(charge)) totalPrice += parseInt(charge);
    return (
      <div>
        <ProgressShow
          open={isLoading}
          onClose={() => this.setState({ isLoading: false })}
        />
        <Header
          color="info"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
        />
        <div className={classes.toolbar} />
        <Container style={{ marginBottom: 20, marginTop: 20 }}>
          <ScrollUpButton
            StopPosition={0}
            ShowAtPosition={150}
            EasingType="easeOutCubic"
            AnimationDuration={500}
            ContainerClassName=""
            TransitionClassName="ScrollUpButton__Toggled"
            style={{}}
            ToggledStyle={{}}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: 8
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <Button
                size="medium"
                color="secondary"
                variant="outlined"
                onClick={this.handleBack}
              >
                {t[this.props.lang].back}
              </Button>
            </div>
            {this.state.user_role != "user" && (
              <Fab
                color="primary"
                aria-label="comment"
                size="small"
                className={classes.fab}
                onClick={this.handleComment}
              >
                <Comment />
              </Fab>
            )}
            {this.props.permission === 2 && (
              <div>
                <Fab
                  color="secondary"
                  aria-label="delete"
                  size="small"
                  className={classes.fab}
                  onClick={this.handleShowDeleteDlg}
                >
                  <DeleteIcon />
                </Fab>
                <Fab
                  color="primary"
                  aria-label="edit"
                  size="small"
                  className={classes.fab}
                  onClick={this.handleEdit}
                >
                  <EditIcon />
                </Fab>
                <Fab
                  color="primary"
                  aria-label="edit"
                  size="small"
                  className={classes.fab}
                  onClick={this.handleDuplicate}
                >
                  <ControlPointDuplicate />
                </Fab>
              </div>
            )}
          </div>
          <Divider />
          <GridContainer spacing={3}>
            <GridItem xs={12} sm={6}>
              <GridContainer>
                <GridItem xs={12}>{PhotosView}</GridItem>
                <GridItem xs={12}>
                  <strong>Image Title: </strong>{imgTitle}
                </GridItem>
                <GridItem xs={12}>
                  <h3>{title}</h3>
                </GridItem>
                {ref && (
                  <GridItem xs={12}>
                    <strong>{ref.join(".")}</strong>
                  </GridItem>
                )}
                <GridItem xs={12} style={{ margin: 8 }}>
                  {description}
                </GridItem>
                <GridItem xs={12}>
                  {extra &&
                    extra.length > 0 &&
                    extra[0].extraList &&
                    extra[0].extraList.length > 0 && (
                      <div style={{ margin: 4 }}>
                        <h3>Extras.</h3>
                        {extra[0].extraList.join(", ")}
                      </div>
                    )}
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <GridContainer>
                {/* <GridItem xs={12}>
                  <AsyncMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlvYXYZ8UtR-LOAZDS4M0C3v4VLPKpono&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={
                      <div style={{ display: "flex", height: 400 }} />
                    }
                    mapElement={<div style={{ margin: 20, width: "100%" }} />}
                  />
                </GridItem> */}
                <GridItem
                  xs={12}
                  // style={{
                  //   backgroundColor: "rgba(0,0,0,0.1)",
                  //   paddingBottom: 4
                  // }}
                >
                  <h3>Details</h3>
                  <Grid
                    container
                    direcion="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={4}>
                      <DetailElement
                        Icon={<Reorder />}
                        title={t[this.props.lang].floor}
                        value={floor}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DetailElement
                        Icon={<ViewQuilt />}
                        title={t[this.props.lang].room}
                        value={room}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DetailElement
                        Icon={<AspectRatio />}
                        title={t[this.props.lang].surface}
                        value={surface}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DetailElement
                        Icon={<DateRange />}
                        title={t[this.props.lang].date}
                        value={
                          availableDate ? formatDate(availableDate) : "nolimit"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DetailElement
                        Icon={<OpenWithIcon />}
                        title={t[this.props.lang].postcode}
                        value={zipcode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DetailElement
                        Icon={<NearMe />}
                        title={t[this.props.lang].zone}
                        value={zone}
                      />
                    </Grid>
                  </Grid>
                  <GridContainer style={{ marginTop: 12 }}>
                    <GridItem xs={4}>
                      <DetailElement
                        title={t[this.props.lang].total}
                        value={formatNumber(totalPrice) + ' CHF'}
                        justify="center"
                      />
                    </GridItem>
                    <GridItem xs={4}>
                      <DetailElement
                        title={t[this.props.lang].loyer}
                        value={formatNumber(price) + ' CHF'}
                        justify="center"
                      />
                    </GridItem>
                    <GridItem xs={4}>
                      <DetailElement
                        title={t[this.props.lang].charge}
                        value={formatNumber(charge) + ' CHF'}
                        justify="center"
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} style={{ marginTop: 8 }}>
                  {advertiser && advertiser.length > 0 && (
                    <div>
                      <h3>{t[this.props.lang].contact_information}</h3>
                      <GridContainer
                        spacing={1}
                        style={{ marginLeft: 8, marginRight: 8 }}
                      >
                        <GridItem xs={6}>
                          <div className={classes.contactForm}>
                            <GridContainer>
                              <GridItem xs={12} style={{ marginBottom: 16 }}>
                                <strong>{t[this.props.lang].call_up_the_advertiser}</strong>
                                <Divider />
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                              >
                                <BusinessIcon style={{ marginRight: 8 }} />
                                {advertiser[0].agency != "" ? (
                                  <span>
                                    {advertiser[0].agency}
                                  </span>
                                ) : (
                                  <span>{t[this.props.lang].agency_name_is_not_provided}</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <Phone style={{ marginRight: 8 }} />
                                {isMobile ? (
                                  <span>
                                    <a
                                      href={`tel:${advertiser[0].phonenumber}`}
                                    >
                                      {advertiser[0].phonenumber}
                                    </a>
                                  </span>
                                ) : (
                                  advertiser[0].phonenumber
                                )}
                              </GridItem>
                              <GridItem
                                xs={12}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <AccountCircle style={{ marginRight: 8 }} />
                                {advertiser[0].fullname != "" ? (
                                  <span>
                                    {advertiser[0].fullname}
                                  </span>
                                ) : (
                                  <span>{t[this.props.lang].advertiser_name_is_not_provided}</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <Email style={{ marginRight: 8 }} />
                                {advertiser[0].email != "" ? (
                                <span>
                                  <a href={`mailto:${advertiser[0].email}`}>
                                    {advertiser[0].email}
                                  </a>
                                </span>
                                ) : (
                                  <span>{t[this.props.lang].advertiser_email_is_not_provided}</span>
                                )}
                              </GridItem>
                            </GridContainer>
                          </div>
                          
                          {/*ODAVDE */}
                          <div className={classes.contactForm} style={{ marginTop: 16 }}>
                            <GridContainer>
                              <GridItem xs={12}>
                                <strong>{t[this.props.lang].information_for_visit}</strong>
                                <Divider />
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <AccountCircle style={{ marginRight: 8 }} />
                                {visit_name != "" ? (
                                  <span>{visit_name}</span>
                                ) : (
                                  <span>{t[this.props.lang].visit_name_is_not_provided}</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <Phone style={{ marginRight: 8 }} />
                                {visit_phone != "" ? (
                                  <span>{visit_phone}</span>
                                ) : (
                                  <span>{t[this.props.lang].visit_phone_is_not_provided}</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <Email style={{ marginRight: 8 }} />
                                {visit_email != "" ? (
                                  <span><a href={`mailto:${visit_email}`}>{visit_email}</a></span>
                                ) : (
                                  <span>{t[this.props.lang].visit_email_is_not_provided}</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <NoteIcon style={{ marginRight: 8 }} />
                                {visit_remark != "" ? (
                                  <span>{visit_remark}</span>
                                ) : (
                                  <span>{t[this.props.lang].visit_remark_is_not_provided}</span>
                                )}
                              </GridItem>
                            </GridContainer>
                          </div>
                          
                  
                          {/* Mend */}
                          <div className={classes.contactForm} style={{ marginTop: 16 }}>
                            <GridContainer>
                              <GridItem xs={12}>
                                <strong>Information For Mendatory</strong>
                                <Divider />
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <AccountCircle style={{ marginRight: 8 }} />
                                {mand_name != "" ? (
                                  <span>{mand_name}</span>
                                ) : (
                                  <span>Mand name is not provided</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <Phone style={{ marginRight: 8 }} />
                                {visit_phone != "" ? (
                                  <span>{mand_phone}</span>
                                ) : (
                                  <span>Mand phone is not provided</span>
                                )}
                              </GridItem>

                              <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <Email style={{ marginRight: 8 }} />
                                {mand_email != "" ? (
                                  <span><a href={`mailto:${mand_email}`}>{mand_email}</a></span>
                                ) : (
                                  <span>Mand email is not provided</span>
                                )}
                              </GridItem>

                              {/* <GridItem
                                xs={12}
                                // style={{ paddingLeft: 16 }}
                                container
                                justify="flex-start"
                                alignItems="center"
                                style={{ marginTop: 16 }}
                              >
                                <NoteIcon style={{ marginRight: 8 }} />
                                {visit_remark != "" ? (
                                  <span>{visit_remark}</span>
                                ) : (
                                  <span>Visit remark is not provided</span>
                                )}
                              </GridItem> */}
                            </GridContainer>
                          </div>

                          
                          
                        </GridItem>

                        <GridItem xs={6}>
                          <div className={classes.contactForm}>
                            <GridContainer>
                              <GridItem xs={12} style={{ marginBottom: 16 }}>
                                <strong style={{ padding: 4 }}>
                                  {t[this.props.lang].contact_advertiser}
                                </strong>
                                <Divider />
                              </GridItem>
                              <GridItem xs={12}>
                                <TextField
                                  required
                                  id="full-name"
                                  label={t[this.props.lang].full_name}
                                  placeholder="John Doe"
                                  className={classes.textField}
                                  margin="normal"
                                  value={user_fullname}
                                  onChange={this.handleInput("user_fullname")}
                                />
                              </GridItem>
                              <GridItem xs={12}>
                                <TextField
                                  required
                                  id="user-email"
                                  label={t[this.props.lang].email}
                                  placeholder=""
                                  className={classes.textField}
                                  margin="normal"
                                  value={user_email}
                                  onChange={this.handleInput("user_email")}
                                />
                              </GridItem>
                              <GridItem xs={12}>
                                <TextField
                                  // required
                                  id="user-phone"
                                  label={t[this.props.lang].phone_number}
                                  className={classes.textField}
                                  margin="normal"
                                  value={user_phonenumber}
                                  onChange={this.handleInput(
                                    "user_phonenumber"
                                  )}
                                />
                              </GridItem>
                              <GridItem xs={12}>
                                <TextField
                                  id="user-message"
                                  label={t[this.props.lang].message}
                                  className={classes.textField}
                                  margin="normal"
                                  value={user_message}
                                  fullWidth
                                  multiline
                                  rows={3}
                                  rowsMax={8}
                                  onChange={this.handleInput("user_message")}
                                />
                              </GridItem>
                              <GridItem
                                xs={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Button
                                  style={{ margin: 8 }}
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleContact}
                                >
                                  {t[this.props.lang].send}
                                </Button>
                              </GridItem>
                            </GridContainer>
                          </div>
                        </GridItem>
                      </GridContainer>
                    </div>
                  )}
                </GridItem>
              </GridContainer>

            </GridItem>
          </GridContainer>
          <Dialog
            maxWidth="sm"
            open={isDeleteDlg}
            onClose={this.handleCancelDeleteDlg}
          >
            <DialogTitle>{t[this.props.lang].confirm_dialog}</DialogTitle>
            <DialogContent>
              <DialogContentText>{t[this.props.lang].are_you_sure_to_delete}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDelete} color="primary">
                {t[this.props.lang].yes}
              </Button>
              <Button onClick={this.handleCancelDeleteDlg} color="primary">
                {t[this.props.lang].no}
              </Button>
            </DialogActions>
          </Dialog>

          {/* VisitorComment */}
          <Dialog
            fullScreen
            open={isCommentDlg}
            onClose={() => this.setState({ isCommentDlg: false })}
          >
            <DialogTitle>
              <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                <Button onClick={() => this.setState({ isCommentDlg: false})}>
                  <ArrowBack />
                </Button>
                <h2>{t[this.props.lang].visitor_comment}</h2>
              </div>
            </DialogTitle>
            <DialogContent  style={{padding:0}}>
              <VisitorComment
                onClose={() => this.setState({ isCommentDlg: false })}
                ads_id={this.state.adsInfo._id}
              />
            </DialogContent>
          </Dialog>
        </Container>
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
)(withStyles(styles)(withRouter(windowSize(AdsDetail))));
