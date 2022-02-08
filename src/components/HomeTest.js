/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Animated,
    Alert,
    StatusBar,
    Platform,
    Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from '../redux/actions';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';
// Variables & assets
import {
    width,
    height,
    MAIN_LIGHT,
    ACCENT_COLOR,
    statusHeight,
} from '../assets/variables';
import { RO, EN } from '../assets/lang';

export default function Home({ navigation }) {
    // Redux
    const dispatch = useDispatch();
    const {
        fontSizes,
        latestError,
        enLang,
        hasNotch,
    } = useSelector((state) => state.appConfig);
    // State
    const netRef = useRef(false);
    const [isNetReachable, setIsNetReachable] = useState(true);
    // Animations
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

    // Component mount
    useEffect(() => {
        // Set font sizes & clear latestError if any
        dispatch(AppConfigActions.setFonts());
        dispatch(AppConfigActions.latestError());
        // API error handling
        if (latestError !== null && latestError !== undefined) {
            if (latestError.response.status === 429) {
                setLimitReached();
            }
            if (latestError.response.status === 503) {
                setAPIDown();
            }
        }
        // Screen focus listener
        const screenFocusListener = navigation.addListener('focus', () => {
            // Dismiss keyboard everytime screen is focused
            Keyboard.dismiss();
        });

        return () => {
            screenFocusListener();
        };
        // eslint-disable-next-line  react-hooks/exhaustive-deps
    }, [latestError]);

    useEffect(() => {
        // Connection listener
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

    // FUNCTIONS
    const setLimitReached = () =>
        Alert.alert(
            'Info',
            enLang ? EN.alert150R : RO.alert150R,
            [
                {
                    text: 'OK',
                    onPress: () => { },
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );

    const setAPIDown = () =>
        Alert.alert(
            'Info',
            enLang ? EN.alertAPI : RO.alertAPI,
            [
                {
                    text: 'OK',
                    onPress: () => { },
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );

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
                        dispatch(AppConfigActions.testLogout());
                    },
                },
                {
                    text: enLang ? EN.no : RO.no,
                    onPress: () => { },
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );
    };

    // Component render return
    return (
        <>
            <StatusBar
                barStyle='light-content'
                backgroundColor={ACCENT_COLOR}
                translucent={false}
            />
            <View
                style={[
                    HomePage.mainSafeAreaView,
                    {
                        backgroundColor: MAIN_LIGHT,
                    },
                ]}>
                <Text>Filelist App Test</Text>
                <TouchableOpacity
                    style={{
                        marginTop: statusHeight,
                        width: width / 3,
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
                        style={{
                            fontSize: Adjust(14),
                            color: 'black',
                        }}>
                        Logout
                    </Text>
                </TouchableOpacity>
                {isNetReachable ? (
                    <Animated.View
                        style={[
                            HomePage.networkAlertContainer,
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
                            HomePage.networkAlertContainer,
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
            </View>
        </>
    );
}

const HomePage = EStyleSheet.create({
    mainSafeAreaView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    networkAlertContainer: {
        elevation: 10,
        zIndex: 10,
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
    },
});
