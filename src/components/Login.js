import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Pressable,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  Dimensions,
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

// Variables
import {
  width,
  height,
  MAIN_LIGHT,
  MAIN_DARK,
  ACCENT_COLOR,
  statusHeight,
} from '../assets/variables';

export default function Login() {
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isNetReachable, setIsNetReachable] = useState(true);
  const [showNetworkAlertTextOn] = useState(new Animated.Value(0));
  const [showNetworkAlertTextOff] = useState(new Animated.Value(0));
  const [showNetworkAlertOn] = useState(new Animated.Value(statusHeight * 3));
  const [showNetworkAlertOff] = useState(new Animated.Value(statusHeight * 3));

  // Redux
  const dispatch = useDispatch();
  const {lightTheme, listLatest, latestError, fontSizes} = useSelector(
    (state) => state.appConfig,
  );

  // Refs
  const netRef = useRef(false);
  const scrollRef = useRef(null);

  // Component mount
  useEffect(() => {
    dispatch(AppConfigActions.setFonts());
    if (latestError !== null) {
      setLoginLoading(false);
      netOff();
    }
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
    
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setIsKeyboard(true);
          scrollRef.current.scrollTo({y: height / 5.4, animated: true});
        },
      );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboard(false);
      },
    );

    return () => {
      unsubscribe();
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [listLatest, latestError, isNetReachable]);

  // Functions
  const storeData = async (value0, value1) => {
    try {
      await AsyncStorage.setItem('username', value0);
      await AsyncStorage.setItem('passkey', value1);
      const fonts = await AsyncStorage.getItem('fontSizes');
      if (fonts === null) {
        await AsyncStorage.setItem(
          'fontSizes',
          JSON.stringify([6, 8, 10, 11, 12, 13, 14, 16, 22, 50]),
        );
      }
    } catch (e) {
      crashlytics().recordError(e);
    }
  };

  const handleLogin = async (user, pass) => {
    try {
      Keyboard.dismiss();
      if (isNetReachable) {
        setLoginLoading(true);
        await storeData(user, pass);
        dispatch(AppConfigActions.getLatest(user, pass));
      } else {
        netOff();
      }
    } catch (error) {
      crashlytics().recordError(error);
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

  return (
    <>
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
        <SafeAreaView styles={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            ref={scrollRef}
            keyboardShouldPersistTaps={'always'}>
            <KeyboardAvoidingView
              style={{flex: 1}}
              enabled={false}
              behavior={'position'}>
              <View
                style={[
                  LoginPage.container,
                  {
                    backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                    paddingBottom: isKeyboard ? 0 : height / 7,
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
                        .required('Numele de utilizator lipseşte'),
                      pass: yup
                        .string()
                        .min(
                          32,
                          'Codul passkey conţine 32 de caractere şi este diferit de parola contului\nAcest cod se află în zona Profil a contului tău filelist',
                        )
                        .required('Codul passkey lipseşte'),
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
                                fontSizes !== null ? fontSizes[3] : 11,
                              ),
                              color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                            },
                          ]}
                          inputContainerStyle={[
                            LoginPage.inputContainer,
                            {
                              borderBottomColor: lightTheme
                                ? MAIN_DARK
                                : MAIN_LIGHT,
                            },
                          ]}
                          onSubmitEditing={handleSubmit}
                          selectionColor="grey"
                          autoCapitalize="none"
                          placeholder="Utilizator"
                          placeholderTextColor={'grey'}
                          blurOnSubmit={false}
                          leftIcon={
                            <FontAwesomeIcon
                              size={22}
                              color={lightTheme ? MAIN_DARK : 'white'}
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
                                fontSizes !== null ? fontSizes[3] : 11,
                              ),
                              color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
                            },
                          ]}
                          inputContainerStyle={[
                            LoginPage.inputContainer,
                            {
                              borderBottomColor: lightTheme
                                ? MAIN_DARK
                                : MAIN_LIGHT,
                            },
                          ]}
                          onSubmitEditing={handleSubmit}
                          selectionColor="grey"
                          autoCapitalize="none"
                          placeholder="Passkey"
                          placeholderTextColor={'grey'}
                          leftIcon={
                            <FontAwesomeIcon
                              size={22}
                              color={lightTheme ? MAIN_DARK : 'white'}
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
                        <View style={LoginPage.btnContainer}>
                          <Pressable
                            disabled={loginLoading}
                            onPress={handleSubmit}
                            android_ripple={{
                              color: 'white',
                              borderless: false,
                            }}
                            style={LoginPage.btn}>
                            {loginLoading ? (
                              <ActivityIndicator size="large" color={'white'} />
                            ) : (
                              <FontAwesomeIcon
                                size={26}
                                color={'white'}
                                icon={faArrowRight}
                              />
                            )}
                          </Pressable>
                        </View>
                      </>
                    )}
                  </Formik>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      {isNetReachable ? (
        <Animated.View
          style={[
            LoginPage.networkAlertContainer,
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
            LoginPage.networkAlertContainer,
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
    </>
  );
}

const LoginPage = EStyleSheet.create({
  container: {
    width: width,
    height: height + statusHeight,
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
    fontSize: '0.55rem',
    paddingLeft: '0.5rem',
    textAlign: 'left',
    color: 'crimson',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '0.5rem',
  },
  inputContainerInner: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    paddingLeft: '1rem',
  },
  btnContainer: {
    elevation: 5,
    zIndex: 5,
    width: statusHeight * 2.3,
    height: statusHeight * 2.3,
    borderRadius: (statusHeight * 2.3) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3rem',
  },
  btn: {
    width: statusHeight * 2.3,
    height: statusHeight * 2.3,
    backgroundColor: ACCENT_COLOR,
    borderRadius: (statusHeight * 2.3) / 2,
    justifyContent: 'center',
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
