import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

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
import {
  ArrowForward,
  ArrowBack,
  PhotoCamera,
  AccountCircle,
  Email,
  Phone
} from "@material-ui/icons";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import * as api from "service/Api";
import { isAuthenticated } from "service/authentication";
import { countryList } from "constants/data.json";
import default_avatar from "assets/profile_default.jpg";

import {
  Divider,
  Paper,
  TablePagination,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import config from "config/config";
import { getUserInfo } from "service/authentication";
import * as utils from "utils/FileUtils"
const headRows = [
  { id: "Num", label: "No" },
  { id: "visitor", label: "Visitor" },
  { id: "agent", label: "Agent" },
  { id: "comment", label: "Comment" },
  { id: "date", label: "Date" }
];

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
  paper: {
    overflowX: "auto",
    padding: theme.spacing(2),
  }
});
class VisitorComment extends Component {
  constructor(props) {
    super(props);

    const userInfo = getUserInfo();
    this.state = {
      date: Date.now(),
      comments: "",
      visitor: "",
      agent: userInfo.fullname,
      isAddComment: false,

      tableData: [],
      currentPage: 0,
      rowsPerPage: 5,
      isLoading: false
    };
  }

  componentWillMount() {
    this.getComments();
  }
  getComments = async () => {
    const ads_id = this.props.ads_id;
    console.log("ads_id to commit", ads_id);

    const result = await api.getComments(ads_id);
    if (result.status) {
      const comments = result.comments;
      this.setState({ tableData: comments });
      // NotificationManager.success("Success");
    } else {
      NotificationManager.warning("Failed to get comments from server");
    }
  };

  addComment = async () => {
    const { date, comments, visitor, agent } = this.state;
    const comment_data = {
      date: date,
      comment: comments,
      visitor: visitor,
      agent: agent,
      ads_id: this.props.ads_id
    };
    const result = await api.addComment(comment_data);
    if (result.status) {
      NotificationManager.success("Success");
      this.state.tableData.push(result.comment);
      this.setState({ tableData: this.state.tableData, isAddComment: false });
    } else {
      NotificationManager.warning("Failed");
    }
  };

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };
  handleChangeDate = val => {
    this.setState({ date: val });
  };
  handleChangePage = (event, newPage) => {
    this.setState({ currentPage: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      currentPage: 0
    });
  };

  handleAddComment = () => {
    this.setState({ isAddComment: true });
  };

  handleSaveVisitorComment = () => {
    this.addComment();
  };

  render() {
    const { classes } = this.props;
    const {
      date,
      comments,
      visitor,
      agent,
      isAddComment,

      tableData,
      currentPage,
      rowsPerPage
    } = this.state;
    const WriteComment = (
      <GridContainer>
        <GridItem xs={12}>
          <DatePicker
            className={classes.formControl}
            label="Date"
            fullWidth
            disablePast
            format="dd/MM/yyyy"
            views={["year", "month", "date"]}
            placeholder="01/07/2019"
            value={date}
            //   error={errors.limitDate}
            onChange={value => this.handleChangeDate(value)}
            //   disabled={dateType !== 0}
            // cancelLabel={t[this.props.lang].cancel}
            // okLabel = {t[this.props.lang].ok}
            // clearLabel = {t[this.props.lang].clear}
          />
        </GridItem>
        <GridItem xs={12}>
          <TextField
            id="id-comments"
            label="Comments"
            className={classes.textField}
            margin="normal"
            value={comments}
            multiline
            rows={3}
            rowsMax={8}
            fullWidth
            onChange={this.handleInput("comments")}
          />
        </GridItem>
        <GridItem xs={12}>
          <TextField
            id="id-visitor"
            label="Visitor"
            className={classes.textField}
            margin="normal"
            value={visitor}
            fullWidth
            onChange={this.handleInput("visitor")}
          />
        </GridItem>
        <GridItem xs={12}>
          <TextField
            id="id-agent"
            label="Agent"
            className={classes.textField}
            margin="normal"
            value={agent}
            fullWidth
            onChange={this.handleInput("agent")}
          />
        </GridItem>
        <GridItem xs={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Button
              style={{ margin: 10 }}
              variant="contained"
              color="secondary"
              onClick={this.handleSaveVisitorComment}
            >
              Save
            </Button>
            <Button
              style={{ margin: 10 }}
              variant="text"
              color="secondary"
              size="small"
              onClick={() => this.setState({ isAddComment: false })}
            >
              cancel
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    );
    return (
      <div style={{ margin: 20 }}>
        <Dialog
          maxWidth="sm"
          open={isAddComment}
          onClose={() => {
            this.setState({ isAddComment: false });
          }}
        >
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>{WriteComment}</DialogContent>
        </Dialog>
        <Container>
          <GridContainer>
            <GridItem
              xs={12}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
            ></GridItem>
            <GridItem xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h3>Comments List</h3>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={this.handleAddComment}
                >
                  Add Comment
                </Button>
              </div>

              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {headRows.map((row, index) => (
                        <TableCell key={row.id} align={"left"}>
                          {row.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData &&
                      tableData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" align="left">
                            {currentPage * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell align="left">{item.visitor}</TableCell>
                          <TableCell align="left">{item.agent}</TableCell>
                          <TableCell
                            align="left"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word"
                            }}
                          >
                            {item.comment}
                          </TableCell>
                          <TableCell align="left">{utils.formatDate(item.date)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{
                      "aria-label": "Previous Page"
                    }}
                    nextIconButtonProps={{
                      "aria-label": "Next Page"
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </div>
              </Paper>
            </GridItem>
          </GridContainer>
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
)(withStyles(styles)(VisitorComment));
