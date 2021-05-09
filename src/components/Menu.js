/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  Platform,
  Linking,
  ScrollView,
  Switch,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import Divider from 'react-native-paper/lib/commonjs/components/Divider';
import {CheckBox} from 'react-native-elements';
// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSignOutAlt,
  faInfoCircle,
  faGlobe,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
// Variables
import {
  width,
  height,
  statusHeight,
  MAIN_LIGHT,
  ACCENT_COLOR,
  PressableOpacity,
} from '../assets/variables';
import {RO, EN} from '../assets/lang';
// Variables & assets
import ro from '../assets/ro.png';
import en from '../assets/en.png';

export default function LeftDrawer({navigation}) {
  // State
  const [user, setUser] = useState('');
  const [checked, setChecked] = React.useState('first');
  // Redux
  const dispatch = useDispatch();
  const {lightTheme, fontSizes, enLang, autoplay} = useSelector(
    (state) => state.appConfig,
  );
  // Component mount
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    fontSizes[0] === 4 && setChecked('first');
    fontSizes[0] === 6 && setChecked('second');
    fontSizes[0] === 8 && setChecked('third');
    // Get Username for display
    getCurrentUser();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, [fontSizes, navigation]);

  // Functions
  const goHowTo = () => navigation.navigate('HowTo');
  const goFilelist = () => navigation.navigate('Filelist');
  const toggleFontS = () => toggleFontSize('S');
  const toggleFontM = () => toggleFontSize('M');
  const toggleFontL = () => toggleFontSize('L');
  const openGooglePlay = () =>
    Linking.openURL('market://details?id=intelligems.torrdroid');
  const goBack = () => navigation.goBack();

  const getCurrentUser = async () => {
    const currentUser = await AsyncStorage.getItem('username');
    if (currentUser !== null) {
      setUser(currentUser);
    }
  };

  const handleLogout = () => {
    const keys = ['username', 'passkey', 'latest'];
    Alert.alert(
      'Logout',
      enLang ? EN.logoutPrompt : RO.logoutPrompt,
      [
        {
          text: enLang ? EN.yes : RO.yes,
          onPress: async () => {
            await AsyncStorage.multiRemove(keys);
            dispatch(AppConfigActions.latestError());
            dispatch(AppConfigActions.retrieveLatest());
          },
        },
        {
          text: enLang ? EN.no : RO.no,
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const toggleFontSize = async (size) => {
    dispatch(AppConfigActions.setCollItems([]));
    switch (size) {
      case 'S':
        await AsyncStorage.setItem('fontSizes', 'S');
        break;
      case 'M':
        await AsyncStorage.setItem('fontSizes', 'M');
        break;
      case 'L':
        await AsyncStorage.setItem('fontSizes', 'L');
        break;
      default:
        await AsyncStorage.setItem('fontSizes', 'M');
    }
    dispatch(AppConfigActions.setFonts());
  };

  const switchTheme = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    const currentTheme = await AsyncStorage.getItem('theme');
    if (currentTheme !== null) {
      if (currentTheme === 'dark') {
        await AsyncStorage.setItem('theme', 'light');
        dispatch(AppConfigActions.toggleLightTheme());
      } else {
        await AsyncStorage.setItem('theme', 'dark');
        dispatch(AppConfigActions.toggleLightTheme());
      }
    } else {
      await AsyncStorage.setItem('theme', 'dark');
    }
  };
  const switchLang = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    const currentLang = await AsyncStorage.getItem('enLang');
    if (currentLang !== null) {
      if (currentLang === 'false') {
        await AsyncStorage.setItem('enLang', 'true');
        dispatch(AppConfigActions.toggleEnLang());
      } else {
        await AsyncStorage.setItem('enLang', 'false');
        dispatch(AppConfigActions.toggleEnLang());
      }
    } else {
      await AsyncStorage.setItem('enLang', 'false');
    }
  };
  const switchAutoplay = async () => {
    const currentAutoplay = await AsyncStorage.getItem('autoplay');
    if (currentAutoplay !== null) {
      if (currentAutoplay !== 'true') {
        await AsyncStorage.setItem('autoplay', 'true');
      } else {
        await AsyncStorage.setItem('autoplay', 'false');
      }
    } else {
      await AsyncStorage.setItem('autoplay', 'false');
    }
    dispatch(AppConfigActions.toggleAutoplay());
  };

  // Component render
  return (
    <>
      <View
        style={{
          height: statusHeight * 3.5,
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
              Platform.OS === 'ios' ? statusHeight * 2.2 : statusHeight * 1.6,
            left: statusHeight / 1.5,
          }}
          android_ripple={{
            color: 'white',
            borderless: true,
            radius: statusHeight / 1.3,
          }}
          onPress={goBack}>
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
              Platform.OS === 'ios' ? statusHeight * 2 : statusHeight * 1.1,
            marginBottom: statusHeight / 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {enLang ? EN.menu : RO.menu}
        </Text>
      </View>
      <View
        style={[
          RightDrawerStyle.profileContainer,
          {backgroundColor: lightTheme ? '#D5D5D5' : '#151515'},
        ]}>
        <View style={RightDrawerStyle.profilePicContainer}>
          <View
            style={[
              RightDrawerStyle.profilePicView,
              {borderColor: lightTheme ? 'black' : 'silver'},
            ]}>
            <Text
              style={{
                fontSize: Adjust(40),
                textTransform: 'uppercase',
                marginBottom: Platform.OS === 'ios' ? -4 : 4,
                fontWeight: 'bold',
                color: lightTheme ? 'black' : 'white',
              }}>
              {user !== '' ? user.charAt(0) : null}
            </Text>
          </View>
        </View>
        <View style={RightDrawerStyle.usernameView}>
          <Text
            style={{
              fontSize: Adjust(16),
              fontWeight: 'bold',
              color: lightTheme ? 'black' : 'white',
            }}>
            {user !== '' ? user : null}
          </Text>
        </View>
      </View>
      <Divider
        style={{
          backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
        }}
      />
      <ScrollView
        style={{flex: 1, backgroundColor: lightTheme ? MAIN_LIGHT : 'black'}}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: Adjust(12),
            fontWeight: 'bold',
            marginBottom: 2,
            marginTop: statusHeight / 2,
            marginLeft: statusHeight / 2,
            color: lightTheme ? 'black' : 'white',
          }}>
          {enLang ? EN.theme : RO.theme}
        </Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginVertical: statusHeight / 3,
          }}>
          <Text
            style={{
              color: lightTheme ? 'grey' : 'silver',
              fontWeight: 'bold',
              marginRight: 5,
            }}>
            Light
          </Text>
          <PressableOpacity
            activeOpacity={0.5}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: lightTheme ? 'grey' : 'silver',
              borderless: true,
              radius: statusHeight / 1.2,
            }}
            onPress={switchTheme}>
            <View pointerEvents={'none'}>
              <Switch
                trackColor={{false: 'black', true: '#505050'}}
                thumbColor={lightTheme ? 'white' : MAIN_LIGHT}
                ios_backgroundColor="#909090"
                value={!lightTheme}
              />
            </View>
          </PressableOpacity>
          <Text
            style={{
              color: lightTheme ? 'grey' : 'silver',
              fontWeight: 'bold',
              marginRight: 5,
            }}>
            Dark
          </Text>
        </View>
        <Divider
          style={{
            backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
          }}
        />
        <Text
          style={{
            fontSize: Adjust(12),
            fontWeight: 'bold',
            marginBottom: 2,
            marginTop: statusHeight / 2,
            marginLeft: statusHeight / 2,
            color: lightTheme ? 'black' : 'white',
          }}>
          {enLang ? EN.lang : RO.lang}
        </Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginVertical: statusHeight / 3,
          }}>
          <FastImage
            style={{width: 25, height: 25}}
            resizeMode={FastImage.resizeMode.contain}
            source={ro}
          />
          <PressableOpacity
            activeOpacity={0.5}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: lightTheme ? 'grey' : 'silver',
              borderless: true,
              radius: statusHeight / 1.2,
            }}
            onPress={switchLang}>
            <View pointerEvents={'none'}>
              <Switch
                trackColor={{
                  false: lightTheme ? 'black' : '#505050',
                  true: lightTheme ? 'black' : '#505050',
                }}
                thumbColor={lightTheme ? 'white' : MAIN_LIGHT}
                ios_backgroundColor="#909090"
                value={enLang}
              />
            </View>
          </PressableOpacity>
          <FastImage
            style={{width: 25, height: 25}}
            resizeMode={FastImage.resizeMode.contain}
            source={en}
          />
        </View>
        <Divider
          style={{
            backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
          }}
        />
        <Text
          style={{
            fontSize: Adjust(12),
            fontWeight: 'bold',
            marginBottom: 2,
            marginTop: statusHeight / 2,
            marginLeft: statusHeight / 2,
            color: lightTheme ? 'black' : 'white',
          }}>
          {enLang ? EN.textSize : RO.textSize}
        </Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: statusHeight / 5,
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: Platform.OS === 'ios' ? statusHeight / 2.5 : 0,
            }}>
            <Text
              style={{
                color: lightTheme ? 'grey' : 'silver',
                fontWeight: 'bold',
                marginRight: Platform.OS === 'ios' ? -8 : 2,
              }}>
              S
            </Text>
            <CheckBox
              uncheckedColor={lightTheme ? 'grey' : 'silver'}
              checkedColor={ACCENT_COLOR}
              checked={checked === 'first' ? true : false}
              onPress={toggleFontS}
            />
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: lightTheme ? 'grey' : 'silver',
                fontWeight: 'bold',
                marginRight: Platform.OS === 'ios' ? -8 : 2,
              }}>
              M
            </Text>
            <CheckBox
              uncheckedColor={lightTheme ? 'grey' : 'silver'}
              checkedColor={ACCENT_COLOR}
              checked={checked === 'second' ? true : false}
              onPress={toggleFontM}
            />
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: lightTheme ? 'grey' : 'silver',
                fontWeight: 'bold',
                marginRight: Platform.OS === 'ios' ? -8 : 2,
              }}>
              L
            </Text>
            <CheckBox
              uncheckedColor={lightTheme ? 'grey' : 'silver'}
              checkedColor={ACCENT_COLOR}
              checked={checked === 'third' ? true : false}
              onPress={toggleFontL}
            />
          </View>
        </View>
        <Divider
          style={{
            backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
          }}
        />
        <Text
          style={{
            fontSize: Adjust(12),
            fontWeight: 'bold',
            marginBottom: 2,
            marginTop: statusHeight / 2,
            marginLeft: statusHeight / 2,
            color: lightTheme ? 'black' : 'white',
          }}>
          {enLang ? EN.autoplay : RO.autoplay}
        </Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginVertical: statusHeight / 3,
          }}>
          <Text
            style={{
              color: lightTheme ? 'grey' : 'silver',
              fontWeight: 'bold',
              marginRight: 5,
            }}>
            OFF
          </Text>
          <PressableOpacity
            activeOpacity={0.5}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: lightTheme ? 'grey' : 'silver',
              borderless: true,
              radius: statusHeight / 1.2,
            }}
            onPress={switchAutoplay}>
            <View pointerEvents={'none'}>
              <Switch
                trackColor={{
                  false: lightTheme ? 'black' : '#505050',
                  true: lightTheme ? 'black' : '#505050',
                }}
                thumbColor={lightTheme ? 'white' : MAIN_LIGHT}
                ios_backgroundColor="#909090"
                value={autoplay}
              />
            </View>
          </PressableOpacity>
          <Text
            style={{
              color: lightTheme ? 'grey' : 'silver',
              fontWeight: 'bold',
              marginRight: 5,
            }}>
            ON
          </Text>
        </View>
        <Divider
          style={{
            backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
          }}
        />
        {Platform.OS === 'android' && (
          <>
            <View
              style={{
                height: statusHeight * 3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: width,
                  height: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: statusHeight / 1.5,
                }}
                onPress={openGooglePlay}>
                <View style={{width: 50, height: 50}}>
                  <FastImage
                    style={{height: '100%', width: '100%'}}
                    resizeMode={FastImage.resizeMode.contain}
                    source={require('../assets/td.png')}
                  />
                </View>
                <Text
                  style={[
                    RightDrawerStyle.settingsOverlayText,
                    {
                      fontSize: Adjust(12),
                      marginLeft: statusHeight / 2,
                      color: lightTheme ? 'black' : 'white',
                    },
                  ]}>
                  TorrDroid - Torrent Downloader
                </Text>
              </TouchableOpacity>
            </View>
            <Divider
              style={{
                backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
              }}
            />
          </>
        )}
        <View
          style={{
            height: statusHeight * 3,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: width / 3,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: statusHeight / 1.5,
            }}
            onPress={goHowTo}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(22)}
              icon={faInfoCircle}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: width / 3,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: Platform.OS === 'ios' ? 0 : statusHeight / 1.5,
            }}
            onPress={goFilelist}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(22)}
              icon={faGlobe}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(14),
                  color: lightTheme ? 'black' : 'white',
                  textAlign: 'center',
                },
              ]}>
              Filelist Web
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: width / 3,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: statusHeight / 1.5,
            }}
            onPress={handleLogout}>
            <FontAwesomeIcon
              color={'crimson'}
              size={Adjust(22)}
              icon={faSignOutAlt}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Divider
        style={{
          backgroundColor: lightTheme ? '#B0B0B0' : '#303030',
        }}
      />
      <View style={{backgroundColor: lightTheme ? '#D5D5D5' : '#151515'}}>
        <Text
          style={{
            fontSize: Adjust(8),
            fontWeight: 'bold',
            marginTop: 6,
            marginBottom: 6,
            color: 'grey',
            textAlign: 'center',
          }}>
          Filelist App v2021.3.0
        </Text>
      </View>
      {Platform.OS === 'ios' && (
        <View
          style={{
            height: statusHeight / 3.5,
            width,
            backgroundColor: lightTheme ? '#D5D5D5' : '#151515',
          }}
        />
      )}
    </>
  );
}

const RightDrawerStyle = EStyleSheet.create({
  profileContainer: {
    paddingVertical: statusHeight / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: statusHeight / 1.5,
  },
  profilePicView: {
    width: width / 5,
    height: width / 5,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '0.3rem',
  },
  usernameView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  settingsOverlayMainContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? statusHeight / 3 : 0,
  },
  settingsOverlayContainer: {
    width: '100%',
    height: width / 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  settingsOverlayPressable: {
    width,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: statusHeight / 1.5,
  },
  settingsOverlayText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  infoOverlay: {
    height: height + statusHeight / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  infoOverlayCloseContainer: {
    width,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlayScrollView: {
    width,
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
    paddingVertical: '0.8rem',
  },
  renderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  btnMainContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    elevation: 2,
    zIndex: 2,
    width: width / 8,
    height: width / 8,
    borderRadius: width / 8 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
  },
  btn: {
    width: width / 8,
    height: width / 8,
    backgroundColor: ACCENT_COLOR,
    borderRadius: width / 8 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
