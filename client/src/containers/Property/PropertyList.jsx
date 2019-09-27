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

class PropertyList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      properties: [],
    };
  }

  componentDidMount() {
    this.getProperties();
  }

  getProperties = async () => {
    const result = await api.getProperties();
    if(result.status){  
      const properties = result.properties;
      this.setState({ properties: properties});
    }else{
      NotificationManager.warning("Failed");
    }
  }
  render() {
    const { classes } = this.props;
    const { properties } = this.state;
    return (
      <GridContainer>
        <GridItem xs={12} style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ flexGrow: 1, color: "#43a047" }}>{t[this.props.lang].my_property}({1})</h2>
          <div>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
            >
              <NavLink to="/property/add-property" style={{textDecoration:'none'}}> {t[this.props.lang].add_new_property}</NavLink>
            </Button>
          </div>
        </GridItem>
        <GridItem xs={12}>
          {properties && properties.map((item, index)=> {
            return(
              <PropertyCard info={item} key={index}/>
            )
          })}
          
        </GridItem>
      </GridContainer>
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
)(withStyles(styles)(PropertyList));
