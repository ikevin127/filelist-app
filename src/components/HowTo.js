/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  BackHandler,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
// Redux
import {useSelector} from 'react-redux';
// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
// Variables
import {
  width,
  height,
  statusHeight,
  MAIN_LIGHT,
  ACCENT_COLOR,
} from '../assets/variables';
import {RO, EN} from '../assets/lang';

export default function HowTo({navigation}) {
  // State
  const [activeSections, setActiveSections] = useState([]);
  const {lightTheme, fontSizes, enLang} = useSelector(
    (state) => state.appConfig,
  );
  // Accordion info
  const INFO = [
    {
      title: enLang ? EN.infoT1 : RO.infoT1,
      content: enLang ? EN.infoC1 : RO.infoC1,
    },
    {
      title: enLang ? EN.infoT2 : RO.infoT2,
      content: enLang ? EN.infoC2 : RO.infoC2,
    },
    {
      title: enLang ? EN.infoT6 : RO.infoT6,
      content: enLang ? EN.infoC6 : RO.infoC6,
    },
    {
      title: enLang ? EN.infoT7 : RO.infoT7,
      content: enLang ? EN.infoC7 : RO.infoC7,
    },
  ];

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, [navigation]);

  // Functions
  const goBack = () => navigation.goBack();

  // eslint-disable-next-line no-shadow
  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  const _renderHeader = (section) => {
    return (
      <View>
        <Text
          style={{
            fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
            color: ACCENT_COLOR,
            fontWeight: 'bold',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={HowToStyle.renderContent}>
        <Text
          style={{
            color: lightTheme ? 'black' : 'white',
            fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
          }}>
          {section.content}
        </Text>
      </View>
    );
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
        <Pressable
          style={{
            position: 'absolute',
            top: statusHeight * 1.6,
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
            marginTop: statusHeight * 1.1,
            marginBottom: statusHeight / 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Info
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        overScrollMode={'never'}
        bounces={false}
        style={{backgroundColor: lightTheme ? MAIN_LIGHT : 'black'}}
        contentContainerStyle={[
          HowToStyle.infoOverlayScrollView,
          {
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
            paddingBottom:
              Platform.OS === 'android' ? statusHeight : statusHeight * 1.5,
          },
        ]}>
        <Accordion
          sections={INFO}
          containerStyle={HowToStyle.accordionContainer}
          expandMultiple
          underlayColor={lightTheme ? MAIN_LIGHT : '#303030'}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </ScrollView>
    </>
  );
}

const HowToStyle = EStyleSheet.create({
  profileContainer: {
    top: 0,
    width: '100%',
    height: width / 2,
    position: 'absolute',
    paddingTop: statusHeight * 2,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profilePicContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicView: {
    width: width / 5,
    height: width / 5,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 1.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '0.3rem',
  },
  usernameView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  settingsOverlayMainContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? statusHeight / 3 : 0,
  },
  settingsOverlayContainer: {
    width: '100%',
    height: width / 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  settingsOverlayPressable: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: statusHeight / 1.5,
  },
  settingsOverlayText: {
    fontWeight: 'bold',
    marginLeft: statusHeight / 1.5,
  },
  infoOverlay: {
    height: height + statusHeight / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  infoOverlayCloseContainer: {
    width,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlayScrollView: {
    width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  infoTitleContainer: {
    width: '100%',
    padding: '1rem',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  accordionContainer: {
    width: '100%',
    paddingHorizontal: '1rem',
    paddingVertical: '0.8rem',
  },
  renderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  btnMainContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    elevation: 2,
    zIndex: 2,
    width: width / 8,
    height: width / 8,
    borderRadius: width / 8 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
  },
  btn: {
    width: width / 8,
    height: width / 8,
    backgroundColor: ACCENT_COLOR,
    borderRadius: width / 8 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
