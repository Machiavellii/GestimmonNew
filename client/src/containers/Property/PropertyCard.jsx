import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../constants/language";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { Divider, Tabs, Tab } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
import { withRouter } from "react-router-dom";

import * as api from "service/Api";
import config from "config/config";

import profile_default from "assets/profile_default.jpg";
import icon_application from "assets/icon_application.png";
import icon_freports from "assets/icon_freports.png";
import icon_inquires from "assets/icon_inquires.png";
import icon_listing from "assets/icon_listing.png";
import icon_maintenance from "assets/icon_maintenance.png";
import icon_messages from "assets/icon_messages.png";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const overview_headRows = [
  { id: "action", label: "Actions" },
  { id: "tenant", label: "TENANT" },
  { id: "lease-term", label: "LEASE TERM" },
  { id: "rent", label: "RENT" },
  { id: "security-deposit", label: "SECURITY DEPOSIT" },
  { id: "rent-adjustment", label: "RENT ADJUSTMENT" },
  { id: "ternant-balance", label: "TENANT(s) BALANCE" },
  { id: "alert", label: "ALERT" }
];

const storedDocument_headRows = [
  { id: "unit", label: "UNIT" },
  { id: "tenant", label: "TENANT" },
  { id: "document", label: "DOCUMENTS" }
];

const servicePlan_headRows = [
  { id: "unit", label: "UNIT" },
  { id: "service-plan", label: "SERVICE PLAN" },
  { id: "start-date", label: "START DATE" },
  { id: "price", label: "PRICE" },
  { id: "next-payment-date", label: "NEXT PAYMENT DATE" },
  { id: "history", label: "HISTORY" },
  { id: "take-action", label: "TAKE ACTION" }
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
  }
});

function GropButtons(props) {
  const { icon, title, subtitle } = props;
  return (
    <Button
      style={{ borderWidth: 1, borderColor: "#aaaaaa", borderStyle: "solid" }}
    >
      <img src={icon} alt="..." style={{ marginRight: 8 }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{ color: "#0076A3", fontSize: "11px", fontWeight: "bold" }}
        >
          {title}
        </span>
        <span style={{ color: "#777777", fontSize: 10 }}>{subtitle}</span>
      </div>
    </Button>
  );
}



class PropertyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      property: props.info,
      expand_manageUnits: false,
      curTab_manageUnits: 0,

      expand_manageService: false
    };
  }

  componentWillMount() {}

  handleExpanedChange = expand_str => (event, isExpanded) => {
    this.setState({ [expand_str]: isExpanded });
  };

  handleManageUnitTabChange = (event, newValue) => {
    this.setState({ curTab_manageUnits: newValue });
  };

  handleAddNewUnit = e => {
    e.stopPropagation();
  };

  handleEdit = () => {
    this.props.history.push({
      pathname: "/property/add-property",
      state: { property: this.state.property, editMode:true }
    })
  }

  overview = (
    <Table className={this.props.classes.table}>
      <TableHead>
        <TableRow>
          {overview_headRows.map((row, index) => (
            <TableCell key={row.id} align={"left"}>
              {row.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {/* {this.state.isLoading && (
              <p style={{ marginLeft: 20 }}>loading...</p>
            )}
            {tableData &&
                tableData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={
                      item.adsType === "offer"
                        ? classes.offer
                        : item.adsType === "demand"
                        ? classes.demand
                        : classes.exchange
                    }
                  >
                    <TableCell component="th" scope="row" align="left">
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell>
                    
                  </TableRow>
                ))} */}
      </TableBody>
    </Table>
  );

  stored_document = (
    <Table className={this.props.classes.table}>
      <TableHead>
        <TableRow>
          {storedDocument_headRows.map((row, index) => (
            <TableCell key={row.id} align={"left"}>
              {row.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {/* {this.state.isLoading && (
              <p style={{ marginLeft: 20 }}>loading...</p>
            )}
            {tableData &&
                tableData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={
                      item.adsType === "offer"
                        ? classes.offer
                        : item.adsType === "demand"
                        ? classes.demand
                        : classes.exchange
                    }
                  >
                    <TableCell component="th" scope="row" align="left">
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell>
                    
                  </TableRow>
                ))} */}
      </TableBody>
    </Table>
  );

  service_plan = (
    <Table className={this.props.classes.table}>
      <TableHead>
        <TableRow>
          {servicePlan_headRows.map((row, index) => (
            <TableCell key={row.id} align={"left"}>
              {row.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {/* {this.state.isLoading && (
              <p style={{ marginLeft: 20 }}>loading...</p>
            )}
            {tableData &&
                tableData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={
                      item.adsType === "offer"
                        ? classes.offer
                        : item.adsType === "demand"
                        ? classes.demand
                        : classes.exchange
                    }
                  >
                    <TableCell component="th" scope="row" align="left">
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell>
                    
                  </TableRow>
                ))} */}
      </TableBody>
    </Table>
  );

  render() {
    const { classes } = this.props;
    const {
      property,

      expand_manageUnits,
      expand_manageService,
      curTab_manageUnits
    } = this.state;
    const coverImage = property.photo
      ? config.apiBaseUrl + property.photo
      : "https://imanagerent.com/uploaded_images/gallery/small/a9/d6/e199e570d46402281a7549b90c23-5cec2399.jpg?20190810055957";
    return (
      <Paper style={{ padding: 8 }}>
        <Grid container direction="row" spacing={2}>
          <Grid item style={{}}>
            <div
              style={{
                width: 200,
                height: 220,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: "url(" + coverImage + ")",
                backgroundSize: "cover",
                backgroundPosition: "top center"
              }}
            >
              <Button variant="outlined" color="secondary" size="small" onClick={this.handleEdit}>
                Edit
              </Button>
            </div>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item style={{ flexGrow: 1 }}>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 400,
                        marginTop: 10,
                        marginBottom: 10
                      }}
                    >
                      {property.name}
                    </p>
                    <div style={{ marginBottom: 10 }}>
                      <strong style={{ fontSize: 16 }}>
                        {property.address}
                      </strong>
                      , {property.city} {property.zipcode}, {property.country}
                    </div>
                    <p
                      style={{
                        marginBottom: 10,
                        fontSize: 12,
                        color: "#888888"
                      }}
                    >
                      Residential property, no ret control
                    </p>
                    <Divider />
                    <p>Landlord: G.Jonathan</p>
                  </Grid>
                  <Grid item style={{ minWidth: 180 }}>
                    <p style={{ marginTop: 10, marginBottom: 0 }}>
                      ACCount AGING
                    </p>
                    <Divider style={{ marginBottom: 10 }} />
                    <p
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        marginBottom: 8
                      }}
                    >
                      $0.00 Current
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#EE0E00",
                        marginBottom: 8
                      }}
                    >
                      $0.00 Past Due
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        marginBottom: 8
                      }}
                    >
                      $0.00 Credit Balance
                    </p>
                    <div
                      style={{
                        width: "100%",
                        height: 1,
                        borderTopWidth: 1,
                        borderColor: "#BBBBBB",
                        borderTopStyle: "dotted"
                      }}
                    />
                    $0.00 Total
                  </Grid>
                  <Grid item style={{ minWidth: 140 }}>
                    <p style={{ marginTop: 10, marginBottom: 0 }}>STATS</p>
                    <Divider style={{ marginBottom: 10 }} />
                    <p
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        marginBottom: 8
                      }}
                    >
                      Active Units: 0
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        marginBottom: 8
                      }}
                    >
                      Listings: 0
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#666666",
                        marginBottom: 8
                      }}
                    >
                      Total Units: 2
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <GropButtons
                  icon={icon_listing}
                  title="Listings"
                  subtitle="0 active"
                />
                <GropButtons
                  icon={icon_inquires}
                  title="Inquires"
                  subtitle="0 active"
                />
                <GropButtons
                  icon={icon_application}
                  title="Applications"
                  subtitle="0 active"
                />
                <GropButtons
                  icon={icon_messages}
                  title="Messages"
                  subtitle="0 active"
                />
                <GropButtons
                  icon={icon_maintenance}
                  title="Maintenance"
                  subtitle="0 active"
                />
                <GropButtons
                  icon={icon_freports}
                  title="Reports"
                  subtitle="0 active"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="column" style={{ marginTop: 8 }}>
          <Grid item>
            <ExpansionPanel
              expanded={expand_manageUnits}
              onChange={this.handleExpanedChange("expand_manageUnits")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="units-content"
                id="manage-units"
              >
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography className={classes.heading}>
                    Manage Units & Tenants
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={this.handleAddNewUnit}
                  >
                    Add New Units
                  </Button>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={curTab_manageUnits}
                    onChange={this.handleManageUnitTabChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                  >
                    <Tab label="Overview" />
                    <Tab label="Stored Documents" />
                    <Tab label="Photos" />
                    <Tab label="Service Plans" />
                  </Tabs>
                  <div>
                    {curTab_manageUnits === 0 && this.overview}
                    {curTab_manageUnits === 1 && this.stored_document}
                    {curTab_manageUnits === 3 && this.service_plan}
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item>
            <ExpansionPanel
              expanded={expand_manageService}
              onChange={this.handleExpanedChange("expand_manageService")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="service-content"
                id="manage-service"
              >
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography className={classes.heading}>
                    Manage Service Provider
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={this.handleAddNewUnit}
                  >
                    Add Provider
                  </Button>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={{ display: "flex", alignItems: "center" }}>
                  No serivce provider added
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </Paper>
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
)(withStyles(styles)(withRouter(PropertyCard)));
