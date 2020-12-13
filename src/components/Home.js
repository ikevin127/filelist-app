import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Animated,
  Alert,
  Easing,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  Pressable,
  Platform,
  Keyboard,
  Linking,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Overlay} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fetch & firebase
import Axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';

// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';

// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faChevronCircleUp,
  faChevronCircleDown,
  faCopy,
  faDownload,
  faDatabase,
  faStar,
  faSearch,
  faFileDownload,
  faFilm,
  faCheck,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

// Assets
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

// Variables
import {width, height, MAIN_LIGHT, ACCENT_COLOR, statusHeight} from '../assets/variables';

export default function Home({navigation}) {
  const [imdbModal, setIMDbModal] = useState(false);
  const [IMDbData, setIMDbData] = useState(null);
  const [isNetReachable, setIsNetReachable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [IMDbLoading, setIMDbLoading] = useState(false);
  const [listLatestLoading, setListLatestLoading] = useState(false);
  const [listEndLoading, setListEndLoading] = useState(true);
  const [listEndMsg, setListEndMsg] = useState(false);

  // Animations
  const [showNetworkAlertTextOn] = useState(new Animated.Value(0));
  const [showNetworkAlertTextOff] = useState(new Animated.Value(0));
  const [showNetworkAlertOn] = useState(new Animated.Value(statusHeight * 3));
  const [showNetworkAlertOff] = useState(new Animated.Value(statusHeight * 3));

  // Redux
  const dispatch = useDispatch();
  const {
    appInfo,
    lightTheme,
    fontSizes,
    collItems,
    listLatest,
    latestError,
  } = useSelector((state) => state.appConfig);

  // Refs
  const netRef = useRef(false);

  // Component mount
  useEffect(() => {
    // Set font sizes
    dispatch(AppConfigActions.setFonts());

    // API error handling
    if (latestError !== null) {
      switch (latestError.response.status) {
        case 429:
          return setLimitReached;
        case 503:
          return setAPIDown;
        default:
          return setError;
      }
    }

    // Screen focus listener
    const screenFocusListener = navigation.addListener('focus', () => {
      // Dismiss keyboard everytime screen gets focus
      Keyboard.dismiss();
    });

    // Connection listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable === true) {
        if (!netRef.current) {
          netRef.current = true;
        } else {
          setIsNetReachable(true);
          netOn();
        }
      } else {
        setIsNetReachable(false);
        netOff();
      }
    });

    return () => {
      screenFocusListener();
      unsubscribe();
    };
  }, [isNetReachable, latestError]);

  // Functions

  const setLimitReached = () => {
    setListLatestLoading(false);
    Alert.alert(
      'Info',
      'API: Ai atins limita de 150 de cereri pe oră.\n\nPentru ca lista să se reactualizeze din nou cu cele mai recente torrente va trebui să aştepţi 1 oră.',
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  const setAPIDown = () => {
    setListLatestLoading(false);
    Alert.alert(
      'Info',
      'API: Momentan serviciul Filelist API nu funcţionează.',
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  const setError = () => {
    setListLatestLoading(false);
    Alert.alert(
      'Info',
      'API: Momentan serviciul Filelist API nu funcţionează.',
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const onRefresh = useCallback(async () => {
    dispatch(AppConfigActions.setCollItems([]));
    setListLatestLoading(true);
    try {
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null) {
        dispatch(AppConfigActions.getLatest(value0, value1, 20));
      }
    } catch (e) {
      crashlytics().log('home -> getRefreshData()');
      crashlytics().recordError(e);
    }
    setTimeout(() => {
      setListLatestLoading(false);
    }, 1000);
  }, [listLatest]);

  const get50 = useCallback(async () => {
    if (listLatest.length == 50) {
      setListEndLoading(false);
      setListEndMsg(true);
    } else {
      setListEndLoading(true);
      setListEndMsg(false);
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null) {
        dispatch(AppConfigActions.getLatest(value0, value1, 50));
      }
    }

    setTimeout(() => {
      setListEndLoading(false);
    }, 1000);
  }, [listLatest]);

  const setCollapsible = (id) => {
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

  const fetchIMDbInfo = async (id) => {
    try {
      if (isNetReachable) {
        setIMDbLoading(true);
        await Axios.get('https://spleeter.co.uk/' + id)
          .then((res) => {
            setIMDbData(Array(res.data));
            setIMDbLoading(false);
          })
          .catch((e) => {
            setIMDbLoading(false);
            crashlytics().log(
              "home -> fetchIMDbInfo() - Axios.get('https://spleeter.co.uk/' + id)",
            );
            crashlytics().recordError(e);
          });
      } else {
        setIMDbLoading(false);
        setIMDbData(null);
      }
    } catch (e) {
      crashlytics().log('home -> fetchIMDbInfo()');
      crashlytics().recordError(e);
    }
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

  const netOn = () => {
    setTimeout(() => {
      Animated.timing(showNetworkAlertOn, {
        toValue: 0,
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
        toValue: Platform.OS === 'ios' ? statusHeight * 1.5 : statusHeight,
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
        toValue: 0,
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
        toValue: Platform.OS === 'ios' ? statusHeight * 1.5 : statusHeight,
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

  const downloadTorrent = async (link) => {
    const supported = await Linking.canOpenURL(
      link,
    );
    if (supported) {
      Alert.alert(
        'Info',
        'Doreşti să descarci fişierul torrent ?',
        [
          {
            text: 'DA',
            onPress: () =>
              Linking.openURL(link),
          },
          {
            text: 'NU',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      Alert.alert(
        'Info',
        'Acest torrent nu poate fi descărcat prin intermediul aplicaţiei.',
        [
          {
            text: 'OK',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
  }

  const SkeletonLoading = () => {
    return (
      <SkeletonContent
        boneColor={
          lightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.04)'
        }
        highlightColor={lightTheme ? '#rgba(0, 0, 0, 0.05)' : '#171717'}
        duration={700}
        containerStyle={[
          HomePage.skeletonContainer,
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
  }

  // Torrent pressable

  const Item = ({item, onPress, style}) => (
    <Pressable
      onLongPress={() => {
        downloadTorrent(item.download_link);
      }}
      onPress={() => setCollapsible(item.id)}
      android_ripple={{
        color: 'grey',
        borderless: false,
      }}
      style={[HomePage.itemPressable, style]}>
      <View
        style={[
          HomePage.itemPressableContainer,
          {
            borderBottomWidth: collItems.includes(item.id) ? 0 : 1,
            borderColor: lightTheme ? 'rgba(0, 0, 0, 0.1)' : '#171717',
            backgroundColor: lightTheme ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)',
          },
        ]}>
        <View style={HomePage.itemPressableFirst}>
          <View style={HomePage.itemPresssablePic}>
            <FastImage
              style={HomePage.itemPresssableFastImage}
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
          <View style={HomePage.itemPressableNameContainer}>
            <Text
              style={[
                HomePage.itemPressableNameText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[1] : 8),
                  color: lightTheme ? 'black' : 'white',
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
          <View style={HomePage.itemPressableUploadContainer}>
            {item.freeleech === 1 ? (
              <View style={HomePage.itemPressableFreeleechText} />
            ) : null}
            {item.internal === 1 ? (
              <View style={HomePage.itemPressableInternalText} />
            ) : null}
            {item.doubleup === 1 ? (
              <View style={HomePage.itemPressableDoubleUpText} />
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({item}) => {
    return (
      <>
        <Item
          item={item}
          style={{
              marginTop: 3,
              backgroundColor: 'transparent',
              marginBottom: collItems.includes(item.id) ? 0 : 3,
            }}
        />
        <Collapsible
          easing={Easing.bounce}
          enablePointerEvents={true}
          duration={500}
          collapsed={!collItems.includes(item.id)}>
          <View
            style={[
              HomePage.collContainer,
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
                    color: lightTheme ? 'black' : 'white',
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
                      HomePage.imdbInfoFreeleechBadge,
                      {
                        fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                        fontWeight: 'bold',
                      },
                    ]}>
                    FREELEECH
                  </Text>
                ) : null}
                {item.internal === 1 ? (
                  <Text
                    style={[
                      HomePage.imdbInfoInternalBadge,
                      {
                        fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                        fontWeight: 'bold',
                      },
                    ]}>
                    INTERNAL
                  </Text>
                ) : null}
                {item.doubleup === 1 ? (
                  <Text
                    style={[
                      HomePage.imdbInfoDoubleUpBadge,
                      {
                        fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                        fontWeight: 'bold',
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
                  <Pressable
                    style={HomePage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={() => {
                      downloadTorrent(item.download_link);
                    }}>
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
                  </Pressable>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={HomePage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={() =>
                      Alert.alert(
                        'Info',
                        'Mărimea totală a fişierelor din torrent',
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
                  </Pressable>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={HomePage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={() =>
                      Alert.alert(
                        'Info',
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
                  </Pressable>
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
                  <Pressable
                    style={HomePage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={() =>
                      Alert.alert(
                        'Info',
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
                  </Pressable>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={HomePage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={() =>
                      Alert.alert(
                        'Info',
                        'Numărul fişierelor din torrent',
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
                  </Pressable>
                </View>
                <View
                  style={{
                    width: '33.33%',
                    height: width / 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={HomePage.imdbInfoMainFooter3rdPressable}
                    android_ripple={{
                      color: 'grey',
                      borderless: false,
                      radius: width / 10,
                    }}
                    onPress={() =>
                      Alert.alert(
                        'Info',
                        'Numărul persoanelor care descarcă torrentul în acest moment',
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
                  </Pressable>
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
                    <Pressable
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
                      onPress={() => {
                        fetchIMDbInfo(item.imdb);
                        setIMDbModal(true);
                      }}>
                      <FontAwesomeIcon
                        size={14}
                        icon={faFilm}
                        color={'black'}
                      />
                      <Text
                        style={[
                          {
                            fontSize: Adjust(
                              fontSizes !== null ? fontSizes[1] : 9,
                            ),
                            fontWeight: 'bold',
                            color: 'black',
                            marginLeft: 5,
                          },
                        ]}>
                        IMDb
                      </Text>
                    </Pressable>
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
    <>
    <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <View
        style={
          [
          HomePage.mainSafeAreaView,
          {
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
          },
        ]
        }>
        <Overlay
          statusBarTranslucent
          animationType="fade"
          overlayStyle={{
            width: '90%',
            height: height / 3,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 0,
            padding: 5,
            backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
          }}
          isVisible={imdbModal}
          onBackdropPress={() => {
            setIMDbData(null);
            setIMDbModal(false);
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {IMDbLoading ? (
              <ActivityIndicator
                style={{marginVertical: statusHeight}}
                size="large"
                color={ACCENT_COLOR}
              />
            ) : IMDbData ? (
              IMDbData.map((item, index) => {
                return (
                  <View
                    style={{
                      height: width / 2,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      marginVertical: 20,
                      paddingRight: 20,
                    }}
                    key={item.link}>
                    <View
                      style={{
                        width: '45%',
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
                          typeof item.link === 'function'
                            ? {}
                            : Alert.alert(
                                'Info',
                                'Doreşti să vizitezi pagina oficială IMDb asociată torrentului ?',
                                [
                                  {
                                    text: 'DA',
                                    onPress: () => Linking.openURL(item.link),
                                  },
                                  {
                                    text: 'NU',
                                    onPress: () => {},
                                    style: 'cancel',
                                  },
                                ],
                                {cancelable: true},
                              )
                        }>
                        <FastImage
                          style={{width: '100%', height: '80%'}}
                          resizeMode={FastImage.resizeMode.contain}
                          source={{
                            uri: item.poster,
                          }}
                        />
                        {item.rating === '' ||
                        item.rating === undefined ? null : (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '20%',
                              }}>
                              <Text
                                style={[
                                  {
                                    fontSize: Adjust(
                                      fontSizes !== null ? fontSizes[6] : 14,
                                    ),
                                    color: lightTheme ? 'black' : 'white',
                                    fontWeight: 'bold',
                                  },
                                ]}>
                                {item.rating}
                              </Text>
                              <FontAwesomeIcon
                                size={Adjust(
                                  fontSizes !== null ? fontSizes[6] : 14,
                                )}
                                style={{marginLeft: 5}}
                                color={lightTheme ? 'goldenrod' : 'gold'}
                                icon={faStar}
                              />
                            </View>
                          </>
                        )}
                      </Pressable>
                    </View>
                    <View
                      style={{
                        width: '55%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          paddingHorizontal: 10,
                        }}>
                        <Text
                          style={[
                            {
                              fontSize: Adjust(
                                fontSizes !== null ? fontSizes[1] : 8,
                              ),
                              color: lightTheme ? 'black' : 'white',
                              fontWeight: 'bold',
                            },
                          ]}>
                          Plot
                        </Text>
                        <Text
                          selectable
                          style={[
                            {
                              fontSize: Adjust(
                                fontSizes !== null ? fontSizes[1] : 8,
                              ),
                              color: lightTheme ? 'black' : MAIN_LIGHT,
                              flexWrap: 'wrap',
                              marginBottom: 3,
                            },
                          ]}>
                          {item.plot === undefined
                            ? 'Acest material nu are plot.'
                            : item.plot.split('\n')[0]}
                        </Text>
                        {item.duration === '' ? null : (
                          <>
                            <View style={{width: '100%', flexDirection: 'row'}}>
                              <Text
                                style={[
                                  {
                                    fontSize: Adjust(
                                      fontSizes !== null ? fontSizes[1] : 8,
                                    ),
                                    color: lightTheme ? 'black' : 'white',
                                    fontWeight: 'bold',
                                  },
                                ]}>
                                Durată:
                              </Text>
                              <Text
                                style={[
                                  {
                                    fontSize: Adjust(
                                      fontSizes !== null ? fontSizes[1] : 8,
                                    ),
                                    color: lightTheme ? 'black' : MAIN_LIGHT,
                                  },
                                ]}>
                                {' '}
                                {item.duration === undefined
                                  ? '∞'
                                  : item.duration}
                              </Text>
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  width: '80%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: Adjust(fontSizes !== null ? fontSizes[2] : 10),
                    textAlign: 'center',
                    color: lightTheme ? 'black' : MAIN_LIGHT,
                  }}>
                  Conexiune offline.
                </Text>
                <Text
                  style={{
                    fontSize: Adjust(fontSizes !== null ? fontSizes[2] : 10),
                    textAlign: 'center',
                    color: lightTheme ? 'black' : MAIN_LIGHT,
                  }}>
                  Reconectează-te pentru a putea vedea informaţii despre acest
                  torrent.
                </Text>
              </View>
            )}
          </View>
        </Overlay>
        <View style={HomePage.mainHeader}>
          <View style={HomePage.mainHeaderContainer}>
            <View style={HomePage.mainHeaderCogContainer}>
              <Pressable
                style={HomePage.mainHeaderCogPressable}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: width / 18,
                }}
                onPress={() => navigation.openDrawer()}>
                <FontAwesomeIcon
                  size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                  color={'white'}
                  icon={faBars}
                />
              </Pressable>
            </View>
            <View style={HomePage.mainHeaderSearchContainer}>
              <Pressable
                style={HomePage.mainHeaderCogPressable}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: width / 18,
                }}
                onPress={() => navigation.navigate('Search')}>
                <FontAwesomeIcon
                  size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                  color={'white'}
                  icon={faSearch}
                />
              </Pressable>
            </View>
            <Text
              style={[
                HomePage.mainHeaderText,
                {fontSize: Adjust(fontSizes !== null ? fontSizes[7] : 16)},
              ]}>
              Recent adăugate
            </Text>
          </View>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              tintColor={ACCENT_COLOR}
              progressViewOffset={55}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() =>
            listEndLoading ? (
              <ActivityIndicator
                style={{marginVertical: statusHeight / 2}}
                size="large"
                color={ACCENT_COLOR}
              />
            ) : listEndMsg ? (
              <View
                style={{
                  marginVertical: statusHeight / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesomeIcon
                  size={14}
                  icon={faCheck}
                  color={ACCENT_COLOR}
                />
              </View>
            ) : null
          }
          onEndReachedThreshold={0.02}
          onEndReached={latestError !== null ? null : get50}
          contentContainerStyle={{
            padding: 9,
            width: width,
          }}
          data={
            listLatestLoading
              ? [
                  {id: '1'},
                  {id: '2'},
                  {id: '3'},
                  {id: '4'},
                  {id: '5'},
                  {id: '6'},
                  {id: '7'},
                  {id: '8'},
                  {id: '9'},
                  {id: '10'},
                  {id: '11'},
                  {id: '12'},
                  {id: '13'},
                  {id: '14'},
                  {id: '15'},
                ]
              : listLatest
          }
          renderItem={
            listLatestLoading ? () => <SkeletonLoading /> : renderItem
          }
          extraData={collItems}
          keyExtractor={(item) => item.id.toString()}
        />
        {isNetReachable ? (
          <Animated.View
            style={[
              HomePage.networkAlertContainer,
              {
                height: Platform.OS === 'ios' ? statusHeight * 1.5 : statusHeight,
                backgroundColor: 'limegreen',
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
              HomePage.networkAlertContainer,
              {
                height: Platform.OS === 'ios' ? statusHeight * 1.5 : statusHeight,
                backgroundColor: 'crimson',
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
    </>
  );
}

const HomePage = EStyleSheet.create({
  itemPressable: {
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
  itemPresssableFastImage: {height: '100%', width: '100%'},
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
  mainHeader: {
    height: statusHeight * 4,
    width: width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: ACCENT_COLOR,
  },
  mainHeaderContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: '1.35rem',
  },
  mainHeaderSearchContainer: {
    position: 'absolute',
    right: '0.3rem',
    bottom: '1rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderCogContainer: {
    position: 'absolute',
    left: '0.3rem',
    bottom: '1rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderCogPressable: {
    width: '100%',
    height: '100%',
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
    marginRight: 4,
    backgroundColor: '#09580a',
  },
  imdbInfoInternalBadge: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingRight: 2,
    borderColor: '#1e87c6',
    borderWidth: 1,
    color: 'white',
    marginRight: 4,
    backgroundColor: '#093b58',
  },
  imdbInfoDoubleUpBadge: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingRight: 2,
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
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
