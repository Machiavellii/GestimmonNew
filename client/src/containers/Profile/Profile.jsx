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
import BasicProfile from "./BasicProfile";
import CompanyProfile from "./CompanyProfile";
import ImportObjects from "./ImportObjects";

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
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    };
  }

  componentWillMount() {}
  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleTabChange = (event, newValue) => {
    console.log("123", event, newValue);
     this.setState({currentTab: newValue})
  };
  render() {
    const { classes } = this.props;
    const { currentTab } = this.state;
    return (
      <div>
        <Header
          color="success"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
        />
        <div className={classes.toolbar} />
        <Container>
          <h1>{t[this.props.lang].profile}</h1>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={currentTab}
            onChange={this.handleTabChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab label={t[this.props.lang].profile} />
            <Tab label={t[this.props.lang].company} />
            <Tab label={t[this.props.lang].create_company} />
            <Tab label="Quorom Import" />
            {/* <Tab label="Item Four" />
            <Tab label="Item Five" />
            <Tab label="Item Six" />
            <Tab label="Item Seven" /> */}
          </Tabs>
          <div>
            {currentTab===0 && <BasicProfile />}
            {currentTab===1 && <CompanyProfile />}
            {currentTab===3 && <ImportObjects />}
          </div>
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
)(withStyles(styles)(Profile));
