/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
  PermissionsAndroid,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Collapsible from 'react-native-collapsible';
import { Input, Overlay, Badge } from 'react-native-elements';
import Chip from 'react-native-paper/lib/commonjs/components/Chip';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Forms
import * as yup from 'yup';
import { Formik } from 'formik';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from '../redux/actions';
// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronCircleUp,
  faChevronCircleDown,
  faCopy,
  faDownload,
  faDatabase,
  faSearch,
  faAngleDoubleUp,
  faFileDownload,
  faCheckSquare,
  faEraser,
  faFilter,
  faArrowLeft,
  faTimes,
  faArrowUp,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { faImdb } from '@fortawesome/free-brands-svg-icons';
// Assets
import { catValues } from '../assets/catData';
import { RO, EN } from '../assets/lang';
// Variables
import {
  width,
  height,
  MAIN_LIGHT,
  ACCENT_COLOR,
  statusHeight,
  sortArrayHistory,
  PressableOpacity,
  getColor,
  getCategoryIcon,
} from '../assets/variables';

export default function Search({ navigation }) {
  // Redux
  const dispatch = useDispatch();
  const {
    lightTheme,
    fontSizes,
    collItems,
    historyList,
    listSearch,
    searchLoading,
    searchError,
    enLang,
    hasNotch,
    variables,
  } = useSelector((state) => state.appConfig);
  // State
  const [catIndex, setCatIndex] = useState('');
  const [searchText, setSearchText] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [catListLatest, setCatListLatest] = useState(false);
  const [imdbSearch, setImdbSearch] = useState(false);
  const [keySearch, setKeySearch] = useState(true);
  const [isNetReachable, setIsNetReachable] = useState(true);
  const [historyHidden, setHistoryHidden] = useState(false);
  // Categories
  const [animes, setAnimes] = useState(false);
  const [audio, setAudio] = useState(false);
  const [desene, setDesene] = useState(false);
  const [diverse, setDiverse] = useState(false);
  const [doc, setDoc] = useState(false);
  const [filme3d, setFilme3d] = useState(false);
  const [filme4k, setFilme4k] = useState(false);
  const [filme4kbd, setFilme4kBD] = useState(false);
  const [filmeBD, setFilmeBD] = useState(false);
  const [filmeDvd, setFilmeDvd] = useState(false);
  const [filmeDvdRo, setFilmeDvdRo] = useState(false);
  const [filmeHd, setFilmeHd] = useState(false);
  const [filmeHdRo, setFilmeHdRo] = useState(false);
  const [filmeSd, setFilmeSd] = useState(false);
  const [flacs, setFlacs] = useState(false);
  const [jocConsole, setJocConsole] = useState(false);
  const [jocPc, setJocPc] = useState(false);
  const [lin, setLin] = useState(false);
  const [mob, setMob] = useState(false);
  const [software, setSoftware] = useState(false);
  const [seriale4k, setSeriale4k] = useState(false);
  const [serialeHd, setSerialeHd] = useState(false);
  const [serialeSd, setSerialeSd] = useState(false);
  const [sports, setSports] = useState(false);
  const [videos, setVideos] = useState(false);
  const [porn, setPorn] = useState(false);
  const [doubleUp, setDoubleUp] = useState(false);
  const [freeleech, setFreeleech] = useState(false);
  const [internal, setInternal] = useState(false);
  // Animations
  const [showNetworkAlertTextOn] = useState(new Animated.Value(0));
  const [showNetworkAlertTextOff] = useState(new Animated.Value(0));
  const [showNetworkAlertOn] = useState(
    new Animated.Value(
      Platform.OS === 'ios' && hasNotch ? -statusHeight * 3 : statusHeight * 3,
    ),
  );
  const [showNetworkAlertOff] = useState(
    new Animated.Value(
      Platform.OS === 'ios' && hasNotch ? -statusHeight * 3 : statusHeight * 3,
    ),
  );

  // Refs
  const netRef = useRef(false);
  const searchRef = useRef(null);
  const formikRef = useRef(null);

  // Component mount
  useEffect(() => {
    inputKeyword.length &&
      historyList.length &&
      sortArrayHistory(historyList, inputKeyword);
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [inputKeyword]);

  useEffect(() => {
    // Connection listener
    const netListener = NetInfo.addEventListener((state) => {
      if (Platform.OS === 'ios') {
        if (state.isInternetReachable === null) {
          setTimeout(() => {
            if (state.isInternetReachable) {
              setIsNetReachable(true);
            } else {
              setIsNetReachable(false);
            }
          }, 1000);
        } else {
          if (state.isInternetReachable) {
            if (netRef.current) {
              setIsNetReachable(true);
              netOn();
            } else {
              netRef.current = true;
            }
          } else {
            setIsNetReachable(false);
            netOff();
          }
        }
      } else {
        if (state.isInternetReachable) {
          if (netRef.current) {
            setIsNetReachable(true);
            netOn();
          } else {
            netRef.current = true;
          }
        } else {
          setIsNetReachable(false);
          netOff();
        }
      }
    });

    return () => {
      netListener();
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [isNetReachable]);

  useEffect(() => {
    // API error handling
    if (searchError !== null) {
      if (searchError.response.status === 429) {
        setLimitReached();
      }
      if (searchError.response.status === 503) {
        setAPIDown();
      }
    }
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // Get search history list everytime screen gets focus
        dispatch(AppConfigActions.getHistoryList());
        setHistoryHidden(true);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [searchError]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => {
        goBack();
        return true;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FUNCTIONS
  const closeSuggestions = () => setHistoryHidden(false);
  const animesSetCat = () => setAnimes(!animes);
  const audioSetCat = () => setAudio(!audio);
  const deseneSetCat = () => setDesene(!desene);
  const diverseSetCat = () => setDiverse(!diverse);
  const docSetCat = () => setDoc(!doc);
  const filme3dSetCat = () => setFilme3d(!filme3d);
  const filme4kSetCat = () => setFilme4k(!filme4k);
  const filme4kbdSetCat = () => setFilme4kBD(!filme4kbd);
  const filmeBDSetCat = () => setFilmeBD(!filmeBD);
  const filmeDvdSetCat = () => setFilmeDvd(!filmeDvd);
  const filmeDvdRoSetCat = () => setFilmeDvdRo(!filmeDvdRo);
  const filmeHdSetCat = () => setFilmeHd(!filmeHd);
  const filmeHdRoSetCat = () => setFilmeHdRo(!filmeHdRo);
  const filmeSdSetCat = () => setFilmeSd(!filmeSd);
  const flacsSetCat = () => setFlacs(!flacs);
  const jocConsoleSetCat = () => setJocConsole(!jocConsole);
  const jocPcSetCat = () => setJocPc(!jocPc);
  const linSetCat = () => setLin(!lin);
  const mobSetCat = () => setMob(!mob);
  const softwareSetCat = () => setSoftware(!software);
  const seriale4kSetCat = () => setSeriale4k(!seriale4k);
  const serialeHdSetCat = () => setSerialeHd(!serialeHd);
  const serialeSdSetCat = () => setSerialeSd(!serialeSd);
  const sportsSetCat = () => setSports(!sports);
  const videosSetCat = () => setVideos(!videos);
  const pornSetCat = () => setPorn(!porn);
  const freeleechSetCat = () => setFreeleech(!freeleech);
  const internalSetCat = () => setInternal(!internal);
  const doubleSetCat = () => setDoubleUp(!doubleUp);
  const displayCatList = () => setCatListLatest(!catListLatest);
  const setSearchValue = (query) => () =>
    formikRef.current.setFieldValue('search', query);

  const setLimitReached = () =>
    Alert.alert(
      'Info',
      enLang ? EN.alert150S : RO.alert150S,
      [
        {
          text: 'OK',
          onPress: () => { },
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );

  const setAPIDown = () =>
    Alert.alert(
      'Info',
      enLang ? EN.alertAPI : RO.alertAPI,
      [
        {
          text: 'OK',
          onPress: () => { },
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );

  const sizeInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrSize : RO.torrSize,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );

  const seedersInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrSeeds : RO.torrSeeds,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );

  const downloadInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrDown : RO.torrDown,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );

  const filesInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrFiles : RO.torrFiles,
      [
        {
          text: 'OK',
        },
      ],
      { onDismiss: () => { }, cancelable: true },
    );

  const leechersInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrLeech : RO.torrLeech,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );

  const showKeywordSearchInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.keywordInfo : RO.keywordInfo,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );

  const showIMDbSearchInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.imdbInfo : RO.imdbInfo,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );

  const onRefChange = useCallback((node) => {
    if (node === null) {
      // node is null, if DOM node of ref had been unmounted before
    } else {
      formikRef.current = node;
      setInputKeyword(node.values.search);
    }
  }, []);

  const clearSearchHistory = async () => {
    setHistoryHidden(false);
    await AsyncStorage.removeItem('history');
    // Set search history empty after AsyncStorage got cleared
    dispatch(AppConfigActions.getHistoryList());
  };

  const goIMDb = (id) => async () => {
    navigation.navigate('IMDb', {
      id,
    });
  };

  const addHistoryItem = async (item) => {
    let currentHistory = await AsyncStorage.getItem('history');
    let currentData = JSON.parse(currentHistory || '[]');
    let randomId = Math.floor(Math.random() * Math.floor(100000 * 100000));
    let newItem = {
      id: randomId,
      query: item,
    };
    currentData.push(newItem);
    await AsyncStorage.setItem('history', JSON.stringify(currentData));
    // get search history after new search
    dispatch(AppConfigActions.getHistoryList());
  };

  const goBack = () => {
    setTimeout(() => {
      Keyboard.dismiss();
    }, 10);
    resetFilters();
    dispatch(AppConfigActions.clearSearchStorage());
    navigation.navigate('Home');
    setHistoryHidden(false);
  };

  const formatBytes = (a, b = 2) => {
    if (a === 0) {
      return '0 Bytes';
    }
    const c = b > 0 ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));
    return (
      parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
      ' ' +
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    );
  };

  const setCollapsible = (id) => () => {
    const newIds = [...collItems];
    const index = newIds.indexOf(id);
    if (index > -1) {
      newIds.splice(index, 1);
    } else {
      newIds.shift();
      newIds.push(id);
    }
    dispatch(AppConfigActions.setCollItems(newIds));
  };

  const handleSearchType = async (action, type, query) => {
    try {
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      dispatch(
        AppConfigActions.getSearch(
          value0,
          value1,
          action,
          type,
          query,
          catIndex.length < 1 ? '' : `&category=${catIndex}`,
          freeleech ? '&freeleech=1' : '',
          internal ? '&internal=1' : '',
          doubleUp ? '&doubleup=1' : '',
        ),
      );
    } catch (e) {
      Alert.alert(
        enLang ? EN.searchErrH : RO.searchErrH,
        enLang ? EN.searchErr : RO.searchErr,
        [
          {
            text: 'OK',
            onPress: () => { },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const handleSearch = async (query) => {
    formikRef.current.setFieldValue('search', query);
    setHistoryHidden(false);
    Keyboard.dismiss();
    // if user network connection is online
    if (isNetReachable) {
      dispatch(AppConfigActions.clearSearchStorage());
      setSearchText(query);
      // if empty search textbox && no filters selected
      if (query === '' && catIndex.length < 1) {
        Alert.alert(
          'Info',
          enLang ? EN.searchNoKey : RO.searchNoKey,
          [
            {
              text: 'OK',
              onPress: () => { },
              style: 'cancel',
            },
          ],
          { cancelable: true },
        );
        // if search textbox || filters not empty
      } else {
        // if search textbox not empty && filters empty
        if (query.length > 0) {
          // save search keyword for history suggestions list
          addHistoryItem(query);
          handleSearchType(
            'search-torrents',
            keySearch ? 'name' : 'imdb',
            query,
          );
          // if search textbox empty && filters not empty
        } else {
          handleSearchType(
            'latest-torrents',
            keySearch ? 'name' : 'imdb',
            query,
          );
        }
      }
      // if user network connection is offline
    } else {
      netOff();
    }
  };

  const downloadTorrent = (name, link) => async () => {
    const { android, ios, config, fs } = RNFetchBlob;
    const downloadDir = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });
    const configOptions = Platform.select({
      ios: {
        IOSBackgroundTask: true,
        fileCache: true,
        indicator: true,
        title: `${name}.torrent`,
        path: `${downloadDir}/${name}.torrent`,
        appendExt: 'torrent',
      },
      android: {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mime: 'application/x-bittorrent',
          path: `${downloadDir}/${name}.torrent`,
          mediaScannable: false,
        },
      },
    });

    if (Platform.OS === 'ios') {
      if (isNetReachable) {
        config(configOptions)
          .fetch('GET', link)
          .then((res) => {
            fs.writeFile(`${downloadDir}/${name}.torrent`, res.data, 'base64');
            ios.previewDocument(`${downloadDir}/${name}.torrent`);
          });
      } else {
        netOff();
      }
    } else {
      const request = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        request['android.permission.READ_EXTERNAL_STORAGE'] &&
        request['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      ) {
        if (isNetReachable) {
          config(configOptions)
            .fetch('GET', link)
            .then((res) => {
              android.actionViewIntent(res.path(), 'application/x-bittorrent');
            });
        } else {
          netOff();
        }
      } else {
        ToastAndroid.showWithGravity(
          enLang ? EN.permissionDenied : RO.permissionDenied,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }
  };

  const selectedFilters = [
    animes ? 1 : 0,
    audio ? 1 : 0,
    desene ? 1 : 0,
    diverse ? 1 : 0,
    doc ? 1 : 0,
    filme3d ? 1 : 0,
    filme4k ? 1 : 0,
    filme4kbd ? 1 : 0,
    filmeBD ? 1 : 0,
    filmeDvd ? 1 : 0,
    filmeDvdRo ? 1 : 0,
    filmeHd ? 1 : 0,
    filmeHdRo ? 1 : 0,
    filmeSd ? 1 : 0,
    flacs ? 1 : 0,
    jocConsole ? 1 : 0,
    jocPc ? 1 : 0,
    lin ? 1 : 0,
    mob ? 1 : 0,
    software ? 1 : 0,
    seriale4k ? 1 : 0,
    serialeHd ? 1 : 0,
    serialeSd ? 1 : 0,
    sports ? 1 : 0,
    videos ? 1 : 0,
    porn ? 1 : 0,
    doubleUp ? 1 : 0,
    freeleech ? 1 : 0,
    internal ? 1 : 0,
  ]
    .reduce((a, b) => a + b, 0)
    .toString();

  const resetFilters = () => {
    setKeySearch(true);
    setImdbSearch(false);
    setAnimes(false);
    setAudio(false);
    setDesene(false);
    setDiverse(false);
    setDoc(false);
    setFilme3d(false);
    setFilme4k(false);
    setFilme4kBD(false);
    setFilmeBD(false);
    setFilmeDvd(false);
    setFilmeDvdRo(false);
    setFilmeHd(false);
    setFilmeHdRo(false);
    setFilmeSd(false);
    setFlacs(false);
    setJocConsole(false);
    setJocPc(false);
    setLin(false);
    setMob(false);
    setSoftware(false);
    setSeriale4k(false);
    setSerialeHd(false);
    setSerialeSd(false);
    setSports(false);
    setVideos(false);
    setPorn(false);
    setFreeleech(false);
    setInternal(false);
    setDoubleUp(false);
  };

  const getIndexes = () => {
    setCatListLatest(!catListLatest);
    setCatIndex(
      [
        animes,
        audio,
        desene,
        diverse,
        doc,
        filme3d,
        filme4k,
        filme4kbd,
        filmeBD,
        filmeDvd,
        filmeDvdRo,
        filmeHd,
        filmeHdRo,
        filmeSd,
        flacs,
        jocConsole,
        jocPc,
        lin,
        mob,
        software,
        seriale4k,
        serialeHd,
        serialeSd,
        sports,
        videos,
        porn,
      ]
        .reduce((out, bool, index) => (bool ? out.concat(index) : out), [])
        .map((index) => catValues[index]),
    );
  };

  const netOn = () => {
    setTimeout(() => {
      Animated.timing(showNetworkAlertOn, {
        toValue: Platform.OS === 'ios' && hasNotch ? statusHeight * 1.5 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(showNetworkAlertTextOn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 100);
    setTimeout(() => {
      Animated.timing(showNetworkAlertOn, {
        toValue:
          Platform.OS === 'ios' && hasNotch
            ? -statusHeight * 1.5
            : statusHeight,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(showNetworkAlertTextOn, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 4000);
  };

  const netOff = () => {
    setTimeout(() => {
      Animated.timing(showNetworkAlertOff, {
        toValue: Platform.OS === 'ios' && hasNotch ? statusHeight * 1.5 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(showNetworkAlertTextOff, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 100);
    setTimeout(() => {
      Animated.timing(showNetworkAlertOff, {
        toValue:
          Platform.OS === 'ios' && hasNotch
            ? -statusHeight * 1.5
            : statusHeight,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(showNetworkAlertTextOff, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 4000);
  };

  const setKeywordSearchType = () => {
    setKeySearch(true);
    setImdbSearch(false);
  };

  const setIMDbSearchType = () => {
    setImdbSearch(true);
    setKeySearch(false);
  };

  const SkeletonLoading = () => {
    return (
      <SkeletonContent
        boneColor={
          lightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.04)'
        }
        highlightColor={lightTheme ? '#rgba(0, 0, 0, 0.05)' : '#171717'}
        duration={700}
        containerStyle={[
          SearchPage.skeletonContainer,
          {
            borderColor: lightTheme ? 'rgba(0, 0, 0, 0.1)' : '#171717',
            backgroundColor: lightTheme
              ? 'rgba(0, 0, 0, 0.05)'
              : 'rgba(255, 255, 255, 0.04)',
          },
        ]}
        isLoading={true}>
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 0,
            marginRight: 8,
          }}
        />
        <View
          style={{
            height: statusHeight / 2,
            width: width / 1.7,
            borderRadius: 0,
          }}
        />
        <View
          style={{
            marginLeft: 62,
            position: 'absolute',
            bottom: 9,
            height: statusHeight / 2.5,
            width: width / 4,
            borderRadius: 0,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 7,
            right: 9,
            width: 13,
            height: 13,
            borderRadius: 100,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 7,
            right: 27,
            width: 13,
            height: 13,
            borderRadius: 100,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 7,
            right: 45,
            width: 13,
            height: 13,
            borderRadius: 100,
          }}
        />
      </SkeletonContent>
    );
  };

  // Torrent pressable
  const Item = ({ item, onPress, style }) => (
    <PressableOpacity
      activeOpacity={0.5}
      onPress={setCollapsible(item.id)}
      android_ripple={{
        color: 'grey',
        borderless: false,
      }}
      style={[SearchPage.itemPressable, style]}>
      <View
        style={[
          SearchPage.itemPressableContainer,
          {
            borderBottomWidth: collItems.includes(item.id) ? 0 : 1,
            borderColor: lightTheme ? 'rgba(0, 0, 0, 0.1)' : '#171717',
            backgroundColor: lightTheme
              ? 'rgba(0, 0, 0, 0.05)'
              : 'rgba(255, 255, 255, 0.04)',
          },
        ]}>
        <View style={SearchPage.itemPressableFirst}>
          <View style={SearchPage.itemPresssablePic}>
            <FastImage
              style={SearchPage.itemPresssableFastImage}
              resizeMode={FastImage.resizeMode.contain}
              source={{ uri: getCategoryIcon(item?.category, variables) }} />
          </View>
          <View style={SearchPage.itemPressableNameContainer}>
            <Text
              style={[
                SearchPage.itemPressableNameText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[1] : 8),
                  color: getColor(lightTheme),
                },
              ]}>
              {item.name}
            </Text>
            <Text
              style={[
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                  color: lightTheme ? 'grey' : 'silver',
                },
              ]}>
              {item.upload_date.substring(8, 10) +
                '-' +
                item.upload_date.substring(5, 7) +
                '-' +
                item.upload_date.substring(0, 4) +
                ' | ' +
                item.upload_date.substring(11, 16)}
            </Text>
          </View>
          <View style={SearchPage.itemPressableUploadContainer}>
            {item.freeleech === 1 ? (
              <View style={SearchPage.itemPressableFreeleechText} />
            ) : null}
            {item.internal === 1 ? (
              <View style={SearchPage.itemPressableInternalText} />
            ) : null}
            {item.doubleup === 1 ? (
              <View style={SearchPage.itemPressableDoubleUpText} />
            ) : null}
          </View>
        </View>
      </View>
    </PressableOpacity>
  );

  const renderItem = ({ item }) => {
    return (
      <>
        <Item
          item={item}
          style={{
            marginTop: 3,
            marginBottom: collItems.includes(item.id) ? 0 : 3,
            backgroundColor: 'transparent',
          }}
        />
        <Collapsible
          enablePointerEvents={true}
          collapsed={!collItems.includes(item.id)}>
          <View
            style={[
              SearchPage.collContainer,
              {
                borderColor: lightTheme ? 'rgba(0, 0, 0, 0.1)' : '#171717',
                backgroundColor: lightTheme
                  ? 'rgba(0, 0, 0, 0.05)'
                  : 'rgba(255, 255, 255, 0.04)',
              },
            ]}>
            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  {
                    fontSize: Adjust(fontSizes !== null ? fontSizes[1] : 9),
                    color: getColor(lightTheme),
                  },
                ]}>
                {item.small_description}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {item.freeleech === 1 ? (
                  <Text
                    style={[
                      SearchPage.imdbInfoFreeleechBadge,
                      {
                        fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                        fontWeight: 'bold',
                        marginRight:
                          item.freeleech === 1 &&
                            item.internal === 0 &&
                            item.doubleup === 0
                            ? 0
                            : 4,
                      },
                    ]}>
                    FREELEECH
                  </Text>
                ) : null}
                {item.internal === 1 ? (
                  <Text
                    style={[
                      SearchPage.imdbInfoInternalBadge,
                      {
                        fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                        fontWeight: 'bold',
                        marginRight:
                          item.freeleech === 1 &&
                            item.internal === 1 &&
                            item.doubleup === 0
                            ? 0
                            : 4,
                      },
                    ]}>
                    INTERNAL
                  </Text>
                ) : null}
                {item.doubleup === 1 ? (
                  <Text
                    style={[
                      SearchPage.imdbInfoDoubleUpBadge,
                      {
                        fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                        fontWeight: 'bold',
                        marginRight:
                          item.freeleech === 1 &&
                            item.internal === 1 &&
                            item.doubleup === 1
                            ? 0
                            : 4,
                      },
                    ]}>
                    2X UPLOAD
                  </Text>
                ) : null}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: width / 16,
                  paddingBottom: width / 16,
                }}>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={downloadTorrent(item.name, item.download_link)}>
                    <FontAwesomeIcon
                      size={14}
                      icon={faFileDownload}
                      color={ACCENT_COLOR}
                    />
                    <Text
                      style={[
                        {
                          fontSize: Adjust(
                            fontSizes !== null ? fontSizes[1] : 8,
                          ),
                          color: lightTheme ? 'black' : MAIN_LIGHT,
                        },
                      ]}>
                      Download
                    </Text>
                  </PressableOpacity>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={sizeInfo}>
                    <FontAwesomeIcon
                      size={14}
                      icon={faDatabase}
                      color={ACCENT_COLOR}
                    />
                    <Text
                      style={[
                        {
                          fontSize: Adjust(
                            fontSizes !== null ? fontSizes[1] : 8,
                          ),
                          color: lightTheme ? 'black' : MAIN_LIGHT,
                        },
                      ]}>
                      {formatBytes(item.size)}
                    </Text>
                  </PressableOpacity>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={seedersInfo}>
                    <FontAwesomeIcon
                      size={14}
                      icon={faChevronCircleUp}
                      color={'limegreen'}
                    />
                    <Text
                      style={[
                        {
                          fontSize: Adjust(
                            fontSizes !== null ? fontSizes[1] : 8,
                          ),
                          color: lightTheme ? 'black' : MAIN_LIGHT,
                        },
                      ]}>
                      {item.seeders}
                    </Text>
                  </PressableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 5,
                }}>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={downloadInfo}>
                    <FontAwesomeIcon
                      size={14}
                      icon={faDownload}
                      color={ACCENT_COLOR}
                    />
                    <Text
                      style={[
                        {
                          fontSize: Adjust(
                            fontSizes !== null ? fontSizes[1] : 8,
                          ),
                          color: lightTheme ? 'black' : MAIN_LIGHT,
                        },
                      ]}>
                      {item.times_completed}
                    </Text>
                  </PressableOpacity>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={filesInfo}>
                    <FontAwesomeIcon
                      size={14}
                      icon={faCopy}
                      color={ACCENT_COLOR}
                    />
                    <Text
                      style={[
                        {
                          fontSize: Adjust(
                            fontSizes !== null ? fontSizes[1] : 8,
                          ),
                          color: lightTheme ? 'black' : MAIN_LIGHT,
                        },
                      ]}>
                      {item.files}
                    </Text>
                  </PressableOpacity>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={leechersInfo}>
                    <FontAwesomeIcon
                      size={14}
                      icon={faChevronCircleDown}
                      color={'crimson'}
                    />
                    <Text
                      style={[
                        {
                          fontSize: Adjust(
                            fontSizes !== null ? fontSizes[1] : 8,
                          ),
                          color: lightTheme ? 'black' : MAIN_LIGHT,
                        },
                      ]}>
                      {item.leechers}
                    </Text>
                  </PressableOpacity>
                </View>
              </View>
            </View>
            {item.imdb !== null ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
                    paddingBottom: 10,
                  }}>
                  <View
                    style={{
                      width: width / 6.5,
                      height: width / 6.5,
                      borderRadius: width / 6.5 / 2,
                      overflow: 'hidden',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: lightTheme ? 'goldenrod' : 'gold',
                    }}>
                    <PressableOpacity
                      activeOpacity={0.5}
                      style={{
                        width: width / 6.5,
                        height: width / 6.5,
                        borderRadius: width / 6.5 / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                      android_ripple={{
                        color: 'grey',
                      }}
                      onPress={goIMDb(item.imdb)}>
                      <FontAwesomeIcon
                        size={Adjust(32)}
                        icon={faImdb}
                        color={'black'}
                      />
                    </PressableOpacity>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </Collapsible>
      </>
    );
  };

  // Component render
  return (
    <View
      style={[
        SearchPage.mainSafeAreaView,
        {
          backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
        },
      ]}>
      <Overlay
        statusBarTranslucent={false}
        animationType="slide"
        overlayStyle={[
          SearchPage.catCheckOverlay,
          {
            flex: 1,
            padding: 0,
            margin: 0,
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
          },
        ]}
        isVisible={catListLatest}
        onBackdropPress={getIndexes}>
        <>
          <View style={SearchPage.catCheckContainer}>
            <View
              style={{
                height:
                  Platform.OS === 'ios' && !hasNotch
                    ? statusHeight * 5
                    : statusHeight * 3.5,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: ACCENT_COLOR,
              }}>
              <PressableOpacity
                activeOpacity={0.5}
                style={{
                  position: 'absolute',
                  top:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 2.4
                      : Platform.OS === 'ios' && hasNotch
                        ? statusHeight * 2.2
                        : statusHeight * 1.6,
                  left:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight
                      : statusHeight / 1.5,
                }}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: statusHeight / 1.3,
                }}
                onPress={getIndexes}>
                <FontAwesomeIcon
                  color={'white'}
                  size={Adjust(22)}
                  icon={faArrowLeft}
                />
              </PressableOpacity>
              <Text
                style={{
                  fontSize: Adjust(16),
                  marginTop:
                    Platform.OS === 'ios'
                      ? statusHeight * 2
                      : statusHeight * 1.1,
                  marginBottom: statusHeight / 2,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {enLang ? EN.filters : RO.filters}
              </Text>
              <PressableOpacity
                activeOpacity={0.5}
                style={{
                  position: 'absolute',
                  top:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 2.4
                      : Platform.OS === 'ios' && hasNotch
                        ? statusHeight * 2.2
                        : statusHeight * 1.6,
                  right:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight
                      : statusHeight / 1.5,
                }}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: statusHeight / 1.3,
                }}
                onPress={resetFilters}>
                <FontAwesomeIcon
                  color={'white'}
                  size={Adjust(22)}
                  icon={faEraser}
                />
              </PressableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={true}
              overScrollMode={'never'}
              bounces={false}
              style={[
                SearchPage.catCheckScrollView,
                { backgroundColor: lightTheme ? MAIN_LIGHT : 'black' },
              ]}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  paddingVertical: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    fontWeight: 'bold',
                    paddingLeft: 5,
                  }}>
                  {enLang ? EN.searchType : RO.searchType}
                </Text>
              </View>
              <View style={SearchPage.catCheckScrollContainer}>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? keySearch
                        ? '#155778'
                        : '#d4d2d2'
                      : keySearch
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? keySearch
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    keySearch ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onLongPress={showKeywordSearchInfo}
                  onPress={setKeywordSearchType}>
                  {enLang ? EN.keywordType : RO.keywordType}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? imdbSearch
                        ? '#155778'
                        : '#d4d2d2'
                      : imdbSearch
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? imdbSearch
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    imdbSearch ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onLongPress={showIMDbSearchInfo}
                  onPress={setIMDbSearchType}>
                  {enLang ? EN.imdbType : RO.imdbType}
                </Chip>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  paddingVertical: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    fontWeight: 'bold',
                    paddingLeft: 5,
                  }}>
                  {enLang ? EN.catType : RO.catType}
                </Text>
              </View>
              <View style={SearchPage.catCheckScrollContainer}>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? animes
                        ? '#155778'
                        : '#d4d2d2'
                      : animes
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (animes ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    animes ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={animesSetCat}>
                  Anime
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? audio
                        ? '#155778'
                        : '#d4d2d2'
                      : audio
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (audio ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    audio ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={audioSetCat}>
                  Audio
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? desene
                        ? '#155778'
                        : '#d4d2d2'
                      : desene
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (desene ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    desene ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={deseneSetCat}>
                  {enLang ? EN.cartoons : RO.cartoons}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? diverse
                        ? '#155778'
                        : '#d4d2d2'
                      : diverse
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (diverse ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    diverse ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={diverseSetCat}>
                  {enLang ? EN.misc : RO.misc}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? doc
                        ? '#155778'
                        : '#d4d2d2'
                      : doc
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (doc ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    doc ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={docSetCat}>
                  Docs
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? flacs
                        ? '#155778'
                        : '#d4d2d2'
                      : flacs
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (flacs ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    flacs ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={flacsSetCat}>
                  FLAC
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? jocConsole
                        ? '#155778'
                        : '#d4d2d2'
                      : jocConsole
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? jocConsole
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    jocConsole ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={jocConsoleSetCat}>
                  {enLang ? EN.console : RO.console}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? jocPc
                        ? '#155778'
                        : '#d4d2d2'
                      : jocPc
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (jocPc ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    jocPc ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={jocPcSetCat}>
                  {enLang ? EN.pc : RO.pc}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? lin
                        ? '#155778'
                        : '#d4d2d2'
                      : lin
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (lin ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    lin ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={linSetCat}>
                  Linux
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? mob
                        ? '#155778'
                        : '#d4d2d2'
                      : mob
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (mob ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    mob ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={mobSetCat}>
                  Mobile
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? software
                        ? '#155778'
                        : '#d4d2d2'
                      : software
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? software
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    software ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={softwareSetCat}>
                  {enLang ? EN.software : RO.software}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? sports
                        ? '#155778'
                        : '#d4d2d2'
                      : sports
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (sports ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    sports ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={sportsSetCat}>
                  Sport
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? videos
                        ? '#155778'
                        : '#d4d2d2'
                      : videos
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (videos ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    videos ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={videosSetCat}>
                  {enLang ? EN.clips : RO.clips}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? porn
                        ? '#155778'
                        : '#d4d2d2'
                      : porn
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (porn ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    porn ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={pornSetCat}>
                  XXX
                </Chip>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingVertical: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <Text
                    style={{
                      color: getColor(lightTheme),
                      paddingLeft: 5,
                    }}>
                    {enLang ? EN.movTV : RO.movTV}
                  </Text>
                </View>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filme3d
                        ? '#155778'
                        : '#d4d2d2'
                      : filme3d
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (filme3d ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    filme3d ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filme3dSetCat}>
                  {enLang ? EN.td : RO.td}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filme4k
                        ? '#155778'
                        : '#d4d2d2'
                      : filme4k
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (filme4k ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    filme4k ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filme4kSetCat}>
                  {enLang ? EN.pk : RO.pk}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filme4kbd
                        ? '#155778'
                        : '#d4d2d2'
                      : filme4kbd
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? filme4kbd
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    filme4kbd ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filme4kbdSetCat}>
                  {enLang ? EN.pkbd : RO.pkbd}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filmeBD
                        ? '#155778'
                        : '#d4d2d2'
                      : filmeBD
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (filmeBD ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    filmeBD ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filmeBDSetCat}>
                  {enLang ? EN.bd : RO.bd}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filmeDvd
                        ? '#155778'
                        : '#d4d2d2'
                      : filmeDvd
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? filmeDvd
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    filmeDvd ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filmeDvdSetCat}>
                  {enLang ? EN.dvd : RO.dvd}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filmeDvdRo
                        ? '#155778'
                        : '#d4d2d2'
                      : filmeDvdRo
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? filmeDvdRo
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    filmeDvdRo ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filmeDvdRoSetCat}>
                  {enLang ? EN.dvdro : RO.dvdro}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filmeHd
                        ? '#155778'
                        : '#d4d2d2'
                      : filmeHd
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (filmeHd ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    filmeHd ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filmeHdSetCat}>
                  {enLang ? EN.hd : RO.hd}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filmeHdRo
                        ? '#155778'
                        : '#d4d2d2'
                      : filmeHdRo
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? filmeHdRo
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    filmeHdRo ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filmeHdRoSetCat}>
                  {enLang ? EN.hdro : RO.hdro}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? filmeSd
                        ? '#155778'
                        : '#d4d2d2'
                      : filmeSd
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme ? (filmeSd ? 'white' : 'black') : 'white',
                  }}
                  icon={() =>
                    filmeSd ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={filmeSdSetCat}>
                  {enLang ? EN.sd : RO.sd}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? seriale4k
                        ? '#155778'
                        : '#d4d2d2'
                      : seriale4k
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? seriale4k
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    seriale4k ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={seriale4kSetCat}>
                  {enLang ? EN.pks : RO.pks}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? serialeHd
                        ? '#155778'
                        : '#d4d2d2'
                      : serialeHd
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? serialeHd
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    serialeHd ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={serialeHdSetCat}>
                  {enLang ? EN.hds : RO.hds}
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? serialeSd
                        ? '#155778'
                        : '#d4d2d2'
                      : serialeSd
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? serialeSd
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    serialeSd ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={serialeSdSetCat}>
                  {enLang ? EN.sds : RO.sds}
                </Chip>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  paddingVertical: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    fontWeight: 'bold',
                    paddingLeft: 5,
                  }}>
                  {enLang ? EN.tags : RO.tags}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? freeleech
                        ? '#155778'
                        : '#d4d2d2'
                      : freeleech
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? freeleech
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    freeleech ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={freeleechSetCat}>
                  Freeleech
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? internal
                        ? '#155778'
                        : '#d4d2d2'
                      : internal
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? internal
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    internal ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={internalSetCat}>
                  Internal
                </Chip>
                <Chip
                  style={{
                    backgroundColor: lightTheme
                      ? doubleUp
                        ? '#155778'
                        : '#d4d2d2'
                      : doubleUp
                        ? '#155778'
                        : '#202020',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  textStyle={{
                    color: lightTheme
                      ? doubleUp
                        ? 'white'
                        : 'black'
                      : 'white',
                  }}
                  icon={() =>
                    doubleUp ? (
                      <FontAwesomeIcon
                        style={{ color: ACCENT_COLOR }}
                        size={14}
                        icon={faCheckSquare}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{
                          color: 'transparent',
                          borderColor: 'grey',
                          borderRadius: 1,
                          borderWidth: 1,
                        }}
                        size={14}
                        icon={faAngleDoubleUp}
                      />
                    )
                  }
                  onPress={doubleSetCat}>
                  2x Upload
                </Chip>
              </View>
            </ScrollView>
          </View>
        </>
      </Overlay>
      <View
        style={[
          SearchPage.mainHeader,
          {
            height:
              Platform.OS === 'ios' && !hasNotch
                ? statusHeight * 5
                : statusHeight * 3.5,
          },
        ]}>
        <Formik
          innerRef={onRefChange}
          initialValues={{ search: '' }}
          onSubmit={(values) => {
            searchLoading ? null : handleSearch(values.search);
          }}
          validationSchema={yup.object().shape({
            search: yup.string(),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            resetForm,
            touched,
            isValid,
            handleSubmit,
          }) => (
            <>
              <Input
                style={[
                  SearchPage.inputStyle,
                  {
                    fontSize:
                      Platform.OS === 'ios' && hasNotch
                        ? Adjust(14)
                        : Adjust(12),
                    color: 'white',
                  },
                ]}
                inputContainerStyle={SearchPage.inputContainerInner}
                underlineColorAndroid="transparent"
                onSubmitEditing={handleSubmit}
                returnKeyType={'search'}
                selectionColor="grey"
                ref={searchRef}
                autoFocus
                onFocus={resetForm}
                placeholder={
                  keySearch
                    ? enLang
                      ? EN.placeholderK
                      : RO.placeholderK
                    : enLang
                      ? EN.placeholderI
                      : RO.placeholderI
                }
                placeholderTextColor={'rgba(255,255,255,0.8)'}
                value={values.search}
                onChangeText={handleChange('search')}
                onBlur={() => setFieldTouched('search')}
              />
              <View style={SearchPage.mainHeaderSearch1Container}>
                {values.search.length > 0 ? (
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.mainHeaderCogPressable}
                    android_ripple={{
                      color: 'white',
                      borderless: true,
                      radius: statusHeight / 1.3,
                    }}
                    onPress={handleSubmit}>
                    <FontAwesomeIcon
                      size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                      color={'white'}
                      icon={faSearch}
                    />
                  </PressableOpacity>
                ) : (
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={[
                      SearchPage.mainHeaderCogPressable,
                      { paddingTop: Platform.OS === 'ios' && hasNotch ? 6 : 0 },
                    ]}
                    android_ripple={{
                      color: 'white',
                      borderless: true,
                      radius: statusHeight / 1.3,
                    }}
                    onPress={goBack}>
                    <FontAwesomeIcon
                      size={
                        Platform.OS === 'ios' && hasNotch
                          ? Adjust(28)
                          : Adjust(fontSizes !== null ? fontSizes[8] : 22)
                      }
                      color={'white'}
                      icon={faArrowLeft}
                    />
                  </PressableOpacity>
                )}
              </View>
              <View style={SearchPage.mainHeaderSearch2Container}>
                {values.search.length > 0 && (
                  <PressableOpacity
                    activeOpacity={0.5}
                    style={SearchPage.mainHeaderCogPressable}
                    android_ripple={{
                      color: 'white',
                      borderless: true,
                      radius: statusHeight / 1.3,
                    }}
                    onPress={resetForm}>
                    <FontAwesomeIcon
                      size={
                        Platform.OS === 'ios' && !hasNotch
                          ? Adjust(28)
                          : Platform.OS === 'ios' && hasNotch
                            ? Adjust(30)
                            : Adjust(fontSizes !== null ? fontSizes[8] : 22)
                      }
                      color={'white'}
                      icon={faTimes}
                    />
                  </PressableOpacity>
                )}
              </View>
              <View style={SearchPage.mainHeaderSearch3Container}>
                <Badge
                  containerStyle={[
                    SearchPage.mainHeaderSearch3Badge,
                    {
                      right:
                        +selectedFilters > 0 && +selectedFilters <= 9 ? 9 : 4,
                    },
                  ]}
                  badgeStyle={{
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                  }}
                  textStyle={{
                    color: +selectedFilters === 0 ? 'transparent' : 'black',
                    fontWeight: 'bold',
                  }}
                  value={selectedFilters}
                />
                <PressableOpacity
                  activeOpacity={0.5}
                  style={SearchPage.mainHeaderCogPressable}
                  android_ripple={{
                    color: 'white',
                    borderless: true,
                    radius: statusHeight / 1.3,
                  }}
                  onPress={displayCatList}>
                  <FontAwesomeIcon
                    size={
                      Platform.OS === 'ios' && !hasNotch
                        ? Adjust(22)
                        : Adjust(
                          fontSizes !== null
                            ? fontSizes[
                            Platform.OS === 'ios' && hasNotch ? 8 : 7
                            ]
                            : Platform.OS === 'ios'
                              ? 22
                              : 20,
                        )
                    }
                    color={'white'}
                    icon={faFilter}
                  />
                </PressableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
      {historyList.length && historyHidden && (
        <FlatList
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            width,
          }}
          data={historyList}
          ListHeaderComponent={() => (
            <View
              style={[
                SearchPage.itemHistoryNav,
                {
                  width,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <TouchableOpacity
                style={{
                  height:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 2
                      : statusHeight * 1.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={clearSearchHistory}>
                <Text
                  style={{
                    color: ACCENT_COLOR,
                    fontSize: Adjust(fontSizes !== null ? fontSizes[3] : 11),
                  }}>
                  {enLang ? EN.clearSearchHistory : RO.clearSearchHistory}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 2
                      : statusHeight * 1.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={closeSuggestions}>
                <Text
                  style={{
                    color: 'crimson',
                    fontSize: Adjust(fontSizes !== null ? fontSizes[3] : 11),
                  }}>
                  {enLang ? EN.close : RO.close}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <PressableOpacity
              activeOpacity={0.5}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width,
                height:
                  Platform.OS === 'ios' && !hasNotch
                    ? statusHeight * 2.2
                    : Platform.OS === 'ios' && hasNotch
                      ? statusHeight
                      : statusHeight * 1.6,
                paddingLeft: statusHeight / 2,
              }}
              android_ripple={{
                color: 'silver',
                borderless: false,
              }}
              onPress={() => handleSearch(item.query)}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <FontAwesomeIcon
                  size={Adjust(18)}
                  color={getColor(lightTheme)}
                  icon={faSync}
                  style={{
                    marginRight: statusHeight,
                    transform: [{ rotateY: '180deg' }],
                  }}
                />
                <Text
                  style={{
                    fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
                    fontWeight: 'bold',
                    color: getColor(lightTheme),
                  }}>
                  {item.query}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: statusHeight * 2,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={setSearchValue(item.query)}>
                <FontAwesomeIcon
                  style={{ transform: [{ rotate: '-45deg' }], marginLeft: 15 }}
                  size={Adjust(18)}
                  color={getColor(lightTheme)}
                  icon={faArrowUp}
                />
              </TouchableOpacity>
            </PressableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      {!historyHidden && (
        <FlatList
          data={
            searchLoading
              ? [
                { id: '1' },
                { id: '2' },
                { id: '3' },
                { id: '4' },
                { id: '5' },
                { id: '6' },
                { id: '7' },
                { id: '8' },
                { id: '9' },
                { id: '10' },
                { id: '11' },
                { id: '12' },
                { id: '13' },
                { id: '14' },
                { id: '15' },
              ]
              : listSearch !== null
                ? listSearch.slice(0, 30)
                : listSearch
          }
          renderItem={searchLoading ? () => <SkeletonLoading /> : renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 9,
            width,
          }}
          ListHeaderComponent={() =>
            listSearch === null ? null : JSON.stringify(listSearch) === '[]' ? (
              <View
                style={{
                  width: '100%',
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {enLang ? EN.resAfterA : RO.resAfterA}
                  {searchText}"
                </Text>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {enLang ? EN.resNo : RO.resNo}
                </Text>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    textAlign: 'center',
                  }}>
                  {enLang ? EN.resTry : RO.resTry}
                </Text>
              </View>
            ) : listSearch.length > 1 ? (
              <View
                style={{
                  width: '100%',
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: getColor(lightTheme),
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {enLang ? EN.resAfterB : RO.resAfterB}{' '}
                  {searchText === ''
                    ? enLang
                      ? EN.resAfterFilters
                      : RO.resAfterFilters
                    : '"' + searchText + '"'}
                </Text>
              </View>
            ) : null
          }
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      {isNetReachable ? (
        <Animated.View
          style={[
            SearchPage.networkAlertContainer,
            {
              height:
                Platform.OS === 'ios' && hasNotch
                  ? statusHeight * 1.5
                  : statusHeight,
              backgroundColor: 'limegreen',
              bottom: Platform.OS === 'ios' && hasNotch ? height : 0,
              justifyContent:
                Platform.OS === 'ios' && hasNotch ? 'flex-end' : 'center',
              paddingBottom: Platform.OS === 'ios' && hasNotch ? 6 : 0,
              transform: [
                {
                  translateY: showNetworkAlertOn,
                },
              ],
            },
          ]}>
          <Animated.Text
            style={{
              fontSize: Adjust(fontSizes !== null ? fontSizes[5] : 13),
              fontWeight: 'bold',
              opacity: showNetworkAlertTextOn,
              color: 'white',
            }}>
            ONLINE
          </Animated.Text>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            SearchPage.networkAlertContainer,
            {
              height:
                Platform.OS === 'ios' && hasNotch
                  ? statusHeight * 1.5
                  : statusHeight,
              backgroundColor: 'crimson',
              bottom: Platform.OS === 'ios' && hasNotch ? height : 0,
              justifyContent:
                Platform.OS === 'ios' && hasNotch ? 'flex-end' : 'center',
              paddingBottom: Platform.OS === 'ios' && hasNotch ? 6 : 0,
              transform: [
                {
                  translateY: showNetworkAlertOff,
                },
              ],
            },
          ]}>
          <Animated.Text
            style={{
              fontSize: Adjust(fontSizes !== null ? fontSizes[5] : 13),
              fontWeight: 'bold',
              opacity: showNetworkAlertTextOff,
              color: 'white',
            }}>
            OFFLINE
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
}

const SearchPage = EStyleSheet.create({
  itemPressable: {
    elevation: 7,
    zIndex: 7,
  },
  itemPressableHistory: {
    elevation: 7,
    zIndex: 7,
  },
  itemPressableContainer: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    padding: '0.5rem',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemPressableHistoryContainer: {
    width: '100%',
    height: statusHeight * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  itemHistoryNav: {
    paddingHorizontal: '0.8rem',
  },
  historyText: {
    paddingLeft: '1.2rem',
  },
  itemPressableFirst: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  itemPresssablePic: {
    height: 45,
    width: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPresssableFastImage: { height: '100%', width: '100%' },
  itemPressableNameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: '0.5rem',
    height: '100%',
    width: '90%',
  },
  itemPressableUploadContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  itemPressableFreeleechText: {
    width: '0.7rem',
    height: '0.7rem',
    borderColor: '#1ec621',
    borderWidth: 1,
    borderRadius: 100,
    marginLeft: '0.3rem',
    backgroundColor: '#09580a',
  },
  itemPressableDoubleUpText: {
    width: '0.7rem',
    height: '0.7rem',
    borderColor: '#7c00ff',
    borderWidth: 1,
    borderRadius: 100,
    marginLeft: '0.3rem',
    backgroundColor: '#370f61',
  },
  itemPressableInternalText: {
    width: '0.7rem',
    height: '0.7rem',
    borderColor: '#1e87c6',
    borderWidth: 1,
    borderRadius: 100,
    marginLeft: '0.3rem',
    backgroundColor: '#093b58',
  },
  mainSafeAreaView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  catCheckOverlay: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  catCheckContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catCheckScrollView: {
    width: '100%',
    height: '100%',
    marginBottom: statusHeight / 2,
    paddingHorizontal: 10,
  },
  catCheckScrollContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catCheckOverlayFooter: {
    width: '100%',
    height: statusHeight * 1.5,
    borderRadius: 34,
    overflow: 'hidden',
  },
  catCheckOverlayPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: 34,
  },
  catCheckOverlayErase: {
    width: width / 8,
    height: width / 8,
    borderRadius: 100,
    overflow: 'hidden',
  },
  catCheckOverlayPressableErase: {
    width: width / 8,
    height: width / 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: 100,
  },
  inputContainerInner: {
    borderBottomColor: MAIN_LIGHT,
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
  },
  inputStyle: {
    paddingLeft: '2.5rem',
    paddingRight: '5rem',
    borderBottomColor: 'transparent',
  },
  mainHeader: {
    width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: ACCENT_COLOR,
  },
  mainHeaderSearch1Container: {
    position: 'absolute',
    left: '0.3rem',
    bottom: '1.2rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderSearch2Container: {
    position: 'absolute',
    right: '3rem',
    bottom: '1.2rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderSearch3Container: {
    position: 'absolute',
    right: '0.3rem',
    bottom: '1.2rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderSearch3Badge: {
    position: 'absolute',
    bottom: 10,
  },
  mainHeaderCogPressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 9,
    marginVertical: 3,
    width: width / 1.048,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  collContainer: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 9,
    marginBottom: 3,
    flexDirection: 'column',
  },
  imdbInfoFreeleechBadge: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingRight: 2,
    borderColor: '#1ec621',
    borderWidth: 1,
    color: 'white',
    backgroundColor: '#09580a',
  },
  imdbInfoInternalBadge: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingRight: 2,
    borderColor: '#1e87c6',
    borderWidth: 1,
    color: 'white',
    backgroundColor: '#093b58',
  },
  imdbInfoDoubleUpBadge: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingRight: 2,
    marginLeft: 4,
    borderColor: '#7c00ff',
    borderWidth: 1,
    color: 'white',
    backgroundColor: '#370f61',
  },
  imdbInfoMainFooter3rdPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  networkAlertContainer: {
    elevation: 10,
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
});
