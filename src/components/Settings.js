/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Text, View, Switch, Pressable, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Divider from 'react-native-paper/lib/commonjs/components/Divider';
import RadioButton from 'react-native-paper/lib/commonjs/components/RadioButton/RadioButton';
// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
// Responsiveness
import Adjust from './AdjustText';
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
// Variables & assets
import {statusHeight, MAIN_LIGHT, ACCENT_COLOR} from '../assets/variables';
import ro from '../assets/ro.png';
import en from '../assets/en.png';
import {RO, EN} from '../assets/lang';

export default function Settings({navigation}) {
  // State
  const [checked, setChecked] = React.useState('first');
  // Redux
  const dispatch = useDispatch();
  const {autoplay, lightTheme, fontSizes, enLang} = useSelector(
    (state) => state.appConfig,
  );
  // Component mount
  useEffect(() => {
    fontSizes[0] === 4 && setChecked('first');
    fontSizes[0] === 6 && setChecked('second');
    fontSizes[0] === 8 && setChecked('third');
  }, [fontSizes]);
  // Functions
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
  const toggleFontS = () => {
    toggleFontSize('S');
  };
  const toggleFontM = () => {
    toggleFontSize('M');
  };
  const toggleFontL = () => {
    toggleFontSize('L');
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
  const goBack = () => {
    navigation.navigate('Home');
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
            top: statusHeight * 1.3,
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
            marginTop: statusHeight / 1.3,
            marginBottom: statusHeight / 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {enLang ? EN.settings : RO.settings}
        </Text>
      </View>
      <ScrollView
        style={{flex: 1, backgroundColor: lightTheme ? MAIN_LIGHT : 'black'}}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: Adjust(12),
            fontWeight: 'bold',
            marginBottom: 2,
            marginTop: statusHeight,
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
        <Divider style={{backgroundColor: lightTheme ? 'black' : 'silver'}} />
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
        <Divider style={{backgroundColor: lightTheme ? 'black' : 'silver'}} />
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
        <Divider style={{backgroundColor: lightTheme ? 'black' : 'silver'}} />
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
        <Divider style={{backgroundColor: lightTheme ? 'black' : 'silver'}} />
      </ScrollView>
    </>
  );
}
