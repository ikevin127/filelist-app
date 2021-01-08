/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  Platform,
} from 'react-native';
import {Input} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';

// Forms
import * as yup from 'yup';
import {Formik} from 'formik';

// Firebase
import crashlytics from '@react-native-firebase/crashlytics';

// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';

// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faKey,
  faUserLock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import ro from '../assets/ro.png';
import en from '../assets/en.png';

// Variables
import {
  width,
  height,
  MAIN_LIGHT,
  ACCENT_COLOR,
  statusHeight,
} from '../assets/variables';
import {RO, EN} from '../assets/lang';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isNetReachable, setIsNetReachable] = useState(true);
  const [showNetworkAlertTextOn] = useState(new Animated.Value(0));
  const [showNetworkAlertTextOff] = useState(new Animated.Value(0));
  const [showNetworkAlertOn] = useState(new Animated.Value(statusHeight * 3));
  const [showNetworkAlertOff] = useState(new Animated.Value(statusHeight * 3));

  // Redux
  const dispatch = useDispatch();
  const {lightTheme, listLatest, latestError, fontSizes, enLang} = useSelector(
    (state) => state.appConfig,
  );

  // Refs
  const netRef = useRef(false);
  const scrollRef = useRef(null);
  let timeoutRef = useRef(null);

  // Component mount
  useEffect(() => {
    // Set font size
    dispatch(AppConfigActions.setFonts());

    // API Error handling
    if (latestError !== null) {
      if (latestError.response.status === 403) {
        if (latestError.response.data.error.includes('Invalid')) {
          setUserPass();
        } else {
          setFailAuth();
        }
      }

      if (latestError.response.status === 429) {
        setLimitReached();
      }

      if (latestError.response.status === 503) {
        setAPIDown();
      }
    }

    if (Platform.OS === 'android') {
      scrollRef.current.scrollTo({y: height, animated: true});
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboard(true);
        scrollRef.current.scrollTo({y: height / 6.2, animated: true});
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboard(false);
      },
    );

    return () => {
      clearTimeout(timeoutRef);
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [listLatest, latestError]);

  useEffect(() => {
    // Network connection listener
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
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [isNetReachable]);

  // Functions
  const setLimitReached = () => {
    setLoginLoading(false);
    setErrorMsg(enLang ? EN.alert150 : RO.alert150);
    timeoutRef = setTimeout(() => {
      setErrorMsg(null);
    }, 5000);
  };

  const setUserPass = () => {
    setLoginLoading(false);
    setErrorMsg(enLang ? EN.alertUP : RO.alertUP);
    timeoutRef = setTimeout(() => {
      setErrorMsg(null);
    }, 5000);
  };

  const setFailAuth = () => {
    setLoginLoading(false);
    setErrorMsg(enLang ? EN.alertLR : RO.alertLR);
    timeoutRef = setTimeout(() => {
      setErrorMsg(null);
    }, 5000);
  };

  const setAPIDown = () => {
    setLoginLoading(false);
    setErrorMsg(enLang ? EN.alertAPI : RO.alertAPI);
    timeoutRef = setTimeout(() => {
      setErrorMsg(null);
    }, 5000);
  };

  const storeData = async (value0, value1) => {
    try {
      await AsyncStorage.setItem('username', value0);
      await AsyncStorage.setItem('passkey', value1);
      const fonts = await AsyncStorage.getItem('fontSizes');
      if (fonts !== null) {
        await AsyncStorage.setItem(
          'fontSizes',
          JSON.stringify([6, 9, 10, 11, 12, 13, 14, 16, 22, 50]),
        );
      }
    } catch (e) {
      crashlytics().log('login -> storeData()');
      crashlytics().recordError(e);
    }
  };

  const handleLogin = async (user, pass) => {
    try {
      Keyboard.dismiss();
      if (isNetReachable) {
        setLoginLoading(true);
        storeData(user, pass);
        dispatch(AppConfigActions.getLatest(user, pass, 20));
      } else {
        netOff();
      }
    } catch (e) {
      crashlytics().log('login -> handleLogin()');
      crashlytics().recordError(e);
    }
  };

  const switchLangRo = async () => {
    try {
      const currentLang = await AsyncStorage.getItem('enLang');
      if (currentLang === 'true') {
        await AsyncStorage.setItem('enLang', 'false');
        dispatch(AppConfigActions.toggleEnLang());
        ToastAndroid.showWithGravity(
          'Limba: Română',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      }
    } catch (e) {
      crashlytics().log('login -> switchLangRo()');
      crashlytics().recordError(e);
    }
  };

  const switchLangEn = async () => {
    try {
      const currentLang = await AsyncStorage.getItem('enLang');
      if (currentLang === 'false') {
        await AsyncStorage.setItem('enLang', 'true');
        dispatch(AppConfigActions.toggleEnLang());
        ToastAndroid.showWithGravity(
          'Language: English',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      }
    } catch (e) {
      crashlytics().log('login -> switchLangEn()');
      crashlytics().recordError(e);
    }
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

  return (
    <>
      <StatusBar
        barStyle={lightTheme ? 'dark-content' : 'light-content'}
        backgroundColor={
          Platform.Version < 23
            ? lightTheme
              ? 'black'
              : 'transparent'
            : 'transparent'
        }
        translucent={Platform.Version < 23 ? false : true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          bounces={false}
          ref={scrollRef}
          keyboardShouldPersistTaps={'always'}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            enabled={false}
            behavior={'padding'}>
            <View
              style={[
                LoginPage.container,
                {
                  backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
                  height:
                    Platform.OS === 'ios' ? height : height + statusHeight,
                  paddingBottom:
                    Platform.OS === 'ios'
                      ? isKeyboard
                        ? height / 5.5
                        : 0
                      : statusHeight * 2,
                },
              ]}>
              <View style={LoginPage.profilePicContainer}>
                <FastImage
                  style={LoginPage.picture}
                  resizeMode={FastImage.resizeMode.contain}
                  source={require('../assets/logo.png')}
                />
              </View>
              <View style={LoginPage.form}>
                <Formik
                  initialValues={{user: '', pass: ''}}
                  onSubmit={(values) => handleLogin(values.user, values.pass)}
                  validationSchema={yup.object().shape({
                    user: yup
                      .string()
                      .min(1)
                      .required(enLang ? EN.userREQ : RO.userREQ),
                    pass: yup
                      .string()
                      .min(32, enLang ? EN.passVAL : RO.passVAL)
                      .required(enLang ? EN.passREQ : RO.passREQ),
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
                          LoginPage.inputStyle,
                          {
                            fontSize: Adjust(
                              fontSizes !== null ? fontSizes[4] : 12,
                            ),
                            color: lightTheme ? 'black' : MAIN_LIGHT,
                          },
                        ]}
                        inputContainerStyle={[
                          LoginPage.inputContainer,
                          {
                            borderBottomColor: lightTheme
                              ? 'black'
                              : MAIN_LIGHT,
                          },
                        ]}
                        onSubmitEditing={handleSubmit}
                        returnKeyType={'go'}
                        selectionColor="grey"
                        autoCapitalize="none"
                        placeholder={enLang ? EN.user : RO.user}
                        placeholderTextColor={'grey'}
                        blurOnSubmit={false}
                        leftIcon={
                          <FontAwesomeIcon
                            size={22}
                            color={lightTheme ? 'black' : 'white'}
                            icon={faUserLock}
                          />
                        }
                        defaultValue=""
                        value={values.user}
                        onChangeText={handleChange('user')}
                        onBlur={() => setFieldTouched('user')}
                      />
                      {touched.user && errors.user && (
                        <Text style={LoginPage.error}>{errors.user}</Text>
                      )}
                      <Input
                        style={[
                          LoginPage.inputStyle,
                          {
                            fontSize: Adjust(
                              fontSizes !== null ? fontSizes[4] : 12,
                            ),
                            color: lightTheme ? 'black' : MAIN_LIGHT,
                          },
                        ]}
                        inputContainerStyle={[
                          LoginPage.inputContainer,
                          {
                            borderBottomColor: lightTheme
                              ? 'black'
                              : MAIN_LIGHT,
                          },
                        ]}
                        onSubmitEditing={handleSubmit}
                        returnKeyType={'go'}
                        selectionColor="grey"
                        autoCapitalize="none"
                        placeholder="Passkey"
                        placeholderTextColor={'grey'}
                        leftIcon={
                          <FontAwesomeIcon
                            size={22}
                            color={lightTheme ? 'black' : 'white'}
                            icon={faKey}
                          />
                        }
                        value={values.pass}
                        onChangeText={handleChange('pass')}
                        onBlur={() => setFieldTouched('pass')}
                      />
                      {touched.pass && errors.pass && (
                        <Text style={LoginPage.error}>{errors.pass}</Text>
                      )}
                      {errorMsg && (
                        <Text style={LoginPage.error}>{errorMsg}</Text>
                      )}
                      <View
                        style={[
                          LoginPage.btnContainer,
                          {
                            elevation: loginLoading ? 0 : 2,
                            zIndex: loginLoading ? 0 : 2,
                          },
                        ]}>
                        {loginLoading ? (
                          <ActivityIndicator
                            size={Platform.OS === 'ios' ? 'small' : 'large'}
                            color={ACCENT_COLOR}
                          />
                        ) : (
                          <Pressable
                            disabled={loginLoading}
                            onPress={handleSubmit}
                            android_ripple={{
                              color: 'white',
                              borderless: false,
                            }}
                            style={LoginPage.btn}>
                            <FontAwesomeIcon
                              size={26}
                              color={'white'}
                              icon={faArrowRight}
                            />
                          </Pressable>
                        )}
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableWithoutFeedback>
      {isKeyboard ? null : (
        <View style={LoginPage.langView}>
          <TouchableOpacity
            onPress={switchLangRo}
            style={{
              width: 30,
              height: 30,
            }}>
            <FastImage
              style={{width: '100%', height: '100%'}}
              resizeMode={FastImage.resizeMode.contain}
              source={ro}
            />
          </TouchableOpacity>
          <View
            style={{
              height: '15%',
              width: 0.5,
              backgroundColor: lightTheme ? 'black' : 'white',
              marginHorizontal: 20,
            }}
          />
          <TouchableOpacity
            onPress={switchLangEn}
            style={{
              width: 30,
              height: 30,
            }}>
            <FastImage
              style={{width: '100%', height: '100%'}}
              resizeMode={FastImage.resizeMode.contain}
              source={en}
            />
          </TouchableOpacity>
        </View>
      )}
      {isNetReachable ? (
        <Animated.View
          style={[
            LoginPage.networkAlertContainer,
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
            LoginPage.networkAlertContainer,
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
    </>
  );
}

const LoginPage = EStyleSheet.create({
  container: {
    width: width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: width / 2,
    height: width / 2,
    justifyContent: 'center',
  },
  form: {
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '1rem',
  },
  error: {
    width: '100%',
    paddingLeft: '0.5rem',
    textAlign: 'left',
    color: 'crimson',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '0.5rem',
  },
  inputStyle: {
    paddingLeft: '1rem',
  },
  btnContainer: {
    width: width / 6,
    height: width / 6,
    borderRadius: width / 6 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3rem',
  },
  btn: {
    width: width / 6,
    height: width / 6,
    backgroundColor: ACCENT_COLOR,
    borderRadius: width / 6 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langView: {
    position: 'absolute',
    height: statusHeight * 2,
    bottom: statusHeight,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
