/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Animated,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  Platform,
  Keyboard,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Collapsible from 'react-native-collapsible';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  faSearch,
  faFileDownload,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import {faImdb} from '@fortawesome/free-brands-svg-icons';
// Variables & assets
import {
  width,
  height,
  MAIN_LIGHT,
  ACCENT_COLOR,
  statusHeight,
  PressableOpacity,
} from '../assets/variables';
import {RO, EN} from '../assets/lang';
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

export default function Home({navigation}) {
  // Redux
  const dispatch = useDispatch();
  const {
    lightTheme,
    fontSizes,
    collItems,
    listLatest,
    latestLoading,
    latestError,
    enLang,
    hasNotch,
  } = useSelector((state) => state.appConfig);
  // State
  const netRef = useRef(false);
  const [refreshing] = useState(false);
  const [isNetReachable, setIsNetReachable] = useState(true);
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

  // Component mount
  useEffect(() => {
    // Set font sizes & clear latestError if any
    dispatch(AppConfigActions.setFonts());
    dispatch(AppConfigActions.latestError());
    // API error handling
    if (latestError !== null && latestError !== undefined) {
      if (latestError.response.status === 429) {
        setLimitReached();
      }
      if (latestError.response.status === 503) {
        setAPIDown();
      }
    }
    // Screen focus listener
    const screenFocusListener = navigation.addListener('focus', () => {
      // Dismiss keyboard everytime screen is focused
      Keyboard.dismiss();
    });

    return () => {
      screenFocusListener();
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [latestError]);

  useEffect(() => {
    // Connection listener
    const unsubscribe = NetInfo.addEventListener((state) => {
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
      unsubscribe();
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [isNetReachable]);

  // FUNCTIONS
  const goMenu = () => navigation.navigate('Menu');
  const goSearch = () => navigation.navigate('Search');

  const goIMDb = (id) => () =>
    navigation.navigate('IMDb', {
      id,
    });

  const setLimitReached = () =>
    Alert.alert(
      'Info',
      enLang ? EN.alert150R : RO.alert150R,
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );

  const setAPIDown = () =>
    Alert.alert(
      'Info',
      enLang ? EN.alertAPI : RO.alertAPI,
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );

  const sizeInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrSize : RO.torrSize,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: true},
    );

  const seedersInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrSeeds : RO.torrSeeds,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: true},
    );

  const downloadInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrDown : RO.torrDown,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: true},
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
      {onDismiss: () => {}, cancelable: true},
    );

  const leechersInfo = () =>
    Alert.alert(
      'Info',
      enLang ? EN.torrLeech : RO.torrLeech,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: true},
    );

  const onRefresh = useCallback(async () => {
    dispatch(AppConfigActions.setCollItems([]));
    const value0 = await AsyncStorage.getItem('username');
    const value1 = await AsyncStorage.getItem('passkey');
    if (value0 !== null && value1 !== null) {
      dispatch(AppConfigActions.getLatest(value0, value1));
    }
  }, [dispatch]);

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

  const downloadTorrent = (name, link) => async () => {
    const {android, ios, config, fs} = RNFetchBlob;
    const downloadDir = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });
    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        title: `${name}.torrent`,
        path: `${downloadDir}/${name}.torrent`,
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

  // Skeleton loading component
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
  };

  // Pressable component
  const Item = ({item, onPress, style}) => (
    <PressableOpacity
      activeOpacity={0.5}
      onPress={setCollapsible(item.id)}
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
            backgroundColor: lightTheme
              ? 'rgba(0, 0, 0, 0.05)'
              : 'rgba(255, 255, 255, 0.04)',
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
    </PressableOpacity>
  );

  // Collapsible component
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
          enablePointerEvents={true}
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
                      HomePage.imdbInfoInternalBadge,
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
                      HomePage.imdbInfoDoubleUpBadge,
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
                    style={HomePage.imdbInfoMainFooter3rdPressable}
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
                    style={HomePage.imdbInfoMainFooter3rdPressable}
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
                    style={HomePage.imdbInfoMainFooter3rdPressable}
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
                    style={HomePage.imdbInfoMainFooter3rdPressable}
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
                    style={HomePage.imdbInfoMainFooter3rdPressable}
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
                    style={HomePage.imdbInfoMainFooter3rdPressable}
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

  // Component render return
  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={ACCENT_COLOR}
        translucent={false}
      />
      <View
        style={[
          HomePage.mainSafeAreaView,
          {
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
          },
        ]}>
        <View
          style={[
            HomePage.mainHeader,
            {
              height:
                Platform.OS === 'ios' && !hasNotch
                  ? statusHeight * 5
                  : statusHeight * 3.5,
            },
          ]}>
          <View style={HomePage.mainHeaderContainer}>
            <View style={HomePage.mainHeaderCogContainer}>
              <PressableOpacity
                activeOpacity={0.5}
                style={HomePage.mainHeaderCogPressable}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: statusHeight / 1.3,
                }}
                onPress={goMenu}>
                <FontAwesomeIcon
                  size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                  color={'white'}
                  icon={faBars}
                />
              </PressableOpacity>
            </View>
            <View style={HomePage.mainHeaderSearchContainer}>
              <PressableOpacity
                activeOpacity={0.5}
                style={HomePage.mainHeaderCogPressable}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: statusHeight / 1.3,
                }}
                onPress={goSearch}>
                <FontAwesomeIcon
                  size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                  color={'white'}
                  icon={faSearch}
                />
              </PressableOpacity>
            </View>
            <Text
              style={[
                HomePage.mainHeaderText,
                {fontSize: Adjust(fontSizes !== null ? fontSizes[7] : 16)},
              ]}>
              {enLang ? EN.latest : RO.latest}
            </Text>
          </View>
        </View>
        <FlatList
          refreshControl={
            latestLoading ? null : (
              <RefreshControl
                tintColor={ACCENT_COLOR}
                progressViewOffset={55}
                refreshing={refreshing}
                onRefresh={isNetReachable ? onRefresh : netOff}
              />
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 9,
            width,
          }}
          data={
            latestLoading
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
          renderItem={latestLoading ? () => <SkeletonLoading /> : renderItem}
          extraData={collItems}
          keyExtractor={(item) => item.id.toString()}
        />
        {isNetReachable ? (
          <Animated.View
            style={[
              HomePage.networkAlertContainer,
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
              HomePage.networkAlertContainer,
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
    width,
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
    paddingBottom: '1.7rem',
  },
  mainHeaderSearchContainer: {
    position: 'absolute',
    right: statusHeight / 3.5,
    bottom: '1.2rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderCogContainer: {
    position: 'absolute',
    left: statusHeight / 3.5,
    bottom: '1.2rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
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
