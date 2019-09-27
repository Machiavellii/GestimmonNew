import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import t from "../../constants/language";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Container from "@material-ui/core/Container";
import Header from "components/Header/Header";
import HeaderLinks from "components/Header/HeaderLinks";

const styles = theme =>({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      },
      nested: {
        paddingLeft: theme.spacing(4),
      }
});

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        const { classes } = this.props;
        return(
            <div style={{ padding: 8, width: 240 }}>
                <Header
                    color="secondary"
                    brand="Gestimmo"
                    rightLinks={<HeaderLinks />}
                    fixed
                />
                <div className={classes.toolbar} />
                <h2>Contact categories</h2>
                <Container>
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                Name
                            </ListSubheader>
                        }
                        className={classes.root}
                        >
                        <ListItem button>
                            <ListItemText primary="Landlord" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Customers" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Custom Category 1" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Custom Category 2" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Suppliers" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="Partner" />
                        </ListItem>
                    </List>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      lang: state.menu.lang
    };
  };
  
  export default connect(mapStateToProps)(withStyles(styles)(Categories));