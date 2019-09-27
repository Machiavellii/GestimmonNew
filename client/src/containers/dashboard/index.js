import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.css";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Header from "components/Header/Header.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";

import Sidebar from "./sidebar";
import UserPanel from "./userpanel";
import Boat from "./boat";
import Schedule from "./schedule";
import Ads from "./ads";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isAuthenticated } from "../../service/authentication";
import setAuthToken from "../../utils/setAuthToken";
import image from "assets/img/bg.jpg";
import navbarsStyle from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.jsx";
const styles = theme => ({
  ...navbarsStyle(theme)
 
});

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_tab: 1
    };
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentWillMount() {
    const jwtToken = localStorage.getItem("jwtToken");
    console.log("jwt", jwtToken);
    if (!isAuthenticated()) {
      this.props.history.push("/");
    }
    setAuthToken(jwtToken);
  }

  onChangeTab(index) {
    this.setState({ selected_tab: index });
    if (index === 5) {
      this.props.logoutUser(this.props.history);
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header
          brand="Navbar with notifications"
          color="primary"
          rightLinks={
            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <CustomDropdown
                  left
                  caret={false}
                  hoverColor="black"
                  dropdownHeader="Dropdown Header"
                  buttonText={
                   'user'
                  }
                  buttonProps={{
                    className:
                      classes.navLink + " " + classes.imageDropdownButton,
                    color: "transparent"
                  }}
                  dropdownList={["Me", "Settings and other stuff", "Sign out"]}
                />
              </ListItem>
            </List>
          }
        />
      </div>
    );
  }
}

DashBoard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  lang: state.menu.lang
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(styles)(withRouter(DashBoard)));
