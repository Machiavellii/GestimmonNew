import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import t from '../../constants/language';
import Grid from '@material-ui/core/Grid';

import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import IconButton from '@material-ui/core/IconButton';

import SearchSidebar from 'components/SearchSidebar/SearchSidebar.jsx';
import ScrollUpButton from 'react-scroll-up-button';
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import ProgressShow from 'components/ProgressShow/ProgressShow';

import {
  ArrowForward,
  ArrowBack,
  PhotoCamera,
  AccountCircle,
  Search,
  Email,
  Phone
} from '@material-ui/icons';

import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import windowSize from 'react-window-size';

import AdsCard from 'components/adscard';
import * as api from 'service/Api';
import { isAuthenticated } from 'service/authentication';

import { Divider } from '@material-ui/core';
import Input from '@material-ui/core/Input';

import { Link } from 'react-router-dom';

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
  group: {
    margin: theme.spacing(1, 0)
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1)
    // width: 400,
  },

  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  viewContainer: {
    width: 'calc(100% - 260px)',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  view_active: {
    color: '#26c6da'
  },
  view_deactive: {
    color: '#757575'
  }
});
const DEFAULT_SHOW_LIMIT = 20;
const SHOW_MORE_COUNT = 20;
class SearchAds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchedAds: [],
      showLimit: DEFAULT_SHOW_LIMIT,
      showLoadMoreBtn: false,
      isLoading: false,

      isDetailDlg: false,
      detailAds_id: '',
      viewType: 0,

      searchOption: null,
      totalAdsCount: 0,
      searchKey: '',

      anibis: true,
      unload: true
    };
  }

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleSearch = async (searchOption, isLoadMore = false) => {
    if (!isLoadMore) {
      this.setState({ totalAdsCount: -1 });
      searchOption.anibis = this.state.anibis; //----------------
      searchOption.unload = this.state.unload; //----------------

      if (!isAuthenticated()) {
        api
          .getTotalAdsCountSimple(searchOption)
          .then(result => {
            if (result.status) {
              this.setState({ totalAdsCount: result.data });
            }
          })
          .catch(err => {
            console.log('getToalAdsCount Err: ', err);
          });
      } else {
        api
          .getTotalAdsCount(searchOption)
          .then(result => {
            if (result.status) {
              this.setState({ totalAdsCount: result.data });
            }
          })
          .catch(err => {
            console.log('getToalAdsCount Err: ', err);
          });
      }
    }
    this.setState({ searchOption: searchOption });
    if (!searchOption.pagination_skip) searchOption.pagination_skip = 0;
    if (!searchOption.pagination_limit)
      searchOption.pagination_limit = DEFAULT_SHOW_LIMIT;
    if (!isLoadMore) {
      this.setState({ showLimit: DEFAULT_SHOW_LIMIT });
    }
    let result;
    this.setState({ isLoading: true });
    if (!isAuthenticated()) {
      result = await api.searchSimpleAds(searchOption);
    } else {
      result = await api.searchAds(searchOption);
    }
    this.setState({ isLoading: false });
    if (result.status) {
      this.setState({
        searchedAds: isLoadMore
          ? this.state.searchedAds.concat(result.data)
          : result.data,
        showLoadMoreBtn: result.data.length === DEFAULT_SHOW_LIMIT
      });

      // NotificationManager.success(result.data.length);
    } else {
      NotificationManager.error('Failed');
    }
    return result;
  };

  handleLoadMore = async () => {
    var searchOption = this.state.searchOption;
    searchOption.pagination_skip = this.state.showLimit;
    searchOption.pagination_limit = SHOW_MORE_COUNT;
    const result = await this.handleSearch(searchOption, true);
    if (result.status) {
      this.setState({
        showLimit: this.state.showLimit + SHOW_MORE_COUNT,
        searchOption: searchOption
      });
    }
  };

  handleDetailView = ads_id => {
    this.setState({ isDetailDlg: true, detailAds_id: ads_id });
  };

  handleViewType = type => {
    this.setState({ viewType: type });
  };

  handleCheckboxAnibis = () => {
    this.setState({ anibis: !this.state.anibis }, function() {
      this.handleSearch(this.state.searchOption);
    });
  };
  handleCheckboxUnload = () => {
    this.setState({ unload: !this.state.unload }, function() {
      this.handleSearch(this.state.searchOption);
    });
  };

  handleSearchBar = e => {
    var key = e.target.value;
    this.setState({ searchKey: key });
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      var searchOption = this.state.searchOption;
      searchOption.searchKey = key;
      const result = await this.handleSearch(searchOption);
      if (result.status) {
      }
    }, 1000);
  };
  render() {
    const { classes } = this.props;
    const {
      isLoading,
      searchedAds,
      showLimit,
      viewType,
      showLoadMoreBtn,
      totalAdsCount,
      searchKey
    } = this.state;

    return (
      <Container fixed>
        <Header
          color="info"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: 'white'
          }}
        />
        <div className={classes.toolbar} />
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          style={{ paddingTop: 30 }}
        >
          <Grid item style={{ width: 'auto' }}>
            <SearchSidebar handleSearch={this.handleSearch} />
          </Grid>
          <Grid item className={classes.viewContainer}>
            <ScrollUpButton
              StopPosition={0}
              ShowAtPosition={150}
              EasingType="easeOutCubic"
              AnimationDuration={500}
              ContainerClassName=""
              TransitionClassName="ScrollUpButton__Toggled"
              style={{}}
              ToggledStyle={{}}
            />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={{ paddingRight: 20 }}
            >
              {totalAdsCount >= 0 && (
                <Grid item>
                  <p style={{ marginLeft: 16 }}>
                    {t[this.props.lang].result}: {totalAdsCount}
                  </p>
                </Grid>
              )}
              <div style={{ flexGrow: 1 }} />
              <Grid item>
                <FormControl
                  className={classes.margin}
                  style={{ marginRight: 8 }}
                >
                  {/* <InputLabel htmlFor="input-with-icon-adornment">
                    With a start adornment
                  </InputLabel> */}

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
              </Grid>
              <Grid item>
                <FormControlLabel
                  className={classes.checkbox}
                  control={
                    <Checkbox
                      checked={this.state.anibis}
                      onChange={() => this.handleCheckboxAnibis('anibis')}
                      value=""
                      color="primary"
                    />
                  }
                  label="Anibis"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  className={classes.checkbox}
                  control={
                    <Checkbox
                      checked={this.state.unload}
                      onChange={() => this.handleCheckboxUnload('unload')}
                      value=""
                      color="primary"
                    />
                  }
                  label="My Ads"
                />

                {/* <Link to="myAds">My Ads</Link> */}
              </Grid>
              <Grid item>
                <IconButton
                  className={
                    viewType === 0 ? classes.view_active : classes.view_deactive
                  }
                  onClick={() => this.handleViewType(0)}
                >
                  <ViewModuleIcon fontSize="default" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={
                    viewType === 1 ? classes.view_active : classes.view_deactive
                  }
                  onClick={() => this.handleViewType(1)}
                >
                  <ViewListIcon fontSize="default" />
                </IconButton>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              direction={viewType === 1 ? 'column' : 'row'}
              justify="flex-start"
              alignItems="flex-start"
            >
              {searchedAds &&
                searchedAds.map((item, index) => {
                  if (index < showLimit) {
                    if (viewType === 1) {
                      return (
                        <Grid item key={index} xs={12}>
                          <AdsCard
                            info={item}
                            permission={1}
                            viewType={viewType}
                          />
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item key={index}>
                          <AdsCard
                            info={item}
                            permission={1}
                            viewType={viewType}
                          />
                        </Grid>
                      );
                    }
                  }
                  return null;
                })}
            </Grid>
            {searchedAds.length > 0 && showLoadMoreBtn && (
              <GridContainer>
                <GridItem
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    style={{ margin: 10 }}
                    variant="contained"
                    color="primary"
                    onClick={this.handleLoadMore}
                  >
                    {t[this.props.lang].load_more} +{SHOW_MORE_COUNT}
                    {/* ({searchedAds.length - showLimit}) */}
                  </Button>
                </GridItem>
              </GridContainer>
            )}
          </Grid>
        </Grid>
        <ProgressShow
          open={isLoading}
          onClose={() => this.setState({ isLoading: false })}
        />
      </Container>
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
)(withStyles(styles)(windowSize(SearchAds)));
