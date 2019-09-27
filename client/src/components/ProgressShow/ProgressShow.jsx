import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";

const styles = theme => ({
  progress: {
    margin: theme.spacing(2)
  }
});

class ProgressShow extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <Dialog
        {...rest}
        style={{ backgroundColor: "transparent" }}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogContent>
          <CircularProgress className={classes.progress} />
        </DialogContent>
      </Dialog>
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
)(withStyles(styles)(ProgressShow));
