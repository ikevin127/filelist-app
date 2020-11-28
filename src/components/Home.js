// React
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Animated,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Pressable,
  Keyboard,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {Input, Overlay, Badge} from 'react-native-elements';
import {Chip} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Forms
import * as yup from 'yup';
import {Formik} from 'formik';

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
  faCalendarWeek,
  faQuestionCircle,
  faSearchPlus,
  faStar,
  faSearch,
  faTasks,
  faAngleDoubleUp,
  faCheckSquare,
  faCog,
  faCheck,
  faEraser,
  faFilter,
  faArrowLeft,
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
import {catValues} from '../assets/catData';

// Variables
import {width, height, MAIN_LIGHT, MAIN_DARK, ACCENT_COLOR, statusHeight} from '../assets/variables';

const INFO = [
  {
    title: '1.Pentru a descărca un un fişier torrent',
    content: 'Ţine apăsat 2 secunde (long press) pe torrentul respectiv',
  },
  {
    title: '2.Reactualizarea listei cu torrente recent adăugate',
    content:
      'Se efectuează prin tragerea în jos (pull down) din capul listei.',
  },
  {
    title: '3.Pentru redirecţionare spre pagina IMDb',
    content:
      'Se aplică doar în cazul torrentelor care conţin cod IMDb şi se efectuează prin atingerea posterului',
  },
  {
    title: '4.Dacă mărimea textului este prea mică / mare',
    content: 'Se poate schimba din meniu pe mărimile mic, mediu ori mare în funcţie de preferinţă',
  },
];

export default function Home({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [advSearchText, setAdvSearchText] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [IMDbID, setIMDbID] = useState(null);
  const [IMDbData, setIMDbData] = useState(null);
  const [advKeyword, setAdvKeyword] = useState(true);
  const [advIMDb, setAdvIMDb] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [advSearch, setAdvSearch] = useState(false);
  const [switchSearch, setSwitchSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [catNames, setCatNames] = useState('');
  const [catIndex, setCatIndex] = useState('');
  const [catList, setCatList] = useState(false);
  const [catListLatest, setCatListLatest] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [imdbSearch, setImdbSearch] = useState(false);
  const [keySearch, setKeySearch] = useState(true);
  const [isNetReachable, setIsNetReachable] = useState(true);
  // Loading
  const [refreshing, setRefreshing] = useState(false);
  const [IMDbLoading, setIMDbLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [listLatestLoading, setListLatestLoading] = useState(false);
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
  const [moderated, setModerated] = useState(false);
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
    listLatest,
    listSearch,
    searchError,
  } = useSelector((state) => state.appConfig);

  // Refs
  const netRef = useRef(false);

  // Component mount
  useEffect(() => {

    // Set font sizes
    dispatch(AppConfigActions.setFonts());

    // Net connection listener
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

    // Checking
    // if (IMDbID !== null) {
    //   fetchIMDbInfo(IMDbID);
    // }

    // Keyboard open / closed listener
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {},
    );

    return () => {
      unsubscribe();
      keyboardDidHideListener.remove();
    };
  }, [
    isNetReachable,
    modalData,
    IMDbID,
  ]);

  // Functions
  const getIndexes = () => {
    setCatIndex([
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
  ].reduce(
    (out, bool, index) => (bool ? out.concat(index) : out),
    [],
  ).map((index) => catValues[index]));
  }

  const handleSearch = async (action, type, query) => {
    try {
            const value0 = await AsyncStorage.getItem('username');
            const value1 = await AsyncStorage.getItem('passkey');
            setSearchLoading(true);
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
            setTimeout(() => {
              setSearchLoading(false);
            }, 1000);
          } catch (e) {
            crashlytics().recordError(error);
            Alert.alert(
              'Eroare',
              'A apărut o eroare. Încearcă din nou.',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
              {cancelable: true},
            );
            crashlytics().recordError(e);
          }
  };

  const SkeletonLoading = () => {
    return (
      <SkeletonContent
                      boneColor={'#404040'}
                      highlightColor={'#505050'}
                      duration={900}
                      containerStyle={HomePage.skeletonContainer}
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
                          height: statusHeight / 1.8,
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
                          bottom: 8,
                          right: 9,
                          width: 13,
                          height: 13,
                          borderRadius: 100,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 27,
                          width: 13,
                          height: 13,
                          borderRadius: 100,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 45,
                          width: 13,
                          height: 13,
                          borderRadius: 100,
                        }}
                      />
                    </SkeletonContent>
    )
  }

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
            crashlytics().recordError(e);
          });
      } else {
        setIMDbData(false);
      }
    } catch (error) {
      crashlytics().recordError(error);
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
        toValue: statusHeight,
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
        toValue: statusHeight,
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

  const _renderHeader = (section) => {
    return (
      <View>
        <Text
          style={{
            fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
            textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
            textShadowOffset: {width: 0.5, height: 0.5},
            textShadowRadius: 1,
            color: ACCENT_COLOR,
            fontWeight: 'bold',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={HomePage.renderContent}>
        <Text
          style={{
            color: lightTheme ? 'black' : 'white',
            fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
          }}>
          {section.content}
        </Text>
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  const getRefreshData = async () => {
    try {
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null) {
        dispatch(AppConfigActions.getLatest(value0, value1));
      }
    } catch (e) {
      crashlytics().recordError(e);
    }
  };

  const onRefresh = useCallback(async () => {
    setListLatestLoading(true);
    getRefreshData();
    setTimeout(() => {
      setListLatestLoading(false);
    }, 1000);
  }, []);

  const Item = ({item, onPress, style}) => (
    <Pressable
      onLongPress={async () => {
        const supported = await Linking.canOpenURL(item.download_link);
        if (supported) {
          Alert.alert(
            'Info',
            'Doreşti să descarci fişierul torrent ?',
            [
              {
                text: 'DA',
                onPress: () => Linking.openURL(item.download_link),
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
      }}
      onPress={onPress}
      android_ripple={{
        color: 'grey',
        borderless: false,
      }}
      style={[HomePage.itemPressable, style]}>
      <View style={HomePage.itemPressableContainer}>
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
                  textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
                  color: lightTheme ? MAIN_DARK : 'white',
                },
              ]}>
              {item.name}
            </Text>
            <Text
              style={[
                HomePage.itemPressableUploadText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[0] : 6),
                  textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
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
    return <Item item={item} style={HomePage.renderItemStyle} />;
  };

  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <Overlay
        statusBarTranslucent
        animationType="slide"
        overlayStyle={[
          HomePage.infoOverlay,
          {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
        ]}
        isVisible={appInfo}
        onBackdropPress={() => {
          dispatch(AppConfigActions.toggleAppInfo());
          setActiveSections([]);
        }}>
        <View
          style={[
            HomePage.infoOverlayCloseContainer,
            {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[
              HomePage.infoOverlayScrollView,
              {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
            ]}>
            <View style={HomePage.infoTitleContainer}>
              <Text
                style={{
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? MAIN_DARK : 'white',
                  textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
                  textShadowOffset: {width: 0.8, height: 0.8},
                  textShadowRadius: 1,
                  fontWeight: 'bold',
                }}>
                Informaţii folosire
              </Text>
            </View>
            <Accordion
              sections={INFO}
              containerStyle={HomePage.accordionContainer}
              expandMultiple
              underlayColor={lightTheme ? MAIN_LIGHT : '#303030'}
              activeSections={activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
            />
          </ScrollView>
        </View>
      </Overlay>
      <Overlay
        statusBarTranslucent
        animationType="fade"
        overlayStyle={[
          HomePage.catCheckOverlay,
          {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
        ]}
        isVisible={catListLatest}
        onBackdropPress={() => {
          setTimeout(() => {
            getIndexes();
          }, 100);
          setTimeout(() => {
            getIndexes();
          }, 150);
          setTimeout(() => {
            setCatListLatest(!catListLatest);
          }, 200);
        }}>
        <View style={HomePage.catCheckContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={[
              HomePage.catCheckScrollView,
              {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
            ]}>
            <View style={HomePage.catCheckOverlayErase}>
              <Pressable
                style={HomePage.catCheckOverlayPressableErase}
                android_ripple={{
                  color: 'white',
                  borderless: false,
                }}
                onPress={() => {
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
                }}>
                <FontAwesomeIcon color={'white'} size={20} icon={faEraser} />
              </Pressable>
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
                  color: lightTheme ? 'black' : 'white',
                  fontWeight: 'bold',
                  paddingLeft: 5,
                }}>
                Căutare după
              </Text>
            </View>
            <View style={HomePage.catCheckScrollContainer}>
              <Chip
                style={{
                  backgroundColor: keySearch ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  keySearch ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onLongPress={() => {
                  Alert.alert(
                    'Info',
                    'Această opţiune permite căutarea după cuvinte cheie pe modelul:\n\ntitanic.1997\ntitanic 1997',
                    [
                      {
                        text: 'OK',
                        onPress: () => {},
                      },
                    ],
                    {cancelable: true},
                  );
                }}
                onPress={() => {
                  setKeySearch(!keySearch);
                  setImdbSearch(false);
                }}>
                Cuvânt cheie
              </Chip>
              <Chip
                style={{
                  backgroundColor: imdbSearch ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  imdbSearch ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onLongPress={() => {
                  Alert.alert(
                    'Info',
                    'Această opţiune permite căutarea după codul IMDb pe modelul:\n\ntt4719744\n4719744',
                    [
                      {
                        text: 'OK',
                        onPress: () => {},
                      },
                    ],
                    {cancelable: true},
                  );
                }}
                onPress={() => {
                  setImdbSearch(!imdbSearch);
                  setKeySearch(false);
                }}>
                Cod IMDb
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
                  color: lightTheme ? 'black' : 'white',
                  fontWeight: 'bold',
                  paddingLeft: 5,
                }}>
                Categorie
              </Text>
            </View>
            <View style={HomePage.catCheckScrollContainer}>
              <Chip
                style={{
                  backgroundColor: animes ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  animes ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setAnimes(!animes)}>
                Anime
              </Chip>
              <Chip
                style={{
                  backgroundColor: audio ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  audio ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setAudio(!audio)}>
                Audio
              </Chip>
              <Chip
                style={{
                  backgroundColor: desene ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  desene ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setDesene(!desene)}>
                Desene
              </Chip>
              <Chip
                style={{
                  backgroundColor: diverse ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  diverse ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setDiverse(!diverse)}>
                Diverse
              </Chip>
              <Chip
                style={{
                  backgroundColor: doc ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  doc ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setDoc(!doc)}>
                Docs
              </Chip>
              <Chip
                style={{
                  backgroundColor: filme3d ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filme3d ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilme3d(!filme3d)}>
                Filme 3D
              </Chip>
              <Chip
                style={{
                  backgroundColor: filme4k ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filme4k ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilme4k(!filme4k)}>
                Filme 4K
              </Chip>
              <Chip
                style={{
                  backgroundColor: filme4kbd ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filme4kbd ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilme4kBD(!filme4kbd)}>
                Filme 4K Blu-Ray
              </Chip>
              <Chip
                style={{
                  backgroundColor: filmeBD ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filmeBD ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilmeBD(!filmeBD)}>
                Filme Blu-Ray
              </Chip>
              <Chip
                style={{
                  backgroundColor: filmeDvd ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filmeDvd ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilmeDvd(!filmeDvd)}>
                Filme DVD
              </Chip>
              <Chip
                style={{
                  backgroundColor: filmeDvdRo ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filmeDvdRo ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilmeDvdRo(!filmeDvdRo)}>
                Filme DVD-RO
              </Chip>
              <Chip
                style={{
                  backgroundColor: filmeHd ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filmeHd ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilmeHd(!filmeHd)}>
                Filme HD
              </Chip>
              <Chip
                style={{
                  backgroundColor: filmeHdRo ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filmeHdRo ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilmeHdRo(!filmeHdRo)}>
                Filme HD-RO
              </Chip>
              <Chip
                style={{
                  backgroundColor: filmeSd ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  filmeSd ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFilmeSd(!filmeSd)}>
                Filme SD
              </Chip>
              <Chip
                style={{
                  backgroundColor: flacs ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  flacs ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFlacs(!flacs)}>
                FLAC
              </Chip>
              <Chip
                style={{
                  backgroundColor: jocConsole ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  jocConsole ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setJocConsole(!jocConsole)}>
                Jocuri Console
              </Chip>
              <Chip
                style={{
                  backgroundColor: jocPc ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  jocPc ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setJocPc(!jocPc)}>
                Jocuri PC
              </Chip>
              <Chip
                style={{
                  backgroundColor: lin ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  lin ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setLin(!lin)}>
                Linux
              </Chip>
              <Chip
                style={{
                  backgroundColor: mob ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  mob ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setMob(!mob)}>
                Mobile
              </Chip>
              <Chip
                style={{
                  backgroundColor: software ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  software ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setSoftware(!software)}>
                Programe
              </Chip>
              <Chip
                style={{
                  backgroundColor: seriale4k ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  seriale4k ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setSeriale4k(!seriale4k)}>
                Seriale 4K
              </Chip>
              <Chip
                style={{
                  backgroundColor: serialeHd ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  serialeHd ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setSerialeHd(!serialeHd)}>
                Seriale HD
              </Chip>
              <Chip
                style={{
                  backgroundColor: serialeSd ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  serialeSd ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setSerialeSd(!serialeSd)}>
                Seriale SD
              </Chip>
              <Chip
                style={{
                  backgroundColor: sports ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  sports ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setSports(!sports)}>
                Sport
              </Chip>
              <Chip
                style={{
                  backgroundColor: videos ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  videos ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setVideos(!videos)}>
                Videoclip
              </Chip>
              <Chip
                style={{
                  backgroundColor: porn ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  porn ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setPorn(!porn)}>
                XXX
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
                  color: lightTheme ? 'black' : 'white',
                  fontWeight: 'bold',
                  paddingLeft: 5,
                }}>
                Torrente
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
                  backgroundColor: freeleech ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  freeleech ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setFreeleech(!freeleech)}>
                Freeleech
              </Chip>
              <Chip
                style={{
                  backgroundColor: internal ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  internal ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setInternal(!internal)}>
                Internal
              </Chip>
              <Chip
                style={{
                  backgroundColor: doubleUp ? '#155778' : '#505050',
                  marginRight: 5,
                  marginBottom: 5,
                }}
                textStyle={{color: 'white'}}
                icon={() =>
                  doubleUp ? (
                    <FontAwesomeIcon
                      style={{color: ACCENT_COLOR}}
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
                onPress={() => setDoubleUp(!doubleUp)}>
                2X Upload
              </Chip>
            </View>
          </ScrollView>
          <View style={HomePage.catCheckOverlayFooter}>
            <Pressable
              style={HomePage.catCheckOverlayPressable}
              android_ripple={{
                color: 'white',
                borderless: false,
              }}
              onPress={() => {
                getIndexes();
                setCatListLatest(!catListLatest);
              }}>
              <FontAwesomeIcon color={'white'} size={20} icon={faCheck} />
            </Pressable>
          </View>
        </View>
      </Overlay>
      <SafeAreaView
        style={[
          HomePage.mainSafeAreaView,
          {
            backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,
          },
        ]}>
        <View style={HomePage.mainHeader}>
          {switchSearch ? (
            <Formik
              initialValues={{search: ''}}
              onSubmit={async (values) => {
                if (isNetReachable) {
                  Keyboard.dismiss();
                  setSearchText(values.search);
                  if (values.search === '' && catIndex.length < 1) {
                    Alert.alert(
                      'Info',
                      'Pentru căutarea fără cuvânt cheie selectează 1 sau mai multe categorii.',
                      [
                        {
                          text: 'OK',
                          onPress: () => {},
                          style: 'cancel',
                        },
                      ],
                      {cancelable: true},
                    );
                  } else {
                    if (values.search.length > 0) {
                      const currentSearch = await AsyncStorage.getItem('search');
                      if (currentSearch !== null) {
                        await AsyncStorage.removeItem('search');
                        dispatch(AppConfigActions.retrieveSearch());
                      }
                      handleSearch(
                        'search-torrents',
                        keySearch ? 'name' : 'imdb',
                        values.search,
                      );
                    } else {
                      handleSearch(
                        'latest-torrents',
                        keySearch ? 'name' : 'imdb',
                        values.search,
                      );
                    }
                  }
              } else {
                  netOff();
                  Alert.alert(
                    'Info',
                    'Conexiune offline. Reconectează-te pentru a continua căutarea.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {},
                      },
                    ],
                    {cancelable: true},
                  );
                }
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
                      HomePage.inputStyle,
                      {
                        fontSize: Adjust(12),
                        color: MAIN_LIGHT,
                      },
                    ]}
                    inputContainerStyle={HomePage.inputContainerInner}
                    onSubmitEditing={handleSubmit}
                    returnKeyType={'search'}
                    selectionColor="grey"
                    autoFocus
                    autoCapitalize="none"
                    onFocus={async () => {
                      resetForm({});
                      const currentSearch = await AsyncStorage.getItem(
                        'search',
                      );
                      if (currentSearch !== null) {
                        await AsyncStorage.removeItem('search');
                        dispatch(AppConfigActions.retrieveSearch());
                      }
                    }}
                    placeholder="Caută după cuvânt cheie, IMDb..."
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    value={values.search}
                    onChangeText={handleChange('search')}
                    onBlur={() => setFieldTouched('search')}
                  />
                  <View style={HomePage.mainHeaderSearch1Container}>
                    <Pressable
                      style={HomePage.mainHeaderCogPressable}
                      android_ripple={{
                        color: 'white',
                        borderless: true,
                        radius: width / 18,
                      }}
                      onPress={async () => {
                        setSwitchSearch(!switchSearch);
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
                        const currentSearch = await AsyncStorage.getItem(
                          'search',
                        );
                        if (currentSearch !== null) {
                          await AsyncStorage.removeItem('search');
                          dispatch(AppConfigActions.retrieveSearch());
                        }
                      }}>
                      <FontAwesomeIcon
                        size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                        color={'white'}
                        icon={faArrowLeft}
                      />
                    </Pressable>
                  </View>
                  <View style={HomePage.mainHeaderSearch2Container}>
                    <Pressable
                      style={HomePage.mainHeaderCogPressable}
                      android_ripple={{
                        color: 'white',
                        borderless: true,
                        radius: width / 18,
                      }}
                      onPress={handleSubmit}>
                      <FontAwesomeIcon
                        size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                        color={'white'}
                        icon={faSearch}
                      />
                    </Pressable>
                  </View>
                  <View style={HomePage.mainHeaderSearch3Container}>
                    <Badge
                      containerStyle={HomePage.mainHeaderSearch3Badge}
                      badgeStyle={{
                        borderWidth: 0,
                        backgroundColor: ACCENT_COLOR,
                      }}
                      textStyle={{
                        color:
                          [
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
                            .toString() === '0'
                            ? 'white'
                            : 'black',
                        fontWeight: 'bold',
                      }}
                      value={[
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
                        .toString()}
                    />
                    <Pressable
                      style={HomePage.mainHeaderCogPressable}
                      android_ripple={{
                        color: 'white',
                        borderless: true,
                        radius: width / 18,
                      }}
                      onPress={() => {
                        setCatListLatest(!catListLatest);
                      }}>
                      <FontAwesomeIcon
                        size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                        color={'white'}
                        icon={faFilter}
                      />
                    </Pressable>
                  </View>
                </>
              )}
            </Formik>
          ) : (
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
                  onPress={() => {setSwitchSearch(!switchSearch);}}>
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
          )}
        </View>
        {switchSearch ? (
          <FlatList
            data={
              searchLoading
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
                    {id: '16'},
                    {id: '17'},
                    {id: '18'},
                    {id: '19'},
                    {id: '20'},
                  ]
                : listSearch
            }
            renderItem={searchLoading ? () => <SkeletonLoading /> : renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 9,
              paddingBottom: 9,
              paddingLeft: 9,
              paddingRight: width < 376 ? 22 : 18,
            }}
            ListHeaderComponent={() =>
              listSearch === null ? null : JSON.stringify(listSearch) ===
                '[]' ? (
                <View
                  style={{
                    width: '100%',
                    padding: 5,
                  }}>
                  <Text
                    style={{
                      color: lightTheme ? 'black' : 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Rezultatele căutării după "{searchText}"
                  </Text>
                  <Text
                    style={{
                      color: lightTheme ? 'black' : 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Nu s-a găsit nimic!
                  </Text>
                  <Text
                    style={{
                      color: lightTheme ? 'black' : 'white',
                      textAlign: 'center',
                    }}>
                    Încearcă din nou cu alt șir de căutare.
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
                      color: lightTheme ? 'black' : 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Rezultatele căutării după{' '}
                    {searchText === ''
                      ? 'filtrele selectate'
                      : '"' + searchText + '"'}
                  </Text>
                </View>
              ) : null
            }
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={HomePage.flatListsContentContainer}
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
                    {id: '16'},
                    {id: '17'},
                    {id: '18'},
                    {id: '19'},
                    {id: '20'},
                  ]
                : listLatest
            }
            renderItem={
              listLatestLoading ? () => <SkeletonLoading /> : renderItem
            }
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        {isNetReachable ? (
          <Animated.View
            style={[
              HomePage.networkAlertContainer,
              {
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
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                fontWeight: 'bold',
                opacity: showNetworkAlertTextOn,
                color: 'white',
              }}>
              Online
            </Animated.Text>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              HomePage.networkAlertContainer,
              {
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
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                fontWeight: 'bold',
                opacity: showNetworkAlertTextOff,
                color: 'white',
              }}>
              Offline
            </Animated.Text>
          </Animated.View>
        )}
      </SafeAreaView>
    </>
  );
}

const HomePage = EStyleSheet.create({
  itemPressable: {
    elevation: 7,
    zIndex: 7,
    marginVertical: '0.2rem',
  },
  itemPressableContainer: {
    flex: 1,
    width: '100%',
    borderColor: '#181818',
    borderWidth: 1,
    padding: '0.5rem',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemPressableFirst: {
    height: '100%',
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
  itemPressableNameText: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
  },
  itemPressableUploadText: {
    color: 'silver',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
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
  renderItemStyle: {
    backgroundColor: 'transparent',
  },
  mainSafeAreaView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  advSearchOverlay: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  advSearchContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
  },
  catCheckOverlay: {
    width: '90%',
    height: '75%',
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
    marginBottom: statusHeight / 2
  },
  catCheckScrollContainer: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  catCheckBox: {
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: 'grey',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  catCheckBoxLast: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    position: 'absolute',
    top: 0,
    right: 0,
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
  catCheckOverlayText: {
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  advSearchScrollView: {
    width: '100%',
    paddingBottom: StatusBar.currentHeight,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingRight: '5rem'
  },
  advSearchInputStyle: {
    fontWeight: 'normal',
    paddingLeft: 1,
  },
  advSearchContainerStyle: {
    height: 30,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  advSearchInputContainerStyle: {
    height: '80%',
    width: '100%',
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 2,
    borderBottomWidth: 1,
  },
  advSearchTypeViewContainer: {
    height: 30,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  advSearchTypeView: {
    height: '25%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '2%',
  },
  advSearchTypeText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  advSearchTypePressable: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '3%',
  },
  // error: {
  //   position: 'absolute',
  //   bottom: 0,
  //   width: '100%',
  //   fontSize: '0.6rem',
  //   paddingLeft: '1rem',
  //   paddingBottom: '0.1rem',
  //   textAlign: 'left',
  //   color: 'black',
  // },
  advSearchTypeCheckView: {
    height: '75%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advSearchTypeViewHalf: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advSearchTypeCheckBox1: {
    width: '93%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  advSearchTypeCheckBox2: {
    width: '92%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  advSearchTypeChecked: {
    color: 'grey',
  },
  advSearchTypeUnchecked: {
    borderRadius: 1,
    borderWidth: 1,
  },
  advSearchCatContainer: {
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  advSearchCatCheck: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  advSearchOptions: {
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advSearchOptionsCheck: {
    width: '47%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  advSearchOptionsChecked: {
    color: ACCENT_COLOR,
  },
  advSearchOptionsUnchecked: {
    borderRadius: 1,
    borderWidth: 1,
  },
  advSearchPressableContainer: {
    width: StatusBar.currentHeight * 6,
    height: StatusBar.currentHeight * 1.5,
    backgroundColor: ACCENT_COLOR,
    overflow: 'hidden',
    borderRadius: 34,
    marginTop: StatusBar.currentHeight,
    marginBottom: 5,
  },
  advSearchPressable: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
  },
  advSearchPressableIcon: {
    color: 'white',
    marginRight: 10,
  },
  advSearchPressableText: {
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  imdbOverlayStyle: {
    width: '87%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  imdbInfoContainer: {
    width: '100%',
    paddingBottom: StatusBar.currentHeight,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imdbInfoContainerStyle: {
    width: '100%',
  },
  imdbInfoView: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imdbInfoHeader: {
    width: '100%',
    height: '45rem',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '8rem',
  },
  imdbInfoHeaderFastImage: {
    position: 'absolute',
    left: 0,
    height: '45rem',
    width: '45rem',
  },
  imdbInfoHeaderText: {
    width: '85%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '2%',
  },
  imdbInfoHeaderCat: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
  },
  imdbInfoHeaderDesc: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imdbInfoTitleSection: {
    width: '100%',
    height: '60rem',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderTopWidth: '0.5rem',
    borderTopColor: '#303030',
    paddingTop: '6rem',
  },
  imdbInfoTitleText: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontWeight: 'bold',
  },
  imdbInfoTitleBadges: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '6rem',
  },
  imdbInfoFreeleechBadge: {
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    borderColor: '#1ec621',
    borderWidth: '0.5rem',
    color: 'aliceblue',
    marginRight: '4rem',
    backgroundColor: '#09580a',
  },
  imdbInfoDoubleUpBadge: {
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    borderColor: '#7c00ff',
    borderWidth: '0.5rem',
    color: 'aliceblue',
    marginRight: '4rem',
    backgroundColor: '#370f61',
  },
  imdbInfoInternalBadge: {
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    borderColor: '#1e87c6',
    borderWidth: '0.5rem',
    color: 'aliceblue',
    marginRight: '4rem',
    backgroundColor: '#093b58',
  },
  imdbInfoDataContainer: {
    borderTopColor: '#303030',
    borderTopWidth: '0.5rem',
    paddingTop: '12rem',
    width: '100%',
    height: '250rem',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15rem',
  },
  imdbInfoActivityIndicator: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  imdbInfoMainView: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imdbInfoMainPoster: {
    width: '50%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imdbInfoPosterPressable: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imdbInfoMainPosterFastImage: {
    width: '90%',
    height: '79%',
  },
  imdbInfoRatingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '21%',
  },
  imdbInfoRatingText: {
    textShadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    textShadowRadius: 1,
    fontWeight: 'bold',
  },
  imdbInfoRatingIcon: {marginLeft: '8rem'},
  imdbInfoMainPlotView: {
    width: '50%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: '2%',
  },
  imdbInfoMainPlot: {
    width: '100%',
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imdbInfoMainPlotTitle: {
    textShadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    textShadowRadius: 1,
    color: 'grey',
    fontWeight: 'bold',
  },
  imdbInfoMainPlotText: {
    textShadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    textShadowRadius: 1,
    paddingTop: '3%',
  },
  imdbInfoMainSeparator: {
    position: 'relative',
    top: 0,
    left: 0,
    marginVertical: '5rem',
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#303030',
  },
  imdbInfoMainETATitle: {
    textShadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    textShadowRadius: 1,
    color: 'grey',
    fontWeight: 'bold',
  },
  imdbInfoMainETAText: {
    textShadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    textShadowRadius: 1,
  },
  imdbInfoMainFooter: {
    borderTopWidth: '0.5rem',
    borderTopColor: '#303030',
    width: '100%',
    paddingTop: '12rem',
    height: '80rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imdbInfoMainFooterView: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imdbInfoMainFooterView2: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10rem',
  },
  imdbInfoMainFooter3rd: {
    width: '33.33%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imdbInfoMainFooter3rdPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imdbInfoMainFooter3rdText: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
  },
  imdbInfoMainFooterTall: {
    width: '100%',
    height: '200rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imdbInfoMainFooterTallView: {
    width: '100%',
    height: '30%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlay: {
    width: '90%',
    height: '50%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    padding: 5,
  },
  infoOverlayCloseContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlayScrollView: {
    width: '100%',
    paddingBottom: StatusBar.currentHeight,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  infoTitleContainer: {
    width: '100%',
    padding: '1rem',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  accordionContainer: {
    width: '100%',
    paddingHorizontal: '1rem',
  },
  renderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: '1rem',
  },
  infoOverlayClosePressable: {
    position: 'absolute',
    right: 0,
    width: '15%',
    height: '25%',
    bottom: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 0,
    padding: 0,
    margin: 0,
  },
  settingsOverlayCloseContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsOverlayClosePressable: {
    position: 'absolute',
    right: 0,
    width: '15%',
    height: '25%',
    bottom: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOverlayThemeContainer: {
    width: '100%',
    height: '33.33%',
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsOverlayThemeText: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontWeight: 'bold',
  },
  settingsOverlayUseContainer: {
    width: '100%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  settingsOverlayUsePressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  settingsOverlayLogoutContainer: {
    width: '100%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'crimson',
  },
  settingsOverlayLogoutPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'crimson',
  },
  settingsOverlayLogoutText: {
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    color: 'white',
    fontWeight: 'bold',
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
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: '1.8rem',
  },
  mainHeaderSearchContainer: {
    position: 'absolute',
    right: '0.3rem',
    bottom: '1.2rem',
    width: '3rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 5,
    elevation: 5,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  mainHeaderCogContainer: {
    position: 'absolute',
    left: '0.3rem',
    bottom: '1.2rem',
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
  mainClearSearchBar: {
    zIndex: 8,
    elevation: 8,
    height: 30,
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainClearSearchBarContainer: {
    height: 20,
    width: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: ACCENT_COLOR,
  },
  mainClearSearchBarPressable: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: ACCENT_COLOR,
    padding: 5,
  },
  mainClearSearchBarText: {
    fontWeight: 'normal',
    paddingHorizontal: 20,
    width: '94%',
  },
  mainClearSearchBarTextSecond: {
    fontWeight: 'bold',
  },
  searchInputContainerStyle: {
    zIndex: 8,
    elevation: 8,
    height: 50,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchInContainerStyle: {
    borderBottomWidth: 1,
    height: '80%',
    width: '100%',
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 1,
  },
  searchInputRIContainer: {
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 2,
  },
  searchInputRIPressable: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2,
  },
  searchLoadingContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchLoadingAI: {
    marginTop: StatusBar.currentHeight * 5,
  },
  searchNoResults: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight * 1.5,
    paddingBottom: StatusBar.currentHeight * 2,
  },
  searchNoResultsTextPrimary: {
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchNoResultsTextSecondary: {
    marginTop: 2,
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    textAlign: 'center',
  },
  flatListsContentContainer: {
    padding: '0.5rem',
  },
  advSearchBtnContainer: {
    width: 40,
    height: 40,
    zIndex: 5,
    elevation: 5,
    overflow: 'hidden',
    bottom: 15,
    right: 20,
    borderRadius: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  advSearchBtnPressable: {
    width: 40,
    height: 40,
    borderRadius: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  refreshContainer: {
    height: StatusBar.currentHeight * 2,
    width: '93%',
    elevation: 9,
    zIndex: 9,
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
  },
  refreshTextPrimary: {
    fontWeight: 'bold',
  },
  refreshTextSecondary: {
    paddingBottom: 2,
  },
  profilePicContainer: {
    height: height,
    width: width,
    paddingBottom: height / 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: width / 1.5,
    height: width / 1.5,
    justifyContent: 'center',
    opacity: 0.3
  },
  skeletonContainer:{
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 9,
    marginVertical: 3.6,
    width: width / 1.048,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: '#181818',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  networkAlertContainer: {
    elevation: 10,
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: statusHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
