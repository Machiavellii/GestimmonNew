import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import t from '../../constants/language';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DatePicker } from '@material-ui/pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import SearchSidebar from 'components/SearchSidebar/SearchSidebar.jsx';
import ScrollUpButton from 'react-scroll-up-button';
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import {
  ArrowForward,
  ArrowBack,
  PhotoCamera,
  AccountCircle,
  Email,
  Phone
} from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import FileDrop from 'react-file-drop';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import windowSize from 'react-window-size';
import Fade from '@material-ui/core/Fade';

import AdsCard from 'components/adscard';
import * as api from 'service/Api';
import { isAuthenticated } from 'service/authentication';
import ProgressShow from 'components/ProgressShow/ProgressShow';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from 'react-device-detect';
import { Divider } from '@material-ui/core';

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
  }
});
const DEFAULT_SHOW_LIMIT = 100;
const SHOW_MORE_COUNT = 20;

class MyAds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchedAds: [],
      showLimit: DEFAULT_SHOW_LIMIT,
      showLoadMoreBtn: false,
      isLoading: false
    };
  }

  componentWillMount() {
    this.handleSearch({});
  }

  handleInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleSearch = async searchOption => {
    let result;

    if (!isAuthenticated()) {
      return;
    }
    this.setState({ isLoading: true });
    result = await api.MyAds(searchOption);

    this.setState({ isLoading: false });
    if (result.status) {
      this.setState({
        searchedAds: result.data,
        showLimit: DEFAULT_SHOW_LIMIT
      });
      // NotificationManager.success(result.data.length);
    } else {
      NotificationManager.error('Failed');
    }
  };

  handleLoadMore = () => {
    this.setState({ showLimit: this.state.showLimit + SHOW_MORE_COUNT });
  };
  render() {
    const { classes } = this.props;
    const { searchedAds, showLimit, isLoading } = this.state;
    // console.log(searchedAds);
    return (
      <div>
        <ProgressShow
          open={isLoading}
          onClose={() => this.setState({ isLoading: false })}
        />
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
        <Container>
          <ScrollUpButton
            StopPosition={0}
            ShowAtPosition={150}
            EasingType="easeOutCubic"
            AnimationDuration={500}
            ContainerClassName={{ backgroundColor: 'red' }}
            TransitionClassName="ScrollUpButton__Toggled"
            style={{}}
            ToggledStyle={{}}
          />
          <GridContainer>
            <GridItem>
              <p style={{ marginLeft: 16 }}>Your Ads: {searchedAds.length}</p>
            </GridItem>
          </GridContainer>
          <Divider />
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {searchedAds &&
              searchedAds.map((item, index) => {
                if (index < showLimit) {
                  return (
                    <Grid item key={index}>
                      <AdsCard info={item} permission={2} />
                    </Grid>
                  );
                }
                return null;
              })}
          </Grid>
          {searchedAds.length > 0 && showLimit < searchedAds.length && (
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
                  Load More ({searchedAds.length - showLimit})
                </Button>
              </GridItem>
            </GridContainer>
          )}
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
)(withStyles(styles)(windowSize(MyAds)));
