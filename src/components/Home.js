// React
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Animated,
  Alert,
  Easing,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Keyboard,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
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
  faStar,
  faSearch,
  faAngleDoubleUp,
  faFileDownload,
  faCheckSquare,
  faFilm,
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
import {width, MAIN_LIGHT, ACCENT_COLOR, statusHeight} from '../assets/variables';

const INFO = [
  {
    title: '1.Folosirea funcţiei de căutare',
    content:
      '* Pentru cele mai recente torrente dintr-o anumită categorie selectează cel puţin 1 categorie din lista de filtre\n\n* Pentru căutarea după cod IMDb asigură-te că selectezi Căutare după: Cod IMDb în lista de Filtre, pentru exemple legat de diferenţele dintre cele două ţine apăsat 2 secunde (long press) pe oricare dintre cele 2 opţiuni Căutare după\n\n* Opţiunea Torrente din lista cu Filtre NU are nici un efect atunci când NU se foloseşte nici un cuvânt cheie ori când se efectuează Căutare după: Cod IMDb\n\n* Opţiunile Torrente: Freeleech, Internal şi 2x Upload pot fi folosite în combinaţie cu oricare dintre Categorii şi Cuvânt cheie ori cod IMDb',
  },
  {
    title: '2.Semnificaţie Freeleech, Internal şi 2x Upload',
    content:
      'Freeleech:\ndescărcarea torrentelor din această categorie, îţi va creşte Upload-ul fără să adăuge Download astfel nu-ţi va afecta negativ Raţia\n\nInternal:\ntorrente care fac parte din grupuri interne ale trackerului printre care se numără Play(HD|BD|SD|XD)\n\n2x Upload:\nîn caz că nu se subînţelege, aceste torrente odată descărcate şi ţinute la Seed îţi oferă de 2 ori mai mult upload',
  },
  {
    title: '3.Reactualizarea listei cu torrente recent adăugate',
    content: 'Se efectuează prin tragerea în jos (pull down) din capul listei',
  },
  {
    title: '4.Pentru a descărca un fişier torrent',
    content: 'Ţine apăsat 2 secunde (long press) pe torrentul respectiv',
  },
  {
    title: '5.Pentru redirecţionare spre IMDb',
    content:
      'Se aplică doar în cazul torrentelor care conţin cod IMDb şi se efectuează prin atingerea posterului',
  },
  {
    title: '6.Dacă mărimea textului este prea mică / mare',
    content:
      'Se poate schimba din meniu pe mărimile mic, mediu ori mare în funcţie de preferinţă',
  },
];

export default function Home({navigation}) {
  const [catIndex, setCatIndex] = useState('');
  const [searchText, setSearchText] = useState('');
  const [imdbModal, setIMDbModal] = useState(false);
  const [IMDbData, setIMDbData] = useState(null);
  const [catListLatest, setCatListLatest] = useState(false);
  const [collItems, setCollItems] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [switchSearch, setSwitchSearch] = useState(false);
  const [imdbSearch, setImdbSearch] = useState(false);
  const [keySearch, setKeySearch] = useState(true);
  const [isNetReachable, setIsNetReachable] = useState(true);
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
  } = useSelector((state) => state.appConfig);

  // Refs
  const netRef = useRef(false);

  // Component mount
  useEffect(() => {
    // Set font sizes
    dispatch(AppConfigActions.setFonts());

    // Clear collapsed
    setCollItems([]);

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

    return () => {
      unsubscribe();
    };
  }, [isNetReachable]);

  // Functions
  const setCollapsible = (id) => {
    const newIds = [...collItems];
    const index = newIds.indexOf(id);

    if (index > -1) {
      newIds.splice(index, 1);
    } else {
      newIds.shift();
      newIds.push(id);
    }

    setCollItems(newIds);
  };

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
      crashlytics().log('home -> handleSearch()');
      crashlytics().recordError(e);
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
    }
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
            height: statusHeight / 1.5,
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
    );
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
            setIMDbLoading(false);
            crashlytics().log("home -> fetchIMDbInfo() - Axios.get('https://spleeter.co.uk/' + id)");
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
      crashlytics().log('home -> getRefreshData()');
      crashlytics().recordError(e);
    }
  };

  const onRefresh = useCallback(async () => {
    setListLatestLoading(true);
    setCollItems([]);
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
      onPress={() => {setCollapsible(item.id);}}
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
          style={[
            HomePage.renderItemStyle,
            {
              marginTop: 3,
              marginBottom: collItems.includes(item.id) ? 0 : 3,
            },
          ]}
        />
        <Collapsible
          easing={Easing.bounce}
          enablePointerEvents={true}
          duration={400}
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
                    onPress={async () => {
                      const supported = await Linking.canOpenURL(
                        item.download_link,
                      );
                      if (supported) {
                        Alert.alert(
                          'Info',
                          'Doreşti să descarci fişierul torrent ?',
                          [
                            {
                              text: 'DA',
                              onPress: () =>
                                Linking.openURL(item.download_link),
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
          {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
        ]}
        isVisible={appInfo}
        onBackdropPress={() => {
          dispatch(AppConfigActions.toggleAppInfo());
          setActiveSections([]);
        }}>
        <View
          style={[
            HomePage.infoOverlayCloseContainer,
            {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[
              HomePage.infoOverlayScrollView,
              {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
            ]}>
            <View style={HomePage.infoTitleContainer}>
              <Text
                style={{
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
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
        overlayStyle={{
          width: '90%',
          height: '30%',
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
      <Overlay
        statusBarTranslucent
        animationType="fade"
        overlayStyle={[
          HomePage.catCheckOverlay,
          {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
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
              {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
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
                  color: lightTheme ? (keySearch ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (filme4kbd ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (filmeDvd ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (filmeHdRo ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (software ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (seriale4k ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (serialeHd ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (serialeSd ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (freeleech ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (internal ? 'white' : 'black') : 'white',
                }}
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
                  color: lightTheme ? (doubleUp ? 'white' : 'black') : 'white',
                }}
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
                2x Upload
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
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
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
                      const currentSearch = await AsyncStorage.getItem(
                        'search',
                      );
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
                        setCollItems([]);
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
                        backgroundColor:
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
                            ? 'transparent'
                            : 'black',
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
                            ? 'transparent'
                            : 'white',
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
                  onPress={() => {
                    navigation.openDrawer();
                    setCollItems([]);
                  }}>
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
                  onPress={() => {
                    setSwitchSearch(!switchSearch);
                    setCollItems([]);
                  }}>
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
                  ]
                : listSearch
            }
            renderItem={searchLoading ? () => <SkeletonLoading /> : renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 9,
              width: width,
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
  renderItemStyle: {
    backgroundColor: 'transparent',
  },
  mainSafeAreaView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginBottom: statusHeight / 2,
  },
  catCheckScrollContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    marginVertical: 3.6,
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
    height: statusHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
