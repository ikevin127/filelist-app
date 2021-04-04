/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  Pressable,
  Platform,
  Linking,
  ScrollView,
  Switch,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import Divider from 'react-native-paper/lib/commonjs/components/Divider';
import RadioButton from 'react-native-paper/lib/commonjs/components/RadioButton/RadioButton';
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
  faDirections,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
// Variables
import {
  width,
  height,
  statusHeight,
  MAIN_LIGHT,
  ACCENT_COLOR,
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
  const toggleFontS = () => toggleFontSize('S');
  const toggleFontM = () => toggleFontSize('M');
  const toggleFontL = () => toggleFontSize('L');
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

  const openFilelist = async () => {
    const supported = await Linking.canOpenURL('https://filelist.io');
    if (supported) {
      Alert.alert(
        'Info',
        enLang ? EN.filelistWeb : RO.filelistWeb,
        [
          {
            text: enLang ? EN.yes : RO.yes,
            onPress: () => Linking.openURL('https://filelist.io'),
          },
          {
            text: enLang ? EN.no : RO.no,
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      Alert.alert(
        'Info',
        enLang ? EN.filelistWebErr : RO.filelistWebErr,
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
        <Pressable
          style={{
            position: 'absolute',
            top: statusHeight * 1.6,
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
        </Pressable>
        <Text
          style={{
            fontSize: Adjust(16),
            marginTop: statusHeight * 1.1,
            marginBottom: statusHeight / 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {enLang ? EN.menu : RO.menu}
        </Text>
      </View>
      <ScrollView
        style={{flex: 1, backgroundColor: lightTheme ? MAIN_LIGHT : 'black'}}
        showsVerticalScrollIndicator={false}>
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
                  marginBottom: 4,
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
          <Pressable
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
          </Pressable>
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
            backgroundColor: 'grey',
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
          <Pressable
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
          </Pressable>
          <FastImage
            style={{width: 25, height: 25}}
            resizeMode={FastImage.resizeMode.contain}
            source={en}
          />
        </View>
        <Divider
          style={{
            backgroundColor: 'grey',
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
            }}>
            <Text
              style={{
                color: lightTheme ? 'grey' : 'silver',
                fontWeight: 'bold',
                marginRight: 2,
              }}>
              S
            </Text>
            <RadioButton
              uncheckedColor={lightTheme ? 'grey' : 'silver'}
              color={ACCENT_COLOR}
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
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
                marginRight: 2,
              }}>
              M
            </Text>
            <RadioButton
              uncheckedColor={lightTheme ? 'grey' : 'silver'}
              color={ACCENT_COLOR}
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
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
                marginRight: 2,
              }}>
              L
            </Text>
            <RadioButton
              uncheckedColor={lightTheme ? 'grey' : 'silver'}
              color={ACCENT_COLOR}
              value="third"
              status={checked === 'third' ? 'checked' : 'unchecked'}
              onPress={toggleFontL}
            />
          </View>
        </View>
        <Divider
          style={{
            backgroundColor: 'grey',
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
          <Pressable
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
          </Pressable>
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
        <View
          style={{
            height: statusHeight * 3.5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: lightTheme ? '#D5D5D5' : '#151515',
          }}>
          <Pressable
            style={{
              width: width / 3,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: statusHeight / 1.5,
            }}
            android_ripple={{
              color: 'grey',
              borderless: false,
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
          </Pressable>
          <Pressable
            style={{
              width: width / 3,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: statusHeight / 1.5,
            }}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={openFilelist}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(22)}
              icon={faDirections}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              Filelist.io
            </Text>
          </Pressable>
          <Pressable
            style={{
              width: width / 3,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: statusHeight / 1.5,
            }}
            android_ripple={{
              color: 'grey',
              borderless: false,
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
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const RightDrawerStyle = EStyleSheet.create({
  profileContainer: {
    width,
    paddingVertical: statusHeight,
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
