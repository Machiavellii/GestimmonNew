import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { connect } from 'react-redux';
import t from '../../constants/language';

import Typography from '@material-ui/core/Typography';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import * as constants from 'constants/data.json';

// import AdsCount from '../../service/Api';
import * as api from 'service/Api';
import isAuthenticated from '../../service/authentication';

const styles = theme => ({
  card: {
    maxWidth: 345
  },
  media: {
    height: 200
  },
  cardContentLine: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0)
  },
  itemsCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedItem: {
    backgroundColor: '#bdbdbd'
  }
});

class SearchSidebar extends Component {
  constructor(props) {
    super(props);
    const { adsInfo } = this.props;
    this.state = {
      // cityList: ["All", "Pully", "Renens", "Lausanne", "Bussigny"],
      cityList: constants.cityList,
      city: '',
      cityIndex: 0,
      type: 'rent', //sale
      floor_min: 0,
      floor_max: 0,
      piece_min: 0,
      piece_max: 0,
      price_min: 0,
      price_max: 0,
      surface_min: 0,
      surface_max: 0,
      price_currency: 'CHF',

      categoryIndex: 0,
      propertyIndex: 0,
      swissCantons: [],
      franceCantons: [],
      swissCities: [],
      franceCities: [],
      canton: ''
    };
  }

  componentDidMount() {
    this.requestSearch();
  }

  requestSearch = () => {
    console.log('requestSearch called');
    this.props.handleSearch({
      city: this.state.city,
      type: this.state.type, //sale
      floor_min: this.state.floor_min,
      floor_max: this.state.floor_max,
      piece_min: this.state.piece_min,
      piece_max: this.state.piece_max,
      price_min: this.state.price_min,
      price_max: this.state.price_max,
      surface_min: this.state.surface_min,
      surface_max: this.state.surface_max,
      category: this.state.categoryIndex,
      property: this.state.propertyIndex,
      price_currency: this.state.price_currency
    });
  };

  handleInput = input => e => {
    const requestSearch = this.requestSearch;
    this.setState(
      { [input]: e.target.value }
      // , function() {
      // requestSearch();}
    );
    clearTimeout(this.timer);
    this.timer = setTimeout(this.requestSearch, 800);
  };

  handleCategory = (item, index) => {
    if (this.state.categoryIndex !== index) {
      const requestSearch = this.requestSearch;
      this.setState({ categoryIndex: index, propertyIndex: 0 }, function() {
        requestSearch();
      });
    }
  };

  handleProperty = (item, index) => {
    this.setState({ propertyIndex: index }, function() {
      this.requestSearch();
    });
  };

  handleCity = (item, index) => {
    this.setState({ city: item, cityIndex: index }, function() {
      this.requestSearch();
    });
  };

  handleSwiss = async () => {
    let res;

    this.setState({ swissCantons: constants.cantonsList });
    this.setState({ franceCantons: [] });
    this.setState({ franceCities: [] });
    console.log(constants.cantonsList[5]);
    
    res = await api.AdsCount(constants.cantonsList[5]);

  };

  handleSwissCities = i => {
    if (constants.cantonsList[i]) {
      this.setState({ swissCities: constants.cityList[i] });
      this.setState({ franceCities: [] });
      this.setState({ franceCantons: [] });
    }
  };
  handleFrance = () => {
    this.setState({ franceCantons: constants.frCantonList });
    this.setState({ swissCantons: [] });
    this.setState({ swissCities: [] });
  };

  handleFranceCities = i => {
    if (constants.frCantonList[i]) {
      this.setState({ franceCities: constants.frCityList[i] });
      this.setState({ swissCities: [] });
      this.setState({ swissCantons: [] });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      cityList,
      city,
      cityIndex,
      type, //sale
      floor_min,
      floor_max,
      piece_min,
      piece_max,
      surface_min,
      surface_max,
      price_min,
      price_max,
      price_currency,

      categoryIndex,
      propertyIndex,
      swissCantons,
      swissCities,
      franceCantons,
      franceCities
    } = this.state;

    return (
      <div style={{ padding: 8, width: 240 }}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id="type">
            <Typography className={classes.heading}>
              {t[this.props.lang].type}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RadioGroup
              name="type"
              className={classes.group}
              value={type}
              onChange={this.handleInput('type')}
            >
              <FormControlLabel
                value="rent"
                control={<Radio color="primary" />}
                label={t[this.props.lang].rent}
                labelPlacement="end"
              />
              <FormControlLabel
                value="sale"
                control={<Radio color="primary" />}
                label={t[this.props.lang].buy}
                labelPlacement="end"
              />
            </RadioGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="category-content"
            id="category"
          >
            <Typography className={classes.heading}>
              {t[this.props.lang].category}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
              style={{ width: '100%' }}
            >
              <ListItem
                button
                key={0}
                onClick={() => this.handleCategory('', 0)}
                className={0 === categoryIndex && classes.selectedItem}
              >
                {'Any'}
              </ListItem>
              {constants.categoryList[this.props.lang].map((item, index) => (
                <ListItem
                  button
                  key={index + 1}
                  className={
                    index + 1 === categoryIndex && classes.selectedItem
                  }
                  onClick={() => this.handleCategory(item, index + 1)}
                >
                  {item}
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {categoryIndex > 0 &&
          constants.propertyList[this.props.lang][categoryIndex - 1].length >
            0 && (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="property-content"
                id="propert"
              >
                <Typography className={classes.heading}>
                  {t[this.props.lang].property}
                </Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  className={classes.root}
                  style={{ width: '100%' }}
                >
                  <ListItem
                    button
                    key={0}
                    className={0 === propertyIndex && classes.selectedItem}
                    onClick={() => this.handleProperty('', 0)}
                  >
                    {'Any'}
                  </ListItem>
                  {constants.propertyList[this.props.lang][
                    categoryIndex - 1
                  ].map((item, index) => (
                    <ListItem
                      button
                      key={index + 1}
                      className={
                        index + 1 === propertyIndex && classes.selectedItem
                      }
                      onClick={() => this.handleProperty(item, index + 1)}
                    >
                      {item}
                    </ListItem>
                  ))}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="country-content"
            id="country"
          >
            <Typography className={classes.heading}>
              {t[this.props.lang].country}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
              style={{ width: '100%' }}
            >
              <ListItem button onClick={() => this.handleSwiss()}>
                {constants.countryList2[this.props.lang][0]}
              </ListItem>
              <ListItem button onClick={() => this.handleFrance()}>
                {constants.countryList2[this.props.lang][1]}
              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="cantons-content"
            id="cantons"
          >
            <Typography className={classes.heading}>
              {t[this.props.lang].canton}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
              style={{ width: '100%' }}
            >
              {swissCantons.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  className={
                    index + 1 === categoryIndex && classes.selectedItem
                  }
                  onClick={() => this.handleSwissCities(index)}
                >
                  {item}
                </ListItem>
              ))}

              {franceCantons.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  className={
                    index + 1 === categoryIndex && classes.selectedItem
                  }
                  onClick={() => this.handleFranceCities(index)}
                >
                  {item}
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="near-content"
            id="near"
          >
            <Typography className={classes.heading}>
              {t[this.props.lang].city}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
              style={{ width: '100%' }}
            >
              {swissCities.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  className={index === cityIndex && classes.selectedItem}
                  onClick={() => this.handleCity(item, index)}
                >
                  {item}
                </ListItem>
              ))}

              {franceCities.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  className={index === cityIndex && classes.selectedItem}
                  onClick={() => this.handleCity(item, index)}
                >
                  {item}
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id="floor">
            <Typography className={classes.heading}>
              {t[this.props.lang].floor}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridContainer>
              <GridItem xs={6}>
                <TextField
                  id="floor-min"
                  label={t[this.props.lang].min}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={floor_min}
                  onChange={this.handleInput('floor_min')}
                  fullWidth
                  type="number"
                />
              </GridItem>
              <GridItem xs={6}>
                <TextField
                  id="floor-max"
                  label={t[this.props.lang].max}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={floor_max}
                  onChange={this.handleInput('floor_max')}
                  fullWidth
                  type="number"
                />
              </GridItem>
            </GridContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id="surface">
            <Typography className={classes.heading}>
              {t[this.props.lang].surface}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridContainer>
              <GridItem xs={6}>
                <TextField
                  id="surface-min"
                  label={t[this.props.lang].min}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={surface_min}
                  onChange={this.handleInput('surface_min')}
                  fullWidth
                  type="number"
                />
              </GridItem>
              <GridItem xs={6}>
                <TextField
                  id="surface-max"
                  label={t[this.props.lang].max}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={surface_max}
                  onChange={this.handleInput('surface_max')}
                  fullWidth
                  type="number"
                />
              </GridItem>
            </GridContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id="piece">
            <Typography className={classes.heading}>
              {t[this.props.lang].room}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridContainer>
              <GridItem xs={6}>
                <TextField
                  id="piece-min"
                  label={t[this.props.lang].min}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={piece_min}
                  onChange={this.handleInput('piece_min')}
                  fullWidth
                  type="number"
                />
              </GridItem>
              <GridItem xs={6}>
                <TextField
                  id="piece-max"
                  label={t[this.props.lang].max}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={piece_max}
                  onChange={this.handleInput('piece_max')}
                  fullWidth
                  type="number"
                />
              </GridItem>
            </GridContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id="price">
            <Typography className={classes.heading}>
              {t[this.props.lang].price} ({price_currency})
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridContainer>
              <GridItem xs={6}>
                <TextField
                  id="price-min"
                  label={t[this.props.lang].min}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={price_min}
                  onChange={this.handleInput('price_min')}
                  fullWidth
                  type="number"
                />
              </GridItem>
              <GridItem xs={6}>
                <TextField
                  id="price-max"
                  label={t[this.props.lang].max}
                  placeholder=""
                  className={classes.textField}
                  margin="normal"
                  value={price_max}
                  onChange={this.handleInput('price_max')}
                  fullWidth
                  type="number"
                />
              </GridItem>
            </GridContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(SearchSidebar));
