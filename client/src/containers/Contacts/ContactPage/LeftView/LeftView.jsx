import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import config from "config/config";
import { connect } from "react-redux";
import ContactOverview from "./ContactOverview/ContactOverview"
import ContactProperties from './ContactProperties/ContactProperties';
import ContactFinances from './ContactFinances/ContactFinances';
import ContactMore from './ContactMore/ContactMore';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

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
    tab: {
        fontSize: 10,
    }
  });

class LeftView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 0
        };
    }

    handleTabChange = (event, newValue) => {
        console.log("123", event, newValue);
         this.setState({currentTab: newValue})
      };

    render() {
        const { classes } = this.props;
        const { currentTab } = this.state;

        return(
            <div>
                <Grid container>
                        <Grid item md={12}>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={currentTab}
                                onChange={this.handleTabChange}
                                aria-label="Vertical tabs example"
                                className={classes.tabs}
                                classes={{ root: classes.tab }}
                            >
                                <Tab classes={{ root: classes.tab }} label="Overview" />
                                <Tab classes={{ root: classes.tab }} label="Finances" />
                                <Tab classes={{ root: classes.tab }} label="Properties" />
                                <Tab classes={{ root: classes.tab }} label="More" />
                            </Tabs>
                            <div>
                                {currentTab===0 && <ContactOverview />}
                                {currentTab===1 && <ContactFinances />}
                                {currentTab===2 && <ContactProperties />}
                                {currentTab===3 && <ContactMore />}
                            </div>
                        </Grid>
                    </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobileOpen: state.mobileOpen,
        lang: state.menu.lang
    };
  };

export default connect(mapStateToProps)(withStyles(styles)(LeftView));