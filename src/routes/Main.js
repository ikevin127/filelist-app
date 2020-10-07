import React, {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  View,
  Text,
  Animated,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import {Input, Overlay} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
import {Main} from '../assets/styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faKey,
  faUserLock,
  faSearch,
  faInfoCircle,
  faChevronCircleUp,
  faChevronCircleDown,
  faCopy,
  faDownload,
  faDatabase,
  faCaretDown,
  faCalendarWeek,
  faSearchPlus,
  faStar,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import SplashScreen from 'react-native-splash-screen';
import Axios from 'axios';
import {USERNAME, PASSKEY} from '../../env';
import a3d from '../assets/cat/3d.png';
import a4k from '../assets/cat/4k.png';
import a4kbd from '../assets/cat/4kBD.png';
import a4ktv from '../assets/cat/4ks.png';
import anime from '../assets/cat/anime.png';
import apps from '../assets/cat/apps.png';
import bluray from '../assets/cat/bluray.png';
import cartoons from '../assets/cat/cartoons.png';
import console from '../assets/cat/console.png';
import docs from '../assets/cat/docs.png';
import dvdro from '../assets/cat/dvd-ro.png';
import dvd from '../assets/cat/dvd.png';
import flac from '../assets/cat/flac.png';
import games from '../assets/cat/games.png';
import hdro from '../assets/cat/hd-ro.png';
import hd from '../assets/cat/hd.png';
import hdtv from '../assets/cat/hdtv.png';
import linux from '../assets/cat/linux.png';
import misc from '../assets/cat/misc.png';
import mobile from '../assets/cat/mobile.png';
import music from '../assets/cat/music.png';
import sd from '../assets/cat/sd.png';
import sdtv from '../assets/cat/sdtv.png';
import sport from '../assets/cat/sport.png';
import vids from '../assets/cat/vids.png';
import xxx from '../assets/cat/xxx.png';

const MAIN_COLOR = '#E8E6E6';
const ACCENT_COLOR = '#1598F4';
const Stack = createStackNavigator();

function Home() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [advSearchText, setAdvSearchText] = useState('');
  const {
    listLatest,
    listSearch,
    listImdb,
    searchError,
    imdbError,
  } = useSelector((state) => state.appConfig);
  const [refreshing, setRefreshing] = useState(false);
  const [showStatus] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [showClipboardStatus] = useState(new Animated.Value(0));
  const [textClipboardOpacity] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [IMDbID, setIMDbID] = useState(null);
  const [IMDbData, setIMDbData] = useState(null);
  const [IMDbLoading, setIMDbLoading] = useState(false);
  const [advSearch, setAdvSearch] = useState(false);
  const [searchValidation, setSearchValidation] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchBy, setSearchBy] = useState(false);
  const [advIMDb, setAdvIMDb] = useState(false);
  const [advKeyword, setAdvKeyword] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const SearchBarRef = useRef();
  const AdvSearchRef = useRef();
  const searchValidationTimeout = useRef();

  useEffect(() => {
    if (IMDbID !== null) {
      fetchIMDbInfo(IMDbID);
    }
    if (listSearch !== null) {
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
    if (listImdb !== null) {
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
    if (
      JSON.stringify(listSearch) === '[]' ||
      JSON.stringify(listImdb) === '[]'
    ) {
      setNoResults(true);
    }
    if (searchError !== null || imdbError !== null) {
      setSearchLoading(false);
      setNoResults(true);
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        SearchBarRef.current.blur();
      },
    );

    return () => {
      clearTimeout(searchValidationTimeout.current);
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [modalData, IMDbID, listSearch, listImdb, searchError, imdbError]);

  // Functions

  const handleSearch = async () => {
    try {
      Keyboard.dismiss();
      setIsSearch(true);
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null && search !== '') {
        if (/\d{6,}/.test(search)) {
          setSearchLoading(true);
          dispatch(AppConfigActions.getImdb(value0, value1, search));
        } else if (/tt\d+/.test(search)) {
          setSearchLoading(true);
          dispatch(AppConfigActions.getImdb(value0, value1, search));
        } else {
          setSearchLoading(true);
          dispatch(AppConfigActions.getSearch(value0, value1, search));
        }
      } else if (search === '') {
        setSearchValidation(true);
        searchValidationTimeout.current = setTimeout(() => {
          setSearchValidation(false);
        }, 3000);
      }
    } catch (e) {
      alert(e);
    }
  };

  const clearSearch = async () => {
    try {
      await AsyncStorage.removeItem('search');
      await AsyncStorage.removeItem('imdb');
    } catch (e) {
      alert(e);
    }
    dispatch(AppConfigActions.retrieveSearch());
    dispatch(AppConfigActions.retrieveImdb());
    dispatch(AppConfigActions.searchError());
    dispatch(AppConfigActions.imdbError());
    setIsSearch(false);
    setNoResults(false);
    SearchBarRef.current.blur();
    SearchBarRef.current.clear();
  };

  const handleLogout = async () => {
    const keys = ['username', 'passkey', 'latest'];
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      alert(e);
    }
    dispatch(AppConfigActions.retrieveLatest());
    dispatch(AppConfigActions.latestError());
  };

  const fetchIMDbInfo = async (id) => {
    setIMDbLoading(true);
    await Axios.get('https://spleeter.co.uk/' + id)
      .then((res) => {
        setIMDbData(Array(res.data));
        setIMDbLoading(false);
      })
      .catch((e) => {
        alert(e);
      });
  };

  const formatBytes = (a, b = 2) => {
    if (0 === a) return '0 Bytes';
    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));
    return (
      parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
      ' ' +
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    );
  };

  const copyToClipboard = (string) => {
    Clipboard.setString(`${string}`);
    setTimeout(() => {
      Animated.timing(showClipboardStatus, {
        toValue: StatusBar.currentHeight * 2.5,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(textClipboardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }, 500);
    setTimeout(() => {
      Animated.timing(showClipboardStatus, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(textClipboardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 3500);
  };

  const getRefreshData = async () => {
    try {
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null) {
        dispatch(AppConfigActions.getLatest(value0, value1));
      }
    } catch (e) {
      alert(e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getRefreshData();
    setTimeout(() => {
      Animated.timing(showStatus, {
        toValue: StatusBar.currentHeight * 2.5,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
      setRefreshing(false);
    }, 1000);
    setTimeout(() => {
      Animated.timing(showStatus, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 4000);
  }, [refreshing]);

  const Item = ({item, onPress, style}) => (
    <Pressable
      onLongPress={() => {
        copyToClipboard(item.download_link);
      }}
      onPress={onPress}
      android_ripple={{
        color: 'white',
        borderless: false,
      }}
      style={[
        {
          elevation: 5,
          marginTop: 16,
          marginHorizontal: 16,
        },
        style,
      ]}>
      <View
        style={{
          height: 75,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            height: 75,
            width: 75,
            borderWidth: 0.5,
            borderColor: 'grey',
          }}>
          <FastImage
            style={{height: '100%', width: '100%'}}
            resizeMode={FastImage.resizeMode.contain}
            source={
              item.category === 'Audio'
                ? music
                : item.category === 'Jocuri PC'
                ? games
                : item.category === 'Filme HD'
                ? hd
                : item.category === 'Filme HD-RO'
                ? hdro
                : item.category === 'Filme Blu-Ray'
                ? bluray
                : item.category === 'Docs'
                ? docs
                : item.category === 'Anime'
                ? anime
                : item.category === 'Jocuri Console'
                ? console
                : item.category === 'XXX'
                ? xxx
                : item.category === 'Seriale HD'
                ? hdtv
                : item.category === 'Filme SD'
                ? sd
                : item.category === 'Filme DVD'
                ? dvd
                : item.category === 'Filme DVD-RO'
                ? dvdro
                : item.category === 'FLAC'
                ? flac
                : item.category === 'Filme 4K'
                ? a4k
                : item.category === 'Programe'
                ? apps
                : item.category === 'Videoclip'
                ? vids
                : item.category === 'Sport'
                ? sport
                : item.category === 'Desene'
                ? cartoons
                : item.category === 'Linux'
                ? linux
                : item.category === 'Diverse'
                ? misc
                : item.category === 'Mobile'
                ? mobile
                : item.category === 'Seriale SD'
                ? sdtv
                : item.category === 'Filme 3D'
                ? a3d
                : item.category === 'Filme 4K Blu-Ray'
                ? a4kbd
                : item.category === 'Seriale 4K'
                ? a4ktv
                : null
            }
          />
        </View>
        <View
          style={{
            borderTopColor: 'grey',
            borderRightColor: 'grey',
            borderBottomColor: 'grey',
            borderTopWidth: 0.5,
            borderRightWidth: 0.5,
            borderBottomWidth: 0.5,
            height: 75,
            width: '80%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              paddingTop: 5,
              paddingLeft: 5,
              height: 57,
              width: '100%',
            }}>
            <Text
              style={{
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                fontSize: 12,
                color: 'white',
              }}>
              {item.name}
            </Text>
          </View>
          <View
            style={{
              height: 18,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                textShadowColor: '#202020',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                fontSize: 9,
                color: 'silver',
                paddingLeft: 5,
              }}>
              [ {item.upload_date.substring(0, 16)} ]
            </Text>
            {item.freeleech === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: '#1ec621',
                  borderWidth: 0.5,
                  fontSize: 9,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: '#09580a',
                }}>
                FREELEECH
              </Text>
            ) : null}
            {item.doubleup === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: '#7c00ff',
                  borderWidth: 0.5,
                  fontSize: 9,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: '#370f61',
                }}>
                2X UPLOAD
              </Text>
            ) : null}
            {item.internal === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: '#1e87c6',
                  borderWidth: 0.5,
                  fontSize: 9,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: '#093b58',
                }}>
                INTERNAL
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({item}) => {
    return (
      <Item
        onPress={() => {
          setModalData(Array(item));
          setIMDbID(item.imdb);
          setInfoModal(true);
        }}
        item={item}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    );
  };

  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#202020',
        }}>
        <Overlay
          statusBarTranslucent
          animationType="fade"
          overlayStyle={{
            top: '1%',
            width: '87%',
            height: '78%',
            backgroundColor: '#202020',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          isVisible={advSearch}
          onBackdropPress={() => {
            AdvSearchRef.current.clear();
            setAdvIMDb(false);
            setAdvKeyword(false);
            setSearchBy(false);
            setAdvSearch(false);
          }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#202020',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              {searchBy ? (
                <View
                  style={{
                    elevation: 10,
                    zIndex: 30,
                    position: 'absolute',
                    top: 0,
                    height: 140,
                    width: '100%',
                    flexDirection: 'row',
                    backgroundColor: '#303030',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '50%',
                      backgroundColor: 'transparent',
                    }}>
                    <Pressable
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      android_ripple={{
                        color: 'grey',
                        borderless: false,
                      }}
                      onPress={() => {
                        setAdvIMDb(true);
                        setSearchBy(!searchBy);
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}>
                        Căutare după cuvânt cheie
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '50%',
                      backgroundColor: 'transparent',
                    }}>
                    <Pressable
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      android_ripple={{
                        color: 'grey',
                        borderless: false,
                      }}
                      onPress={() => {
                        setAdvKeyword(true);
                        setSearchBy(!searchBy);
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}>
                        Căutare după cod IMDb
                      </Text>
                      <Text style={{textAlign: 'center', fontSize: 11}}>
                        (tt4719744 ori 4719744)
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
              <View style={{height: 70, width: '100%', flexDirection: 'row'}}>
                <Input
                  ref={AdvSearchRef}
                  style={{
                    color: 'white',
                    fontSize: 14,
                  }}
                  containerStyle={{
                    height: 70,
                    width: '90%',
                    paddingTop: 12,
                    justifyContent: 'flex-start',
                    paddingBottom: 2,
                    alignItems: 'center',
                    backgroundColor: '#202020',
                  }}
                  inputContainerStyle={{
                    borderBottomWidth: 1,
                    borderColor: 'grey',
                    height: '80%',
                    width: '100%',
                    paddingLeft: 5,
                    paddingRight: 2.5,
                  }}
                  keyboardType="default"
                  selectionColor="grey"
                  autoCapitalize="none"
                  placeholder={
                    advIMDb === false && advKeyword === false
                      ? 'Căutare după...'
                      : advIMDb
                      ? 'Căutare după cuvânt cheie...'
                      : 'Căutare după cod Imdb...'
                  }
                  placeholderTextColor={'grey'}
                  leftIcon={
                    <FontAwesomeIcon size={18} color={'grey'} icon={faSearch} />
                  }
                  onChangeText={(advSearchText) =>
                    setAdvSearchText(advSearchText)
                  }
                  value={advSearchText}
                />
                <View
                  style={{
                    height: 70,
                    width: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#202020',
                  }}>
                  <Pressable
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: 15,
                    }}
                    onPress={() => {
                      setAdvKeyword(false);
                      setAdvIMDb(false);
                      setSearchBy(!searchBy);
                    }}>
                    <FontAwesomeIcon
                      size={20}
                      icon={faCaretDown}
                      color={'grey'}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Overlay>
        <Overlay
          statusBarTranslucent
          animationType="fade"
          overlayStyle={{
            top: IMDbID !== null ? '5%' : '2%',
            width: '87%',
            height: IMDbID !== null ? '60%' : '50%',
            backgroundColor: '#202020',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          isVisible={infoModal}
          onBackdropPress={() => {
            setModalData(null);
            setIMDbID(null);
            setInfoModal(false);
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {modalData
              ? modalData.map((item, index) => {
                  return (
                    <View
                      key={item.id}
                      style={{
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: '8.5%',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}>
                        <FastImage
                          style={{
                            position: 'absolute',
                            left: 0,
                            height: '100%',
                            width: 45,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                          source={
                            item.category === 'Audio'
                              ? music
                              : item.category === 'Jocuri PC'
                              ? games
                              : item.category === 'Filme HD'
                              ? hd
                              : item.category === 'Filme HD-RO'
                              ? hdro
                              : item.category === 'Filme Blu-Ray'
                              ? bluray
                              : item.category === 'Docs'
                              ? docs
                              : item.category === 'Anime'
                              ? anime
                              : item.category === 'Jocuri Console'
                              ? console
                              : item.category === 'XXX'
                              ? xxx
                              : item.category === 'Seriale HD'
                              ? hdtv
                              : item.category === 'Filme SD'
                              ? sd
                              : item.category === 'Filme DVD'
                              ? dvd
                              : item.category === 'Filme DVD-RO'
                              ? dvdro
                              : item.category === 'FLAC'
                              ? flac
                              : item.category === 'Filme 4K'
                              ? a4k
                              : item.category === 'Programe'
                              ? apps
                              : item.category === 'Videoclip'
                              ? vids
                              : item.category === 'Sport'
                              ? sport
                              : item.category === 'Desene'
                              ? cartoons
                              : item.category === 'Linux'
                              ? linux
                              : item.category === 'Diverse'
                              ? misc
                              : item.category === 'Mobile'
                              ? mobile
                              : item.category === 'Seriale SD'
                              ? sdtv
                              : item.category === 'Filme 3D'
                              ? a3d
                              : item.category === 'Filme 4K Blu-Ray'
                              ? a4kbd
                              : item.category === 'Seriale 4K'
                              ? a4ktv
                              : null
                          }
                        />
                        <View
                          style={{
                            width: '85%',
                            height: '100%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            paddingLeft: '2%',
                          }}>
                          <Text
                            style={{
                              textShadowColor: 'black',
                              textShadowOffset: {width: 0.5, height: 0.5},
                              textShadowRadius: 1,
                              color: MAIN_COLOR,
                              fontSize: 18,
                            }}>
                            {item.category}
                          </Text>
                          <Text
                            style={{
                              textShadowColor: 'black',
                              textShadowOffset: {width: 0.5, height: 0.5},
                              textShadowRadius: 1,
                              color: 'grey',
                              fontSize: 9,
                              fontWeight: 'bold',
                              textAlign: 'center',
                            }}>
                            [ {item.small_description} ]
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          position: 'relative',
                          top: 0,
                          left: 0,
                          marginTop: 10,
                          marginBottom: 10,
                          width: '100%',
                          height: '0.1%',
                          backgroundColor: '#303030',
                        }}
                      />
                      <View
                        style={{
                          width: '100%',
                          height: '10%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          style={{
                            textShadowColor: 'black',
                            textShadowOffset: {width: 0.5, height: 0.5},
                            textShadowRadius: 1,
                            color: MAIN_COLOR,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          {item.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          height:
                            item.freeleech !== 1 &&
                            item.doubleup !== 1 &&
                            item.internal !== 1
                              ? 0
                              : '3%',
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        {item.freeleech === 1 ? (
                          <Text
                            style={{
                              textShadowColor: 'black',
                              textShadowOffset: {width: 1, height: 1},
                              textShadowRadius: 1,
                              paddingHorizontal: 2,
                              borderColor: '#1ec621',
                              borderWidth: 0.5,
                              fontSize: 9,
                              color: 'aliceblue',
                              marginLeft: 5,
                              backgroundColor: '#09580a',
                            }}>
                            FREELEECH
                          </Text>
                        ) : null}
                        {item.doubleup === 1 ? (
                          <Text
                            style={{
                              textShadowColor: 'black',
                              textShadowOffset: {width: 1, height: 1},
                              textShadowRadius: 1,
                              paddingHorizontal: 2,
                              borderColor: '#7c00ff',
                              borderWidth: 0.5,
                              fontSize: 9,
                              color: 'aliceblue',
                              marginLeft: 5,
                              backgroundColor: '#370f61',
                            }}>
                            2X UPLOAD
                          </Text>
                        ) : null}
                        {item.internal === 1 ? (
                          <Text
                            style={{
                              textShadowColor: 'black',
                              textShadowOffset: {width: 1, height: 1},
                              textShadowRadius: 1,
                              paddingHorizontal: 2,
                              borderColor: '#1e87c6',
                              borderWidth: 0.5,
                              fontSize: 9,
                              color: 'aliceblue',
                              marginLeft: 5,
                              backgroundColor: '#093b58',
                            }}>
                            INTERNAL
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={{
                          position: 'relative',
                          top: 0,
                          left: 0,
                          marginTop: 10,
                          marginBottom: 10,
                          width: '100%',
                          height: '0.1%',
                          backgroundColor: '#303030',
                        }}
                      />
                      {IMDbID !== null ? (
                        <View
                          style={{
                            width: '100%',
                            height: '50%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '7%',
                          }}>
                          {IMDbLoading ? (
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                              }}>
                              <ActivityIndicator
                                size="large"
                                color={ACCENT_COLOR}
                              />
                            </View>
                          ) : (
                            <>
                              {IMDbData
                                ? IMDbData.map((item, index) => {
                                    return (
                                      <View
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          flexDirection: 'row',
                                          justifyContent: 'flex-start',
                                          alignItems: 'flex-start',
                                        }}
                                        key={item.link}>
                                        <View
                                          style={{
                                            width: '50%',
                                            height: '100%',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                          }}>
                                          <Pressable
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              flexDirection: 'column',
                                              justifyContent: 'flex-start',
                                              alignItems: 'flex-start',
                                            }}
                                            onPress={() =>
                                              Alert.alert(
                                                'Alertă',
                                                'Doreşti să vizitezi pagina IMDb asociată filmului ?',
                                                [
                                                  {
                                                    text: 'Da',
                                                    onPress: () =>
                                                      Linking.openURL(
                                                        item.link,
                                                      ),
                                                  },
                                                  {
                                                    text: 'Nu',
                                                    onPress: () => {},
                                                    style: 'cancel',
                                                  },
                                                ],
                                                {cancelable: true},
                                              )
                                            }>
                                            <FastImage
                                              style={{
                                                width: '85%',
                                                height: '80%',
                                              }}
                                              resizeMode={
                                                FastImage.resizeMode.contain
                                              }
                                              source={{
                                                uri: item.poster,
                                              }}
                                            />
                                            {item.rating === '' ? null : (
                                              <>
                                                <View
                                                  style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '85%',
                                                    height: '20%',
                                                  }}>
                                                  <Text
                                                    style={{
                                                      fontSize: 10,
                                                      textShadowColor: 'black',
                                                      textShadowOffset: {
                                                        width: 0.5,
                                                        height: 0.5,
                                                      },
                                                      textShadowRadius: 1,
                                                      color: 'white',
                                                      fontSize: 18,
                                                      fontWeight: 'bold',
                                                    }}>
                                                    {item.rating}
                                                  </Text>
                                                  <FontAwesomeIcon
                                                    size={20}
                                                    style={{marginLeft: 10}}
                                                    color={'gold'}
                                                    icon={faStar}
                                                  />
                                                </View>
                                              </>
                                            )}
                                          </Pressable>
                                        </View>
                                        <View
                                          style={{
                                            width: '50%',
                                            height: '100%',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            paddingRight: '2%',
                                          }}>
                                          <View
                                            style={{
                                              width: '100%',
                                              height: '80%',
                                              flexDirection: 'column',
                                              justifyContent: 'flex-start',
                                              alignItems: 'flex-start',
                                            }}>
                                            <Text
                                              style={{
                                                fontSize: 10,
                                                textShadowColor: 'black',
                                                textShadowOffset: {
                                                  width: 0.5,
                                                  height: 0.5,
                                                },
                                                textShadowRadius: 1,
                                                color: 'grey',
                                                fontWeight: 'bold',
                                              }}>
                                              Plot
                                            </Text>
                                            <Text
                                              style={{
                                                fontSize: 10,
                                                textShadowColor: 'black',
                                                textShadowOffset: {
                                                  width: 0.5,
                                                  height: 0.5,
                                                },
                                                textShadowRadius: 1,
                                                color: 'white',
                                                paddingTop: '3%',
                                              }}>
                                              {item.plot.split('\n')[0]}
                                            </Text>
                                            {item.duration === '' ? null : (
                                              <>
                                                <View
                                                  style={{
                                                    position: 'relative',
                                                    top: 0,
                                                    left: 0,
                                                    marginTop: '4%',
                                                    marginBottom: '4%',
                                                    width: '100%',
                                                    height: '0.2%',
                                                    backgroundColor: '#404040',
                                                  }}
                                                />
                                                <Text
                                                  style={{
                                                    fontSize: 10,
                                                    textShadowColor: 'black',
                                                    textShadowOffset: {
                                                      width: 0.5,
                                                      height: 0.5,
                                                    },
                                                    textShadowRadius: 1,
                                                    color: 'grey',
                                                    fontWeight: 'bold',
                                                  }}>
                                                  Durată:
                                                  <Text
                                                    style={{
                                                      fontSize: 10,
                                                      textShadowColor: 'black',
                                                      textShadowOffset: {
                                                        width: 0.5,
                                                        height: 0.5,
                                                      },
                                                      textShadowRadius: 1,
                                                      color: 'white',
                                                      fontWeight: 'bold',
                                                    }}>
                                                    {' '}
                                                    {item.duration}
                                                  </Text>
                                                </Text>
                                              </>
                                            )}
                                          </View>
                                        </View>
                                      </View>
                                    );
                                  })
                                : null}
                            </>
                          )}
                        </View>
                      ) : null}
                      {IMDbID !== null ? (
                        <View
                          style={{
                            width: '100%',
                            height: '14%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: '100%',
                              height: '50%',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: '33.33%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Pressable
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                                android_ripple={{
                                  color: 'grey',
                                  borderless: false,
                                  radius: 40,
                                }}
                                onPress={() =>
                                  Alert.alert(
                                    'Alertă',
                                    'Mărimea totală a torrentului',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => {},
                                      },
                                    ],
                                    {cancelable: true},
                                  )
                                }>
                                <FontAwesomeIcon
                                  size={14}
                                  icon={faDatabase}
                                  color={ACCENT_COLOR}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textShadowColor: 'black',
                                    textShadowOffset: {width: 0.5, height: 0.5},
                                    textShadowRadius: 1,
                                    color: 'white',
                                  }}>
                                  {formatBytes(item.size)}
                                </Text>
                              </Pressable>
                            </View>
                            <View
                              style={{
                                width: '33.33%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Pressable
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                                android_ripple={{
                                  color: 'grey',
                                  borderless: false,
                                  radius: 40,
                                }}
                                onPress={() =>
                                  Alert.alert(
                                    'Alertă',
                                    'Numărul de fişiere din torrent',
                                    [
                                      {
                                        text: 'OK',
                                      },
                                    ],
                                    {onDismiss: () => {}, cancelable: true},
                                  )
                                }>
                                <FontAwesomeIcon
                                  size={14}
                                  icon={faCopy}
                                  color={ACCENT_COLOR}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textShadowColor: 'black',
                                    textShadowOffset: {width: 0.5, height: 0.5},
                                    textShadowRadius: 1,
                                    color: 'white',
                                  }}>
                                  {item.files}
                                </Text>
                              </Pressable>
                            </View>
                            <View
                              style={{
                                width: '33.33%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Pressable
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                                android_ripple={{
                                  color: 'grey',
                                  borderless: false,
                                  radius: 40,
                                }}
                                onPress={() =>
                                  Alert.alert(
                                    'Alertă',
                                    'Numărul de persoane care ţin torrentul la seed în acest moment',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => {},
                                      },
                                    ],
                                    {cancelable: true},
                                  )
                                }>
                                <FontAwesomeIcon
                                  size={14}
                                  icon={faChevronCircleUp}
                                  color={'limegreen'}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textShadowColor: 'black',
                                    textShadowOffset: {width: 0.5, height: 0.5},
                                    textShadowRadius: 1,
                                    color: 'white',
                                  }}>
                                  {item.seeders}
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                          <View
                            style={{
                              width: '100%',
                              height: '50%',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: 12,
                            }}>
                            <View
                              style={{
                                width: '33.33%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Pressable
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                                android_ripple={{
                                  color: 'grey',
                                  borderless: false,
                                  radius: 40,
                                }}
                                onPress={() =>
                                  Alert.alert(
                                    'Alertă',
                                    'Data la care torrentul a apărut pe Filelist',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => {},
                                      },
                                    ],
                                    {cancelable: true},
                                  )
                                }>
                                <FontAwesomeIcon
                                  size={14}
                                  icon={faCalendarWeek}
                                  color={ACCENT_COLOR}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textShadowColor: 'black',
                                    textShadowOffset: {width: 0.5, height: 0.5},
                                    textShadowRadius: 1,
                                    color: 'white',
                                  }}>
                                  {item.upload_date.substring(0, 10)}
                                </Text>
                              </Pressable>
                            </View>
                            <View
                              style={{
                                width: '33.33%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Pressable
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                                android_ripple={{
                                  color: 'grey',
                                  borderless: false,
                                  radius: 40,
                                }}
                                onPress={() =>
                                  Alert.alert(
                                    'Alertă',
                                    'De câte ori a fost descărcat torrentul',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => {},
                                      },
                                    ],
                                    {cancelable: true},
                                  )
                                }>
                                <FontAwesomeIcon
                                  size={14}
                                  icon={faDownload}
                                  color={ACCENT_COLOR}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textShadowColor: 'black',
                                    textShadowOffset: {width: 0.5, height: 0.5},
                                    textShadowRadius: 1,
                                    color: 'white',
                                  }}>
                                  {item.times_completed}
                                </Text>
                              </Pressable>
                            </View>
                            <View
                              style={{
                                width: '33.33%',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Pressable
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}
                                android_ripple={{
                                  color: 'grey',
                                  borderless: false,
                                  radius: 40,
                                }}
                                onPress={() =>
                                  Alert.alert(
                                    'Alertă',
                                    'Numărul de persoane care descarcă torrentul în acest moment',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => {},
                                      },
                                    ],
                                    {cancelable: true},
                                  )
                                }>
                                <FontAwesomeIcon
                                  size={14}
                                  icon={faChevronCircleDown}
                                  color={'crimson'}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textShadowColor: 'black',
                                    textShadowOffset: {width: 0.5, height: 0.5},
                                    textShadowRadius: 1,
                                    color: 'white',
                                  }}>
                                  {item.leechers}
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={{
                            width: '100%',
                            height: '64%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: '100%',
                              height: '30%',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: '100%',
                                height: '50%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: '33.33%',
                                  height: '100%',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Pressable
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}
                                  android_ripple={{
                                    color: 'grey',
                                    borderless: false,
                                    radius: 40,
                                  }}
                                  onPress={() =>
                                    Alert.alert(
                                      'Alertă',
                                      'Mărimea totală a torrentului',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {},
                                        },
                                      ],
                                      {cancelable: true},
                                    )
                                  }>
                                  <FontAwesomeIcon
                                    size={14}
                                    icon={faDatabase}
                                    color={ACCENT_COLOR}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      textShadowColor: 'black',
                                      textShadowOffset: {
                                        width: 0.5,
                                        height: 0.5,
                                      },
                                      textShadowRadius: 1,
                                      color: 'white',
                                    }}>
                                    {formatBytes(item.size)}
                                  </Text>
                                </Pressable>
                              </View>
                              <View
                                style={{
                                  width: '33.33%',
                                  height: '100%',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Pressable
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}
                                  android_ripple={{
                                    color: 'grey',
                                    borderless: false,
                                    radius: 40,
                                  }}
                                  onPress={() =>
                                    Alert.alert(
                                      'Alertă',
                                      'Numărul de fişiere din torrent',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {},
                                        },
                                      ],
                                      {cancelable: true},
                                    )
                                  }>
                                  <FontAwesomeIcon
                                    size={14}
                                    icon={faCopy}
                                    color={ACCENT_COLOR}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      textShadowColor: 'black',
                                      textShadowOffset: {
                                        width: 0.5,
                                        height: 0.5,
                                      },
                                      textShadowRadius: 1,
                                      color: 'white',
                                    }}>
                                    {item.files}
                                  </Text>
                                </Pressable>
                              </View>
                              <View
                                style={{
                                  width: '33.33%',
                                  height: '100%',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Pressable
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}
                                  android_ripple={{
                                    color: 'grey',
                                    borderless: false,
                                    radius: 40,
                                  }}
                                  onPress={() =>
                                    Alert.alert(
                                      'Alertă',
                                      'Numărul de persoane care ţin torrentul la seed în acest moment',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {},
                                        },
                                      ],
                                      {cancelable: true},
                                    )
                                  }>
                                  <FontAwesomeIcon
                                    size={14}
                                    icon={faChevronCircleUp}
                                    color={'limegreen'}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      textShadowColor: 'black',
                                      textShadowOffset: {
                                        width: 0.5,
                                        height: 0.5,
                                      },
                                      textShadowRadius: 1,
                                      color: 'white',
                                    }}>
                                    {item.seeders}
                                  </Text>
                                </Pressable>
                              </View>
                            </View>
                            <View
                              style={{
                                width: '100%',
                                height: '50%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 12,
                              }}>
                              <View
                                style={{
                                  width: '33.33%',
                                  height: '100%',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Pressable
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}
                                  android_ripple={{
                                    color: 'grey',
                                    borderless: false,
                                    radius: 40,
                                  }}
                                  onPress={() =>
                                    Alert.alert(
                                      'Alertă',
                                      'Data la care torrentul a apărut pe Filelist',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {},
                                        },
                                      ],
                                      {cancelable: true},
                                    )
                                  }>
                                  <FontAwesomeIcon
                                    size={14}
                                    icon={faCalendarWeek}
                                    color={ACCENT_COLOR}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      textShadowColor: 'black',
                                      textShadowOffset: {
                                        width: 0.5,
                                        height: 0.5,
                                      },
                                      textShadowRadius: 1,
                                      color: 'white',
                                    }}>
                                    {item.upload_date.substring(0, 10)}
                                  </Text>
                                </Pressable>
                              </View>
                              <View
                                style={{
                                  width: '33.33%',
                                  height: '100%',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Pressable
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}
                                  android_ripple={{
                                    color: 'grey',
                                    borderless: false,
                                    radius: 40,
                                  }}
                                  onPress={() =>
                                    Alert.alert(
                                      'Alertă',
                                      'De câte ori a fost descărcat torrentul',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {},
                                        },
                                      ],
                                      {cancelable: true},
                                    )
                                  }>
                                  <FontAwesomeIcon
                                    size={14}
                                    icon={faDownload}
                                    color={ACCENT_COLOR}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      textShadowColor: 'black',
                                      textShadowOffset: {
                                        width: 0.5,
                                        height: 0.5,
                                      },
                                      textShadowRadius: 1,
                                      color: 'white',
                                    }}>
                                    {item.times_completed}
                                  </Text>
                                </Pressable>
                              </View>
                              <View
                                style={{
                                  width: '33.33%',
                                  height: '100%',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Pressable
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}
                                  android_ripple={{
                                    color: 'grey',
                                    borderless: false,
                                    radius: 40,
                                  }}
                                  onPress={() =>
                                    Alert.alert(
                                      'Alertă',
                                      'Numărul de persoane care descarcă torrentul în acest moment',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => {},
                                        },
                                      ],
                                      {cancelable: true},
                                    )
                                  }>
                                  <FontAwesomeIcon
                                    size={14}
                                    icon={faChevronCircleDown}
                                    color={'crimson'}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      textShadowColor: 'black',
                                      textShadowOffset: {
                                        width: 0.5,
                                        height: 0.5,
                                      },
                                      textShadowRadius: 1,
                                      color: 'white',
                                    }}>
                                    {item.leechers}
                                  </Text>
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })
              : null}
          </View>
        </Overlay>
        <View
          style={{
            height: StatusBar.currentHeight * 3,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            backgroundColor: ACCENT_COLOR,
          }}>
          <View
            style={{
              flex: 4,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 16,
            }}>
            <Text
              style={{
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 8,
              }}>
              {isSearch ? 'Căutare' : 'Recent adăugate'}
            </Text>
            <View
              style={{
                width: '20%',
                height: '40%',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <Pressable
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                android_ripple={{
                  color: 'black',
                  borderless: false,
                }}
                onPress={handleLogout}>
                <Text
                  style={{
                    textShadowColor: 'black',
                    textShadowOffset: {width: 0.5, height: 0.5},
                    textShadowRadius: 1,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            top:
              listSearch !== null ||
              listImdb !== null ||
              searchError != null ||
              imdbError !== null
                ? StatusBar.currentHeight * 3
                : -100,
            zIndex: 12,
            elevation: 12,
            height: 70,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#202020',
          }}>
          <View
            style={{
              position: 'absolute',
              left: 25,
              height: '60%',
              width: '10%',
              overflow: 'hidden',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              backgroundColor: ACCENT_COLOR,
            }}>
            <Pressable
              style={{
                height: '100%',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                backgroundColor: ACCENT_COLOR,
                padding: 10,
              }}
              android_ripple={{
                color: 'black',
                borderless: false,
              }}
              onPress={() => {
                clearSearch();
              }}>
              <FontAwesomeIcon size={20} color={'white'} icon={faArrowLeft} />
            </Pressable>
          </View>
          <Text style={{fontWeight: 'bold', color: 'white'}}>
            Rezultatele căutării după "{search}"
          </Text>
        </View>
        <Input
          ref={SearchBarRef}
          style={{
            color: 'white',
          }}
          containerStyle={{
            zIndex: 10,
            elevation: 10,
            height: 70,
            width: '100%',
            paddingTop: 12,
            justifyContent: 'flex-start',
            paddingBottom: 2,
            alignItems: 'center',
            backgroundColor: '#202020',
          }}
          inputContainerStyle={{
            borderBottomWidth: 1,
            borderColor: searchValidation ? 'crimson' : 'grey',
            height: '80%',
            width: '100%',
            paddingLeft: 5,
            paddingRight: 2.5,
          }}
          keyboardType="default"
          selectionColor="grey"
          autoCapitalize="none"
          placeholder={
            searchValidation
              ? 'Căsuţa este goală...'
              : 'Caută după cuvânt cheie, IMDb...'
          }
          placeholderTextColor={searchValidation ? 'crimson' : 'grey'}
          rightIcon={
            <View
              style={{
                height: '100%',
                width: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
              <Pressable
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                android_ripple={{
                  color: ACCENT_COLOR,
                  borderless: false,
                }}
                onPress={() => {
                  handleSearch();
                }}>
                <FontAwesomeIcon
                  size={20}
                  color={ACCENT_COLOR}
                  icon={faSearch}
                />
              </Pressable>
            </View>
          }
          onChangeText={(search) => setSearch(search)}
          value={search}
        />
        {searchLoading ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-start',
              paddingTop: StatusBar.currentHeight * 4,
              alignItems: 'center',
              paddingBottom: StatusBar.currentHeight * 3 + 70,
            }}>
            <ActivityIndicator size="large" color={ACCENT_COLOR} />
          </View>
        ) : noResults ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: StatusBar.currentHeight,
              paddingBottom: StatusBar.currentHeight * 2 + 70,
            }}>
            <Text
              style={{
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                color: 'white',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Rezultatele căutării după "{search}"
            </Text>
            <Text
              style={{
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                color: 'white',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Nu s-a găsit nimic
            </Text>
            <Text
              style={{
                marginTop: 10,
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                color: 'white',
                textAlign: 'center',
              }}>
              Încearcă din nou cu alt șir de căutare
            </Text>
          </View>
        ) : listSearch !== null ? (
          <FlatList
            style={{marginBottom: 16}}
            data={listSearch}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : listImdb !== null ? (
          <FlatList
            style={{marginBottom: 16}}
            data={listImdb}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                progressViewOffset={55}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            style={{marginBottom: 16}}
            data={listLatest}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <View
          style={{
            width: 50,
            height: 50,
            zIndex: 12,
            elevation: 12,
            overflow: 'hidden',
            bottom: 20,
            right: 20,
            borderRadius: 50 / 2,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: ACCENT_COLOR,
          }}>
          <Pressable
            android_ripple={{
              color: 'white',
              borderless: false,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50 / 2,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: ACCENT_COLOR,
            }}
            onPress={() => setAdvSearch(!advSearch)}>
            <FontAwesomeIcon color={'white'} size={25} icon={faSearchPlus} />
          </Pressable>
        </View>
        <Animated.View
          style={[
            {
              elevation: 15,
              zIndex: 15,
              position: 'absolute',
              bottom: 0,
              backgroundColor: ACCENT_COLOR,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            {height: showStatus},
          ]}>
          <Animated.Text
            style={[
              {
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                fontSize: 14,
                color: 'white',
                fontWeight: 'bold',
              },
              {opacity: textOpacity},
            ]}>
            Actualizare completă
          </Animated.Text>
          <Animated.Text
            style={[
              {
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                fontSize: 14,
                color: 'white',
                paddingBottom: 5,
              },
              {opacity: textOpacity},
            ]}>
            (nu există torrente noi)
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            {
              elevation: 15,
              zIndex: 15,
              position: 'absolute',
              bottom: 0,
              backgroundColor: ACCENT_COLOR,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            {height: showClipboardStatus},
          ]}>
          <Animated.Text
            style={[
              {
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                fontSize: 14,
                color: 'white',
                fontWeight: 'bold',
              },
              {opacity: textClipboardOpacity},
            ]}>
            Ai copiat linkul de descărcare al torrentului
          </Animated.Text>
        </Animated.View>
      </SafeAreaView>
    </>
  );
}

function Login() {
  const dispatch = useDispatch();
  const {listLatest, latestError} = useSelector((state) => state.appConfig);
  const [userModal, setUserModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [user, setUser] = useState(USERNAME);
  const [pass, setPass] = useState(PASSKEY);
  const [invalid, setInvalid] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const err1 = useRef();
  const err2 = useRef();
  const err3 = useRef();
  const err4 = useRef();

  useEffect(() => {
    if (latestError !== null) {
      setLoginLoading(false);
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      clearInterval(err1.current);
      clearInterval(err2.current);
      clearInterval(err3.current);
      clearInterval(err4.current);
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [listLatest, latestError]);

  const storeData = async (value0, value1) => {
    try {
      await AsyncStorage.setItem('username', value0);
      await AsyncStorage.setItem('passkey', value1);
    } catch (e) {
      alert(e);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    if (user.length === 0 && pass.length > 0) {
      setInvalidUser(true);
      setLoginLoading(false);
      err1.current = setTimeout(() => {
        setInvalidUser(false);
      }, 5000);
    }
    if (user.length > 0 && pass.length === 0) {
      setInvalidPass(true);
      setLoginLoading(false);
      err2.current = setTimeout(() => {
        setInvalidPass(false);
      }, 5000);
    }
    if (user.length === 0 && pass.length === 0) {
      setInvalid(true);
      setLoginLoading(false);
      err3.current = setTimeout(() => {
        setInvalid(false);
      }, 5000);
    }
    if (user.length > 0 && pass.length > 0) {
      await storeData(user, pass);
      dispatch(AppConfigActions.getLatest(user, pass));
      err4.current = setTimeout(() => {
        dispatch(AppConfigActions.latestError());
      }, 5000);
    }
  };

  return (
    <>
      <Overlay
        statusBarTranslucent
        animationType="fade"
        overlayStyle={{
          width: '90%',
          height: '30%',
          backgroundColor: MAIN_COLOR,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        isVisible={userModal}
        onBackdropPress={() => {
          setUserModal(false);
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: '20%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 5,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
              Go to
            </Text>
            <Pressable
              style={{
                width: '20%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              android_ripple={{
                color: 'grey',
                borderless: false,
              }}
              onPress={() => Linking.openURL('https://filelist.io')}>
              <Text
                style={{
                  color: ACCENT_COLOR,
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Filelist
              </Text>
            </Pressable>
          </View>
          <View style={{width: '100%', height: '80%'}}>
            <FastImage
              style={{width: '100%', height: '100%'}}
              resizeMode={FastImage.resizeMode.contain}
              source={require('../assets/user.png')}
            />
          </View>
        </View>
      </Overlay>
      <Overlay
        statusBarTranslucent
        animationType="fade"
        overlayStyle={{
          width: '90%',
          height: '30%',
          backgroundColor: MAIN_COLOR,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        isVisible={passModal}
        onBackdropPress={() => {
          setPassModal(false);
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: '20%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 5,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
              Go to
            </Text>
            <Pressable
              style={{
                width: '20%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              android_ripple={{
                color: 'grey',
                borderless: false,
              }}
              onPress={() => Linking.openURL('https://filelist.io')}>
              <Text
                style={{
                  color: ACCENT_COLOR,
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Filelist
              </Text>
            </Pressable>
          </View>
          <View style={{width: '100%', height: '80%'}}>
            <FastImage
              style={{width: '100%', height: '100%'}}
              resizeMode={FastImage.resizeMode.contain}
              source={require('../assets/pass.png')}
            />
          </View>
        </View>
      </Overlay>
      <Overlay
        statusBarTranslucent
        animationType="fade"
        overlayStyle={{
          top: '4%',
          width: '90%',
          height: '25%',
          backgroundColor: MAIN_COLOR,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        isVisible={aboutModal}
        onBackdropPress={() => {
          setAboutModal(false);
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: '15%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: StatusBar.currentHeight,
            }}>
            <View
              style={{
                width: '40%',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>About</Text>
            </View>
            <View
              style={{
                width: '60%',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingRight: 20,
              }}>
              <Text style={{color: ACCENT_COLOR}}>Filelist App</Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: '85%',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: StatusBar.currentHeight,
            }}>
            <View
              style={{
                width: '40%',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 12}}>
                Version:
              </Text>
              <View
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  marginTop: 10,
                  marginBottom: 10,
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#303030',
                }}
              />
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 12}}>
                Publisher:
              </Text>
              <View
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  marginTop: 10,
                  marginBottom: 10,
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#303030',
                }}
              />
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 12}}>
                Developed with:
              </Text>
            </View>
            <View
              style={{
                width: '60%',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingRight: 20,
              }}>
              <Text style={{color: ACCENT_COLOR, fontSize: 12}}>v1.0.0</Text>
              <View
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  marginTop: 10,
                  marginBottom: 10,
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#303030',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Pressable
                  style={{height: '100%'}}
                  android_ripple={{
                    color: 'grey',
                    borderless: false,
                  }}
                  onPress={() =>
                    Linking.openURL('https://github.com/baderproductions')
                  }>
                  <Text
                    style={{
                      color: ACCENT_COLOR,
                      textDecorationLine: 'underline',
                      fontSize: 12,
                    }}>
                    BADERproductions
                  </Text>
                </Pressable>
              </View>
              <View
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  marginTop: 10,
                  marginBottom: 10,
                  width: '100%',
                  height: 0.5,
                  backgroundColor: '#303030',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Pressable
                  style={{height: '100%'}}
                  android_ripple={{
                    color: 'grey',
                    borderless: false,
                  }}
                  onPress={() =>
                    Linking.openURL(
                      'https://www.npmjs.com/package/react-native',
                    )
                  }>
                  <Text
                    style={{
                      color: ACCENT_COLOR,
                      textDecorationLine: 'underline',
                      fontSize: 12,
                    }}>
                    React Native v0.63.3
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Overlay>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          enabled={false}
          style={{flex: 1}}
          behavior={'padding'}>
          <View style={Main.container}>
            <View style={Main.profilePicContainer}>
              <FastImage
                style={Main.picture}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../assets/logo13.png')}
              />
            </View>
            <View style={Main.form}>
              <Input
                style={Main.input}
                containerStyle={Main.inputContainer}
                inputContainerStyle={Main.inputContainerInner}
                keyboardType="default"
                selectionColor="grey"
                underlineColorAndroid={'black'}
                autoCapitalize="none"
                placeholder="Nume utilizator"
                placeholderTextColor={'grey'}
                leftIcon={
                  <FontAwesomeIcon
                    size={22}
                    color={'black'}
                    icon={faUserLock}
                  />
                }
                rightIcon={
                  <Pressable
                    android_ripple={{
                      color: ACCENT_COLOR,
                      borderless: true,
                      radius: 17,
                    }}
                    onPress={() => setUserModal(true)}>
                    <FontAwesomeIcon
                      size={25}
                      color={'black'}
                      icon={faInfoCircle}
                    />
                  </Pressable>
                }
                onChangeText={(user) => setUser(user)}
                value={user}
              />
              <Input
                style={Main.input}
                containerStyle={Main.inputContainer}
                inputContainerStyle={Main.inputContainerInner}
                leftIcon={
                  <FontAwesomeIcon size={22} color={'black'} icon={faKey} />
                }
                rightIcon={
                  <Pressable
                    android_ripple={{
                      color: ACCENT_COLOR,
                      borderless: true,
                      radius: 17,
                    }}
                    onPress={() => setPassModal(true)}>
                    <FontAwesomeIcon
                      size={25}
                      color={'black'}
                      icon={faInfoCircle}
                    />
                  </Pressable>
                }
                selectionColor="grey"
                underlineColorAndroid={'black'}
                autoCapitalize="none"
                placeholder="Passkey"
                placeholderTextColor={'grey'}
                onChangeText={(pass) => setPass(pass)}
                value={pass}
              />
              {latestError && (
                <Text style={Main.error}>Utilizator sau passkey incorect</Text>
              )}
              {invalid && (
                <Text style={Main.error}>
                  Introdu numele de utilizator şi codul passkey
                </Text>
              )}
              {invalidUser && (
                <Text style={Main.error}>Introdu numele de utilizator</Text>
              )}
              {invalidPass && (
                <Text style={Main.error}>Introdu codul passkey</Text>
              )}
              <View style={Main.btnContainer}>
                <Pressable
                  onPress={handleLogin}
                  disabled={loginLoading}
                  android_ripple={{
                    color: 'black',
                    borderless: false,
                  }}
                  style={Main.btn}>
                  {loginLoading ? (
                    <ActivityIndicator size="small" color={'white'} />
                  ) : (
                    <Text style={Main.btnText}>Logare</Text>
                  )}
                </Pressable>
              </View>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: StatusBar.currentHeight * 1.5,
                backgroundColor: 'transparent',
              }}>
              <Pressable
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                android_ripple={{
                  color: 'black',
                  borderless: false,
                }}
                onPress={() => setAboutModal(true)}>
                <Text style={{color: 'black'}}>About</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: MAIN_COLOR,
      }}>
      <ActivityIndicator size="large" color={ACCENT_COLOR} />
    </View>
  );
}

function Auth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {listLatest} = useSelector((state) => state.appConfig);

  useEffect(() => {
    if (!listLatest) {
      dispatch(AppConfigActions.retrieveLatest());
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        cardStyle: {backgroundColor: MAIN_COLOR},
      }}
      headerMode="none">
      {listLatest ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      ) : loading ? (
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={{
            animationTypeForReplace: 'pop',
            cardStyle: {backgroundColor: 'white'},
          }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            animationTypeForReplace: 'push',
            cardStyle: {backgroundColor: 'white'},
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <Auth />
    </NavigationContainer>
  );
};
