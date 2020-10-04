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
import {Input, SearchBar, Overlay} from 'react-native-elements';
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
} from '@fortawesome/free-solid-svg-icons';
import SplashScreen from 'react-native-splash-screen';
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
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const {latest} = useSelector((state) => state.appConfig);
  const [refreshing, setRefreshing] = useState(false);
  const [showStatus] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [showClipboardStatus] = useState(new Animated.Value(0));
  const [textClipboardOpacity] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const SearchBarRef = useRef();

  // Determine torrent size
  // function formatBytes(a, b = 2) {
  //   if (0 === a) return '0 Bytes';
  //   const c = 0 > b ? 0 : b,
  //     d = Math.floor(Math.log(a) / Math.log(1024));
  //   return (
  //     parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
  //     ' ' +
  //     ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  //   );
  // }

  useEffect(() => {
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
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const copyToClipboard = (string) => {
    Clipboard.setString(`${string}`);
    setTimeout(() => {
      Animated.timing(showClipboardStatus, {
        toValue: StatusBar.currentHeight * 2,
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

  const handleLogout = async () => {
    const keys = ['username', 'passkey', 'torrents'];
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.log(e);
    }
    dispatch(AppConfigActions.getLatest());
  };

  const getUserDetails = async () => {
    try {
      const value0 = await AsyncStorage.getItem('username');
      const value1 = await AsyncStorage.getItem('passkey');
      if (value0 !== null && value1 !== null) {
        setUser(value0);
        setPass(value1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserDetails();
    dispatch(AppConfigActions.setLatest(user, pass));
    setTimeout(() => {
      Animated.timing(showStatus, {
        toValue: StatusBar.currentHeight * 2,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }, 500);
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
    }, 3500);
    setTimeout(() => {
      setRefreshing(false);
    }, refreshing);
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
          marginBottom: 16,
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
              height: 45,
              width: '80%',
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
              height: 15,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingLeft: 5,
            }}>
            <Text
              style={{
                textShadowColor: '#202020',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                fontSize: 9,
                color: 'silver',
              }}>
              [ {item.small_description} ]
            </Text>
          </View>
          <View
            style={{
              height: 15,
              marginBottom: 5,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {item.freeleech === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 0.5, height: 0.5},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: 'yellowgreen',
                  borderWidth: 0.5,
                  fontSize: 10,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: 'green',
                }}>
                Freeleech
              </Text>
            ) : null}
            {item.doubleup === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 0.5, height: 0.5},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: 'fuchsia',
                  borderWidth: 0.5,
                  fontSize: 10,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: 'darkmagenta',
                }}>
                Doubleup
              </Text>
            ) : null}
            {item.internal === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 0.5, height: 0.5},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: 'deepskyblue',
                  borderWidth: 0.5,
                  fontSize: 10,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: 'darkblue',
                }}>
                Internal
              </Text>
            ) : null}
            {item.moderated === 1 ? (
              <Text
                style={{
                  textShadowColor: 'black',
                  textShadowOffset: {width: 0.5, height: 0.5},
                  textShadowRadius: 1,
                  paddingHorizontal: 2,
                  borderColor: 'crimson',
                  borderWidth: 0.5,
                  fontSize: 10,
                  color: 'aliceblue',
                  marginLeft: 5,
                  backgroundColor: 'maroon',
                }}>
                Moderated
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
      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss;
        }}> */}
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#202020',
        }}>
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
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textShadowColor: 'black',
                textShadowOffset: {width: 0.5, height: 0.5},
                textShadowRadius: 1,
                color: 'white',
                fontSize: 18,
                padding: 8,
                fontWeight: 'bold',
              }}>
              Recent adăugate
            </Text>
            <View
              style={{
                width: '20%',
                height: '40%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Pressable
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                android_ripple={{
                  color: 'white',
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
                    padding: 8,
                  }}>
                  Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              progressViewOffset={130}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListHeaderComponent={
            <SearchBar
              ref={SearchBarRef}
              textContentType="none"
              selectTextOnFocus
              clearIcon={false}
              searchIcon={
                <FontAwesomeIcon
                  style={{marginLeft: 5}}
                  color={'grey'}
                  icon={faSearch}
                />
              }
              placeholder="Caută după cuvânt cheie, IMDb..."
              onChangeText={(search) => setSearch(search)}
              value={search}
            />
          }
          onEndReached={() => alert('coaeee')}
          onEndReachedThreshold={0.7}
          data={latest}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        <Animated.View
          style={[
            {
              elevation: 15,
              zIndex: 15,
              position: 'absolute',
              bottom: 0,
              backgroundColor: ACCENT_COLOR,
              width: '100%',
              justifyContent: 'flex-end',
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
                position: 'relative',
                bottom: 7,
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
                position: 'relative',
                bottom: 7,
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
              justifyContent: 'flex-end',
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
                position: 'relative',
                bottom: 21,
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
      {/* </TouchableWithoutFeedback> */}
    </>
  );
}

function Login() {
  const dispatch = useDispatch();
  const {latest, error} = useSelector((state) => state.appConfig);
  const [userModal, setUserModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [user, setUser] = useState('kevin7');
  const [pass, setPass] = useState('51e60083fcfc825ffd146bfa8786fda0');
  const [invalid, setInvalid] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (error !== null) {
      setTimeout(() => {
        dispatch(AppConfigActions.setError());
      }, 5000);
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
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [latest, error]);

  const storeData = async (value0, value1) => {
    try {
      await AsyncStorage.setItem('username', value0);
      await AsyncStorage.setItem('passkey', value1);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    if (user.length === 0 && pass.length > 0) {
      setInvalidUser(true);
      setLoginLoading(false);
      setTimeout(() => {
        setInvalidUser(false);
      }, 5000);
    }
    if (user.length > 0 && pass.length === 0) {
      setInvalidPass(true);
      setLoginLoading(false);
      setTimeout(() => {
        setInvalidPass(false);
      }, 5000);
    }
    if (user.length === 0 && pass.length === 0) {
      setInvalid(true);
      setLoginLoading(false);
      setTimeout(() => {
        setInvalid(false);
      }, 5000);
    }
    if (user.length > 0 && pass.length > 0) {
      await storeData(user, pass);
      dispatch(AppConfigActions.setLatest(user, pass));
      setTimeout(() => {
        dispatch(AppConfigActions.setError());
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
          backgroundColor: 'black',
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
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
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
          backgroundColor: 'black',
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
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
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
          backgroundColor: 'black',
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
              <Text style={{color: MAIN_COLOR, fontWeight: 'bold'}}>About</Text>
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
              <Text
                style={{color: MAIN_COLOR, fontWeight: 'bold', fontSize: 12}}>
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
              <Text
                style={{color: MAIN_COLOR, fontWeight: 'bold', fontSize: 12}}>
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
              <Text
                style={{color: MAIN_COLOR, fontWeight: 'bold', fontSize: 12}}>
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
                source={require('../assets/logo.png')}
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
                      color: 'black',
                      borderless: true,
                      radius: 18,
                    }}
                    onPress={() => setUserModal(true)}>
                    <FontAwesomeIcon
                      size={28}
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
                      color: 'black',
                      borderless: true,
                      radius: 18,
                    }}
                    onPress={() => setPassModal(true)}>
                    <FontAwesomeIcon
                      size={28}
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
              {error && (
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
  const {latest} = useSelector((state) => state.appConfig);

  useEffect(() => {
    if (!latest) {
      dispatch(AppConfigActions.getLatest());
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
      {latest ? (
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
