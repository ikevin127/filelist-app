/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faSignOutAlt,
  faInfoCircle,
  faDirections,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
// Variables
import {
  width,
  height,
  statusHeight,
  MAIN_LIGHT,
  ACCENT_COLOR,
} from '../assets/variables';
import {RO, EN} from '../assets/lang';

export default function LeftDrawer({navigation}) {
  // State
  const [user, setUser] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  // Redux
  const dispatch = useDispatch();
  const {appInfo, lightTheme, fontSizes, enLang} = useSelector(
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
  ];
  // Component mount
  useEffect(() => {
    // Get Username for display
    getCurrentUser();
  }, []);
  // Functions
  // eslint-disable-next-line no-shadow
  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };
  const getCurrentUser = async () => {
    const currentUser = await AsyncStorage.getItem('username');
    if (currentUser !== null) {
      setUser(currentUser);
    }
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
            navigation.closeDrawer();
            await AsyncStorage.multiRemove(keys);
            dispatch(AppConfigActions.latestError());
            dispatch(AppConfigActions.retrieveLatest());
          },
        },
        {
          text: enLang ? EN.no : RO.no,
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
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
      <View style={RightDrawerStyle.renderContent}>
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
  const openFilelist = async () => {
    const supported = await Linking.canOpenURL('https://filelist.io');
    if (supported) {
      Alert.alert(
        'Info',
        enLang ? EN.filelistWeb : RO.filelistWeb,
        [
          {
            text: enLang ? EN.yes : RO.yes,
            onPress: () => Linking.openURL('https://filelist.io'),
          },
          {
            text: enLang ? EN.no : RO.no,
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      Alert.alert(
        'Info',
        enLang ? EN.filelistWebErr : RO.filelistWebErr,
        [
          {
            text: 'OK',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
  };
  const handleSettings = () => {
    navigation.navigate('Settings');
    navigation.closeDrawer();
  };
  // Component render
  return (
    <>
      <Overlay
        animationType="slide"
        overlayStyle={[
          RightDrawerStyle.infoOverlay,
          {
            backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
          },
        ]}
        isVisible={appInfo}
        onBackdropPress={() => {
          setActiveSections([]);
          dispatch(AppConfigActions.toggleAppInfo());
        }}>
        <View
          style={[
            RightDrawerStyle.infoOverlayCloseContainer,
            {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
          ]}>
          <View
            style={{
              height: statusHeight * 3,
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
              onPress={() => {
                setActiveSections([]);
                dispatch(AppConfigActions.toggleAppInfo());
              }}>
              <FontAwesomeIcon
                color={'white'}
                size={Adjust(22)}
                icon={faArrowLeft}
              />
            </Pressable>
            <Text
              style={{
                fontSize: Adjust(fontSizes !== null ? fontSizes[7] : 16),
                color: 'white',
                fontWeight: 'bold',
              }}>
              {enLang ? EN.howToUse : RO.howToUse}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={true}
            overScrollMode={'never'}
            bounces={false}
            contentContainerStyle={[
              RightDrawerStyle.infoOverlayScrollView,
              {
                backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
                paddingBottom:
                  Platform.OS === 'android' ? statusHeight : statusHeight * 1.5,
              },
            ]}>
            <Accordion
              sections={INFO}
              containerStyle={RightDrawerStyle.accordionContainer}
              expandMultiple
              underlayColor={lightTheme ? MAIN_LIGHT : '#303030'}
              activeSections={activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
            />
          </ScrollView>
        </View>
      </Overlay>
      <View
        style={[
          RightDrawerStyle.settingsOverlayMainContainer,
          {backgroundColor: lightTheme ? MAIN_LIGHT : 'black'},
        ]}>
        <View style={RightDrawerStyle.profileContainer}>
          <View style={RightDrawerStyle.profilePicContainer}>
            <View
              style={[
                RightDrawerStyle.profilePicView,
                {borderColor: lightTheme ? 'black' : MAIN_LIGHT},
              ]}>
              <Text
                style={{
                  fontSize: Adjust(30),
                  fontWeight: 'bold',
                  color: lightTheme ? 'black' : 'white',
                }}>
                {user !== '' ? user.charAt(0) : null}
              </Text>
            </View>
          </View>
          <View style={RightDrawerStyle.usernameView}>
            <Text
              style={{
                fontSize: Adjust(fontSizes !== null ? fontSizes[7] : 16),
                fontWeight: 'bold',
                color: lightTheme ? 'black' : 'white',
              }}>
              {user !== '' ? user : null}
            </Text>
          </View>
        </View>
        <View style={RightDrawerStyle.settingsOverlayContainer}>
          <Pressable
            style={RightDrawerStyle.settingsOverlayPressable}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={() => dispatch(AppConfigActions.toggleAppInfo())}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
              icon={faInfoCircle}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              {enLang ? EN.howToUse : RO.howToUse}
            </Text>
          </Pressable>
        </View>
        <View style={RightDrawerStyle.settingsOverlayContainer}>
          <Pressable
            style={RightDrawerStyle.settingsOverlayPressable}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={openFilelist}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
              icon={faDirections}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              Filelist.io
            </Text>
          </Pressable>
        </View>
        <View style={RightDrawerStyle.settingsOverlayContainer}>
          <Pressable
            style={RightDrawerStyle.settingsOverlayPressable}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={handleSettings}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
              icon={faCog}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              {enLang ? EN.settings : RO.settings}
            </Text>
          </Pressable>
        </View>
        <View style={RightDrawerStyle.settingsOverlayContainer}>
          <Pressable
            style={RightDrawerStyle.settingsOverlayPressable}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={handleLogout}>
            <FontAwesomeIcon
              color={'crimson'}
              size={Adjust(25)}
              icon={faSignOutAlt}
            />
            <Text
              style={[
                RightDrawerStyle.settingsOverlayText,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const RightDrawerStyle = EStyleSheet.create({
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
    width: width,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlayScrollView: {
    width: width,
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
    width: width,
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
