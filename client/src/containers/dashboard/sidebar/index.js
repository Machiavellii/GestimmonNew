import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, useTheme } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import AccountCircle from "@material-ui/icons/AccountCircle";
import DirectionsBoat from "@material-ui/icons/DirectionsBoat";
import NoteAdd from "@material-ui/icons/NoteAdd";
import Email from "@material-ui/icons/Email";
import VideoLibrary from "@material-ui/icons/VideoLibrary";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import SpeakerNotes from "@material-ui/icons/SpeakerNotes";
import { Grid, Avatar } from "@material-ui/core";
import { typography } from "@material-ui/system";
import Hidden from "@material-ui/core/Hidden";
import { connect } from "react-redux";
import UserStatus from "../userstatus";
import { handleMenuClick } from "../../../actions/menuActions";
import axios from "axios";
import config from "../../../config/config";
import t from "../../../constants/language";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      shortname: "",
    };

    this.getUserInfo();
  }

  getUserInfo = () => {
    axios
      .request({
        url: "/api/users/info",
        baseURL: config.apiBaseUrl,
        method: "get"
      })
      .then(res => {
        console.log("user info: ", res);
        var shortname = res.data.user.firstname[0] + res.data.user.lastname[0];
        this.setState({ firstname: res.data.user.firstname, shortname: shortname.toUpperCase() });
        this.props.dispatch({ type: "AVATAR_CHANGED", payload: res.data.avatar });
      })
      .catch(err => {
        console.log("get userinfo error", err);
      });
  };

  handleSidebar = (tabname, isMobile) => {
    switch (tabname) {
      case "userinfo":
        this.props.ontab(1);
        break;
      case "boatinfo":
        this.props.ontab(2);
        break;
      case "adsinfo":
        this.props.ontab(3);
        break;
      case "schedule":
        this.props.ontab(4);
        break;
      case "logout":
        this.props.ontab(5);
        break;
      default:
        break;
    }
    if(isMobile)
    this.props.toggleMobileMenu();
  };

  handleMobilesidebar = (tabname, isMobile) => {
    switch (tabname) {
      case "userinfo":
        this.props.ontab(1);
        break;
      case "boatinfo":
        this.props.ontab(2);
        break;
      case "adsinfo":
        this.props.ontab(3);
        break;
      case "schedule":
        this.props.ontab(4);
        break;
      case "logout":
        this.props.ontab(5);
        break;
      default:
        break;
    }
    if(isMobile)
    this.props.toggleMobileMenu();
  };

  drawer = (firstname, shortname, avatar, isMobile) => (
    <div>
      <div className={this.props.classes.toolbar} />
      <List>
        <UserStatus online={true} name={firstname} shortname={shortname} avatar={avatar}/>
        <ListItem button onClick={() => this.handleSidebar("userinfo", isMobile)}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={t[this.props.lang].user_info} />
        </ListItem>
        <ListItem button onClick={() => this.handleSidebar("boatinfo", isMobile)}>
          <ListItemIcon>
            <DirectionsBoat />
          </ListItemIcon>
          <ListItemText primary={t[this.props.lang].boat_info} />
        </ListItem>
        <ListItem button onClick={() => this.handleSidebar("adsinfo", isMobile)}>
          <ListItemIcon>
            <NoteAdd />
          </ListItemIcon>
          <ListItemText primary={t[this.props.lang].ads} />
        </ListItem>
        <ListItem button onClick={() => this.handleSidebar("schedule", isMobile)}>
          <ListItemIcon>
            <SpeakerNotes />
          </ListItemIcon>
          <ListItemText primary={t[this.props.lang].schedule} />
        </ListItem>
        <ListItem button onClick={() => this.handleSidebar("logout", isMobile)}>
          <ListItemIcon>
            <PowerSettingsNew />
          </ListItemIcon>
          <ListItemText primary={t[this.props.lang].logout} />
        </ListItem>
      </List>
    </div>
  );

  render() {
    const { classes } = this.props;
    // const theme = useTheme();
    return (
      <nav className={classes.drawer} aria-label="Mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor="left"
            open={this.props.mobileOpen}
            onClose={this.props.toggleMobileMenu}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {/* //Mobile menu */}
            {this.drawer(this.state.firstname, this.state.shortname, this.props.avatarPath, true)}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {this.drawer(this.state.firstname, this.state.shortname, this.props.avatarPath, false)}
          </Drawer>
        </Hidden>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    mobileOpen: state.menu.mobileOpen,
    avatarPath: state.menu.avatarPath,
    lang: state.menu.lang
  };
};

const mapDispathToProps = dispatch => {
  return {
    toggleMobileMenu: () => {
      dispatch(handleMenuClick());
    },
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(withStyles(styles)(Sidebar));
