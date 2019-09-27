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
import Cancel from '@material-ui/icons/Cancel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import {
  ArrowForward,
  ArrowBack,
  PhotoCamera,
  AccountCircle,
  Email,
  Phone
} from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import FileDrop from 'react-file-drop';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import windowSize from 'react-window-size';
import GoogleMapManager from 'components/GoogleMap/GoogleMap.jsx';
import './style.css';
import {
  countryList,
  categoryList,
  propertyList,
  proximiteList,
  facilityList,
  outdoorEquipList,
  interiorEquipList,
  otherEquipList,
  soilList,
  expositionList,
  viewsList,
  sunshineList,
  cantonsList,
  cityList
} from 'constants/data.json';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from 'react-device-detect';
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import Autocomplete from 'react-google-autocomplete';
import * as api from 'service/Api';
import { getUserInfo } from 'service/authentication';
import config from '../../config/config';
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
  dropContainer: {
    border: '2px solid black',
    borderStyle: 'dashed',
    // width: "100%",
    color: 'black',
    padding: 10
  },
  dropStyle: {
    '$file-drop-target': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
});

const steps = [
  ['1.Advertisement', '2.Extra Detail', '3.Photos', '4.Contact'],
  ['1.Inscription', '2.Extra détails', '3.Photos', '4.Contact'],
  ['1.Advertentie', '2.Extra details', '3.Fotos', '4.Contact'],
  ['1.Annuncio pubblicitario', '2.Dettagli extra', '3.Fotografie', '4.Contatto']
];
class CreateAds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //stepper
      step: 0,
      //step1
      title: '',
      description: '',
      country: -1,
      canton: -1,
      city: -1,
      zipcode: '',
      street: '',
      location: '',
      type: '',
      category: -1,
      property: -1,
      surface: '',
      floor: '',
      room: '',
      dateType: 0,
      limitDate: null,
      price: 0,
      charge: 0,
      priceType: 1,
      //step2
      extraList: [],
      propertyList: [],
      proximiteList: [],
      facilityList: [],
      outdoorEquipList: [],
      interiorEquipList: [],
      otherEquipList: [],
      soilList: [],
      expositionList: [],
      viewsList: [],
      sunshineList: [],
      //step3
      selectedImages: [],
      selectedImagesUrl: [],
      //step4
      fullname: '',
      phonenumber: '',
      email: '',
      visit_name: '',
      visit_phone: '',
      visit_email: '',
      mand_name: '',
      mand_phone: '',
      mand_email: '',

      swissCitiesList: [],
      rotation: 0,
      imgTitle: '',

      //others
      expanded: false,

      //errors
      errors: {
        //step1
        title: false,
        description: false,
        country: false,
        canton: false,
        city: false,
        zipcode: false,
        street: false,
        location: false,
        type: false,
        category: false,
        // property: ,
        surface: false,
        floor: false,
        room: false,
        dateType: false,
        limitDate: false,
        price: false,
        charge: false,
        priceType: false,
        //step2

        //step4
        fullname: false,
        phonenumber: false,
        email: false,
        // visit_name: false,
        // visit_phone: false,
        // visit_email: false,
        // mand_name: false,
        // mand_phone: false,
        // mand_email: false,
        imgTitle: false
      },
      step1Validation: false,
      step2Validation: false,
      step3Validation: false,
      step4Validation: false,

      isLoadDlg: false,
      editMode: false,

      isChanged: false
    };
  }

  componentWillMount() {
    console.log('createAds_willmount', this.props);
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.adsInfo
    ) {
      this.loadStateWithProps();
    } else {
      if (this.isExistSavedState()) {
        this.setState({ isLoadDlg: true });
      } else {
      }
    }
  }
  componentWillUnmount() {
    if (!this.state.editMode) {
      const {
        title,
        description,
        country,
        canton,
        city,
        zipcode,
        street,
        location,
        type,
        category,
        property,
        surface,
        floor,
        room,
        dateType,
        limitDate,
        price,
        charge,
        priceType
      } = this.state;
      if (this.state.step > 0 || this.state.isChanged) {
        console.log('saveState', this.state.step, this.state.isChanged);
        this.saveState(this.state);
      }
    }
  }

  initExtraList(extra) {
    if (extra && extra[0]) {
      var extraList = extra[0].extraList;
      if (extraList.length === 9) {
        this.setState({
          proximiteList: extraList[0],
          facilityList: extraList[1],
          outdoorEquipList: extraList[2],
          interiorEquipList: extraList[3],
          otherEquipList: extraList[4],
          soilList: extraList[5],
          expositionList: extraList[6],
          viewsList: extraList[7],
          sunshineList: extraList[8]
        });
      }
    }
    return [];
  }
  loadStateWithProps() {
    const { adsInfo } = this.props.location.state;

    this.setState({
      //stepper
      step: 0,
      //step1
      title: adsInfo.title,
      description: adsInfo.description,
      country: adsInfo.country - 1,
      canton: adsInfo.canton - 1,
      city: adsInfo.city - 1,
      zipcode: adsInfo.zipcode,
      street: adsInfo.street,
      location: adsInfo.location,
      type: adsInfo.type,
      category: adsInfo.category - 1,
      property: adsInfo.property - 1,
      surface: adsInfo.surface,
      floor: adsInfo.floor,
      room: adsInfo.room,
      dateType: adsInfo.dateType,
      limitDate: adsInfo.availableDate,
      price: adsInfo.price,
      charge: adsInfo.charge,
      priceType: adsInfo.currency,
      //step2
      extraList: this.initExtraList(adsInfo.extra),
      //step3
      // selectedImages: adsInfo.photos.length > 0 ? adsInfo.photos[0].photos : [],
      selectedImagesUrl:
        adsInfo.photos.length > 0 ? adsInfo.photos[0].photos : [],
      //step4
      fullname:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].fullname : '',
      phonenumber:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].phonenumber : '',
        email: adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].email : '',
        
        visit_name:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].visit_name : '',
        visit_phone:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].visit_phone : '',
        visit_email:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].visit_email : '',
        mand_name:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].mand_name : '',
        mand_phone:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].mand_phone : '',
        mand_email:
        adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].mand_email : '',
        imgTitle:
          adsInfo.advertiser.length > 0 ? adsInfo.advertiser[0].imgTitle : '',
        //others
        expanded: false,
        
        //errors
      errors: {
        //step1
        title: false,
        description: false,
        country: false,
        canton: false,
        city: false,
        zipcode: false,
        street: false,
        location: false,
        type: false,
        category: false,
        // property: ,
        surface: false,
        floor: false,
        room: false,
        dateType: false,
        limitDate: false,
        price: false,
        charge: false,
        priceType: false,
        //step2

        //step4
        fullname: false,
        phonenumber: false,
        email: false,
        // visit_name: false,
        // visit_phone: false,
        // visit_email: false,
        // mand_name: false,
        // mand_phone: false,
        // mand_email: false,
        imgTitle: false
      },
      step1Validation: false,
      step2Validation: false,
      step3Validation: false,
      step4Validation: false,

      isLoadDlg: false,
      editMode: true
    });
  }

  saveState = state => {
    const userInfo = getUserInfo();
    localStorage.setItem('createAds_' + userInfo.email, JSON.stringify(state));
    // console.log("zzz", JSON.stringify(state));
  };
  loadState = () => {
    const userInfo = getUserInfo();
    console.log('loadState:', userInfo);
    const stateJson = localStorage.getItem('createAds_' + userInfo.email);
    if (stateJson) {
      const state = JSON.parse(stateJson);
      this.setState({ ...state, selectedImages: [], selectedImagesUrl: [] });
    }

    console.log('stateJson: ', stateJson);
  };
  isExistSavedState = () => {
    const userInfo = getUserInfo();
    const stateJson = localStorage.getItem('createAds_' + userInfo.email);
    return stateJson ? true : false;
  };

  handleInput = input => (e, i) => {
    this.setState({ [input]: e.target.value, isChanged: true }, function() {
      if (this.state.step === 0) this.validationStep1();
      if (this.state.step === 3) this.validationStep4();
    });
  };

  getCurCategoryIndex = () => {
    const { category } = this.state;
    return category;

    // const index = categoryList.indexOf(category);
    // return index;
  };

  handleLimitDate = val => {
    this.setState({ limitDate: val });
  };

  handleExpanedChange = panel => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  handleStepBack = () => {
    if (this.state.step > 0) this.setState({ step: this.state.step - 1 });
  };

  validationStep1 = () => {
    if (!this.state.step1Validation) return false;
    const {
      title,
      description,
      country,
      canton,
      city,
      zipcode,
      street,
      location,
      type,
      category,
      property,
      surface,
      floor,
      room,
      dateType,
      limitDate,
      price,
      charge,
      priceType,

      errors
    } = this.state;
    var result = true;
    if (!title) {
      errors.title = true;
      result = false;
    } else errors.title = false;
    if (!description) {
      errors.description = true;
      result = false;
    } else errors.description = false;
    if (country < 0) {
      errors.country = true;
      result = false;
    } else errors.country = false;
    if (canton < 0) {
      errors.canton = true;
      result = false;
    } else errors.canton = false;
    if (!city) {
      errors.city = true;
      result = false;
    } else errors.city = false;
    if (!zipcode) {
      errors.zipcode = true;
      result = false;
    } else errors.zipcode = false;
    if (!street) {
      errors.street = true;
      result = false;
    } else errors.street = false;
    if (!type) {
      errors.type = true;
      result = false;
    } else errors.type = false;
    if (category < 0) {
      errors.category = true;
      result = false;
    } else errors.category = false;
    if (!surface) {
      errors.surface = true;
      result = false;
    } else errors.surface = false;
    if (!floor) {
      errors.floor = true;
      result = false;
    } else errors.floor = false;
    if (!room) {
      errors.room = true;
      result = false;
    } else errors.room = false;
    if (dateType === 0 && !limitDate) {
      errors.limitDate = true;
      result = false;
    } else errors.limitDate = false;
    if (priceType < 0) {
      errors.priceType = true;
      result = false;
    } else errors.priceType = false;
    if (dateType < 0) {
      errors.dateType = true;
      result = false;
    } else errors.dateType = false;
    // if (priceType === 0 && price < 0) {
    //   errors.price = true;
    //   result = false;
    // } else {
    //   errors.price = true;
    // }
    this.setState({ errors: this.state.errors });
    return result;
  };

  validationStep4 = () => {
    if (!this.state.step4Validation) return false;
    const {
      fullname,
      phonenumber,
      email,
      visit_name,
      visit_email,
      visit_phone,
      mand_name,
      mand_phone,
      mand_email,
      imgTitle,
      errors
    } = this.state;
    var result = true;
    if (!fullname) {
      errors.fullname = true;
      result = false;
    } else errors.fullname = false;

    if (!phonenumber) {
      errors.phonenumber = true;
      result = false;
    } else errors.phonenumber = false;

    // if (!imgTitle) {
    //   errors.imgTitle = true;
    //   result = false;
    // } else errors.imgTitle = false;

    if (!email) {
      errors.email = true;
      result = false;
    } else errors.email = false;

    // if (!visit_name) {
    //   errors.visit_name = true;
    //   result = false;
    // } else errors.visit_name = false;
    // if (!visit_email) {
    //   errors.visit_email = true;
    //   result = false;
    // } else errors.visit_email = false;
    // if (!visit_phone) {
    //   errors.visit_phone = true;
    //   result = false;
    // } else errors.visit_phone = false;
    // if (!mand_name) {
    //   errors.mand_name = true;
    //   result = false;
    // } else errors.mand_name = false;
    // if (!mand_email) {
    //   errors.mand_email = true;
    //   result = false;
    // } else errors.mand_email = false;
    // if (!mand_phone) {
    //   errors.mand_phone = true;
    //   result = false;
    // } else errors.mand_phone = false;
    this.setState({ errors: this.state.errors });
    return result;
  };
  handleStepForward = () => {
    if (this.state.step > 4) return;

    if (this.state.step === 0) {
      this.state.step1Validation = true;
      if (!this.validationStep1()) {
        return;
      }
    }
    if (this.state.step === 3) {
      this.state.step4Validation = true;
      if (!this.validationStep4()) {
        return;
      }
    }

    this.setState({ step: this.state.step + 1 });
  };

  handleDrop = (files, event) => {
    console.log('drop', files, event);
    if (files.length === 0) {
      return;
    }
    const files1 = Object.keys(files).map((item, index) => {
      return files[item];
    });
    this.addSelectedImages(files1);
  };

  handleChooseImages = event => {
    if (event.target.files.length === 0) {
      return;
    }
    const files = Object.keys(event.target.files).map((item, index) => {
      return event.target.files[item];
    });
    console.log('a', files);
    this.addSelectedImages(files);
  };

  addSelectedImages = files => {
    console.log('b', this.state.selectedImages);
    files.map(item => {
      this.state.selectedImages.push(item);
    });

    this.setState({ selectedImages: this.state.selectedImages });

    var imagesurl = this.state.selectedImagesUrl;
    files.map((item, index) => {
      var freader = new FileReader();
      freader.readAsDataURL(item);
      freader.onload = _event => {
        imagesurl.push(freader.result);
        this.setState({ selectedImagesUrl: imagesurl });
      };
    });
  };
  deleteSelectedImages = index => {
    console.log('c', index, this.state.selectedImages);
    this.state.selectedImages.splice(index, 1);
    this.state.selectedImagesUrl.splice(index, 1);

    this.setState({
      selectedImages: this.state.selectedImages,
      selectedImagesUrl: this.state.selectedImagesUrl
    });
  };
  makeExtraList = () => {
    const {
      extraList,
      proximiteList,
      facilityList,
      outdoorEquipList,
      interiorEquipList,
      otherEquipList,
      soilList,
      expositionList,
      viewsList,
      sunshineList
    } = this.state;

    extraList.push(proximiteList);
    extraList.push(facilityList);
    extraList.push(outdoorEquipList);
    extraList.push(interiorEquipList);
    extraList.push(otherEquipList);
    extraList.push(soilList);
    extraList.push(expositionList);
    extraList.push(viewsList);
    extraList.push(sunshineList);
    return extraList;
  };

  handleUploadAds = async ads_id => {
    const {
      //step1
      title,
      description,
      country,
      canton,
      city,
      zipcode,
      street,
      location,
      type,
      category,
      property,
      surface,
      floor,
      room,
      dateType,
      limitDate,
      price,
      charge,
      priceType,
      //step2
      extraList,
      //step3
      selectedImages,
      //step4
      fullname,
      phonenumber,
      email,
      visit_name,
      visit_phone,
      visit_email,
      mand_name,
      mand_email,
      mand_phone,
      imgTitle
    } = this.state;

    const adsInfo = {
      title: title,
      description: description,
      country: country,
      canton: canton,
      city: city,
      zipcode: zipcode,
      street: street,
      location: location,
      type: type,
      category: category,
      property: property,
      surface: surface,
      floor: floor,
      room: room,
      dateType: dateType,
      limitDate: limitDate,
      price: price,
      charge: charge,
      priceType: priceType,
      //step2
      extraList: this.makeExtraList(),
      //step3
      // selectedImages,
      //step4
      fullname: fullname,
      phonenumber: phonenumber,
      email: email,
      visit_name,
      visit_phone,
      visit_email,
      mand_name,
      mand_email,
      mand_phone,
      imgTitle,
      ads_id: ads_id
    };
    console.log(123)
    // const data = new FormData();
    // for (var i = 0; i < selectedImages.length; i++) {
    //   let file = selectedImages[i];
    //   data.append("images", file);
    // }
    // data.append("adsInfo", adsInfo);
    const data = adsInfo;
    const result = await api.uploadAds(data);
    if (result.status) {
      const data = new FormData();
      for (var i = 0; i < selectedImages.length; i++) {
        let file = selectedImages[i];
        data.append('images', file);
      }
      data.append('ads_id', result.adsId);

      var exist_images = [];
      this.state.selectedImagesUrl.map((item, index) => {
        if (!item.startsWith('data')) {
          exist_images.push(item);
        }
      });
      console.log('exist_iamges', exist_images);
      data.append('exist_images', exist_images);
      const uploadImagesResult = await api.uploadImages(data);
      if (uploadImagesResult.status) {
        NotificationManager.success('Upload Ads Successfully.');
        this.saveState('');
        this.props.history.push('/myAds');
        return;
      }
    }
    NotificationManager.error('failed');
    return;
  };

  onPlaceSelected = place => {
    // const address = place.formatted_address;
    // const addressArray = place.address_components;
    // // const city = this.getCity(addressArray);
    // // const area = this.getArea(addressArray);
    // // const state = this.getState(addressArray);
    // // const latValue = place.geometry.location.lat();
    // // const lngValue = place.geometry.location.lng();
    // console.log("123", address, addressArray)
  };

  handleInputExtra = (input, type) => {
    const {
      extraList,
      proximiteList,
      facilityList,
      outdoorEquipList,
      interiorEquipList,
      otherEquipList,
      soilList,
      expositionList,
      viewsList,
      sunshineList
    } = this.state;
    var pList = null;
    if (type === 'proximiteList') {
      pList = proximiteList;
    }
    if (type === 'facilityList') {
      pList = facilityList;
    }
    if (type === 'outdoorEquipList') {
      pList = outdoorEquipList;
    }
    if (type === 'interiorEquipList') {
      pList = interiorEquipList;
    }
    if (type === 'otherEquipList') {
      pList = otherEquipList;
    }
    if (type === 'soilList') {
      pList = soilList;
    }
    if (type === 'expositionList') {
      pList = expositionList;
    }
    if (type === 'viewsList') {
      pList = viewsList;
    }
    if (type === 'sunshineList') {
      pList = sunshineList;
    }
    if (pList) {
      var flag = false;
      for (var i = 0; i < pList.length; i++) {
        if (pList[i] === input) {
          pList.splice(i, 1);
          flag = true;
          break;
        }
      }
      if (!flag) {
        pList.push(input);
      }
      this.setState({ [type]: pList }, function() {
        console.log('123', pList);
      });
    }
  };

  getCheckStatus = (value, type) => {
    const {
      extraList,
      proximiteList,
      facilityList,
      outdoorEquipList,
      interiorEquipList,
      otherEquipList,
      soilList,
      expositionList,
      viewsList,
      sunshineList
    } = this.state;
    var pList = null;
    if (type === 'proximiteList') {
      pList = proximiteList;
    }
    if (type === 'facilityList') {
      pList = facilityList;
    }
    if (type === 'outdoorEquipList') {
      pList = outdoorEquipList;
    }
    if (type === 'interiorEquipList') {
      pList = interiorEquipList;
    }
    if (type === 'otherEquipList') {
      pList = otherEquipList;
    }
    if (type === 'soilList') {
      pList = soilList;
    }
    if (type === 'expositionList') {
      pList = expositionList;
    }
    if (type === 'viewsList') {
      pList = viewsList;
    }
    if (type === 'sunshineList') {
      pList = sunshineList;
    }
    if (pList) {
      for (var i = 0; i < pList.length; i++) {
        if (pList[i] === value) {
          return true;
        }
      }
      return false;
    }
  };

  handleLoadState = () => {
    this.loadState();
    this.setState({ isLoadDlg: false });
  };

  handleCancelLoadState = () => {
    this.setState({ isLoadDlg: false });
  };

  handleCantons = () => {
    const { canton } = this.state;
    return canton;
  };

  rotateImg = i => {
    const { selectedImages } = this.state;

    let newRotation = this.state.rotation + 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }

    // selectedImages.forEach((img, index) => {

    // })
    if (selectedImages[i]) {
      this.setState({
        rotation: newRotation
      });
      console.log(selectedImages);
    }
  };

  // rotateImg2 = i => {
  //   this.setState({
  //     rotation: newRotation
  //   })
  // }

  render() {
    const { classes } = this.props;
    const {
      step,
      //step1
      title,
      description,
      location,
      country,
      canton,
      city,
      zipcode,
      street,
      type,
      category,
      property,
      surface,
      floor,
      room,
      dateType,
      limitDate,
      price,
      charge,
      priceType,

      //step3
      selectedImages,

      //step4
      fullname,
      phonenumber,
      email,
      visit_name,
      visit_phone,
      visit_email,
      mand_name,
      mand_email,
      mand_phone,
      imgTitle,
      expanded,
      editMode,
      errors,
      
    } = this.state;
    console.log(this.state);

    const step1Container = () => {
      return (
        <div className={classes.advertiseContainer}>
          <h3>{t[this.props.lang].step1}</h3>
          <GridContainer justify="center">
            <GridItem xs={12}>
              <GridContainer>
                <GridItem xs={12}>
                  <h4 style={{ marginBottom: 0 }}>
                    {t[this.props.lang].main_info}
                  </h4>
                </GridItem>
                <GridItem xs={12} sm={6}>
                  <TextField
                    required
                    id="id-title"
                    label={t[this.props.lang].title_of_ad}
                    className={classes.textField}
                    margin="normal"
                    error={errors.title}
                    value={title}
                    fullWidth
                    onChange={this.handleInput('title')}
                    inputProps={{
                      maxLength: 50
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <TextField
                    id="id-description"
                    label={t[this.props.lang].description}
                    className={classes.textField}
                    margin="normal"
                    error={errors.description}
                    value={description}
                    fullWidth
                    multiline
                    rows={3}
                    rowsMax={8}
                    onChange={this.handleInput('description')}
                  />
                </GridItem>
                {/* </GridContainer> */}
                {/* <GridContainer> */}

                <GridItem xs={12} sm={3}>
                  <FormControl
                    className={classes.formControl}
                    fullWidth
                    required
                    error={errors.country}
                  >
                    <InputLabel>{t[this.props.lang].country}</InputLabel>
                    <Select
                      value={country}
                      onChange={this.handleInput('country')}
                    >
                      {countryList.map((item, index) => {
                        return (
                          <MenuItem key={index} value={index}>
                            {item.name[this.props.lang]}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </GridItem>

                {/* SELECT LIST CANTON */}

                <GridItem xs={6} sm={3}>
                  <FormControl
                    className={classes.formControl}
                    fullWidth
                    required
                    error={errors.canton}
                  >
                    <InputLabel>{t[this.props.lang].canton}</InputLabel>
                    <Select
                      value={canton}
                      onChange={this.handleInput('canton')}
                    >
                      {cantonsList.map((item, index) => {
                        return (
                          <MenuItem key={index} value={index}>
                            {item}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </GridItem>
                {/* SELECT LIST CANTON END */}

                {/* <GridItem xs={12} sm={3}>
                  <TextField
                    required
                    id="id-canton"
                    label={t[this.props.lang].canton}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.canton}
                    value={canton}
                    fullWidth
                    onChange={this.handleInput("canton")}
                  />
                </GridItem> */}

                {/* SELECT LIST CITIES */}
                <GridItem xs={6} sm={3}>
                  {this.handleCantons() >= 0 && (
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel>{t[this.props.lang].city}</InputLabel>
                      <Select value={city} onChange={this.handleInput('city')}>
                        {cityList[this.handleCantons()].map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </GridItem>
                {/* SELECT LIST CITIES END */}

                {/* <GridItem xs={6} sm={3}>
                  <TextField
                    required
                    id="id-city"
                    label={t[this.props.lang].city}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.city}
                    value={city}
                    fullWidth
                    onChange={this.handleInput("city")}
                  />
                </GridItem> */}
                <GridItem xs={6} sm={3}>
                  <TextField
                    required
                    id="id-zipcode"
                    label={t[this.props.lang].postcode}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.zipcode}
                    value={zipcode}
                    fullWidth
                    type="text"
                    onChange={this.handleInput('zipcode')}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <TextField
                    required
                    id="street"
                    label={t[this.props.lang].street_and_house_number}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.street}
                    value={street}
                    fullWidth
                    onChange={this.handleInput('street')}
                  />
                </GridItem>
                {/* <GridItem xs={12}>
                  <GoogleMapManager />
                </GridItem>
                <GridItem xs={12}>
                  <Autocomplete
                    style={{
                      width: "90%",
                      height: "1.1875em",
                      margin: 0,
                      display: "block",
                      padding: "6px 0 7px",
                      minWidth: 0,
                      background: "none",
                      boxSizing: "content-box",
                      font: "inherit",
                      borderBottomWwidth: 1,
                      borderBottomColor: "rgb(0,0,0,0.5)",
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                      borderRightWidth: 0
                    }}
                    onPlaceSelected={this.onPlaceSelected}
                    types={["(regions)"]}
                  />
                </GridItem> */}
                <GridItem xs={12}>
                  <h4 style={{ marginBottom: 0 }}>
                    {t[this.props.lang].details}
                  </h4>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                    required
                    error={errors.type}
                  >
                    <FormLabel component="legend">
                      {t[this.props.lang].type_of_ownership}
                    </FormLabel>
                    <RadioGroup
                      name="type"
                      className={classes.group}
                      value={type}
                      onChange={this.handleInput('type')}
                      row
                    >
                      <FormControlLabel
                        value="rent"
                        control={<Radio color="primary" />}
                        label={t[this.props.lang].for_rent}
                        labelPlacement="start"
                      />

                      <FormControlLabel
                        value="sale"
                        control={<Radio color="primary" />}
                        label={t[this.props.lang].for_sale}
                        labelPlacement="start"
                      />
                    </RadioGroup>
                  </FormControl>
                </GridItem>

                <GridItem xs={12} sm={4}>
                  <FormControl
                    className={classes.formControl}
                    fullWidth
                    required
                    error={errors.category}
                  >
                    <InputLabel>{t[this.props.lang].category}</InputLabel>
                    <Select
                      value={category}
                      onChange={this.handleInput('category')}
                    >
                      {categoryList[this.props.lang].map((item, index) => {
                        return (
                          <MenuItem key={index} value={index}>
                            {item}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem xs={12} sm={4}>
                  {this.getCurCategoryIndex() >= 0 && (
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel>{t[this.props.lang].property}</InputLabel>
                      <Select
                        value={property}
                        onChange={this.handleInput('property')}
                      >
                        {propertyList[this.props.lang][
                          this.getCurCategoryIndex()
                        ].map((item, index) => {
                          return (
                            <MenuItem key={index} value={index}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </GridItem>

                <GridItem xs={12} sm={4}>
                  <TextField
                    required
                    id="living-space"
                    label={t[this.props.lang].surface}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.surface}
                    value={surface}
                    fullWidth
                    onChange={this.handleInput('surface')}
                  />
                </GridItem>

                <GridItem xs={12} sm={4}>
                  <TextField
                    required
                    id="floor-space"
                    label={t[this.props.lang].floor}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.floor}
                    value={floor}
                    fullWidth
                    onChange={this.handleInput('floor')}
                  />
                </GridItem>

                <GridItem xs={12} sm={4}>
                  <TextField
                    required
                    id="room-count"
                    label={t[this.props.lang].rooms}
                    placeholder=""
                    className={classes.textField}
                    margin="normal"
                    error={errors.room}
                    value={room}
                    fullWidth
                    onChange={this.handleInput('room')}
                  />
                </GridItem>

                <GridItem xs={12} sm={6} container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      error={errors.dateType}
                    >
                      <InputLabel htmlFor="">
                        {t[this.props.lang].availability}
                      </InputLabel>
                      <Select
                        value={dateType}
                        onChange={this.handleInput('dateType')}
                      >
                        <MenuItem value={0}>
                          {t[this.props.lang].from_date}
                        </MenuItem>
                        <MenuItem value={1}>
                          {t[this.props.lang].immediately}
                        </MenuItem>
                        <MenuItem value={2}>
                          {t[this.props.lang].on_request}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      className={classes.formControl}
                      style={{ marginTop: 30 }}
                      disablePast
                      format="dd/MM/yyyy"
                      views={['year', 'month', 'date']}
                      placeholder="01/07/2019"
                      value={limitDate && limitDate}
                      error={errors.limitDate}
                      onChange={value => this.handleLimitDate(value)}
                      disabled={dateType !== 0}
                      // cancelLabel={t[this.props.lang].cancel}
                      // okLabel = {t[this.props.lang].ok}
                      // clearLabel = {t[this.props.lang].clear}
                    />
                  </Grid>
                </GridItem>

                <GridItem xs={12} sm={6} container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      error={errors.priceType}
                    >
                      <InputLabel htmlFor="">
                        {t[this.props.lang].price_type}
                      </InputLabel>

                      <Select
                        value={priceType}
                        onChange={this.handleInput('priceType')}
                      >
                        <MenuItem value={0}>
                          {t[this.props.lang].on_request}
                        </MenuItem>
                        <MenuItem value={1}>CHF</MenuItem>
                        <MenuItem value={2}>EUR</MenuItem>
                        <MenuItem value={3}>USD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      required
                      id="price"
                      label={t[this.props.lang].price}
                      placeholder=""
                      className={classes.textField}
                      margin="normal"
                      error={errors.price}
                      value={price}
                      fullWidth
                      onChange={this.handleInput('price')}
                      disabled={priceType === 0}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      required
                      id="charge"
                      label={t[this.props.lang].charge}
                      placeholder=""
                      className={classes.textField}
                      margin="normal"
                      error={errors.charge}
                      value={charge}
                      fullWidth
                      onChange={this.handleInput('charge')}
                      disabled={priceType === 0}
                    />
                  </Grid>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </div>
      );
    };

    const step2Container = () => {
      return (
        <div className={classes.extraDetailContainer}>
          <h3>{t[this.props.lang].step2}</h3>
          <GridContainer justify="center">
            <GridItem xs={12}>
              <GridContainer>
                <GridItem xs={12}>
                  <h3 style={{ marginBottom: 8 }}>{t[this.props.lang].near}</h3>
                </GridItem>
                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel1'}
                    onChange={this.handleExpanedChange('panel1')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].proximity}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {proximiteList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem
                              style={{ width: 300 }}
                              xs={12}
                              key={index}
                            >
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'proximiteList')
                                }
                                value={item}
                                checked={this.getCheckStatus(
                                  item,
                                  'proximiteList'
                                )}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>
                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel2'}
                    onChange={this.handleExpanedChange('panel2')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].facilities}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {facilityList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem style={{ width: 300 }} key={index}>
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'facilityList')
                                }
                                value={item}
                                checked={this.getCheckStatus(
                                  item,
                                  'facilityList'
                                )}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel3'}
                    onChange={this.handleExpanedChange('panel3')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].outdoor_equipment}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {outdoorEquipList[this.props.lang].map(
                          (item, index) => {
                            return (
                              <GridItem style={{ width: 300 }} key={index}>
                                <Checkbox
                                  onChange={() =>
                                    this.handleInputExtra(
                                      item,
                                      'outdoorEquipList'
                                    )
                                  }
                                  value={item}
                                  checked={this.getCheckStatus(
                                    item,
                                    'outdoorEquipList'
                                  )}
                                  color="primary"
                                  inputProps={{
                                    'aria-label': 'secondary checkbox'
                                  }}
                                />
                                {item}
                              </GridItem>
                            );
                          }
                        )}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel4'}
                    onChange={this.handleExpanedChange('panel4')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].interior_equipment}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {interiorEquipList[this.props.lang].map(
                          (item, index) => {
                            return (
                              <GridItem style={{ width: 300 }} key={index}>
                                <Checkbox
                                  onChange={() =>
                                    this.handleInputExtra(
                                      item,
                                      'interiorEquipList'
                                    )
                                  }
                                  value={item}
                                  checked={this.getCheckStatus(
                                    item,
                                    'interiorEquipList'
                                  )}
                                  color="primary"
                                  inputProps={{
                                    'aria-label': 'secondary checkbox'
                                  }}
                                />
                                {item}
                              </GridItem>
                            );
                          }
                        )}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel5'}
                    onChange={this.handleExpanedChange('panel5')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].other_equipment}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {otherEquipList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem style={{ width: 300 }} key={index}>
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'otherEquipList')
                                }
                                value={item}
                                checked={this.getCheckStatus(
                                  item,
                                  'otherEquipList'
                                )}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel7'}
                    onChange={this.handleExpanedChange('panel7')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].soils}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {soilList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem style={{ width: 300 }} key={index}>
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'soilList')
                                }
                                value={item}
                                checked={this.getCheckStatus(item, 'soilList')}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel8'}
                    onChange={this.handleExpanedChange('panel8')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].exposition}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {expositionList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem style={{ width: 300 }} key={index}>
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'expositionList')
                                }
                                value={item}
                                checked={this.getCheckStatus(
                                  item,
                                  'expositionList'
                                )}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel9'}
                    onChange={this.handleExpanedChange('panel9')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].views}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {viewsList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem style={{ width: 300 }} key={index}>
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'viewsList')
                                }
                                value={item}
                                checked={this.getCheckStatus(item, 'viewsList')}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>

                <GridItem xs={12}>
                  <ExpansionPanel
                    expanded={expanded === 'panel10'}
                    onChange={this.handleExpanedChange('panel10')}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="near-content"
                      id="near"
                    >
                      <Typography className={classes.heading}>
                        {t[this.props.lang].sunshine}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <GridContainer
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        {sunshineList[this.props.lang].map((item, index) => {
                          return (
                            <GridItem style={{ width: 300 }} key={index}>
                              <Checkbox
                                onChange={() =>
                                  this.handleInputExtra(item, 'sunshineList')
                                }
                                value={item}
                                checked={this.getCheckStatus(
                                  item,
                                  'sunshineList'
                                )}
                                color="primary"
                                inputProps={{
                                  'aria-label': 'secondary checkbox'
                                }}
                              />
                              {item}
                            </GridItem>
                          );
                        })}
                      </GridContainer>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </div>
      );
    };
    const step3Container = () => {
      return (
        <div className={classes.selectPhotosContainer}>
          <h3>{t[this.props.lang].step3}</h3>
          {selectedImages && (
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={2}
              style={{ margin: 8 }}
            >
              {/* {Object.keys(selectedImages).map((item, index) => {
                return (
                  <GridItem xs={12} key={index}>
                    {selectedImages[item].name}
                  </GridItem>
                );
              })} */}
              {this.state.selectedImagesUrl.map((item, index) => {
                var imgPath = item;
                if (!item.startsWith('data')) {
                  if (item.startsWith('http')) {
                    imgPath = item;
                  } else imgPath = config.apiBaseUrl + '/' + item;
                }
                return (
                  <Grid item key={index}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgb(0,0,0,0.1)',
                        borderWidth: 2,
                        borderCollapse: '#aaa',
                        borderStyle: 'dashed',
                        position: 'relative'
                      }}
                    >
                      <Cancel
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 10,
                          width: 30,
                          height: 30
                        }}
                        onClick={() => this.deleteSelectedImages(index)}
                      />

                      <i
                        className="fas fa-undo"
                        onClick={() => this.rotateImg(index)}
                        style={{
                          cursor: 'pointer',
                          margin: '1rem',
                          display: 'block'
                        }}
                      ></i>

                      <img
                        alt="..."
                        src={imgPath}
                        // onClick={() => this.rotateImg2()}
                        style={{
                          width: 240,
                          height: 240,
                          objectFit: 'contain',
                          transform: `rotate(${this.state.rotation}deg)`
                        }}
                      />
                    </div>
                      <TextField
                        
                        id="imgTitle"
                        // label=''
                        className={classes.textField}
                        margin="normal"
                        // error={errors.imgTitle}
                        value={imgTitle}
                        style={{background:'#e5e5e5'}}
                        fullWidth
                        
                        placeholder='Image Title'
                        onChange={this.handleInput('imgTitle')}
                      />
                  </Grid>
                );
              })}
            </Grid>
          )}
          <GridContainer>
            <GridItem>
              <div className={classes.dropContainer}>
                <FileDrop onDrop={this.handleDrop}>
                  <PhotoCamera />
                  {t[this.props.lang].drop_some_files_here}
                  <br />
                  {t[this.props.lang].or}
                  <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    className={classes.button}
                    style={{ marginTop: 4 }}
                  >
                    <input
                      accept="Image/*"
                      style={{ display: 'none' }}
                      type="file"
                      multiple
                      onChange={this.handleChooseImages}
                    />
                    {t[this.props.lang].choose}
                  </Button>
                </FileDrop>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      );
    };

    const step4Container = () => {
      return (
        <div className={classes.contactInfoContainer}>
          <h3>{t[this.props.lang].step4}</h3>
          <GridContainer>
            <GridItem xs={12}>
              <TextField
                required
                id="name"
                label={t[this.props.lang].full_name}
                className={classes.textField}
                margin="normal"
                error={errors.fullname}
                value={fullname}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
                onChange={this.handleInput('fullname')}
              />
            </GridItem>

            <GridItem xs={12}>
              <TextField
                required
                id="phonenumber"
                label={t[this.props.lang].phone_number}
                className={classes.textField}
                margin="normal"
                error={errors.phonenumber}
                value={phonenumber}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  )
                }}
                onChange={this.handleInput('phonenumber')}
              />
            </GridItem>

            <GridItem xs={12}>
              <TextField
                required
                id="email"
                label={t[this.props.lang].email}
                className={classes.textField}
                margin="normal"
                error={errors.email}
                value={email}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
                onChange={this.handleInput('email')}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            {/* Visit */}
            <GridContainer md={6} style={{marginLeft: '0', marginRight: '0'}}>
              <GridItem>
                <TextField
                  
                  id="visit_name"
                  label="Visit_name"
                  className={classes.textField}
                  margin="normal"
                  error={errors.visit_name}
                  value={visit_name}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleInput('visit_name')}
                />
              </GridItem>
              <GridItem>
                <TextField
                  
                  id="visit_email"
                  label="Visit_email"
                  className={classes.textField}
                  margin="normal"
                  error={errors.visit_email}
                  value={visit_email}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleInput('visit_email')}
                />
              </GridItem>
              <GridItem>
                <TextField
                  
                  id="visit_phone"
                  label="Visit_phone"
                  className={classes.textField}
                  margin="normal"
                  error={errors.visit_phone}
                  value={visit_phone}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleInput('visit_phone')}
                />
              </GridItem>
            </GridContainer>

            {/* Mand */}
            <GridContainer md={6}>
              <GridItem>
                <TextField
                  
                  id="mand_name"
                  label="Mand_name"
                  className={classes.textField}
                  margin="normal"
                  error={errors.mand_name}
                  value={mand_name}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleInput('mand_name')}
                />
              </GridItem>
              <GridItem>
                <TextField
                  
                  id="mand_email"
                  label="Mand_email"
                  className={classes.textField}
                  margin="normal"
                  error={errors.mand_email}
                  value={mand_email}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleInput('mand_email')}
                />
              </GridItem>
              <GridItem>
                <TextField
                  
                  id="mand_phone"
                  label="Mand_phone"
                  className={classes.textField}
                  margin="normal"
                  error={errors.mand_phone}
                  value={mand_phone}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleInput('mand_phone')}
                />
              </GridItem>
            </GridContainer>
          </GridContainer>
        </div>
      );
    };

    const step5Container = () => {
      return (
        <div className={classes.finishStepsContainer}>
          <GridContainer>
            <GridItem xs={12}>
              <h2>{t[this.props.lang].compleated_all_the_steps}</h2>
            </GridItem>
          </GridContainer>
        </div>
      );
    };
    const stepButtons = () => {
      return (
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
          style={{ margin: 12 }}
        >
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              className={classes.button}
              onClick={this.handleStepBack}
              disabled={step === 0}
            >
              <ArrowBack className={classes.leftIcon} />
              {t[this.props.lang].back}
            </Button>
          </Grid>
          {step < 4 && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                className={classes.button}
                onClick={this.handleStepForward}
              >
                {t[this.props.lang].next}
                <ArrowForward className={classes.rightIcon} />
              </Button>
            </Grid>
          )}
          {step === 4 && !editMode && (
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                component="label"
                className={classes.button}
                style={{ marginTop: 4 }}
                onClick={() => this.handleUploadAds('')}
              >
                {t[this.props.lang].upload_ads}
              </Button>
            </Grid>
          )}
          {step === 4 && editMode && (
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                component="label"
                className={classes.button}
                style={{ marginTop: 4 }}
                onClick={() =>
                  this.handleUploadAds(this.props.location.state.adsInfo._id)
                }
              >
                {t[this.props.lang].upload_changes}
              </Button>
            </Grid>
          )}
        </Grid>
      );
    };
    return (
      <Container>
        <Header
          color="rose"
          brand="Gestimmo"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: 'white'
          }}
        />
        <div className={classes.toolbar} />

        <div className={classes.content}>
          {this.props.windowWidth < 600 && (
            <Stepper activeStep={step} orientation="vertical">
              {steps[this.props.lang].map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {step === 0 && step1Container()}
                    {step === 1 && step2Container()}
                    {step === 2 && step3Container()}
                    {step === 3 && step4Container()}
                    {stepButtons()}
                  </StepContent>
                </Step>
              ))}
              {step === 4 && step5Container()}
              {step === 4 && stepButtons()}
            </Stepper>
          )}
          {this.props.windowWidth >= 600 && (
            <div>
              <div className={classes.stepper}>
                <Stepper activeStep={step} alternativeLabel>
                  {steps[this.props.lang].map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
              <Container fixed>
                {step === 0 && step1Container()}
                {step === 1 && step2Container()}
                {step === 2 && step3Container()}
                {step === 3 && step4Container()}
                {step === 4 && step5Container()}
              </Container>
              {stepButtons()}
            </div>
          )}
        </div>

        <Dialog
          open={this.state.isLoadDlg}
          // onClose={this.handlePasswordClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {t[this.props.lang].confirm}
          </DialogTitle>
          <DialogContent>
            {t[this.props.lang].you_can_continue_from_the_previous_state}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleLoadState} color="primary">
              {t[this.props.lang].yes}
            </Button>
            <Button onClick={this.handleCancelLoadState} color="primary">
              {t[this.props.lang].no}
            </Button>
          </DialogActions>
        </Dialog>
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
)(withStyles(styles)(windowSize(CreateAds)));
