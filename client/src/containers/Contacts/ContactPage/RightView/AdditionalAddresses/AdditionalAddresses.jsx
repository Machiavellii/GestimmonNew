import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

class AdditionalAddresses extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                <h2>Additional Addresses</h2>
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

export default connect(mapStateToProps)(AdditionalAddresses);