/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView,
    Text,
    Platform,
} from 'react-native';
import { Input } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from '../redux/actions';
// Forms
import * as yup from 'yup';
import { Formik } from 'formik';
// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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
    ACCENT_COLOR,
    statusHeight,
    PressableOpacity,
    getColor,
    addMediaPrefix,
} from '../assets/variables';
import { RO, EN } from '../assets/lang';

export default function LoginTest() {
    // Redux
    const dispatch = useDispatch();
    const {
        lightTheme,
        listLatest,
        latestError,
        fontSizes,
        enLang,
        hasNotch,
        variables,
    } = useSelector((state) => state.appConfig);
    // State
    const [errorMsg, setErrorMsg] = useState(null);
    const [isKeyboard, setIsKeyboard] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [isNetReachable, setIsNetReachable] = useState(true);
    const [showNetworkAlertTextOn] = useState(new Animated.Value(0));
    const [showNetworkAlertTextOff] = useState(new Animated.Value(0));
    const [showNetworkAlertOn] = useState(
        new Animated.Value(
            Platform.OS === 'ios' && hasNotch ? -statusHeight * 3 : statusHeight * 3,
        ),
    );
    const [showNetworkAlertOff] = useState(
        new Animated.Value(
            Platform.OS === 'ios' && hasNotch ? -statusHeight * 3 : statusHeight * 3,
        ),
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
        if (latestError !== null && latestError !== undefined) {
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

        scrollRef.current.scrollTo({ y: height, animated: true });

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboard(true);
                scrollRef.current.scrollTo({ y: height / 6.2, animated: true });
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
            if (Platform.OS === 'ios') {
                if (state.isInternetReachable === null) {
                    setTimeout(() => {
                        if (state.isInternetReachable) {
                            setIsNetReachable(true);
                        } else {
                            setIsNetReachable(false);
                        }
                    }, 1000);
                } else {
                    if (state.isInternetReachable) {
                        if (netRef.current) {
                            setIsNetReachable(true);
                            netOn();
                        } else {
                            netRef.current = true;
                        }
                    } else {
                        setIsNetReachable(false);
                        netOff();
                    }
                }
            } else {
                if (state.isInternetReachable) {
                    if (netRef.current) {
                        setIsNetReachable(true);
                        netOn();
                    } else {
                        netRef.current = true;
                    }
                } else {
                    setIsNetReachable(false);
                    netOff();
                }
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
        await AsyncStorage.setItem('username', value0);
        await AsyncStorage.setItem('passkey', value1);
    };

    const handleLogin = async (user, pass) => {
        Keyboard.dismiss();
        if (isNetReachable) {
            setLoginLoading(true);
            storeData(user, pass);
            dispatch(AppConfigActions.getTestLogin(user, pass));
        } else {
            netOff();
        }
    };

    const switchLangRo = async () => {
        const currentLang = await AsyncStorage.getItem('enLang');
        if (currentLang === 'true') {
            await AsyncStorage.setItem('enLang', 'false');
            dispatch(AppConfigActions.toggleEnLang());
        }
    };

    const switchLangEn = async () => {
        const currentLang = await AsyncStorage.getItem('enLang');
        if (currentLang === 'false') {
            await AsyncStorage.setItem('enLang', 'true');
            dispatch(AppConfigActions.toggleEnLang());
        }
    };

    const netOn = () => {
        setTimeout(() => {
            Animated.timing(showNetworkAlertOn, {
                toValue: Platform.OS === 'ios' && hasNotch ? statusHeight * 1.5 : 0,
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
                toValue:
                    Platform.OS === 'ios' && hasNotch
                        ? -statusHeight * 1.5
                        : statusHeight,
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
                toValue: Platform.OS === 'ios' && hasNotch ? statusHeight * 1.5 : 0,
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
                toValue:
                    Platform.OS === 'ios' && hasNotch
                        ? -statusHeight * 1.5
                        : statusHeight,
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

    const { CDN_URL, LOGIN_LOGO, ICONS } = variables || {};
    const { roIcon, enIcon } = ICONS || {};

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
                        style={{ flex: 1 }}
                        enabled={false}
                        behavior={'padding'}>
                        <View
                            style={[
                                LoginPage.container,
                                {
                                    backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
                                    height:
                                        Platform.OS === 'ios' && hasNotch
                                            ? height
                                            : height + statusHeight,
                                    paddingBottom:
                                        Platform.OS === 'ios'
                                            ? isKeyboard
                                                ? height / 3
                                                : statusHeight
                                            : statusHeight * 2,
                                },
                            ]}>
                            <View style={LoginPage.profilePicContainer}>
                                <FastImage
                                    style={LoginPage.picture}
                                    resizeMode={FastImage.resizeMode.contain}
                                    source={{
                                        uri: CDN_URL
                                            ? `${CDN_URL}/${LOGIN_LOGO}`
                                            : addMediaPrefix('filelist.png'),
                                    }}
                                />
                            </View>
                            <View
                                style={[
                                    LoginPage.form,
                                    { paddingTop: Platform.OS === 'ios' && hasNotch ? 0 : 16 },
                                ]}>
                                <Formik
                                    initialValues={{ user: '', pass: '' }}
                                    onSubmit={(values) => handleLogin(values.user, values.pass)}
                                    validationSchema={yup.object().shape({
                                        user: yup
                                            .string()
                                            .min(1)
                                            .required(enLang ? EN.userREQ : RO.userREQ),
                                        pass: yup
                                            .string()
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
                                                underlineColorAndroid="transparent"
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
                                                        color={getColor(lightTheme)}
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
                                                underlineColorAndroid="transparent"
                                                onSubmitEditing={handleSubmit}
                                                returnKeyType={'go'}
                                                selectionColor="grey"
                                                autoCapitalize="none"
                                                placeholder="Passkey"
                                                placeholderTextColor={'grey'}
                                                leftIcon={
                                                    <FontAwesomeIcon
                                                        size={22}
                                                        color={getColor(lightTheme)}
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
                                                        marginTop:
                                                            (Platform.OS === 'ios' && hasNotch) ||
                                                                (Platform.OS === 'ios' && !hasNotch)
                                                                ? 8
                                                                : 48,
                                                    },
                                                ]}>
                                                {loginLoading ? (
                                                    <ActivityIndicator
                                                        size={Platform.OS === 'ios' ? 'small' : 'large'}
                                                        color={ACCENT_COLOR}
                                                    />
                                                ) : (
                                                    <PressableOpacity
                                                        activeOpacity={0.5}
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
                                                    </PressableOpacity>
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
                <View
                    style={[
                        LoginPage.langView,
                        {
                            bottom:
                                Platform.OS === 'ios' && hasNotch
                                    ? statusHeight / 3
                                    : statusHeight,
                        },
                    ]}>
                    <TouchableOpacity
                        onPress={switchLangRo}
                        style={{
                            width: 30,
                            height: 30,
                        }}>
                        <FastImage
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={FastImage.resizeMode.contain}
                            source={{ uri: CDN_URL ? `${CDN_URL}/${roIcon}` : addMediaPrefix('ro_cf908c3a13.png') }}
                        />
                    </TouchableOpacity>
                    <View
                        style={{
                            height: '15%',
                            width: 0.5,
                            backgroundColor: getColor(lightTheme),
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
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={FastImage.resizeMode.contain}
                            source={{ uri: CDN_URL ? `${CDN_URL}/${enIcon}` : addMediaPrefix('en_eb0fd1fe87.png') }}
                        />
                    </TouchableOpacity>
                </View>
            )}
            {isNetReachable ? (
                <Animated.View
                    style={[
                        LoginPage.networkAlertContainer,
                        {
                            height:
                                Platform.OS === 'ios' && hasNotch
                                    ? statusHeight * 1.5
                                    : statusHeight,
                            backgroundColor: 'limegreen',
                            bottom: Platform.OS === 'ios' && hasNotch ? height : 0,
                            justifyContent:
                                Platform.OS === 'ios' && hasNotch ? 'flex-end' : 'center',
                            paddingBottom: Platform.OS === 'ios' && hasNotch ? 6 : 0,
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
                            height:
                                Platform.OS === 'ios' && hasNotch
                                    ? statusHeight * 1.5
                                    : statusHeight,
                            backgroundColor: 'crimson',
                            bottom: Platform.OS === 'ios' && hasNotch ? height : 0,
                            justifyContent:
                                Platform.OS === 'ios' && hasNotch ? 'flex-end' : 'center',
                            paddingBottom: Platform.OS === 'ios' && hasNotch ? 6 : 0,
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
        width,
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
        paddingLeft: '0.6rem',
        borderBottomColor: 'transparent',
    },
    btnContainer: {
        width: width / 6,
        height: width / 6,
        borderRadius: width / 6 / 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
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
        width: '100%',
        alignItems: 'center',
    },
});
