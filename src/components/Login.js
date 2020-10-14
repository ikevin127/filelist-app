import React, {useEffect, useRef, useState} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
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
  const {listLatest, latestError} = useSelector((state) => state.appConfig);
  const [userModal, setUserModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
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
        overlayStyle={LoginPage.dataOverlay}
        isVisible={userModal}
        onBackdropPress={() => {
          setUserModal(false);
        }}>
        <View style={LoginPage.dataContainer}>
          <View style={LoginPage.openFilelist}>
            <Text style={LoginPage.openText}>Deschide</Text>
            <Pressable
              style={LoginPage.filelistPressable}
              android_ripple={{
                color: 'white',
                borderless: false,
              }}
              onPress={() => Linking.openURL('https://filelist.io')}>
              <Text style={LoginPage.filelistText}>Filelist.io</Text>
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
        overlayStyle={LoginPage.dataOverlay}
        isVisible={passModal}
        onBackdropPress={() => {
          setPassModal(false);
        }}>
        <View style={LoginPage.dataContainer}>
          <View style={LoginPage.openFilelist}>
            <Text style={LoginPage.openText}>Deschide</Text>
            <Pressable
              style={LoginPage.filelistPressable}
              android_ripple={{
                color: 'grey',
                borderless: false,
              }}
              onPress={() => Linking.openURL('https://filelist.io')}>
              <Text style={LoginPage.filelistText}>Filelist.io</Text>
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
        overlayStyle={LoginPage.dataOverlay}
        isVisible={aboutModal}
        onBackdropPress={() => {
          setAboutModal(false);
        }}>
        <View style={LoginPage.dataContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={LoginPage.aboutScrollView}>
            <View style={LoginPage.aboutFirst}>
              <View style={LoginPage.aboutLeftHalf}>
                <Text style={LoginPage.aboutLeftText}>About</Text>
              </View>
              <View style={LoginPage.aboutRightHalf}>
                <Text style={LoginPage.aboutRightText}>Filelist App</Text>
              </View>
            </View>
            <View style={LoginPage.aboutSecond}>
              <View style={LoginPage.aboutLeftHalf}>
                <Text style={LoginPage.aboutLeftText}>Version</Text>
                <View style={LoginPage.aboutSeparator} />
                <Text style={LoginPage.aboutLeftText}>Publisher</Text>
                <View style={LoginPage.aboutSeparator} />
                <Text style={LoginPage.aboutLeftText}>Developed with</Text>
              </View>
              <View style={LoginPage.aboutRightHalf}>
                <Text style={LoginPage.aboutRightText}>v1.0.0</Text>
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
                    <Text style={LoginPage.aboutRightTextUnderlined}>
                      BADERproductions
                    </Text>
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
                    <Text style={LoginPage.aboutRightTextUnderlined}>
                      React Native v0.63.3
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Overlay>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          enabled={false}
          style={LoginPage.KeyboardAvoidingView}
          behavior={'padding'}>
          <View style={LoginPage.container}>
            <View style={LoginPage.profilePicContainer}>
              <FastImage
                style={LoginPage.picture}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../assets/logo.png')}
              />
            </View>
            <View style={LoginPage.form}>
              <Input
                style={LoginPage.input}
                containerStyle={LoginPage.inputContainer}
                inputContainerStyle={LoginPage.inputContainerInner}
                keyboardType="default"
                selectionColor="grey"
                underlineColorAndroid={'white'}
                autoCapitalize="none"
                placeholder="Nume utilizator"
                placeholderTextColor={'grey'}
                leftIcon={
                  <FontAwesomeIcon
                    size={22}
                    color={'white'}
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
                      color={'white'}
                      icon={faInfoCircle}
                    />
                  </Pressable>
                }
                onChangeText={(user) => setUser(user)}
                value={user}
              />
              <Input
                style={LoginPage.input}
                containerStyle={LoginPage.inputContainer}
                inputContainerStyle={LoginPage.inputContainerInner}
                leftIcon={
                  <FontAwesomeIcon size={22} color={'white'} icon={faKey} />
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
                      color={'white'}
                      icon={faInfoCircle}
                    />
                  </Pressable>
                }
                selectionColor="grey"
                underlineColorAndroid={'white'}
                autoCapitalize="none"
                placeholder="Passkey"
                placeholderTextColor={'grey'}
                onChangeText={(pass) => setPass(pass)}
                value={pass}
              />
              {latestError && (
                <Text style={LoginPage.error}>
                  Utilizator sau passkey incorect
                </Text>
              )}
              {invalid && (
                <Text style={LoginPage.error}>
                  Introdu numele de utilizator şi codul passkey
                </Text>
              )}
              {invalidUser && (
                <Text style={LoginPage.error}>
                  Introdu numele de utilizator
                </Text>
              )}
              {invalidPass && (
                <Text style={LoginPage.error}>Introdu codul passkey</Text>
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
                    <Text style={LoginPage.btnText}>Logare</Text>
                  )}
                </Pressable>
              </View>
            </View>
            <View style={LoginPage.aboutBtnContainer}>
              <Pressable
                style={LoginPage.aboutPressable}
                android_ripple={{
                  color: 'white',
                  borderless: false,
                }}
                onPress={() => setAboutModal(true)}>
                <Text style={LoginPage.aboutText}>About</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const LoginPage = EStyleSheet.create({
  // user pass info overlay
  dataOverlay: {
    width: '90%',
    height: '30%',
    backgroundColor: MAIN_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openText: {color: 'white', fontWeight: 'bold'},
  filelistPressable: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: MAIN_DARK,
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
  aboutLeftText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: '0.5rem', height: '0.5rem'},
    textShadowRadius: '0.5rem',
  },
  aboutRightText: {
    color: ACCENT_COLOR,
    textShadowColor: 'black',
    textShadowOffset: {width: '0.5rem', height: '0.5rem'},
    textShadowRadius: '0.5rem',
  },
  aboutRightTextUnderlined: {
    color: ACCENT_COLOR,
    textDecorationLine: 'underline',
    textShadowColor: 'black',
    textShadowOffset: {width: '0.5rem', height: '0.5rem'},
    textShadowRadius: '0.5rem',
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
    paddingTop: StatusBar.currentHeight,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: MAIN_DARK,
  },
  profilePicContainer: {
    width: '100%',
    height: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    height: '60%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  picture: {
    width: '240rem',
    height: '240rem',
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
  input: {
    height: '40rem',
    color: 'white',
    fontSize: '12rem',
  },
  error: {
    textAlign: 'center',
    width: '60%',
    color: 'red',
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
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontWeight: 'bold',
    fontSize: '13rem',
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
  aboutText: {color: 'white'},
});
