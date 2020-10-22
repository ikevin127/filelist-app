import React, {useEffect, useRef, useState} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import RText from './Text';
import Adjust from './AdjustText';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Dimensions,
  PixelRatio,
  View,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
} from 'react-native';
import {Input, Overlay} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faKey,
  faUserLock,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {USERNAME, PASSKEY} from '../../env';

const MAIN_LIGHT = '#E8E6E6';
const MAIN_DARK = '#202020';
const ACCENT_COLOR = '#15ABF4';

export default function Login() {
  const dispatch = useDispatch();
  const {lightTheme, listLatest, latestError} = useSelector(
    (state) => state.appConfig,
  );
  const [userModal, setUserModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [user, setUser] = useState(USERNAME);
  const [pass, setPass] = useState(PASSKEY);
  const [invalid, setInvalid] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isKeyboard, setIsKeyboard] = useState(false);
  const err1 = useRef();
  const err2 = useRef();
  const err3 = useRef();

  useEffect(() => {
    if (latestError !== null) {
      setLoginLoading(false);
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboard(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboard(false);
      },
    );

    return () => {
      clearInterval(err1.current);
      clearInterval(err2.current);
      clearInterval(err3.current);
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [listLatest, latestError]);

  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
  const scale = SCREEN_WIDTH / SCREEN_WIDTH;

  function fontSz(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  }

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
      setTimeout(() => {
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
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 0,
          backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,
        }}
        isVisible={userModal}
        onBackdropPress={() => {
          setUserModal(false);
        }}>
        <View style={LoginPage.dataContainer}>
          <View style={LoginPage.openFilelist}>
            <Pressable
              style={LoginPage.filelistPressable}
              onPress={() => Linking.openURL('https://filelist.io')}>
              <RText
                title={`Deschide${' '}`}
                t12
                style={{
                  color: lightTheme ? MAIN_DARK : 'white',
                  fontWeight: 'bold',
                }}
              />
              <RText title={'Filelist.io'} t12 style={LoginPage.filelistText} />
            </Pressable>
          </View>
          <View style={LoginPage.imageContainer}>
            <FastImage
              style={LoginPage.imageStyle}
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
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 0,
          backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,
        }}
        isVisible={passModal}
        onBackdropPress={() => {
          setPassModal(false);
        }}>
        <View style={LoginPage.dataContainer}>
          <View style={LoginPage.openFilelist}>
            <Pressable
              style={LoginPage.filelistPressable}
              onPress={() => Linking.openURL('https://filelist.io')}>
              <RText
                title={`Deschide${' '}`}
                t12
                style={{
                  color: lightTheme ? MAIN_DARK : 'white',
                  fontWeight: 'bold',
                }}
              />
              <RText
                title={'Filelist.io'}
                t12
                style={[LoginPage.filelistText]}
              />
            </Pressable>
          </View>
          <View style={LoginPage.imageContainer}>
            <FastImage
              style={LoginPage.imageStyle}
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
          width: '90%',
          height: '30%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 0,
          backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,
        }}
        isVisible={aboutModal}
        onBackdropPress={() => {
          setAboutModal(false);
        }}>
        <View style={LoginPage.dataContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[
              LoginPage.aboutScrollView,
              {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
            ]}>
            <View style={LoginPage.aboutFirst}>
              <View style={LoginPage.aboutLeftHalf}>
                <RText
                  title={'About'}
                  t12
                  style={{
                    fontWeight: 'bold',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 1,
                    color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                    textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                  }}
                />
              </View>
              <View style={LoginPage.aboutRightHalf}>
                <RText
                  title={'Filelist App'}
                  t12
                  style={{
                    color: ACCENT_COLOR,
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 1,
                    textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                  }}
                />
              </View>
            </View>
            <View style={LoginPage.aboutSecond}>
              <View style={LoginPage.aboutLeftHalf}>
                <RText
                  title={'Version'}
                  t12
                  style={{
                    fontWeight: 'bold',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 1,
                    color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                    textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                  }}
                />
                <View style={LoginPage.aboutSeparator} />
                <RText
                  title={'Publisher'}
                  t12
                  style={{
                    fontWeight: 'bold',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 1,
                    color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                    textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                  }}
                />
                <View style={LoginPage.aboutSeparator} />
                <RText
                  title={'Developed with'}
                  t12
                  style={{
                    fontWeight: 'bold',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 1,
                    color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                    textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                  }}
                />
              </View>
              <View style={LoginPage.aboutRightHalf}>
                <RText
                  title={'v3.0.1'}
                  t12
                  style={{
                    color: ACCENT_COLOR,
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 1,
                    textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                  }}
                />
                <View style={LoginPage.aboutSeparator} />
                <View style={LoginPage.aboutPressView}>
                  <Pressable
                    android_ripple={{
                      color: 'white',
                      borderless: false,
                    }}
                    onPress={() =>
                      Linking.openURL('https://github.com/baderproductions')
                    }>
                    <RText
                      title={'BADERproductions'}
                      t12
                      style={{
                        color: ACCENT_COLOR,
                        textDecorationLine: 'underline',
                        textShadowOffset: {width: 1, height: 1},
                        textShadowRadius: 1,
                        textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                      }}
                    />
                  </Pressable>
                </View>
                <View style={LoginPage.aboutSeparator} />
                <View style={LoginPage.aboutPressView}>
                  <Pressable
                    android_ripple={{
                      color: 'white',
                      borderless: false,
                    }}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.npmjs.com/package/react-native',
                      )
                    }>
                    <RText
                      title={'React Native v0.63'}
                      t12
                      style={{
                        color: ACCENT_COLOR,
                        textDecorationLine: 'underline',
                        textShadowOffset: {width: 1, height: 1},
                        textShadowRadius: 1,
                        textShadowColor: lightTheme ? MAIN_LIGHT : 'black',
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Overlay>
      <StatusBar
        barStyle={lightTheme ? 'dark-content' : 'light-content'}
        backgroundColor={
          Platform.Version < 23
            ? lightTheme
              ? MAIN_DARK
              : 'transparent'
            : 'transparent'
        }
        translucent={Platform.Version < 23 ? false : true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          enabled={false}
          style={LoginPage.KeyboardAvoidingView}
          behavior={'padding'}>
          <View
            style={[
              LoginPage.container,
              {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
            ]}>
            <View style={LoginPage.profilePicContainer}>
              <FastImage
                style={LoginPage.picture}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../assets/logo.png')}
              />
            </View>
            <View style={LoginPage.form}>
              <Input
                style={{
                  height: 45,
                  fontSize: Adjust(11),
                  color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                }}
                containerStyle={LoginPage.inputContainer}
                inputContainerStyle={LoginPage.inputContainerInner}
                keyboardType="default"
                selectionColor="grey"
                underlineColorAndroid={lightTheme ? MAIN_DARK : 'white'}
                autoCapitalize="none"
                placeholder="Nume utilizator"
                placeholderTextColor={'grey'}
                leftIcon={
                  <FontAwesomeIcon
                    size={22}
                    color={lightTheme ? MAIN_DARK : 'white'}
                    icon={faUserLock}
                  />
                }
                rightIcon={
                  <Pressable
                    android_ripple={{
                      color: 'white',
                      borderless: true,
                      radius: 15,
                    }}
                    onPress={() => setUserModal(true)}>
                    <FontAwesomeIcon
                      size={22}
                      color={lightTheme ? MAIN_DARK : 'white'}
                      icon={faInfoCircle}
                    />
                  </Pressable>
                }
                onChangeText={(user) => setUser(user)}
                value={user}
              />
              <Input
                style={{
                  height: 45,
                  fontSize: Adjust(11),
                  color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                }}
                containerStyle={LoginPage.inputContainer}
                inputContainerStyle={LoginPage.inputContainerInner}
                leftIcon={
                  <FontAwesomeIcon
                    size={22}
                    color={lightTheme ? MAIN_DARK : 'white'}
                    icon={faKey}
                  />
                }
                rightIcon={
                  <Pressable
                    android_ripple={{
                      color: 'white',
                      borderless: true,
                      radius: 15,
                    }}
                    onPress={() => setPassModal(true)}>
                    <FontAwesomeIcon
                      size={22}
                      color={lightTheme ? MAIN_DARK : 'white'}
                      icon={faInfoCircle}
                    />
                  </Pressable>
                }
                selectionColor="grey"
                underlineColorAndroid={lightTheme ? MAIN_DARK : 'white'}
                autoCapitalize="none"
                placeholder="Passkey"
                placeholderTextColor={'grey'}
                onChangeText={(pass) => setPass(pass)}
                value={pass}
              />
              {latestError && (
                <RText
                  title={'Utilizator sau Passkey incorect'}
                  t12
                  style={LoginPage.error}
                />
              )}
              {invalid && (
                <RText
                  title={'Introdu Numele de utilizator şi codul Passkey'}
                  t12
                  style={LoginPage.error}
                />
              )}
              {invalidUser && (
                <RText
                  title={'Introdu Numele de utilizator'}
                  t12
                  style={LoginPage.error}
                />
              )}
              {invalidPass && (
                <RText
                  title={'Introdu codul Passkey'}
                  t12
                  style={LoginPage.error}
                />
              )}
              <View style={LoginPage.btnContainer}>
                <Pressable
                  onPress={handleLogin}
                  disabled={loginLoading}
                  android_ripple={{
                    color: 'white',
                    borderless: false,
                  }}
                  style={LoginPage.btn}>
                  {loginLoading ? (
                    <ActivityIndicator size="small" color={'white'} />
                  ) : (
                    <RText title={'Login'} t14 style={LoginPage.btnText} />
                  )}
                </Pressable>
              </View>
            </View>
            {isKeyboard ? null : (
              <View style={LoginPage.aboutBtnContainer}>
                <Pressable
                  style={LoginPage.aboutPressable}
                  android_ripple={{
                    color: lightTheme ? MAIN_DARK : 'white',
                    borderless: false,
                  }}
                  onPress={() => setAboutModal(true)}>
                  <RText
                    title={'About'}
                    t12
                    style={{
                      color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                    }}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const LoginPage = EStyleSheet.create({
  // user pass info overlay
  dataContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openFilelist: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10rem',
  },
  filelistPressable: {
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  filelistText: {
    color: ACCENT_COLOR,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  imageContainer: {width: '100%', height: '80%'},
  imageStyle: {width: '100%', height: '100%'},
  // about overlay
  aboutScrollView: {
    width: '100%',
    paddingTop: StatusBar.currentHeight,
    paddingBottom: StatusBar.currentHeight,
    height: StatusBar.currentHeight * 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutFirst: {
    width: '100%',
    height: StatusBar.currentHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutSecond: {
    width: '100%',
    height: StatusBar.currentHeight * 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutLeftHalf: {
    width: '45%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '20rem',
  },
  aboutRightHalf: {
    width: '55%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: '20rem',
  },
  aboutPressView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  aboutSeparator: {
    position: 'relative',
    top: 0,
    left: 0,
    marginTop: '10rem',
    marginBottom: '10rem',
    width: '100%',
    height: '0.3rem',
    backgroundColor: '#404040',
  },
  // login page
  KeyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight * 1.5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profilePicContainer: {
    width: '100%',
    height: '35%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    height: '65%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  picture: {
    width: '200rem',
    height: '200rem',
    justifyContent: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerInner: {
    borderBottomWidth: 0,
    width: '85%',
  },
  error: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '60%',
    color: 'crimson',
    marginBottom: StatusBar.currentHeight / 2,
  },
  btnContainer: {
    elevation: 5,
    width: '50%',
    height: '40rem',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10rem',
    padding: 0,
    borderRadius: 34,
    overflow: 'hidden',
  },
  btn: {
    width: '100%',
    height: '40rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    backgroundColor: ACCENT_COLOR,
  },
  btnText: {
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: '0.5rem', height: '0.5rem'},
    textShadowRadius: '1rem',
    fontWeight: 'bold',
  },
  checkBox: {
    width: '85%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  checkBoxFont: {
    fontSize: '13rem',
  },
  aboutBtnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: StatusBar.currentHeight * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  aboutPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
