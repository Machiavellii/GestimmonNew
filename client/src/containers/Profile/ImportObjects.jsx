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
import ProgressShow from "components/ProgressShow/ProgressShow";
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
    objectFit: "contain"
    // backgroundColor: "rgb(0,0,0,0.1)"
  }
});
class ImportObjects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      isLoading: false
    };
  }

  componentDidMount() {}

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleImport = async () => {
    const url = this.state.url;
    this.setState({ isLoading: true });
    const result = await api.quoromImport(url);
    this.setState({ isLoading: false });
    if (result.status) {
      // NotificationManager.success("Added: " + result.importedNum);
      NotificationManager.success("Success");
    } else {
      NotificationManager.warning("Failed");
    }
  };
  render() {
    const { classes } = this.props;
    const { url, isLoading } = this.state;
    return (
      <div style={{ margin: 20 }}>
        <GridContainer>
          <GridItem>
            <h3>Quorom Import</h3>
          </GridItem>
          <GridItem>
            <TextField
              id="quorom-url"
              label="Quorom Url"
              className={classes.textField}
              margin="normal"
              fullWidth
              value={url}
              type="url"
              onChange={this.handleInput("url")}
            />
          </GridItem>
          <GridItem container alignItems="center" justify="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleImport}
            >
              Import
            </Button>
          </GridItem>
          <GridItem></GridItem>
        </GridContainer>

        <ProgressShow open={isLoading} />
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
)(withStyles(styles)(ImportObjects));
