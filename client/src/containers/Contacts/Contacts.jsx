import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import t from "../../constants/language";
import * as api from "service/Api";
// import SearchBar from 'material-ui-search-bar'
import { tableData } from "../../constants/data.json";

import {
  IconButton,
  TableSortLabel,
  Divider,
  Container,
  Button,
  Input,
  InputAdornment,
  Fade
} from "@material-ui/core";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  FilterList,
  Search,
  CheckCircle
} from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Header from "components/Header/Header";
import HeaderLinks from "components/Header/HeaderLinks";
import axios from "axios";
import config from "../../config/config";
import { Link } from 'react-router-dom';


const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowX: "auto"
  },

  toolbar: theme.mixins.toolbar,
  paper: {
    // width: "100%",
    overflowX: "auto",
    padding: theme.spacing(3)
  },
  table: {
    minWidth: 650
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#30a5ff",
    width: 60
  },

  moreSummary: {
    "& div": {
      flexGrow: 0
    }
  },
  username: {
    color: "#2065bf",
    cursor: "pointer"
  },
  offer: {
    backgroundColor: "#f3e5f5"
  },
  demand: {
    backgroundColor: "#e3f2fd"
  },
  exchange: {
    backgroundColor: "#e0f2f1"
  },

  formControl: {
    margin: theme.spacing(1)
  }
});

const headRows = [
  {
    id: "No",
    numeric: true,
    disablePadding: false,
    label: ["No.", "Num.", "Nr.", "N."]
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: ["Name", "Prénom", "Name", "Nome"]
  },
  {
    id: "postcode",
    numeric: true,
    disablePadding: false,
    label: ["postcode", "Code postal", "Postleitzahl", "Codice postale"]
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: ["City", "Ville", "Stadt", "Città"]
  },
  {
    id: "country",
    numeric: false,
    disablePadding: false,
    label: ["Country", "Pays", "Land", "Nazione"]
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: ["Phone", "Téléphone", "Telefon", "Telefono"]
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: ["Email", "Email", "Email", "Email"]
  }
];

class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: new Array(),

      isLoading: true,
      currentPage: 0,
      rowsPerPage: 5,

      order: "desc",
      orderBy: "No",

      filterOn: false,
      filterData: {
        contactNo: "",
        companyName: "", //or lastname
        additionalCompanyName: "", //or firstname
        category: "",
        sector: "",
        country: "",
        language: "",
        contactPartner: "",
        contactType: "",
        owner: "",
        marked: true
      },
      searchKey: "",
      isFilterApplied: false
    };
  }

  componentWillMount() {
    // const jwtToken = localStorage.getItem("jwtToken");
    // console.log("jwt", jwtToken);
    // if (!isAuthenticated()) {
    //   this.props.history.push("/");
    // }
    // setAuthToken(jwtToken);
  }
  componentDidMount() {
    this.getContacts();
  }

  getContacts = async () => {
    this.setState({ isLoading: true });
    const result = await api.getContacts();
    if (result.status) {
      console.log("GET contactsList", result.contacts);
      this.setState({ tableData: result.contacts });
    } else {
      NotificationManager.warning("Failed");
    }
    this.setState({ isLoading: false });
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

  onClickDelete = item => {
    console.log("213");
  };

  handleSort = rowId => {
    console.log("handleSort", rowId);
    const isDesc = this.state.orderBy === rowId && this.state.order === "desc";
    this.setState({ order: isDesc ? "asc" : "desc", orderBy: rowId });
  };

  desc(a, b, orderBy) {
    var left = a[orderBy];
    var right = b[orderBy];
    // if (orderBy === "postcode" || orderBy === "draught") {
    //   left = parseInt(left);
    //   right = parseInt(right);
    // } else {
    if (typeof left === "string") left = left.toLowerCase();
    if (typeof right === "string") right = right.toLowerCase();
    // }

    if (right < left) {
      return -1;
    }
    if (right > left) {
      return 1;
    }
    return 0;
  }

  getSorting = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => this.desc(a, b, orderBy)
      : (a, b) => -this.desc(a, b, orderBy);
  };

  stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map(el => el[0]);
  };

  handleNewContact = () => {
    this.props.history.push("/add-contact");
  };

  handleSettings = () => {
    this.props.history.push("/settings");
  };

  handleFilterClick = () => {
    this.setState({ filterOn: !this.state.filterOn });
  };

  handleFilterData = input => event => {
    this.setState({
      filterData: { ...this.state.filterData, [input]: event.target.value }
    });
  };

  handleSearchBar = e => {
    const key = e.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ searchKey: key });
    }, 800);
  };

  filterTable() {
    const data = this.state.tableData;
    const searchKey = this.state.searchKey;
    const result_of_searchkey = data.filter((item, index) => {
      if (
        item.companyName.includes(searchKey) ||
        item.firstName.includes(searchKey) ||
        item.lastName.includes(searchKey) ||
        (item.firstName + " " + item.lastName).includes(searchKey) ||
        item.postcode.includes(searchKey) ||
        item.city.includes(searchKey) ||
        item.country.includes(searchKey) ||
        item.phone.includes(searchKey) ||
        item.email.includes(searchKey)
      ) {
        return true;
      }
      return false;
    });

    if (!this.state.isFilterApplied) return result_of_searchkey;

    // filter with filter data
    const filterKey = this.state.filterData;
    return result_of_searchkey.filter((item, index) => {
      if (
        item.contactNo.includes(filterKey.contactNo) &&
        (item.contactType === "Company"
          ? item.companyName.includes(filterKey.companyName)
          : item.lastName.includes(filterKey.companyName)) &&
        (item.contactType === "Company"
          ? item.nameSuffix.includes(filterKey.additionalCompanyName)
          : item.firstName.includes(filterKey.additionalCompanyName)) &&
        item.category.includes(filterKey.category) &&
        item.sector.includes(filterKey.sector) &&
        item.country.includes(filterKey.country) &&
        item.language.includes(filterKey.language) &&
        item.contactPartner.includes(filterKey.contactPartner) &&
        item.contactType.includes(filterKey.contactType) &&
        item.owner.includes(filterKey.owner)
        // item.marked.includes(filterKey.marked)
      ) {
        return true;
      }
      return false;
    });
  }

  handleDeleteCurrentFilter = () => {
    
    this.setState({ filterData: {}, isFilterApplied:false, filterOn: false });
  };

  handleApplyFilter = () => {
    console.log("filterData", this.state.filterData)
    this.setState({ isFilterApplied: true, filterOn: false });
  };

  render() {
    const { classes } = this.props;
    const {
      currentPage,
      rowsPerPage,
      tableData,

      order,
      orderBy,

      filterOn,
      filterData,
      searchKey,
      isFilterApplied
    } = this.state;
    return (
      <div>
        <Header
          color="primary"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
        />
        <div className={classes.toolbar} />
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16
            }}
          >
            <h2>{t[this.props.lang].contacts}</h2>
            <div style={{ flexGrow: 1 }} />
            <div>
              <Button
                variant="text"
                color="primary"
                size="medium"
                onClick={this.handleSettings}
              >
                Settings
              </Button>
            </div>
            <div>
              <Button variant="text" color="primary" size="medium">
                {t[this.props.lang].imp_exp}
              </Button>
            </div>
            <div>
              <Button
                variant="text"
                color="secondary"
                size="medium"
                onClick={this.handleNewContact}
              >
                {t[this.props.lang].new_contact}
              </Button>
            </div>
          </div>
          <Paper
            className={classes.paper}
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            <div style={{ display: "flex", marginTop: 4, marginBottom: 8 }}>
              <Button variant="outlined" color="primary" onClick={() => {}}>
                {t[this.props.lang].all}
              </Button>
              <Button variant="text" color="primary" onClick={() => {}}>
                {t[this.props.lang].marked}
              </Button>
              <div style={{ flexGrow: 1 }} />
              {isFilterApplied && (
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  onClick={this.handleDeleteCurrentFilter}
                >
                  <Cancel />
                  Remove active filter
                </Button>
              )}
              <Button
                variant="text"
                color="primary"
                onClick={this.handleFilterClick}
              >
                <FilterList />
                {t[this.props.lang].filter}
              </Button>

              <FormControl
                className={classes.margin}
                style={{ marginRight: 8, maxWidth: 120 }}
              >
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  onChange={this.handleSearchBar}
                />
              </FormControl>
            </div>
            {/* filter part */}
            {filterOn && (
              <Fade in={{ filterOn }}>
                <Paper style={{ marginTop: 16, marginBottom: 16, padding: 16 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <strong>Detailed filter</strong>
                    </Grid>
                    <Grid item xs={12} container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-contactNo"
                          label="Contact no."
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.contactNo}
                          onChange={this.handleFilterData("contactNo")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-companyName"
                          label="Company name/last name"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.companyName}
                          onChange={this.handleFilterData("companyName")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-additionalCompany"
                          label="Additional company information/first name"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.additionalCompanyName}
                          onChange={this.handleFilterData(
                            "additionalCompanyName"
                          )}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-category"
                          label="Category"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.sector}
                          onChange={this.handleFilterData("sector")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-sector"
                          label="Sector"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.sector}
                          onChange={this.handleFilterData("sector")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-country"
                          label="Country"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.country}
                          onChange={this.handleFilterData("country")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-language"
                          label="Language"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.language}
                          onChange={this.handleFilterData("language")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-contact partner"
                          label="Contact Partner"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.contactPartner}
                          onChange={this.handleFilterData("contactPartner")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-contactType"
                          label="Contact type"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.contactType}
                          onChange={this.handleFilterData("contactType")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-contactNo"
                          label="Show only marked as deleted"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.marked}
                          onChange={this.handleFilterData("marked")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          id="id-owner"
                          label="Owner"
                          placeholder=""
                          className={classes.textField}
                          margin="normal"
                          value={filterData.owner}
                          onChange={this.handleFilterData("owner")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleApplyFilter}
                          >
                            <CheckCircle style={{ marginRight: 8 }} />
                            Apply filter
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button variant="contained" color="secondary">
                            <Save style={{ marginRight: 8 }} />
                            Save filter
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Fade>
            )}
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {headRows.map((row, index) => (
                    <TableCell
                      key={row.id}
                      align={"left"}
                      padding={row.disablePadding ? "none" : "default"}
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={() => this.handleSort(row.id)}
                      >
                        {row.label[this.props.lang]}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.isLoading && (
                  <p style={{ marginLeft: 20 }}>loading...</p>
                )}

                {tableData &&
                  this.filterTable()
                    .slice(
                      currentPage * rowsPerPage,
                      currentPage * rowsPerPage + rowsPerPage
                    )
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row" align="left">
                          {currentPage * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left">
                          {item.companyName
                            ? (

                            <Link to="/contactID">{item.companyName}</Link>
                          ) : (
                            <Link to="/contactID">{item.firstName}+ " " +{item.lastName}</Link>

                          )}
                        </TableCell>
                        <TableCell align="left">{item.postcode}</TableCell>
                        <TableCell align="left">{item.city}</TableCell>
                        <TableCell align="left">{item.country}</TableCell>
                        <TableCell align="left">{item.phone}</TableCell>
                        <TableCell align="left">{item.email}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.filterTable().length}
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
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mobileOpen: state.mobileOpen,
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Contacts));
