import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import config from "config/config";
import { connect } from "react-redux";
import AdditionalAddresses from './AdditionalAddresses/AdditionalAddresses'
import BankAccounts from './BankAccounts/BankAccounts'
import LinkedContacts from './LinkedContacts/LinkedContacts'
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

class RightView extends Component {
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
                                <Tab  classes={{ root: classes.tab }} label="Linked Contacts" />
                                <Tab  classes={{ root: classes.tab }} label="Additional Addresses" />
                                <Tab  classes={{ root: classes.tab }} label="Bank Accounts" />
                            </Tabs>
                            <div>
                                {currentTab===0 && <AdditionalAddresses />}
                                {currentTab===1 && <BankAccounts />}
                                {currentTab===2 && <LinkedContacts />}
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

export default connect(mapStateToProps)(withStyles(styles)(RightView));