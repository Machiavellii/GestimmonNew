import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

class ContactOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                <Grid container>
                    <Grid item md={6}>
                        <Grid container>
                            <Grid item md={4}>Contact IMG</Grid>
                            <Grid item md={8}>Contact name</Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={12}>
                        <Grid container>
                            <Grid item md={6}>
                                <Grid container>
                                    <Grid item md={4}>Addres:</Grid>
                                    <Grid item md={8}>User Addres</Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={4}>Phone:</Grid>
                                    <Grid item md={8}>+41 (0) 71 552 00 60</Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={4}>Email:</Grid>
                                    <Grid item md={8}>support@bexio.com</Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={4}>Website:</Grid>
                                    <Grid item md={8}>https://www.bexio.com</Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={6}>
                                <Grid container>
                                    <Grid item md={4}>Contact Partner:</Grid>
                                    <Grid item md={8}>Nebojsa Popadic</Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={4}>Correspondence type:</Grid>
                                    <Grid item md={8}>Post</Grid>
                                </Grid>
                            </Grid>
                        </Grid>
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

export default connect(mapStateToProps)(ContactOverview);