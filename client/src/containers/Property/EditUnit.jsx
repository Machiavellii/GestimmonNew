import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../constants/language";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Button from "@material-ui/core/Button";
import { NavLink, Link } from "react-router-dom";

import * as api from "service/Api";
import PropertyCard from "./PropertyCard";
import { Paper, Grid, Divider, TextField } from "@material-ui/core";
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

class EditUnit extends Component {
  constructor(props) {
    super(props);

    this.state = {
        unitID: "",
        unitType: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        parking: "",
        parking_option: "",
        petPolicy: "",
        smoking: false,
        attributes: [],
        
    };
  }

  componentWillMount() {}

  render() {
    const { classes } = this.props;
    return (
      <Paper>
          <Grid container>
            <Grid item xs={12} container justify="space-between">
                <Grid item>

                </Grid>
                <Grid item>
                    Edit unit features for super address
                </Grid>
                <Grid item>
                    status: Vacant
                </Grid>
            </Grid>
            <Divider />
            <Grid item xs={12} sm={5} >
                <Grid container>
                    <Grid item xs={12}>
                        Unit Features
                    </Grid>
                    <Grid item xs={12}>
                        picture
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={7}>
                <Grid container>
                <TextField
                  id="id-phonenumber"
                  label="Phone"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  value={phonenumber}
                  onChange={this.handleInput("phonenumber")}
                />
                </Grid>
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
)(withStyles(styles)(EditUnit));
