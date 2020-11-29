import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import {types} from '../types';
import Axios from 'axios';

const initState = {
  lightTheme: false,
  appInfo: false,
  fontSizes: null,
  listLatest: null,
  latestError: null,
  listSearch: null,
  searchError: null,
};

export const actions = {
  toggleLightTheme: () => ({
    type: types.APP_CONFIG.LIGHT_THEME,
  }),
  toggleAppInfo: () => ({
    type: types.APP_CONFIG.APP_INFO,
  }),
  setFonts: () => async (dispatch) => {
    try {
      const fonts = await AsyncStorage.getItem('fontSizes');
      if (fonts !== null) {
        dispatch({
          type: types.APP_CONFIG.FONT_SIZES,
          payload: JSON.parse(fonts),
        });
      } else {
        crashlytics().log('Font sizes not found in async storage.');
      }
    } catch (e) {
      crashlytics().log('ducks -> setFonts()');
      crashlytics().recordError(e);
    }
  },
  getLatest: (user, pass) => async (dispatch) => {
    await Axios.get(
      `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=latest-torrents&limit=50`,
    )
      .then(async (res) => {
        let {data} = res;
        dispatch({
          type: types.APP_CONFIG.GET_LATEST,
          payload: data,
        });
        try {
          await AsyncStorage.setItem('latest', JSON.stringify(data));
        } catch (e) {
          crashlytics().log('ducks -> getLatest()');
          crashlytics().recordError(e);
        }
      })
      .catch((err) => {
        dispatch({
          type: types.APP_CONFIG.LATEST_ERROR,
          payload: err.response.status,
        });
      });
  },
  retrieveLatest: () => async (dispatch) => {
    try {
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
    } catch (e) {
      crashlytics().log('ducks -> retrieveLatest()');
      crashlytics().recordError(e);
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
    await Axios.get(
      `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=${action}&type=${type}&query=${query}${category}${freeleech}${internal}${doubleup}`,
    )
      .then(async (res) => {
        let {data} = res;
        dispatch({
          type: types.APP_CONFIG.GET_SEARCH,
          payload: data,
        });
        try {
          await AsyncStorage.setItem('search', JSON.stringify(data));
        } catch (e) {
          crashlytics().log('ducks -> getSearch()');
          crashlytics().recordError(e);
        }
      })
      .catch((err) => {
        dispatch({type: types.APP_CONFIG.SEARCH_ERROR, payload: err});
      });
  },
  retrieveSearch: () => async (dispatch) => {
    try {
      const search = await AsyncStorage.getItem('search');
      if (search !== null) {
        dispatch({
          type: types.APP_CONFIG.GET_SEARCH,
          payload: JSON.parse(search),
        });
      } else {
        dispatch({
          type: types.APP_CONFIG.GET_SEARCH,
          payload: null,
        });
      }
    } catch (e) {
      crashlytics().log('ducks -> retrieveSearch()');
      crashlytics().recordError(e);
    }
  },
  searchError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.SEARCH_ERROR, payload: null});
  },
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case types.APP_CONFIG.LIGHT_THEME:
      return {...state, lightTheme: !state.lightTheme};
    case types.APP_CONFIG.APP_INFO:
      return {...state, appInfo: !state.appInfo};
    case types.APP_CONFIG.FONT_SIZES:
      return {...state, fontSizes: action.payload};
    case types.APP_CONFIG.GET_LATEST:
      return {...state, listLatest: action.payload};
    case types.APP_CONFIG.LATEST_ERROR:
      return {...state, latestError: action.payload};
    case types.APP_CONFIG.GET_SEARCH:
      return {...state, listSearch: action.payload};
    case types.APP_CONFIG.SEARCH_ERROR:
      return {...state, searchError: action.payload};
    default:
      return state;
  }
}
