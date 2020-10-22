import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {types} from '../types';

const initState = {
  lightTheme: false,
  appInfo: false,
  listLatest: null,
  listSearch: null,
  listImdb: null,
  listAdvSearch: null,
  latestError: null,
  searchError: null,
  imdbError: null,
  advSearchError: null,
};

export const actions = {
  toggleLightTheme: () => ({
    type: types.APP_CONFIG.LIGHT_THEME,
  }),
  toggleAppInfo: () => ({
    type: types.APP_CONFIG.APP_INFO,
  }),
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
          console.log(e);
        }
      })
      .catch((err) => {
        dispatch({type: types.APP_CONFIG.LATEST_ERROR, payload: err});
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
      console.log(e);
    }
  },
  latestError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.LATEST_ERROR, payload: null});
  },
  getSearch: (user, pass, query) => async (dispatch) => {
    await Axios.get(
      `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=search-torrents&type=name&query=${query}`,
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
          console.log(e);
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
      console.log(e);
    }
  },
  searchError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.SEARCH_ERROR, payload: null});
  },
  getImdb: (user, pass, query) => async (dispatch) => {
    await Axios.get(
      `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=search-torrents&type=imdb&query=${query}`,
    )
      .then(async (res) => {
        let {data} = res;
        dispatch({
          type: types.APP_CONFIG.GET_IMDB_SEARCH,
          payload: data,
        });
        try {
          await AsyncStorage.setItem('imdb', JSON.stringify(data));
        } catch (e) {
          console.log(e);
        }
      })
      .catch((err) => {
        dispatch({type: types.APP_CONFIG.IMDB_SEARCH_ERROR, payload: err});
      });
  },
  retrieveImdb: () => async (dispatch) => {
    try {
      const imdb = await AsyncStorage.getItem('imdb');
      if (imdb !== null) {
        dispatch({
          type: types.APP_CONFIG.GET_IMDB_SEARCH,
          payload: JSON.parse(imdb),
        });
      } else {
        dispatch({
          type: types.APP_CONFIG.GET_IMDB_SEARCH,
          payload: null,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  imdbError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.IMDB_SEARCH_ERROR, payload: null});
  },
  getAdvSearch: (
    user,
    pass,
    action,
    type,
    query,
    category,
    moderated,
    internal,
    freeleech,
    doubleup,
  ) => async (dispatch) => {
    await Axios.get(
      `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=${action}${type}${query}${category}${moderated}${internal}${freeleech}${doubleup}`,
    )
      .then(async (res) => {
        let {data} = res;
        dispatch({
          type: types.APP_CONFIG.GET_ADV_SEARCH,
          payload: data,
        });
        try {
          await AsyncStorage.setItem('searchAdv', JSON.stringify(data));
        } catch (e) {
          console.log(e);
        }
      })
      .catch((err) => {
        dispatch({type: types.APP_CONFIG.SEARCH_ADV_ERROR, payload: err});
      });
  },
  retrieveAdvSearch: () => async (dispatch) => {
    try {
      const searchAdv = await AsyncStorage.getItem('searchAdv');
      if (searchAdv !== null) {
        dispatch({
          type: types.APP_CONFIG.GET_ADV_SEARCH,
          payload: JSON.parse(searchAdv),
        });
      } else {
        dispatch({
          type: types.APP_CONFIG.GET_ADV_SEARCH,
          payload: null,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  searchAdvError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.SEARCH_ADV_ERROR, payload: null});
  },
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case types.APP_CONFIG.LIGHT_THEME:
      return {...state, lightTheme: !state.lightTheme};
    case types.APP_CONFIG.APP_INFO:
      return {...state, appInfo: !state.appInfo};
    case types.APP_CONFIG.GET_LATEST:
      return {...state, listLatest: action.payload};
    case types.APP_CONFIG.GET_SEARCH:
      return {...state, listSearch: action.payload};
    case types.APP_CONFIG.GET_IMDB_SEARCH:
      return {...state, listImdb: action.payload};
    case types.APP_CONFIG.GET_ADV_SEARCH:
      return {...state, listAdvSearch: action.payload};
    case types.APP_CONFIG.LATEST_ERROR:
      return {...state, latestError: action.payload};
    case types.APP_CONFIG.SEARCH_ERROR:
      return {...state, searchError: action.payload};
    case types.APP_CONFIG.IMDB_SEARCH_ERROR:
      return {...state, imdbError: action.payload};
    case types.APP_CONFIG.SEARCH_ADV_ERROR:
      return {...state, advSearchError: action.payload};
    default:
      return state;
  }
}
