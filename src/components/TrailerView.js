/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Keyboard,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native';
import {
  getColor,
  statusHeight,
} from '../assets/variables.js';
import Orientation from 'react-native-orientation-locker';
// Redux
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Adjust from './AdjustText';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import TrailerViewStatusBar from '../templates/TrailerViewStatusBar';
import { EN, RO } from '../assets/lang';
import TrailerViewHeader from '../templates/TrailerViewHeader';
import WebViewLoadingScreen from '../templates/WebViewLoadingScreen';

export default function TrailerView({ route, navigation }) {
  const isFocused = useIsFocused();
  const [orientation, setOrientation] = useState('portrait');
  const [webviewLoading, setWebviewLoading] = useState(true);
  const { enLang, lightTheme, hasNotch } = useSelector((state) => state.appConfig);
  // Component mount
  useEffect(() => {
    // Unlock screen orientation
    Orientation.unlockAllOrientations();
    // Orientation listener
    Orientation.addOrientationListener(onOrientationChange);
    // Screen focus listener
    const screenFocusListener = navigation.addListener('focus', () => {
      // Dismiss keyboard everytime screen gets focus
      Keyboard.dismiss();
    });
    const screenBlurListener = navigation.addListener('beforeRemove', () => {
      // Reset trailer param
      navigation.setParams({ trailer: undefined, autoplay: undefined });
    });
    return () => {
      // Lock screen orientation to portrait
      Orientation.lockToPortrait();
      // Remove rientation listener on unmount
      Orientation.removeOrientationListener(onOrientationChange);
      screenFocusListener();
      screenBlurListener();
    };
  }, [navigation]);

  const onOrientationChange = (result) => setOrientation(result?.toLowerCase());
  const onWebviewLoad = () => setWebviewLoading(false);

  const isPortrait = orientation.includes('portrait');
  const focusedLandscape = isFocused && !isPortrait;
  const netErrorText = enLang ? EN.imdbNetErrH : RO.imdbNetErrH;

  return (
    <>
      <TrailerViewStatusBar focusedLandscape={ focusedLandscape } />
      {!route.params ||
        !route.params.trailer ||
        route.params.autoplay === undefined ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: lightTheme ? '#E8E6E6' : 'black',
            paddingBottom: statusHeight * 2,
          }}>
          <FontAwesomeIcon
            size={Adjust(100)}
            style={{ marginBottom: statusHeight / 5 }}
            color={getColor(lightTheme)}
            icon={faExclamationTriangle}
          />
          <Text
            style={{
              fontSize: Adjust(20),
              fontWeight: 'bold',
              textAlign: 'center',
              color: getColor(lightTheme),
              paddingHorizontal: statusHeight,
              marginBottom: statusHeight / 5,
            }}>
            {netErrorText}
          </Text>
        </View>
      ) : (
        <>
          <TrailerViewHeader navigation={ navigation } isPortrait={ isPortrait } hasNotch={ hasNotch } />
          { webviewLoading && <WebViewLoadingScreen isPortrait={ isPortrait } lightTheme={ lightTheme } hasNotch={ hasNotch } /> }
          <WebView
            useWebKit
            allowsInlineMediaPlayback
            onLoad={ onWebviewLoad }
            source={{
              uri: route.params.trailer,
            }}
            mediaPlaybackRequiresUserAction={ !route.params.autoplay || false }
          />
        </>
      )}
    </>
  );
}
