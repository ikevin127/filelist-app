import React, {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import Clipboard from '@react-native-community/clipboard';
import NetInfo from "@react-native-community/netinfo";
import EStyleSheet from 'react-native-extended-stylesheet';
import FastImage from 'react-native-fast-image';
import Accordion from 'react-native-collapsible/Accordion';
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
  ScrollView,
  StatusBar,
  Switch,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {Input, Overlay, CheckBox} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
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
  faInfoCircle,
  faSun,
  faMoon,
  faCog,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {catStrings, catValues} from '../assets/cat/catData';
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

const MAIN_LIGHT = '#E8E6E6';
const MAIN_DARK = '#202020';
const ACCENT_COLOR = '#15ABF4';

export default function Home() {
  const dispatch = useDispatch();
  const {
    lightTheme,
    listLatest,
    listSearch,
    listImdb,
    listAdvSearch,
    searchError,
    imdbError,
    advSearchError,
  } = useSelector((state) => state.appConfig);
  const [showStatus] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [showClipboardStatus] = useState(new Animated.Value(0));
  const [textClipboardOpacity] = useState(new Animated.Value(0));
  const [showNetworkAlert] = useState(new Animated.Value(-StatusBar.currentHeight * 4));
  const [showNetworkAlertText] = useState(new Animated.Value(0));
  const [search, setSearch] = useState('');
  const [advSearchText, setAdvSearchText] = useState('');
  const [catNames, setCatNames] = useState('');
  const [catIndex, setCatIndex] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [IMDbID, setIMDbID] = useState(null);
  const [IMDbData, setIMDbData] = useState(null);
  const [advKeyword, setAdvKeyword] = useState(true);
  const [isNetReachable, setIsNetReachable] = useState(true);
  const [advIMDb, setAdvIMDb] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [IMDbLoading, setIMDbLoading] = useState(false);
  const [listLatestLoading, setListLatestLoading] = useState(false);
  const [advSearch, setAdvSearch] = useState(false);
  const [searchValidation, setSearchValidation] = useState(false);
  const [advSearchValidation, setAdvSearchValidation] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [catList, setCatList] = useState(false);
  const [catListLatest, setCatListLatest] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isSearchBar, setIsSearchBar] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
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
  const SearchBarRef = useRef();
  const AdvSearchRef = useRef();
  const searchValidationTimeout = useRef();
  const advSearchValidationTimeout = useRef();

  let catArray = [
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
  ];

  let arrIndex = catArray.reduce(
    (out, bool, index) => (bool ? out.concat(index) : out),
    [],
  );

  const INFO = [
    {
      title: '1.Cum copiez linkul de descărcare al unui torrent ?',
      content: 'Ţine apăsat 2 secunde (long press) pe torrentul respectiv.',
    },
    {
      title: '2.Redirecţionare spre pagina IMDb a unui torrent.',
      content: 'Se aplică doar în cazul torrentelor care conţin cod IMDb şi se efectuează prin touch pe posterul acestuia pentru redirecţionare spre pagina IMDb.',
    },
    {
      title: '3.Căutare torrente Recent adăugate în funcţie de categorie.',
      content: 'Ţine apăsat 2 secunde (long press) pe iconiţa de Căutare albastră şi alege Categoria.',
    },
    {
      title: '4.Reactualizarea listei cu torrentele recent adăugate.',
      content: 'Se efectuează prin tragerea în jos (pull down) de la începutul listei.',
    },
    {
      title: '5.Cum schimb tema de culori a aplicaţiei ?',
      content: 'Se poate schimba din meniul de Setări.',
    },
  ];

  useEffect(() => {
    if (IMDbID !== null) {
      fetchIMDbInfo(IMDbID);
    }
    setCatNames(arrIndex.map((index) => catStrings[index]));
    setCatIndex(arrIndex.map((index) => catValues[index]));
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable === true) {
        setIsNetReachable(true);
      } else {
        setIsNetReachable(false);
        setTimeout(() => {
          Animated.timing(showNetworkAlert, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }).start();
          Animated.timing(showNetworkAlertText, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        }, 100);
        setTimeout(() => {
          Animated.timing(showNetworkAlert, {
            toValue: -StatusBar.currentHeight * 4,
            duration: 700,
            useNativeDriver: false,
          }).start();
          Animated.timing(showNetworkAlertText, {
            toValue: 0,
            duration: 700,
            useNativeDriver: false,
          }).start();
        }, 4000);
      }
    });

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
    if (listAdvSearch !== null) {
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
    if (
      JSON.stringify(listSearch) === '[]' ||
      JSON.stringify(listImdb) === '[]' ||
      JSON.stringify(listAdvSearch) === '[]'
    ) {
      setNoResults(true);
    }
    if (searchError !== null || imdbError !== null || advSearchError !== null) {
      setSearchLoading(false);
      setNoResults(true);
    }

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (SearchBarRef.current) {
          SearchBarRef.current.blur();
        }
        if (AdvSearchRef.current) {
          AdvSearchRef.current.blur();
        }
      },
    );

    return () => {
      unsubscribe();
      clearTimeout(searchValidationTimeout.current);
      clearTimeout(advSearchValidationTimeout.current);
      keyboardDidHideListener.remove();
    };
  }, [
    isNetReachable,
    modalData,
    IMDbID,
    listSearch,
    listImdb,
    listAdvSearch,
    searchError,
    imdbError,
    advSearchError,
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
  ]);

  // Functions

  const handleSearch = async () => {
    if (isNetReachable) {
      if (search !== '') {
        setIsSearchBar(true);
        setIsSearch(true);
        try {
          Keyboard.dismiss();
          const value0 = await AsyncStorage.getItem('username');
          const value1 = await AsyncStorage.getItem('passkey');
          if (value0 !== null && value1 !== null) {
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
          }
        } catch (e) {
          alert(e);
        }
      } else {
        setSearchValidation(true);
        searchValidationTimeout.current = setTimeout(() => {
          setSearchValidation(false);
        }, 3000);
      }
    } else {
      Alert.alert(
        'Info',
        'Conexiune offline. Reconectează-te pentru a putea folosi funcţia de Căutare.',
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

  const handleLatestSearch = async () => {
    if (isNetReachable) {
      if (animes || 
        audio || 
        desene || 
        diverse || 
        doc || 
        filme3d || 
        filme4k || 
        filme4kbd || 
        filmeBD || 
        filmeDvd || 
        filmeDvdRo || 
        filmeHd || 
        filmeHdRo || 
        filmeSd || 
        flacs || 
        jocConsole || 
        jocPc || 
        lin || 
        mob || 
        software || 
        seriale4k || 
        serialeHd || 
        serialeSd || 
        sports || 
        videos || 
        porn !== false ) {
            if (catNames.length <= 8) {
              setCatListLatest(false);
              setIsSearchBar(true);
        setIsSearch(true);
        setAdvSearchText(
          animes ||
          audio ||
          desene ||
          diverse ||
          doc ||
          filme3d ||
          filme4k ||
          filme4kbd ||
          filmeBD ||
          filmeDvd ||
          filmeDvdRo ||
          filmeHd ||
          filmeHdRo ||
          filmeSd ||
          flacs ||
          jocConsole ||
          jocPc ||
          lin ||
          mob ||
          software ||
          seriale4k ||
          serialeHd ||
          serialeSd ||
          sports ||
          videos ||
          porn === true
            ? catNames !== ''
              ? catNames.toString().split(',').join(', ')
              : 'Categorii'
            : 'Categorii');
              try {
                const value0 = await AsyncStorage.getItem('username');
                const value1 = await AsyncStorage.getItem('passkey');
                if (value0 !== null && value1 !== null) {
                  setSearchLoading(true);
                  dispatch(
                    AppConfigActions.getAdvSearch(
                      value0,
                      value1,
                      'latest-torrents',
                      '',
                      '',
                      catIndex !== null ? `&category=${catIndex}` : '',
                      '',
                      '',
                      '',
                      '',
                    ),
                  );
                }
              } catch (e) {
                alert(e);
              }
            } else {
              Alert.alert(
                'Info',
                'Nu pot fi selectate mai mult de 8 categorii per căutare.',
                [
                  {
                    text: 'OK',
                    onPress: () => {},
                  },
                ],
                {cancelable: true},
              );
            }
      } else {
        Alert.alert(
          'Info',
          'Selectează cel puţin o categorie pentru a putea continua căutarea.',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          {cancelable: true},
        );
      }
    } else {
      Alert.alert(
        'Info',
        'Conexiune offline. Reconectează-te pentru a putea folosi funcţia de Căutare pe categorii.',
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

  const handleAdvancedSearch = async () => {
    if (isNetReachable) {if (advSearchText.length === 0) {
      setAdvSearchValidation(true);
      searchValidationTimeout.current = setTimeout(() => {
        setAdvSearchValidation(false);
      }, 3000);
    } else {
      Keyboard.dismiss();
      setAdvSearch(false);
      setIsSearchBar(true);
      setIsSearch(true);
      try {
        const value0 = await AsyncStorage.getItem('username');
        const value1 = await AsyncStorage.getItem('passkey');
        if (value0 !== null && value1 !== null) {
          if (advKeyword) {
            setSearchLoading(true);
            dispatch(
              AppConfigActions.getAdvSearch(
                value0,
                value1,
                'search-torrents',
                '&type=name',
                `&query=${advSearchText}`,
                catIndex !== null ? `&category=${catIndex}` : '',
                moderated ? '&moderated=1' : '',
                doubleUp ? '&doubleup=1' : '',
                internal ? '&internal=1' : '',
                freeleech ? '&freeleech=1' : '',
              ),
            );
          } else if (advIMDb) {
            setSearchLoading(true);
            dispatch(
              AppConfigActions.getAdvSearch(
                value0,
                value1,
                'search-torrents',
                '&type=imdb',
                `&query=${advSearchText}`,
                catIndex !== null ? `&category=${catIndex}` : '',
                moderated ? '&moderated=1' : '',
                doubleUp ? '&doubleup=1' : '',
                internal ? '&internal=1' : '',
                freeleech ? '&freeleech=1' : '',
              ),
            );
          } else {
            Alert.alert(
              'Info',
              'Selectează categoria căutării de la săgeata din dreapta câmpului de căutare.',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
              {cancelable: true},
            );
          }
        } else {
          Alert.alert(
            'Info',
            'Căutarea nu poate continua deoarece Numele de utilizator si Passkey-ul nu a fost salvat. Este necesară o relogare pentru a înregistra din nou datele.',
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
            {cancelable: true},
          );
        }
      } catch (e) {
        alert(e);
      }
    }} else {Alert.alert(
      'Info',
      'Conexiune offline. Reconectează-te pentru a putea folosi funcţia de Căutare avansată.',
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: true},
    );}
  };

  const clearSearch = async () => {
    setSearchLoading(true);
    try {
      await AsyncStorage.removeItem('search');
      await AsyncStorage.removeItem('imdb');
      await AsyncStorage.removeItem('searchAdv');
    } catch (e) {
      alert(e);
    }
    dispatch(AppConfigActions.retrieveSearch());
    dispatch(AppConfigActions.retrieveImdb());
    dispatch(AppConfigActions.retrieveAdvSearch());
    dispatch(AppConfigActions.searchError());
    dispatch(AppConfigActions.imdbError());
    dispatch(AppConfigActions.searchAdvError());
    setSearch('');
    setAdvSearchText('');
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
    setDoubleUp(false);
    setFreeleech(false);
    setInternal(false);
    setModerated(false);
    setIsSearchBar(false);
    setIsSearch(false);
    setNoResults(false);
    setSearchLoading(false);
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
 
  const _renderHeader = section => {
    return (
      <View style={HomePage.renderHeader}>
        <Text style={{textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, 
      textShadowOffset: {width: 0.8, height: 0.8},
      textShadowRadius: 1,
      color: ACCENT_COLOR, fontWeight: 'bold'}}>{section.title}</Text>
      </View>
    );
  };
 
  const _renderContent = section => {
    return (
      <View style={HomePage.renderContent}>
        <Text style={{color: lightTheme ? 'black' : 'white'}}>{section.content}</Text>
      </View>
    );
  };
 
  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  const switchTheme = async () => {
    try {
      const currentTheme = await AsyncStorage.getItem('theme');
      if (currentTheme !== null) {
        if (currentTheme === 'dark') {
          await AsyncStorage.setItem('theme', 'light');
          dispatch(AppConfigActions.toggleLightTheme())
        } else {
          await AsyncStorage.setItem('theme', 'dark');
          dispatch(AppConfigActions.toggleLightTheme())
        }
      } else {
        await AsyncStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      alert(e);
    }
  }

  const fetchIMDbInfo = async (id) => {
    if (isNetReachable) {
      setIMDbLoading(true);
      await Axios.get('https://spleeter.co.uk/' + id)
        .then((res) => {
          setIMDbData(Array(res.data));
          setIMDbLoading(false);
        })
        .catch((e) => {
          alert(e);
        });
    } else {
      setIMDbData(false);
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

  const copyToClipboard = (string) => {
    Clipboard.setString(`${string}`);
    setTimeout(() => {
      Animated.timing(showClipboardStatus, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(textClipboardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }, 100);
    setTimeout(() => {
      Animated.timing(showClipboardStatus, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
      Animated.timing(textClipboardOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, 2500);
  };

  const getRefreshData = async () => {
    try {
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null) {
        dispatch(AppConfigActions.getLatest(value0, value1));
        setTimeout(() => {
          setListLatestLoading(false);
          setTimeout(() => {
            Animated.timing(showStatus, {
              toValue: 1,
              duration: 400,
              useNativeDriver: false,
            }).start();
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }).start();
            setRefreshing(false);
          }, 500);
          setTimeout(() => {
            Animated.timing(showStatus, {
              toValue: 0,
              duration: 250,
              useNativeDriver: false,
            }).start();
            Animated.timing(textOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: false,
            }).start();
          }, 4000);
        }, 3000);
      }
    } catch (e) {
      alert(e);
    }
  };

  const onRefresh = useCallback(async () => {
    setListLatestLoading(true);
    await getRefreshData();
  }, [refreshing]);

  const Item = ({item, onPress, style}) => (
    <Pressable
      onLongPress={() => {
        copyToClipboard(item.download_link);
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
            <Text style={[HomePage.itemPressableNameText, {textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
          color: lightTheme ? MAIN_DARK : 'white'}]}>{item.name}</Text>
            <Text style={[HomePage.itemPressableUploadText, {textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
          color: lightTheme ? 'grey' : 'silver'}]}>
              [ {item.upload_date.substring(0, 16)} ]
            </Text>
            <View style={HomePage.itemPressableUploadContainer}>
            {item.doubleup === 1 ? (
              <Text style={HomePage.itemPressableDoubleUpText}>2X UPLOAD</Text>
            ) : null}
            {item.internal === 1 ? (
              <Text style={HomePage.itemPressableInternalText}>INTERNAL</Text>
            ) : null}
            {item.freeleech === 1 ? (
              <Text style={HomePage.itemPressableFreeleechText}>FREELEECH</Text>
            ) : null}
          </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({item}) => {
    return (
      <Item
        onPress={() => {
          setInfoModal(true);
          setIMDbID(item.imdb);
          setModalData(Array(item));
        }}
        item={item}
        style={HomePage.renderItemStyle}
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
      <SafeAreaView style={[HomePage.mainSafeAreaView, {
      backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
        <Overlay
                statusBarTranslucent
                animationType="fade"
                overlayStyle={[HomePage.catCheckOverlay, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}
                isVisible={catListLatest}
                onBackdropPress={() => {setCatListLatest(false);
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
                  setPorn(false);}}>
                <View style={HomePage.catCheckContainer}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={[HomePage.catCheckScrollView,{backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
                    <View style={HomePage.catCheckScrollContainer}>
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Anime"
                        checked={animes}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setAnimes(!animes)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Audio"
                        checked={audio}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setAudio(!audio)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Desene"
                        checked={desene}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setDesene(!desene)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Diverse"
                        checked={diverse}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setDiverse(!diverse)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Docs"
                        checked={doc}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setDoc(!doc)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme 3D"
                        checked={filme3d}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilme3d(!filme3d)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme 4K"
                        checked={filme4k}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilme4k(!filme4k)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme 4K Blu-Ray"
                        checked={filme4kbd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilme4kBD(!filme4kbd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme Blu-Ray"
                        checked={filmeBD}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeBD(!filmeBD)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme DVD"
                        checked={filmeDvd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeDvd(!filmeDvd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme DVD-RO"
                        checked={filmeDvdRo}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeDvdRo(!filmeDvdRo)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme HD"
                        checked={filmeHd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeHd(!filmeHd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme HD-RO"
                        checked={filmeHdRo}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeHdRo(!filmeHdRo)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme SD"
                        checked={filmeSd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeSd(!filmeSd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="FLAC"
                        checked={flacs}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFlacs(!flacs)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Jocuri Console"
                        checked={jocConsole}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setJocConsole(!jocConsole)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Jocuri PC"
                        checked={jocPc}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setJocPc(!jocPc)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Linux"
                        checked={lin}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setLin(!lin)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Mobile"
                        checked={mob}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setMob(!mob)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Programe"
                        checked={software}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSoftware(!software)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Seriale 4K"
                        checked={seriale4k}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSeriale4k(!seriale4k)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Seriale HD"
                        checked={serialeHd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSerialeHd(!serialeHd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Seriale SD"
                        checked={serialeSd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSerialeSd(!serialeSd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Sport"
                        checked={sports}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSports(!sports)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Videoclip"
                        checked={videos}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setVideos(!videos)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBoxLast}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="XXX"
                        checked={porn}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setPorn(!porn)}
                      />
                    </View>
                  </ScrollView>
                  <View style={HomePage.catCheckOverlayFooter}>
                    <Pressable
                      style={HomePage.catCheckOverlayPressable}
                      android_ripple={{
                        color: 'white',
                        borderless: false,
                      }}
                      onPress={handleLatestSearch}>
                      <Text style={HomePage.catCheckOverlayText}>Caută</Text>
                    </Pressable>
                  </View>
                </View>
              </Overlay>
        <Overlay
          statusBarTranslucent
          animationType="slide"
          overlayStyle={[HomePage.advSearchOverlay, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,}]}
          isVisible={advSearch}
          onBackdropPress={() => {
            AdvSearchRef.current.clear();
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
            setAdvSearch(false);
          }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={HomePage.advSearchContainer}>
            <Overlay
                statusBarTranslucent
                animationType="fade"
                overlayStyle={[HomePage.catCheckOverlay, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}
                isVisible={catList}
                onBackdropPress={() => setCatList(false)}>
                <View style={HomePage.catCheckContainer}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={[HomePage.catCheckScrollView,{backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
                    <View style={HomePage.catCheckScrollContainer}>
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Anime"
                        checked={animes}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setAnimes(!animes)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Audio"
                        checked={audio}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setAudio(!audio)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Desene"
                        checked={desene}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setDesene(!desene)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Diverse"
                        checked={diverse}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setDiverse(!diverse)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Docs"
                        checked={doc}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setDoc(!doc)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme 3D"
                        checked={filme3d}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilme3d(!filme3d)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme 4K"
                        checked={filme4k}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilme4k(!filme4k)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme 4K Blu-Ray"
                        checked={filme4kbd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilme4kBD(!filme4kbd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme Blu-Ray"
                        checked={filmeBD}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeBD(!filmeBD)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme DVD"
                        checked={filmeDvd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeDvd(!filmeDvd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme DVD-RO"
                        checked={filmeDvdRo}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeDvdRo(!filmeDvdRo)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme HD"
                        checked={filmeHd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeHd(!filmeHd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme HD-RO"
                        checked={filmeHdRo}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeHdRo(!filmeHdRo)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Filme SD"
                        checked={filmeSd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFilmeSd(!filmeSd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="FLAC"
                        checked={flacs}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setFlacs(!flacs)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Jocuri Console"
                        checked={jocConsole}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setJocConsole(!jocConsole)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Jocuri PC"
                        checked={jocPc}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setJocPc(!jocPc)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Linux"
                        checked={lin}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setLin(!lin)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Mobile"
                        checked={mob}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setMob(!mob)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Programe"
                        checked={software}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSoftware(!software)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Seriale 4K"
                        checked={seriale4k}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSeriale4k(!seriale4k)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Seriale HD"
                        checked={serialeHd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSerialeHd(!serialeHd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Seriale SD"
                        checked={serialeSd}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSerialeSd(!serialeSd)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Sport"
                        checked={sports}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setSports(!sports)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBox}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Videoclip"
                        checked={videos}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setVideos(!videos)}
                      />
                      <CheckBox
                        containerStyle={HomePage.catCheckBoxLast}
                        textStyle={{color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="XXX"
                        checked={porn}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.catCheckedIcon}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={{color: lightTheme ? MAIN_LIGHT : MAIN_DARK, borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT, borderRadius: 1, borderWidth: 1}}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onPress={() => setPorn(!porn)}
                      />
                    </View>
                  </ScrollView>
                  <View style={HomePage.catCheckOverlayFooter}>
                    <Pressable
                      style={HomePage.catCheckOverlayPressable}
                      android_ripple={{
                        color: 'white',
                        borderless: false,
                      }}
                      onPress={() => setCatList(false)}>
                      <Text style={HomePage.catCheckOverlayText}>OK</Text>
                    </Pressable>
                  </View>
                </View>
              </Overlay>
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={HomePage.advSearchScrollView}>
                <View style={HomePage.advSearchView}>
                  <Text style={[HomePage.advSearchViewText, {color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                    Căutare avansată
                  </Text>
                </View>
                <Input
                  ref={AdvSearchRef}
                  style={[HomePage.advSearchInputStyle, {color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}
                  containerStyle={[HomePage.advSearchContainerStyle, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,}]}
                  inputContainerStyle={[
                    HomePage.advSearchInputContainerStyle,
                    {
                      borderBottomColor: advSearchValidation
                        ? 'crimson'
                        : lightTheme ? MAIN_DARK : MAIN_LIGHT,
                    },
                  ]}
                  keyboardType="default"
                  selectionColor="grey"
                  autoCapitalize="none"
                  placeholder={
                    advIMDb
                      ? 'Caută după Cod IMDb...'
                      : 'Caută după Cuvinte Cheie...'
                  }
                  placeholderTextColor={
                    advSearchValidation ? 'crimson' : 'grey'
                  }
                  leftIcon={
                    <FontAwesomeIcon
                      size={20}
                      color={advSearchValidation ? 'crimson' : 'grey'}
                      icon={faSearch}
                    />
                  }
                  onChangeText={(advSearchText) =>
                    setAdvSearchText(advSearchText)
                  }
                  value={advSearchText}
                />
                <View style={HomePage.advSearchTypeViewContainer}>
                  <View style={HomePage.advSearchTypeView}>
                    <Text style={[HomePage.advSearchTypeText, {color: lightTheme ? MAIN_DARK : MAIN_LIGHT,}]}>
                      Tipul căutării
                    </Text>
                    <Pressable
                      style={HomePage.advSearchTypePressable}
                      android_ripple={{
                        color: 'white',
                        borderless: false,
                        radius: 10,
                      }}
                      onPress={() => {
                        Keyboard.dismiss();
                        Alert.alert(
                          'Info',
                          'Pentru informaţii suplimentare legate de diferenţa dintre cele două tipuri, ţine apăsat 1 secundă pe căsuţa nebifată şi vice-versa.',
                          [
                            {
                              text: 'OK',
                              onPress: () => {},
                            },
                          ],
                          {cancelable: true},
                        );
                      }}>
                      <FontAwesomeIcon
                        color={lightTheme ? MAIN_DARK : MAIN_LIGHT}
                        icon={faQuestionCircle}
                      />
                    </Pressable>
                  </View>
                  <View style={HomePage.advSearchTypeCheckView}>
                    <View
                      pointerEvents={advKeyword ? 'none' : 'auto'}
                      style={HomePage.advSearchTypeViewHalf}>
                      <CheckBox
                        containerStyle={[
                          HomePage.advSearchTypeCheckBox1,
                          {borderColor: advKeyword ? 'grey' : lightTheme ? MAIN_DARK : MAIN_LIGHT},
                        ]}
                        textStyle={{color: advKeyword ? 'grey' : lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Cuvânt cheie"
                        checked={advKeyword}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.advSearchTypeChecked}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={[
                              HomePage.advSearchTypeUnchecked,
                              {
                                color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                                borderColor: advKeyword ? 'grey' : lightTheme ? MAIN_DARK : MAIN_LIGHT,
                              },
                            ]}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onLongPress={() =>
                          Alert.alert(
                            'Info',
                            'Această opţiune permite căutarea după Cuvinte Cheie pe modelul: titanic.1997 ori titanic 1997.',
                            [
                              {
                                text: 'OK',
                                onPress: () => {},
                              },
                            ],
                            {cancelable: true},
                          )
                        }
                        onPress={() => {
                          Keyboard.dismiss();
                          setAdvKeyword(true);
                          setAdvIMDb(false);
                        }}
                      />
                    </View>
                    <View
                      pointerEvents={advIMDb ? 'none' : 'auto'}
                      style={HomePage.advSearchTypeViewHalf}>
                      <CheckBox
                        containerStyle={[
                          HomePage.advSearchTypeCheckBox2,
                          {borderColor: advIMDb ? 'grey' : lightTheme ? MAIN_DARK : MAIN_LIGHT},
                        ]}
                        textStyle={{color: advIMDb ? 'grey' : lightTheme ? MAIN_DARK : MAIN_LIGHT}}
                        center
                        title="Cod IMDb"
                        checked={advIMDb}
                        checkedIcon={
                          <FontAwesomeIcon
                            style={HomePage.advSearchTypeChecked}
                            size={20}
                            icon={faCheckSquare}
                          />
                        }
                        uncheckedIcon={
                          <FontAwesomeIcon
                            style={[
                              HomePage.advSearchTypeUnchecked,
                              {
                                color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                                borderColor: advIMDb ? 'grey' : lightTheme ? MAIN_DARK : MAIN_LIGHT,
                              },
                            ]}
                            size={20}
                            icon={faAngleDoubleUp}
                          />
                        }
                        onLongPress={() =>
                          Alert.alert(
                            'Info',
                            'Această opţiune permite căutarea după Codul IMDb pe modelul modelul: tt4719744 ori 4719744.',
                            [
                              {
                                text: 'OK',
                                onPress: () => {},
                              },
                            ],
                            {cancelable: true},
                          )
                        }
                        onPress={() => {
                          Keyboard.dismiss();
                          setAdvKeyword(false);
                          setAdvIMDb(true);
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={HomePage.advSearchCatContainer}>
                  <CheckBox
                    containerStyle={[HomePage.advSearchCatCheck, {borderColor: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}
                    textStyle={{
                      color:
                        animes ||
                        audio ||
                        desene ||
                        diverse ||
                        doc ||
                        filme3d ||
                        filme4k ||
                        filme4kbd ||
                        filmeBD ||
                        filmeDvd ||
                        filmeDvdRo ||
                        filmeHd ||
                        filmeHdRo ||
                        filmeSd ||
                        flacs ||
                        jocConsole ||
                        jocPc ||
                        lin ||
                        mob ||
                        software ||
                        seriale4k ||
                        serialeHd ||
                        serialeSd ||
                        sports ||
                        videos ||
                        porn === true
                          ? ACCENT_COLOR
                          : 'grey',
                    }}
                    center
                    title={
                      animes ||
                      audio ||
                      desene ||
                      diverse ||
                      doc ||
                      filme3d ||
                      filme4k ||
                      filme4kbd ||
                      filmeBD ||
                      filmeDvd ||
                      filmeDvdRo ||
                      filmeHd ||
                      filmeHdRo ||
                      filmeSd ||
                      flacs ||
                      jocConsole ||
                      jocPc ||
                      lin ||
                      mob ||
                      software ||
                      seriale4k ||
                      serialeHd ||
                      serialeSd ||
                      sports ||
                      videos ||
                      porn === true
                        ? catNames !== ''
                          ? catNames.toString().split(',').join(', ')
                          : 'Categorii'
                        : 'Categorii'
                    }
                    checked
                    checkedIcon={
                      <FontAwesomeIcon
                        size={20}
                        color={lightTheme ? MAIN_DARK : MAIN_LIGHT}
                        icon={faTasks}
                      />
                    }
                    onPress={() => {
                      Keyboard.dismiss();
                      setCatList(true);
                    }}
                  />
                </View>
                <View style={HomePage.advSearchOptions}>
                  <CheckBox
                    containerStyle={[HomePage.advSearchOptionsCheck, {borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                    textStyle={{color: lightTheme ? MAIN_DARK :  MAIN_LIGHT}}
                    center
                    title="2X Upload"
                    checked={doubleUp}
                    checkedIcon={
                      <FontAwesomeIcon
                        style={HomePage.advSearchOptionsChecked}
                        size={20}
                        icon={faCheckSquare}
                      />
                    }
                    uncheckedIcon={
                      <FontAwesomeIcon
                        style={[HomePage.advSearchOptionsUnchecked, {
                          color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                          borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                        size={20}
                        icon={faAngleDoubleUp}
                      />
                    }
                    onLongPress={() =>
                      Alert.alert(
                        'Info',
                        'Această opţiune filtrează torrentele care îţi oferă de 2 ori mai mult Upload, atât pe perioada descărcării şi după finalizaree, când sunt ţinute la Seed.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {},
                          },
                        ],
                        {cancelable: true},
                      )
                    }
                    onPress={() => {
                      setDoubleUp(!doubleUp);
                      Keyboard.dismiss();
                    }}
                  />
                  <CheckBox
                    containerStyle={[HomePage.advSearchOptionsCheck, {borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                    textStyle={{color: lightTheme ? MAIN_DARK :  MAIN_LIGHT}}
                    center
                    title="Freeleech"
                    checked={freeleech}
                    checkedIcon={
                      <FontAwesomeIcon
                        style={HomePage.advSearchOptionsChecked}
                        size={20}
                        icon={faCheckSquare}
                      />
                    }
                    uncheckedIcon={
                      <FontAwesomeIcon
                        style={[HomePage.advSearchOptionsUnchecked, {
                          color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                          borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                        size={20}
                        icon={faAngleDoubleUp}
                      />
                    }
                    onLongPress={() =>
                      Alert.alert(
                        'Info',
                        'Această opţiune filtrează torrentele a căror descărcare îţi oferă decât Upload, nu se contorizează la Download, fapt care face ca Raţia să nu-ţi fie afectată în nici un fel.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {},
                          },
                        ],
                        {cancelable: true},
                      )
                    }
                    onPress={() => {
                      setFreeleech(!freeleech);
                      Keyboard.dismiss();
                    }}
                  />
                </View>
                <View style={HomePage.advSearchOptions}>
                  <CheckBox
                    containerStyle={[HomePage.advSearchOptionsCheck,{borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                    textStyle={{color: lightTheme ? MAIN_DARK :  MAIN_LIGHT}}
                    center
                    title="Internal"
                    checked={internal}
                    checkedIcon={
                      <FontAwesomeIcon
                        style={HomePage.advSearchOptionsChecked}
                        size={20}
                        icon={faCheckSquare}
                      />
                    }
                    uncheckedIcon={
                      <FontAwesomeIcon
                        style={[HomePage.advSearchOptionsUnchecked, {
                          color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                          borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                        size={20}
                        icon={faAngleDoubleUp}
                      />
                    }
                    onLongPress={() =>
                      Alert.alert(
                        'Info',
                        'Această opţiune filtrează torrentele care aparţin grupurilor Play(HD|BD|SD|XD) care sunt grupuri Interne ale trackerului.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {},
                          },
                        ],
                        {cancelable: true},
                      )
                    }
                    onPress={() => {
                      setInternal(!internal);
                      Keyboard.dismiss();
                    }}
                  />
                  <CheckBox
                    containerStyle={[HomePage.advSearchOptionsCheck,{borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                    textStyle={{color: lightTheme ? MAIN_DARK :  MAIN_LIGHT}}
                    center
                    title="Moderated"
                    checked={moderated}
                    checkedIcon={
                      <FontAwesomeIcon
                        style={HomePage.advSearchOptionsChecked}
                        size={20}
                        icon={faCheckSquare}
                      />
                    }
                    uncheckedIcon={
                      <FontAwesomeIcon
                        style={[HomePage.advSearchOptionsUnchecked, {
                          color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                          borderColor: lightTheme ? MAIN_DARK :  MAIN_LIGHT}]}
                        size={20}
                        icon={faAngleDoubleUp}
                      />
                    }
                    onLongPress={() =>
                      Alert.alert(
                        'Info',
                        'Această opţiune filtrează torrentele care sunt verificate pentru a corespunde regulilor (titlu, descriere, gen, screens, subtitrare nedecalată, etc), verificate de către staff-ul Filelist.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {},
                          },
                        ],
                        {cancelable: true},
                      )
                    }
                    onPress={() => {
                      setModerated(!moderated);
                      Keyboard.dismiss();
                    }}
                  />
                </View>
                <View style={HomePage.advSearchPressableContainer}>
                  <Pressable
                    style={HomePage.advSearchPressable}
                    android_ripple={{
                      color: 'white',
                      borderless: false,
                    }}
                    onPress={handleAdvancedSearch}>
                    <FontAwesomeIcon
                      style={HomePage.advSearchPressableIcon}
                      size={20}
                      icon={faSearch}
                    />
                    <Text style={HomePage.advSearchPressableText}>Caută</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Overlay>
        <Overlay
          statusBarTranslucent
          animationType="fade"
          overlayStyle={[
            HomePage.imdbOverlayStyle,
            {height: IMDbID !== null ? '70%' : '40%',
          backgroundColor: lightTheme ? MAIN_LIGHT:MAIN_DARK},
          ]}
          isVisible={infoModal}
          onBackdropPress={() => {
            setInfoModal(false);
            setModalData(null);
            setIMDbID(null);
          }}>
          <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={HomePage.imdbInfoContainer}
                style={HomePage.imdbInfoContainerStyle}>
            {modalData
              ? modalData.map((item, index) => {
                  return (
                    <View key={item.id} style={HomePage.imdbInfoView}>
                      <View style={HomePage.imdbInfoHeader}>
                        <FastImage
                          style={HomePage.imdbInfoHeaderFastImage}
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
                        <View style={HomePage.imdbInfoHeaderText}>
                          <Text style={[HomePage.imdbInfoHeaderCat, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                            {item.category}
                          </Text>
                          <Text style={[HomePage.imdbInfoHeaderDesc, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
                            [ {item.small_description} ]
                          </Text>
                        </View>
                      </View>
                      <View style={HomePage.imdbInfoTitleSection}>
                        <Text style={[HomePage.imdbInfoTitleText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                          {item.name}
                        </Text>
                      </View>
                      <View
                        style={[
                          HomePage.imdbInfoTitleBadges,
                          {
                            height:
                              item.freeleech !== 1 &&
                              item.doubleup !== 1 &&
                              item.internal !== 1
                                ? 0
                                : '3%',
                          },
                        ]}>
                        {item.doubleup === 1 ? (
                          <Text style={HomePage.imdbInfoDoubleUpBadge}>
                            2X UPLOAD
                          </Text>
                        ) : null}
                        {item.internal === 1 ? (
                          <Text style={HomePage.imdbInfoInternalBadge}>
                            INTERNAL
                          </Text>
                        ) : null}
                        {item.freeleech === 1 ? (
                          <Text style={HomePage.imdbInfoFreeleechBadge}>
                            FREELEECH
                          </Text>
                        ) : null}
                      </View>
                      {IMDbID !== null ? (<>
                        <View style={HomePage.imdbInfoDataContainer}>
                          {IMDbLoading ? (
                            <View style={HomePage.imdbInfoActivityIndicator}>
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
                                        style={HomePage.imdbInfoMainView}
                                        key={item.link}>
                                        <View
                                          style={HomePage.imdbInfoMainPoster}>
                                          <Pressable
                                            style={
                                              HomePage.imdbInfoPosterPressable
                                            }
                                            onPress={() =>
                                              typeof item.link === 'function'
                                                ? {}
                                                : Alert.alert(
                                                    'Info',
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
                                              style={
                                                HomePage.imdbInfoMainPosterFastImage
                                              }
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
                                                  style={
                                                    HomePage.imdbInfoRatingView
                                                  }>
                                                  <Text
                                                    style={[
                                                      HomePage.imdbInfoRatingText
                                                    , {color: lightTheme ? MAIN_DARK : 'white', textShadowColor: lightTheme ? 'silver' : 'black'}]}>
                                                    {item.rating === undefined
                                                      ? 'Fără'
                                                      : item.rating}
                                                  </Text>
                                                  <FontAwesomeIcon
                                                    size={20}
                                                    style={
                                                      HomePage.imdbInfoRatingIcon
                                                    }
                                                    color={lightTheme ? 'goldenrod':'gold'}
                                                    icon={faStar}
                                                  />
                                                </View>
                                              </>
                                            )}
                                          </Pressable>
                                        </View>
                                        <View
                                          style={HomePage.imdbInfoMainPlotView}>
                                          <View
                                            style={HomePage.imdbInfoMainPlot}>
                                            <Text
                                              style={[HomePage.imdbInfoMainPlotTitle, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
                                              Plot
                                            </Text>
                                            <Text
                                                style={[
                                                  HomePage.imdbInfoMainPlotText
                                                , {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                            {item.plot === undefined ? "Acest material nu conţine plot" : item.plot.split('\n')[0]}
                                            </Text>
                                            {item.duration === '' ? null : (
                                              <>
                                                <View
                                                  style={
                                                    HomePage.imdbInfoMainSeparator
                                                  }
                                                />
                                                <Text
                                                  style={[
                                                    HomePage.imdbInfoMainETATitle
                                                  ,{textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
                                                  Durată:
                                                  <Text
                                                    style={[
                                                      HomePage.imdbInfoMainETAText
                                                    , {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                                    {' '}
                                                    {item.duration === undefined
                                                      ? 'Necunoscută'
                                                      : item.duration}
                                                  </Text>
                                                </Text>
                                              </>
                                            )}
                                          </View>
                                        </View>
                                      </View>
                                    );
                                  })
                                : <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}><Text style={{textAlign: 'center', color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}>Conexiune offline.</Text><Text style={{textAlign: 'center', color: lightTheme ? MAIN_DARK : MAIN_LIGHT}}>Reconectează-te pentru a putea vedea informaţii despre acest material.</Text></View>}
                            </>
                          )}
                        </View>
                        <View style={HomePage.imdbInfoMainFooter}>
                        <View style={HomePage.imdbInfoMainFooterView}>
                          <View style={HomePage.imdbInfoMainFooter3rd}>
                            <Pressable
                              style={HomePage.imdbInfoMainFooter3rdPressable}
                              android_ripple={{
                                color: 'grey',
                                borderless: false,
                                radius: 40,
                              }}
                              onPress={() =>
                                Alert.alert(
                                  'Info',
                                  'Mărimea totală a torrentului.',
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
                                style={[HomePage.imdbInfoMainFooter3rdText,{textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                {formatBytes(item.size)}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={HomePage.imdbInfoMainFooter3rd}>
                            <Pressable
                              style={HomePage.imdbInfoMainFooter3rdPressable}
                              android_ripple={{
                                color: 'grey',
                                borderless: false,
                                radius: 40,
                              }}
                              onPress={() =>
                                Alert.alert(
                                  'Info',
                                  'Numărul de fişiere din torrent.',
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
                                style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                {item.files}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={HomePage.imdbInfoMainFooter3rd}>
                            <Pressable
                              style={HomePage.imdbInfoMainFooter3rdPressable}
                              android_ripple={{
                                color: 'grey',
                                borderless: false,
                                radius: 40,
                              }}
                              onPress={() =>
                                Alert.alert(
                                  'Info',
                                  'Numărul de persoane care ţin torrentul la seed în acest moment.',
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
                                style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                {item.seeders}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                        <View style={HomePage.imdbInfoMainFooterView2}>
                          <View style={HomePage.imdbInfoMainFooter3rd}>
                            <Pressable
                              style={HomePage.imdbInfoMainFooter3rdPressable}
                              android_ripple={{
                                color: 'grey',
                                borderless: false,
                                radius: 40,
                              }}
                              onPress={() =>
                                Alert.alert(
                                  'Info',
                                  'Data la care torrentul a apărut pe Filelist.',
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
                                style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                {item.upload_date.substring(0, 10)}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={HomePage.imdbInfoMainFooter3rd}>
                            <Pressable
                              style={HomePage.imdbInfoMainFooter3rdPressable}
                              android_ripple={{
                                color: 'grey',
                                borderless: false,
                                radius: 40,
                              }}
                              onPress={() =>
                                Alert.alert(
                                  'Info',
                                  'De câte ori a fost descărcat torrentul.',
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
                                style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                {item.times_completed}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={HomePage.imdbInfoMainFooter3rd}>
                            <Pressable
                              style={HomePage.imdbInfoMainFooter3rdPressable}
                              android_ripple={{
                                color: 'grey',
                                borderless: false,
                                radius: 40,
                              }}
                              onPress={() =>
                                Alert.alert(
                                  'Info',
                                  'Numărul de persoane care descarcă torrentul în acest moment.',
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
                                style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                                {item.leechers}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View></>
                      ) : 
                          <>
                      <View style={HomePage.imdbInfoMainFooter}>
                      <View style={HomePage.imdbInfoMainFooterView}>
                        <View style={HomePage.imdbInfoMainFooter3rd}>
                          <Pressable
                            style={HomePage.imdbInfoMainFooter3rdPressable}
                            android_ripple={{
                              color: 'grey',
                              borderless: false,
                              radius: 40,
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Info',
                                'Mărimea totală a torrentului.',
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
                              style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                              {formatBytes(item.size)}
                            </Text>
                          </Pressable>
                        </View>
                        <View style={HomePage.imdbInfoMainFooter3rd}>
                          <Pressable
                            style={HomePage.imdbInfoMainFooter3rdPressable}
                            android_ripple={{
                              color: 'grey',
                              borderless: false,
                              radius: 40,
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Info',
                                'Numărul de fişiere din torrent.',
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
                              style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                              {item.files}
                            </Text>
                          </Pressable>
                        </View>
                        <View style={HomePage.imdbInfoMainFooter3rd}>
                          <Pressable
                            style={HomePage.imdbInfoMainFooter3rdPressable}
                            android_ripple={{
                              color: 'grey',
                              borderless: false,
                              radius: 40,
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Info',
                                'Numărul de persoane care ţin torrentul la seed în acest moment.',
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
                              style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                              {item.seeders}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                      <View style={HomePage.imdbInfoMainFooterView2}>
                        <View style={HomePage.imdbInfoMainFooter3rd}>
                          <Pressable
                            style={HomePage.imdbInfoMainFooter3rdPressable}
                            android_ripple={{
                              color: 'grey',
                              borderless: false,
                              radius: 40,
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Info',
                                'Data la care torrentul a apărut pe Filelist.',
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
                              style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                              {item.upload_date.substring(0, 10)}
                            </Text>
                          </Pressable>
                        </View>
                        <View style={HomePage.imdbInfoMainFooter3rd}>
                          <Pressable
                            style={HomePage.imdbInfoMainFooter3rdPressable}
                            android_ripple={{
                              color: 'grey',
                              borderless: false,
                              radius: 40,
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Info',
                                'De câte ori a fost descărcat torrentul.',
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
                              style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                              {item.times_completed}
                            </Text>
                          </Pressable>
                        </View>
                        <View style={HomePage.imdbInfoMainFooter3rd}>
                          <Pressable
                            style={HomePage.imdbInfoMainFooter3rdPressable}
                            android_ripple={{
                              color: 'grey',
                              borderless: false,
                              radius: 40,
                            }}
                            onPress={() =>
                              Alert.alert(
                                'Info',
                                'Numărul de persoane care descarcă torrentul în acest moment.',
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
                              style={[HomePage.imdbInfoMainFooter3rdText, {textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, color: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
                              {item.leechers}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                          </>}
                      </View>
                  );
                })
              : null}
              </ScrollView>
        </Overlay>
        <Overlay
          statusBarTranslucent
          animationType="slide"
          overlayStyle={HomePage.infoOverlay}
          isVisible={isInfo}
          onBackdropPress={() => {
            setIsInfo(false);
            setActiveSections([]);
          }}>
          <View style={[HomePage.infoOverlayCloseContainer, {backgroundColor: lightTheme ? 'white' : MAIN_DARK}]}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[HomePage.infoOverlayScrollView, {backgroundColor: lightTheme ? 'white':MAIN_DARK}]}>
            <View style={HomePage.infoTitleContainer}>
              <Text style={{
                color: lightTheme ? MAIN_DARK:'white',
                textShadowColor: lightTheme ? MAIN_LIGHT : MAIN_DARK, textShadowOffset: {width: 0.8, height: 0.8},
                textShadowRadius: 1,
                fontWeight: 'bold',
                fontSize: 20}}>Informaţii folosire</Text>
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
          animationType="slide"
          overlayStyle={HomePage.settingsOverlay}
          isVisible={isSettings}
          onBackdropPress={() => {
            setIsSettings(false);
          }}>
          <View style={[HomePage.settingsOverlayCloseContainer, {backgroundColor: lightTheme ? MAIN_DARK : MAIN_LIGHT}]}>
            <View style={HomePage.settingsOverlayThemeContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={[HomePage.settingsOverlayThemeText, {textShadowColor: lightTheme ? MAIN_DARK : MAIN_LIGHT,
              color: lightTheme ? 'white' : MAIN_DARK}]}>Temă curentă: </Text>
              {lightTheme ? <FontAwesomeIcon color={MAIN_LIGHT} size={22} icon={faSun}/> : <FontAwesomeIcon color={MAIN_DARK} size={22} icon={faMoon}/>}</View>
              <Switch
                trackColor={{ false: 'grey', true: 'grey' }}
                thumbColor={lightTheme ? "white" : "black"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={switchTheme}
                value={lightTheme}
              />
            </View>
            <View style={HomePage.settingsOverlayUseContainer}>
              <Pressable
                style={HomePage.settingsOverlayUsePressable}
                android_ripple={{
                  color: 'white',
                  borderless: false,
                }}
                onPress={() => {
                  setIsInfo(true);
                }}>
                <Text style={HomePage.settingsOverlayLogoutText}>Informaţii folosire</Text>
              </Pressable>
            </View>
            <View style={HomePage.settingsOverlayLogoutContainer}>
              <Pressable
                style={HomePage.settingsOverlayLogoutPressable}
                android_ripple={{
                  color: 'white',
                  borderless: false,
                }}
                onPress={() => {
                  setIsSettings(false);
                  handleLogout();
                }}>
                <Text style={HomePage.settingsOverlayLogoutText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </Overlay>
        <View style={HomePage.mainHeader}>
          <View style={HomePage.mainHeaderContainer}>
          <View style={HomePage.mainHeaderInfoContainer}>
              <Pressable
                style={HomePage.mainHeaderInfoPressable}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: 16,
                }}
                onPress={() => setIsInfo(true)}>
                <FontAwesomeIcon size={24} color={'white'} icon={faInfoCircle} />
              </Pressable>
            </View>
            <Text style={HomePage.mainHeaderText}>
              {isSearch ? 'Căutare' : 'Recent adăugate'}
            </Text>
            <View style={HomePage.mainHeaderCogContainer}>
              <Pressable
                style={HomePage.mainHeaderCogPressable}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: 16,
                }}
                onPress={() => setIsSettings(true)}>
                <FontAwesomeIcon size={24} color={'white'} icon={faCog} />
              </Pressable>
            </View>
          </View>
        </View>
        {isSearchBar ? <View
          style={[HomePage.mainClearSearchBar, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
          <View style={HomePage.mainClearSearchBarContainer}>
            <Pressable
              style={HomePage.mainClearSearchBarPressable}
              android_ripple={{
                color: 'white',
                borderless: false,
              }}
              onPress={() => {
                clearSearch();
              }}>
              <FontAwesomeIcon size={20} color={'white'} icon={faArrowLeft} />
            </Pressable>
          </View>
          <Text style={[HomePage.mainClearSearchBarText, {color: lightTheme ? MAIN_DARK : 'white'}]}>
            Rezultatele căutării după "
            <Text style={[HomePage.mainClearSearchBarTextSecond, {color: lightTheme ? MAIN_DARK : 'white'}]}>
              {search !== ''
                ? search
                : advSearchText !== ''
                ? advSearchText
                : ''}
            </Text>
            "
          </Text>
        </View> : <Input
          ref={SearchBarRef}
          style={{color: lightTheme ? MAIN_DARK : 'white'}}
          containerStyle={[HomePage.searchInputContainerStyle, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}
          inputContainerStyle={[
            HomePage.searchInContainerStyle,
            {
              borderColor: searchValidation ? 'crimson' : 'grey',
            },
          ]}
          keyboardType="default"
          selectionColor="grey"
          autoCapitalize="none"
          placeholder={
            searchValidation
              ? 'Căsuţa nu poate fi goală...'
              : 'Caută după cuvinte cheie, IMDb...'
          }
          placeholderTextColor={searchValidation ? 'crimson' : 'grey'}
          rightIcon={
            <View style={HomePage.searchInputRIContainer}>
              <Pressable
                style={HomePage.searchInputRIPressable}
                android_ripple={{
                  color: 'white',
                  borderless: false,
                }}
                onPress={() => {
                  handleSearch();
                }}
                onLongPress={() => setCatListLatest(true)}>
                <FontAwesomeIcon
                  size={22}
                  color={ACCENT_COLOR}
                  icon={faSearch}
                />
              </Pressable>
            </View>
          }
          onChangeText={(search) => setSearch(search)}
          value={search}
        />}
        {searchLoading ? (
          <View style={HomePage.searchLoadingContainer}>
            <ActivityIndicator
              style={HomePage.searchLoadingAI}
              size="large"
              color={ACCENT_COLOR}
            />
          </View>
        ) : noResults ? (
          <View style={HomePage.searchNoResults}>
            <Text style={[HomePage.searchNoResultsTextPrimary, {textShadowColor: lightTheme ? MAIN_LIGHT : 'black', color: lightTheme ? MAIN_DARK:'white'}]}>
              Nu s-a găsit nimic
            </Text>
            <Text style={[HomePage.searchNoResultsTextSecondary, {textShadowColor: lightTheme ? MAIN_LIGHT : 'black', color: lightTheme ? MAIN_DARK:'white'}]}>
              Încearcă din nou cu alt șir de căutare
            </Text>
          </View>
        ) : listSearch !== null ? (
          <FlatList
            data={listSearch}
            renderItem={renderItem}
            contentContainerStyle={HomePage.flatListsContentContainer}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : listImdb !== null ? (
          <FlatList
            data={listImdb}
            renderItem={renderItem}
            contentContainerStyle={HomePage.flatListsContentContainer}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : listAdvSearch !== null ? (
          <FlatList
            data={listAdvSearch}
            renderItem={renderItem}
            contentContainerStyle={HomePage.flatListsContentContainer}
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
            contentContainerStyle={HomePage.flatListsContentContainer}
            data={listLatestLoading ? [{id: 'ABC'}] : listLatest}
            renderItem={listLatestLoading ? (item, index) => (
              <View key={index} style={HomePage.searchLoadingContainer}>
            <ActivityIndicator
              style={HomePage.searchLoadingAI}
              size="large"
              color={ACCENT_COLOR}
            />
          </View>
            ) : renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <View style={HomePage.advSearchBtnContainer}>
          <Pressable
            android_ripple={{
              color: 'white',
              borderless: false,
            }}
            style={HomePage.advSearchBtnPressable}
            onPress={() => {
              clearSearch();
              setAdvSearch(!advSearch);
              setAdvKeyword(true);
              setAdvIMDb(false);
              setAdvSearchText('');
            }}>
            <FontAwesomeIcon color={'white'} size={26} icon={faSearchPlus} />
          </Pressable>
        </View>
        <Animated.View
          style={[
            HomePage.refreshContainer,
            {
              backgroundColor: lightTheme ? 'rgba(0, 0, 0, 0.7)':'rgba(255, 255, 255, 0.9)',
              transform: [
                {
                  scale: showStatus,
                },
              ],
            },
          ]}>
          <Animated.Text
            style={[HomePage.refreshTextPrimary, {opacity: textOpacity,color: lightTheme ? 'white' : 'black'}]}>
            Actualizare completă
          </Animated.Text>
          <Animated.Text
            style={[HomePage.refreshTextSecondary, {opacity: textOpacity,color: lightTheme ? 'white' : 'black'}]}>
            (nu există torrente noi)
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            HomePage.clipboardAlertContainer,
            {
              backgroundColor: lightTheme ? 'rgba(0, 0, 0, 0.7)':'rgba(255, 255, 255, 0.9)',
              transform: [
                {
                  scale: showClipboardStatus,
                },
              ],
            },
          ]}>
          <Animated.Text
            style={[
              HomePage.clipboardAlertText,
              {opacity: textClipboardOpacity, color: lightTheme ? 'white' : 'black'},
            ]}>
            Link descărcare copiat în Clipboard
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            HomePage.networkAlertContainer,
            {
              backgroundColor: isNetReachable ? 'limegreen' : 'crimson',
              transform: [
                {
                  translateY: showNetworkAlert,
                },
              ],
            },
          ]}>
          <Animated.Text
            style={{fontSize: 13,
            fontWeight: 'bold', opacity: showNetworkAlertText,color: 'white'}
            }>
            {isNetReachable ? 'Online' : 'Offline'}
          </Animated.Text>
        </Animated.View>
      </SafeAreaView>
    </>
  );
}

const HomePage = EStyleSheet.create({
    itemPressable: {
      elevation: 7,
      zIndex: 7,
      marginBottom: '15rem',
    },
    itemPressableContainer: {
      height: '70rem',
      width: '100%',
      borderColor: '#181818',
      borderWidth: '0.5rem',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    itemPressableFirst: {
      height: '90%',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },
    itemPresssablePic: {
      height: '100%',
      width: '20%',
      paddingLeft: '4rem',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    itemPresssableFastImage: {height: '100%', width: '100%'},
    itemPressableNameContainer: {
      justifyContent: 'space-between',
      paddingHorizontal: '4rem',
      height: '100%',
      width: '78%',
    },
    itemPressableNameText: {
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      fontSize: '10rem',
    },
    itemPressableUploadText: {
      fontSize: '8rem',
      color: 'silver',
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
    },
    itemPressableUploadContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: '14rem',
      width: '70%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    itemPressableFreeleechText: {
      textShadowColor: 'black',
      textShadowOffset: {width: '1rem', height: '1rem'},
      textShadowRadius: '1rem',
      paddingHorizontal: '1rem',
      borderColor: '#1ec621',
      borderWidth: '0.5rem',
      fontSize: '7.5rem',
      color: 'aliceblue',
      marginLeft: '5rem',
      backgroundColor: '#09580a',
    },
    itemPressableDoubleUpText: {
      textShadowColor: 'black',
      textShadowOffset: {width: '1rem', height: '1rem'},
      textShadowRadius: '1rem',
      paddingHorizontal: '1rem',
      borderColor: '#7c00ff',
      borderWidth: '0.5rem',
      fontSize: '7.5rem',
      color: 'aliceblue',
      marginLeft: '5rem',
      backgroundColor: '#370f61',
    },
    itemPressableInternalText: {
      textShadowColor: 'black',
      textShadowOffset: {width: '1rem', height: '1rem'},
      textShadowRadius: '1rem',
      paddingHorizontal: '1rem',
      borderColor: '#1e87c6',
      borderWidth: '0.5rem',
      fontSize: '7.5rem',
      color: 'aliceblue',
      marginLeft: '5rem',
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
      width: '100%',
      height: '55%',
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
      paddingTop: '8rem',
    },
    catCheckOverlay: {
      width: '70%',
      height: '80%',
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
      marginBottom: '8rem',
    },
    catCheckScrollContainer: {
      width: '100%',
      height: '100%',
    },
    catCheckBox: {
      width: '100%',
      backgroundColor: 'transparent',
      borderColor: 'grey',
      borderBottomWidth: '0.5rem',
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
    catCheckedIcon: {
      color: ACCENT_COLOR,
    },
    // catUncheckedIcon: {
    //   // color: 'red',
    //   // borderColor: 'red',
    //   borderRadius: '1rem',
    //   borderWidth: '1rem',
    // },
    catCheckOverlayFooter: {
      width: '100%',
      height: '5%',
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
    catCheckOverlayText: {
      textShadowColor: 'black',
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '12rem',
    },
    advSearchScrollView: {
      width: '100%',
      paddingBottom: StatusBar.currentHeight,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    advSearchView: {
      width: '100%',
    },
    advSearchViewText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '14rem',
    },
    advSearchInputStyle: {
      fontSize: '14rem',
      fontWeight: 'normal',
    },
    advSearchContainerStyle: {
      height: '64rem',
      width: '100%',
      paddingTop: '10rem',
      paddingBottom: '1rem',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    advSearchInputContainerStyle: {
      height: '80%',
      width: '100%',
      paddingLeft: '6rem',
      paddingRight: '3rem',
      borderBottomWidth: '0.5rem',
    },
    advSearchTypeViewContainer: {
      height: '64rem',
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
      fontSize: '10rem',
    },
    advSearchTypePressable: {
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '3%',
    },
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
      borderBottomWidth: '0.5rem',
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
      borderBottomWidth: '0.5rem',
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
      borderRadius: '1rem',
      borderWidth: '1rem',
    },
    advSearchCatContainer: {
      width: '96%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '3rem',
      marginBottom: '13rem',
    },
    advSearchCatCheck: {
      width: '100%',
      backgroundColor: 'transparent',
      borderBottomWidth: '0.5rem',
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
      borderBottomWidth: '0.5rem',
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
      borderRadius: '1rem',
      borderWidth: '1rem',
    },
    advSearchPressableContainer: {
      width: StatusBar.currentHeight * 7,
      height: '10%',
      backgroundColor: ACCENT_COLOR,
      overflow: 'hidden',
      borderRadius: 34,
      marginTop: StatusBar.currentHeight,
      marginBottom: '8rem',
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
      marginRight: '12rem',
    },
    advSearchPressableText: {
      textShadowColor: 'black',
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      fontSize: '16rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'white',
    },
    imdbOverlayStyle: {
      width: '87%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imdbInfoContainer: {
      width: '100%',
      paddingBottom: StatusBar.currentHeight,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
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
      marginBottom: '8rem'
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
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      fontSize: '16rem',
    },
    imdbInfoHeaderDesc: {
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      color: 'grey',
      fontSize: '7.5rem',
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
      paddingTop: '6rem'
    },
    imdbInfoTitleText: {
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      fontSize: '10rem',
      fontWeight: 'bold',
    },
    imdbInfoTitleBadges: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: '6rem'
    },
    imdbInfoFreeleechBadge: {
      textShadowColor: 'black',
      textShadowOffset: {width: '1rem', height: '1rem'},
      textShadowRadius: '1rem',
      borderColor: '#1ec621',
      borderWidth: '0.5rem',
      fontSize: '7.5rem',
      color: 'aliceblue',
      marginRight: '4rem',
      backgroundColor: '#09580a',
    },
    imdbInfoDoubleUpBadge: {
      textShadowColor: 'black',
      textShadowOffset: {width: '1rem', height: '1rem'},
      textShadowRadius: '1rem',
      borderColor: '#7c00ff',
      borderWidth: '0.5rem',
      fontSize: '7.5rem',
      color: 'aliceblue',
      marginRight: '4rem',
      backgroundColor: '#370f61',
    },
    imdbInfoInternalBadge: {
      textShadowColor: 'black',
      textShadowOffset: {width: '1rem', height: '1rem'},
      textShadowRadius: '1rem',
      borderColor: '#1e87c6',
      borderWidth: '0.5rem',
      fontSize: '7.5rem',
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
      marginBottom: '15rem'
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
      alignItems: 'flex-start'
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
      fontSize: '8rem',
      textShadowOffset: {
        width: '1rem',
        height: '1rem',
      },
      textShadowRadius: '1rem',
      fontSize: '16rem',
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
      fontSize: '10rem',
      textShadowOffset: {
        width: '1rem',
        height: '1rem',
      },
      textShadowRadius: '1rem',
      color: 'grey',
      fontWeight: 'bold',
    },
    imdbInfoMainPlotText: {
      fontSize: '9rem',
      textShadowOffset: {
        width: '1rem',
        height: '1rem',
      },
      textShadowRadius: '1rem',
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
      fontSize: '10rem',
      textShadowOffset: {
        width: '1rem',
        height: '1rem',
      },
      textShadowRadius: '1rem',
      color: 'grey',
      fontWeight: 'bold',
    },
    imdbInfoMainETAText: {
      fontSize: '9rem',
      textShadowOffset: {
        width: '1rem',
        height: '1rem',
      },
      textShadowRadius: '1rem',
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
      fontSize: '9rem',
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
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
      padding: 0
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
      alignItems: 'center',
    },
    infoTitleContainer: {
      width: '100%',
      height: '50rem',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
    },
    accordionContainer: {width: '100%', paddingHorizontal: '18rem', marginTop: '50rem'},
    renderHeader: {marginVertical: '6rem'},
    renderContent: {flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: '13rem'},
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
      paddingHorizontal: '10rem',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingsOverlayThemeText: {
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      fontWeight: 'bold',
      fontSize: '16rem',
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
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16rem',
    },
    mainHeader: {
      height: StatusBar.currentHeight * 3,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: ACCENT_COLOR,
      paddingBottom: '5rem',
    },
    mainHeaderContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainHeaderInfoContainer: {
      position: 'absolute',
      left: 18,
      width: '10%',
      height: '40%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainHeaderInfoPressable: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainHeaderText: {
      textShadowColor: 'black',
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    mainHeaderCogContainer: {
      position: 'absolute',
      right: 18,
      width: '10%',
      height: '40%',
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
      height: '64rem',
      width: '100%',
      paddingHorizontal: '18rem',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mainClearSearchBarContainer: {
      height: '40rem',
      width: '40rem',
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
      padding: '8rem',
    },
    mainClearSearchBarText: {
      fontWeight: 'normal',
      paddingHorizontal: '22rem',
      width: '94%',
    },
    mainClearSearchBarTextSecond: {
      fontWeight: 'bold',
    },
    searchInputContainerStyle: {
      zIndex: 8,
      elevation: 8,
      height: '64rem',
      width: '100%',
      paddingTop: '8rem',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    searchInContainerStyle: {
      borderBottomWidth: '0.5rem',
      height: '80%',
      width: '100%',
      paddingLeft: '4rem',
      paddingRight: '1.5rem',
    },
    searchInputRIContainer: {
      height: '35rem',
      width: '35rem',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    searchInputRIPressable: {
      height: '100%',
      width: '100%',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
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
      paddingBottom: StatusBar.currentHeight * 2 + '64rem',
    },
    searchNoResultsTextPrimary: {
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      textAlign: 'center',
      fontSize: '16rem',
      fontWeight: 'bold',
    },
    searchNoResultsTextSecondary: {
      marginTop: '4rem',
      textShadowOffset: {width: '0.5rem', height: '0.5rem'},
      textShadowRadius: '1rem',
      textAlign: 'center',
    },
    flatListsContentContainer: {
      paddingTop: '15rem',
      paddingHorizontal: '15rem',
    },
    advSearchBtnContainer: {
      width: '45rem',
      height: '45rem',
      zIndex: 5,
      elevation: 5,
      overflow: 'hidden',
      bottom: '18rem',
      right: '20rem',
      borderRadius: 100,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ACCENT_COLOR,
    },
    advSearchBtnPressable: {
      width: '45rem',
      height: '45rem',
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
      fontSize: '12rem',
      fontWeight: 'bold',
    },
    refreshTextSecondary: {
      fontSize: '12rem',
      paddingBottom: '4rem',
    },
    clipboardAlertContainer: {
      width: '93%',
      height: StatusBar.currentHeight * 2,
      elevation: 9,
      zIndex: 9,
      position: 'absolute',
      top: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 34,
    },
    clipboardAlertText: {
      fontSize: '12rem',
      fontWeight: 'bold',
    },
    networkAlertContainer: {
      width: '100%',
      height: StatusBar.currentHeight * 3,
      paddingTop: StatusBar.currentHeight,
      elevation: 9,
      zIndex: 9,
      position: 'absolute',
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });