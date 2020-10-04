import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {types} from '../types';

const initState = {
  latest: null,
  error: null,
};

export const actions = {
  setLatest: (user, pass) => async (dispatch) => {
    await Axios.get(
      `https://filelist.io/api.php?username=${user}&passkey=${pass}&action=latest-torrents`,
    )
      .then(async (res) => {
        let {data} = res;
        dispatch({
          type: types.APP_CONFIG.GET_LATEST,
          payload: data,
        });
        try {
          await AsyncStorage.setItem('torrents', JSON.stringify(data));
        } catch (e) {
          console.log(e);
        }
      })
      .catch((err) => {
        dispatch({type: types.APP_CONFIG.SET_ERROR, payload: err});
      });
  },
  getLatest: () => async (dispatch) => {
    try {
      const torrents = await AsyncStorage.getItem('torrents');
      if (torrents !== null) {
        dispatch({
          type: types.APP_CONFIG.GET_LATEST,
          payload: JSON.parse(torrents),
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
  setError: () => async (dispatch) => {
    dispatch({type: types.APP_CONFIG.SET_ERROR, payload: null});
  },
  // getProfiles: () => async (dispatch) => {
  //   let data = [];
  //   await firestore()
  //     .collection('zapp-native')
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((documentSnapshot) => {
  //         data.push(documentSnapshot.data());
  //         dispatch({type: types.APP_CONFIG.GET_PROFILES, payload: data});
  //       });
  //     })
  //     .catch((error) =>
  //       dispatch({type: types.APP_CONFIG.GET_PROFILES_ERROR, payload: error}),
  //     );
  // },
  // getCurrentUser: () => async (dispatch) => {
  //   let current = [];
  //   await firestore()
  //     .collection('zapp-native')
  //     .where('_id', '==', auth().currentUser.uid)
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((documentSnapshot) => {
  //         current.push(documentSnapshot.data());
  //         dispatch({type: types.APP_CONFIG.GET_CURRENTUSER, payload: current});
  //       });
  //     })
  //     .catch((error) =>
  //       dispatch({
  //         type: types.APP_CONFIG.GET_CURRENTUSER_ERROR,
  //         payload: error,
  //       }),
  //     );
  // },
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case types.APP_CONFIG.GET_LATEST:
      return {...state, latest: action.payload};
    case types.APP_CONFIG.SET_ERROR:
      return {...state, error: action.payload};
    default:
      return state;
  }
}
