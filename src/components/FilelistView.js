/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Text, View, Keyboard, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  ACCENT_COLOR,
  statusHeight,
  PressableOpacity,
} from '../assets/variables';
import Orientation from 'react-native-orientation-locker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Adjust from './AdjustText';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export default function FilelistView({navigation}) {
  // Component mount
  useEffect(() => {
    // Screen focus listener
    const screenFocusListener = navigation.addListener('focus', () => {
      // Unlock screen orientation
      Orientation.lockToPortrait();
      // Dismiss keyboard everytime screen gets focus
      Keyboard.dismiss();
    });
    return () => {
      screenFocusListener();
    };
  }, [navigation]);

  // Functions
  const handleBack = () => {
    Orientation.lockToPortrait();
    navigation.goBack();
  };

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
              Platform.OS === 'ios' ? statusHeight * 2 : statusHeight * 1.1,
            marginBottom: statusHeight / 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Filelist Web
        </Text>
      </View>
      <WebView
        source={{
          uri: 'https://filelist.io/forums.php',
        }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={true}
      />
    </>
  );
}
