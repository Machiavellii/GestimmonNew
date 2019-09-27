import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import axios from 'axios';
import config from '../../config/config';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import t from '../../constants/language';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { withRouter } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { FormatIndentDecrease } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AdsDetail from 'containers/AdsDetail/AdsDetail';

import { formatNumber } from 'utils/index';

const styles = theme => ({
  toolbar: theme.mixins.toolbar,

  card: {
    maxWidth: 300
  },
  media: {
    height: 200
  },
  cardContentLine: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0)
  },
  card_list: {
    maxWidth: 988,
    display: 'flex',
    flexDirection: 'row'
  },
  card_details: {
    // display: "flex",
    // flexDirection: "row"
  },
  media_list: {
    width: 320,
    height: 280
  },

  itemsCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeMark: {
    textAlign: 'center',
    position: 'absolute',
    top: 16,
    left: 16,
    display: 'flex',
    zIndex: 100,
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    transform: 'rotate(-30deg)',
    boxShadow:
      '0 4px 5px -2px rgba(0,0,0,.2), 0 7px 10px 1px rgba(0,0,0,.14), 0 2px 16px 1px rgba(0,0,0,.12)',
    fontWeight: 'bold'
  },
  typeMark_Sale: {
    color: '#fff',
    backgroundColor: 'rgb(36, 123, 160)'
  },
  typeMark_Rent: {
    color: '#fff',
    backgroundColor: 'rgb(221, 44, 0)'
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class AdsCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDetailDlg: false
    };
  }

  getPhotoUrl = () => {
    try {
      const { photoThumbs } = this.props.info;
      if (photoThumbs.length > 0 && photoThumbs[0]) {
        if (photoThumbs[0].startsWith('http')) return photoThumbs[0];
        else return config.apiBaseUrl + '/' + photoThumbs[0];
      }
      // const { photos } = this.props.info.photos[0];
      // if (photos[0]) {
      //   if (photos[0].startsWith("http")) return photos[0];
      //   else return config.apiBaseUrl + "/" + photos[0];
      // }
    } catch (err) {
      //  console.log("getphotoUrl err:", err);
    }
    return '';
  };

  handleDetail = () => {
    this.setState({ isDetailDlg: true });
  };

  handleFavorite = e => {
    e.stopPropagation();
  };
  render() {
    const { isDetailDlg, detailAds_id } = this.state;
    const { classes, viewType } = this.props;
    const {
      photos,
      type,
      title,
      ref,
      subtitle,
      city,
      room,
      floor,
      charge,
      visitedNum,
      price,
      surface
    } = this.props.info;
    const typeMarkExt =
      type === 'rent' ? classes.typeMark_Rent : classes.typeMark_Sale;

    var totalPrice = 0;
    if (parseInt(price)) totalPrice += parseInt(price);
    if (parseInt(charge)) totalPrice += parseInt(charge);

    const adsCard_normal = () => {
      return (
        <Card className={classes.card}>
          <CardActionArea onClick={this.handleDetail}>
            <div className={classes.typeMark + ' ' + typeMarkExt}>
              <span>{type}</span>
            </div>
            <CardMedia
              className={classes.media}
              image={this.getPhotoUrl()}
              title={title}
              
            />

            <CardContent> 
              <Typography gutterBottom variant="h6" component="h6">
                {title.length > 45 ? (
                <span>{title.slice(0,45) + "..."}</span>
                ) : (
                  <span>{title}</span>
                )}
              </Typography>
              <GridContainer>
                {ref && <GridItem xs={12}>{ref.join('.')}</GridItem>}
                <GridItem xs={12}>
                  <p className={classes.cardContentLine}>
                    <strong>{t[this.props.lang].city}: </strong>
                    <span>{city}</span>
                  </p>
                </GridItem>
                <GridItem xs={12}>
                  <p className={classes.cardContentLine}>
                    <strong>{t[this.props.lang].room}: </strong>
                    <span>{room}</span>
                  </p>
                </GridItem>
                <GridItem xs={12}>
                  <p className={classes.cardContentLine}>
                    <strong>{t[this.props.lang].floor}: </strong>
                    <span>{floor}</span>
                  </p>
                </GridItem>
                <GridItem xs={12}>
                  <p className={classes.cardContentLine}>
                    <strong>{t[this.props.lang].charge}: </strong>
                    <span>{charge}</span>
                  </p>
                </GridItem>
                <GridItem xs={12}>
                  <p className={classes.cardContentLine}>
                    <strong>{'Visited'}: </strong>
                    <span>{visitedNum}</span>
                  </p>
                </GridItem>
              </GridContainer>
            </CardContent>
          </CardActionArea>
          {/* <CardActions> */}
          <GridContainer style={{ margin: 8 }}>
            <GridItem xs={5} className={classes.itemsCenter}>
              <span>{formatNumber(totalPrice)} CHF</span>
            </GridItem>
            <GridItem xs={2} className={classes.itemsCenter}>
              <span>
                {surface}m<sup>2</sup>
              </span>
            </GridItem>
            <GridItem xs={5} className={classes.itemsCenter}>
              <Button size="small" color="secondary" variant="text">
                <FavoriteBorder />
              </Button>
            </GridItem>
          </GridContainer>
          {/* </CardActions> */}
        </Card>
      );
    };

    const adsCard_ListView = () => {
      return (
        <Card className={classes.card_list} onClick={this.handleDetail}>
          <CardMedia
            className={classes.media_list}
            image={this.getPhotoUrl()}
            title={title}
            style={{ position: 'relative', backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            <div className={classes.typeMark + ' ' + typeMarkExt}>
              <span>{type}</span>
            </div>
          </CardMedia>
          {/* <CardActionArea onClick={this.handleDetail}> */}
          <CardContent style={{ width: 600 }}>
            <GridContainer style={{ height: '100%' }}>
              <GridItem xs={12}>
                <Typography gutterBottom variant="h5" component="h2">
                  {title}
                </Typography>
              </GridItem>
              <GridItem xs={12}>{ref.join('.')}</GridItem>
              <GridItem xs={6}>
                <p className={classes.cardContentLine}>
                  <strong>{t[this.props.lang].city}: </strong>
                  <span>{city}</span>
                </p>
              </GridItem>
              <GridItem xs={6}>
                <p className={classes.cardContentLine}>
                  <strong>{t[this.props.lang].room}: </strong>
                  <span>{room}</span>
                </p>
              </GridItem>
              <GridItem xs={4}>
                <p className={classes.cardContentLine}>
                  <strong>{t[this.props.lang].floor}: </strong>
                  <span>{floor}</span>
                </p>
              </GridItem>
              <GridItem xs={4}>
                <p className={classes.cardContentLine}>
                  <strong>{t[this.props.lang].charge}: </strong>
                  <span>{charge}</span>
                </p>
              </GridItem>
              <GridItem xs={4}>
                <p className={classes.cardContentLine}>
                  <strong>{'Visited'}: </strong>
                  <span>{visitedNum}</span>
                </p>
              </GridItem>
              {/* <GridItem xs={12} style={{flexGrow:1}}></GridItem> */}
              <GridItem xs={4} className={classes.itemsCenter}>
                <span>{price}CHF</span>
              </GridItem>
              <GridItem xs={4} className={classes.itemsCenter}>
                <span>
                  {surface}m<sup>2</sup>
                </span>
              </GridItem>
              <GridItem xs={4} className={classes.itemsCenter}>
                <Button
                  size="small"
                  color="secondary"
                  variant="text"
                  onClick={e => this.handleFavorite(e)}
                >
                  <FavoriteBorder />
                </Button>
              </GridItem>
            </GridContainer>
          </CardContent>
          {/* </CardActionArea> */}
        </Card>
      );
    };
    return (
      <div style={{ padding: 8 }}>
        {viewType === 1 ? adsCard_ListView() : adsCard_normal()}
        <Dialog
          fullScreen
          open={isDetailDlg}
          onClose={() => this.setState({ isDetailDlg: false })}
        >
          <AdsDetail
            ads_id={this.props.info._id}
            permission={this.props.permission ? this.props.permission : 1} //1:user, 2:owner
            onBack={() => this.setState({ isDetailDlg: false })}
          />
        </Dialog>
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
)(withStyles(styles)(withRouter(AdsCard)));
