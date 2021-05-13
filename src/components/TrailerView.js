/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Keyboard,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useIsFocused} from '@react-navigation/native';
import {
  ACCENT_COLOR,
  MAIN_LIGHT,
  statusHeight,
  PressableOpacity,
} from '../assets/variables';
import Orientation from 'react-native-orientation-locker';
// Redux
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Adjust from './AdjustText';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export default function TrailerView({route, navigation}) {
  const isFocused = useIsFocused();
  const [orientation, setOrientation] = useState('');
  const {lightTheme, hasNotch} = useSelector((state) => state.appConfig);
  // Component mount
  useEffect(() => {
    // Orientation listener
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setOrientation('PORTRAIT');
      } else {
        setOrientation('LANDSCAPE');
      }
    });
    // Screen focus listener
    const screenFocusListener = navigation.addListener('focus', () => {
      // Unlock screen orientation
      Orientation.unlockAllOrientations();
      // Dismiss keyboard everytime screen gets focus
      Keyboard.dismiss();
    });
    const screenBlurListener = navigation.addListener('beforeRemove', () => {
      // Lock screen orientation to portrait
      Orientation.lockToPortrait();
      // Reset trailerLink param
      navigation.setParams({trailerLink: undefined, autoplay: undefined});
    });
    return () => {
      Dimensions.removeEventListener('change', ({window: {width, height}}) => {
        if (width < height) {
          setOrientation('PORTRAIT');
        } else {
          setOrientation('LANDSCAPE');
        }
      });
      screenFocusListener();
      screenBlurListener();
    };
  }, [navigation]);

  // Functions
  const handleBack = () => {
    Orientation.lockToPortrait();
    navigation.goBack();
  };

  return (
    <>
      {isFocused && orientation === 'LANDSCAPE' ? (
        <StatusBar backgroundColor={'black'} translucent={false} />
      ) : null}
      {!route.params ||
      !route.params.trailerLink ||
      route.params.autoplay === undefined ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
          }}
        />
      ) : (
        <>
          {orientation === 'LANDSCAPE' ? null : (
            <View
              style={{
                height:
                  Platform.OS === 'ios' && !hasNotch
                    ? statusHeight * 5
                    : statusHeight * 3.5,
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
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 2.3
                      : Platform.OS === 'ios' && hasNotch
                      ? statusHeight * 2.2
                      : statusHeight * 1.6,
                  left: statusHeight / 1.5,
                }}
                android_ripple={{
                  color: 'white',
                  borderless: true,
                  radius: statusHeight / 1.3,
                }}
                onPress={handleBack}>
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
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 1.1
                      : Platform.OS === 'ios' && hasNotch
                      ? statusHeight * 2.1
                      : statusHeight * 1.1,
                  marginBottom: statusHeight / 2,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                IMDb Trailer
              </Text>
            </View>
          )}
          <WebView
            source={{
              uri: route.params.trailerLink,
            }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={!route.params.autoplay || false}
          />
        </>
      )}
    </>
  );
}
