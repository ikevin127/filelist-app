import AsyncStorage from '@react-native-async-storage/async-storage';
import {S, M, L, removeDublicate} from '../../assets/variables';
import crashlytics from '@react-native-firebase/crashlytics';
import {ToastAndroid} from 'react-native';
import {RO, EN} from '../../assets/lang';
import {types} from '../types';
import Axios from 'axios';

const initState = {
  lightTheme: false,
  autoplay: true,
  autofocusScreen: true,
  enLang: false,
  appInfo: false,
  fontSizes: null,
  listLatest: null,
  latestLoading: false,
  endListLoading: false,
  latestError: null,
  listSearch: null,
  searchLoading: false,
  searchError: null,
  collItems: [],
  historyList: {},
};

export const actions = {
  toggleLightTheme: () => ({
    type: types.APP_CONFIG.LIGHT_THEME,
  }),
  toggleEnLang: () => ({
    type: types.APP_CONFIG.EN_LANG,
  }),
  toggleAppInfo: () => ({
    type: types.APP_CONFIG.APP_INFO,
  }),
  toggleAutoplay: () => ({
    type: types.APP_CONFIG.AUTOPLAY,
  }),
  toggleAutofocusScreen: () => ({
    type: types.APP_CONFIG.AUTOFOCUS_SCREEN,
  }),
  setFonts: () => async (dispatch) => {
    const size = await AsyncStorage.getItem('fontSizes');
    if (size !== null) {
      size === 'S' &&
        dispatch({
          type: types.APP_CONFIG.FONT_SIZES,
          payload: JSON.parse(S),
        });
      size === 'M' &&
        dispatch({
          type: types.APP_CONFIG.FONT_SIZES,
          payload: JSON.parse(M),
        });
      size === 'L' &&
        dispatch({
          type: types.APP_CONFIG.FONT_SIZES,
          payload: JSON.parse(L),
        });
    } else {
      dispatch({
        type: types.APP_CONFIG.FONT_SIZES,
        payload: JSON.parse(M),
      });
    }
  },
  setCollItems: (data) => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.COLL_ITEMS, payload: data});
  },
  getHistoryList: () => async (dispatch) => {
    const history = await AsyncStorage.getItem('history');
    if (history !== null) {
      dispatch({
        type: types.APP_CONFIG.HISTORY_LIST,
        payload: removeDublicate(JSON.parse(history).reverse()),
      });
    } else {
      dispatch({
        type: types.APP_CONFIG.HISTORY_LIST,
        payload: {},
      });
    }
  },
  getLatest: (user, pass) => async (dispatch) => {
    try {
      dispatch({
        type: types.APP_CONFIG.LATEST_LOADING,
      });
      await Axios.get(
        `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=latest-torrents&limit=30`,
      )
        .then(async (res) => {
          let {data} = res;
          dispatch({
            type: types.APP_CONFIG.GET_LATEST,
            payload: data,
          });
          await AsyncStorage.setItem('latest', JSON.stringify(data));
          const enLang = await AsyncStorage.getItem('enLang');
          dispatch({
            type: types.APP_CONFIG.LATEST_LOADING,
          });
          if (enLang !== null) {
            ToastAndroid.showWithGravity(
              enLang === 'true' ? EN.refreshComplete : RO.refreshComplete,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        })
        .catch((err) => {
          dispatch({
            type: types.APP_CONFIG.LATEST_ERROR,
            payload: err,
          });
          dispatch({
            type: types.APP_CONFIG.LATEST_LOADING,
          });
        });
    } catch (e) {
      crashlytics().log('ducks -> getLatest()');
      crashlytics().recordError(e);
    }
  },
  getPlusLatest: (user, pass, length) => async (dispatch) => {
    try {
      dispatch({
        type: types.APP_CONFIG.END_LIST_LOADING,
      });
      await Axios.get(
        `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=latest-torrents&limit=${length}`,
      )
        .then(async (res) => {
          let {data} = res;
          dispatch({
            type: types.APP_CONFIG.GET_LATEST,
            payload: data,
          });
          dispatch({
            type: types.APP_CONFIG.END_LIST_LOADING,
          });
        })
        .catch((err) => {
          dispatch({
            type: types.APP_CONFIG.LATEST_ERROR,
            payload: err,
          });
          dispatch({
            type: types.APP_CONFIG.END_LIST_LOADING,
          });
        });
    } catch (e) {
      crashlytics().log('ducks -> getPlusLatest()');
      crashlytics().recordError(e);
    }
  },
  getLatestLogin: (user, pass) => async (dispatch) => {
    try {
      await Axios.get(
        `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=latest-torrents&limit=30`,
      )
        .then(async (res) => {
          let {data} = res;
          dispatch({
            type: types.APP_CONFIG.GET_LATEST,
            payload: data,
          });
          await AsyncStorage.setItem('latest', JSON.stringify(data));
        })
        .catch((err) => {
          dispatch({
            type: types.APP_CONFIG.LATEST_ERROR,
            payload: err,
          });
        });
    } catch (e) {
      crashlytics().log('ducks -> getLatestLogin()');
      crashlytics().recordError(e);
    }
  },
  retrieveLatest: () => async (dispatch) => {
    const latest = await AsyncStorage.getItem('latest');
    if (latest !== null) {
      dispatch({
        type: types.APP_CONFIG.GET_LATEST,
        payload: JSON.parse(latest),
      });
    } else {
      dispatch({
        type: types.APP_CONFIG.GET_LATEST,
        payload: null,
      });
    }
  },
  latestError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.LATEST_ERROR, payload: null});
  },
  getSearch: (
    user,
    pass,
    action,
    type,
    query,
    category,
    internal,
    freeleech,
    doubleup,
  ) => async (dispatch) => {
    try {
      dispatch({
        type: types.APP_CONFIG.SEARCH_LOADING,
      });
      await Axios.get(
        `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=${action}&type=${type}&query=${query}${category}${freeleech}${internal}${doubleup}`,
      )
        .then(async (res) => {
          let {data} = res;
          dispatch({
            type: types.APP_CONFIG.GET_SEARCH,
            payload: data,
          });
          await AsyncStorage.setItem('search', JSON.stringify(data));
          dispatch({
            type: types.APP_CONFIG.SEARCH_LOADING,
          });
        })
        .catch((err) => {
          dispatch({type: types.APP_CONFIG.SEARCH_ERROR, payload: err});
          dispatch({
            type: types.APP_CONFIG.SEARCH_LOADING,
          });
        });
    } catch (e) {
      crashlytics().log('ducks -> getSearch()');
      crashlytics().recordError(e);
    }
  },
  clearSearchStorage: () => async (dispatch) => {
    await AsyncStorage.removeItem('search');
    dispatch({
      type: types.APP_CONFIG.GET_SEARCH,
      payload: null,
    });
  },
  searchError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.SEARCH_ERROR, payload: null});
  },
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case types.APP_CONFIG.LIGHT_THEME:
      return {...state, lightTheme: !state.lightTheme};
    case types.APP_CONFIG.AUTOPLAY:
      return {...state, autoplay: !state.autoplay};
    case types.APP_CONFIG.AUTOFOCUS_SCREEN:
      return {...state, autofocusScreen: !state.autofocusScreen};
    case types.APP_CONFIG.EN_LANG:
      return {...state, enLang: !state.enLang};
    case types.APP_CONFIG.APP_INFO:
      return {...state, appInfo: !state.appInfo};
    case types.APP_CONFIG.FONT_SIZES:
      return {...state, fontSizes: action.payload};
    case types.APP_CONFIG.COLL_ITEMS:
      return {...state, collItems: action.payload};
    case types.APP_CONFIG.HISTORY_LIST:
      return {...state, historyList: action.payload};
    case types.APP_CONFIG.GET_LATEST:
      return {...state, listLatest: action.payload};
    case types.APP_CONFIG.END_LIST_LOADING:
      return {...state, endListLoading: !state.endListLoading};
    case types.APP_CONFIG.LATEST_LOADING:
      return {...state, latestLoading: !state.latestLoading};
    case types.APP_CONFIG.LATEST_ERROR:
      return {...state, latestError: action.payload};
    case types.APP_CONFIG.GET_SEARCH:
      return {...state, listSearch: action.payload};
    case types.APP_CONFIG.SEARCH_LOADING:
      return {...state, searchLoading: !state.searchLoading};
    case types.APP_CONFIG.SEARCH_ERROR:
      return {...state, searchError: action.payload};
    default:
      return state;
  }
}
