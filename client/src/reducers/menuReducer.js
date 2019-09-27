import * as types from '../actions/types'

const initialState = {
    mobileOpen: false,
    lang: 0, // 0='English', 1='French'
    avatarPath: "",
    loginOpen: false,
    registerOpen: false,
    user: {},
}

export default function toggleMenu(state=initialState, action) {
    if(action.type === "AVATAR_CHANGED") {
        return {
            ...state,
            avatarPath: action.payload
        }
    }
    if(action.type === types.TOGGLE_MENU) {
        return {
            ...state,
            mobileOpen: !state.mobileOpen
        }
    }
    if(action.type === types.CHANGE_LANG) {
        return {
            ...state,
            lang: action.payload,
        }
    }
    if(action.type === types.SET_USER) {
        return {
            ...state,
            user: action.payload,
        }
    }
    
    if(action.type === types.LOGIN_DIALOG) {
        return {
            ...state,
            loginOpen: !state.loginOpen
        }
    }
    if(action.type === types.REGISTER_DIALOG) {
        return {
            ...state,
            registerOpen: !state.registerOpen
        }
    }
    return state;
}