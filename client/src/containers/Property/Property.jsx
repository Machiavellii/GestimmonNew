import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, BrowserRouter, HashRouter } from "react-router-dom";
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

import * as api from "service/Api";
import { isAuthenticated } from "service/authentication";
import PropertyList from "./PropertyList";
import AddProperty from "./AddProperty";
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

class Property extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    };
  }

  componentWillMount() {}

  handleNewProperty = () => {};

  render() {
    const { classes } = this.props;
    const { currentTab } = this.state;
    return (
      <div>
        <Header
          color="primary"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
        />
        <div className={classes.toolbar} />
        <Container>
           <Route exact path="/property" component={PropertyList} />
           <Route path="/property/add-property" component={AddProperty} />
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
)(withStyles(styles)(Property));
