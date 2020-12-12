import React, {useState, useEffect} from 'react';
import {
  Alert,
  Animated,
  Text,
  View,
  Easing,
  ScrollView,
  Switch,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import Accordion from 'react-native-collapsible/Accordion';
import {Overlay} from 'react-native-elements';
import crashlytics from '@react-native-firebase/crashlytics';
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
  faAdjust,
  faCheck,
  faSignOutAlt,
  faInfoCircle,
  faDirections,
  faTextHeight,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

// Variables
import {
  width,
  height,
  statusHeight,
  MAIN_LIGHT,
  ACCENT_COLOR,
} from '../assets/variables';

const INFO = [
  {
    title: '1.Folosirea funcţiei de căutare',
    content:
      '* Pentru cele mai recente torrente dintr-o anumită categorie selectează cel puţin 1 categorie din lista de filtre\n\n* Pentru căutarea după cod IMDb asigură-te că selectezi Căutare după: Cod IMDb în lista de Filtre, pentru exemple legat de diferenţele dintre cele două ţine apăsat 2 secunde (long press) pe oricare dintre cele 2 opţiuni Căutare după\n\n* Opţiunea Torrente din lista cu Filtre NU are nici un efect atunci când NU se foloseşte nici un cuvânt cheie ori când se efectuează Căutare după: Cod IMDb\n\n* Opţiunile Torrente: Freeleech, Internal şi 2x Upload pot fi folosite în combinaţie cu oricare dintre Categorii şi Cuvânt cheie ori cod IMDb',
  },
  {
    title: '2.Semnificaţie Freeleech, Internal şi 2x Upload',
    content:
      'Freeleech:\ndescărcarea torrentelor din această categorie, îţi va creşte Upload-ul fără să adăuge Download astfel nu-ţi va afecta negativ Raţia\n\nInternal:\ntorrente care fac parte din grupuri interne ale trackerului printre care se numără Play(HD|BD|SD|XD)\n\n2x Upload:\nîn caz că nu se subînţelege, aceste torrente odată descărcate şi ţinute la Seed îţi oferă de 2 ori mai mult upload',
  },
  {
    title: '3.Reactualizarea listei cu torrente recent adăugate',
    content: 'Se efectuează prin tragerea în jos (pull down) din capul listei',
  },
  {
    title: '4.Pentru a descărca un fişier torrent',
    content: 'Ţine apăsat 2 secunde (long press) pe torrentul respectiv',
  },
  {
    title: '5.Pentru redirecţionare spre IMDb',
    content:
      'Se aplică doar în cazul torrentelor care conţin cod IMDb şi se efectuează prin atingerea posterului',
  },
  {
    title: '6.Dacă mărimea textului este prea mică / mare',
    content:
      'Se poate schimba din meniu pe mărimile mic, mediu ori mare în funcţie de preferinţă',
  },
];

export default function RightDrawer({navigation}) {
  const [user, setUser] = useState('');
  const [darkLight] = useState(new Animated.Value(0));
  const [activeSections, setActiveSections] = useState([]);
  const spinIt = darkLight.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  // Redux
  const dispatch = useDispatch();
  const {appInfo, lightTheme, fontSizes} = useSelector(
    (state) => state.appConfig,
  );

  // Component mount
  useEffect(() => {
    getCurrentUser();
    dispatch(AppConfigActions.setFonts());
  }, []);

  // Functions

  const toggleSFonts = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([4, 6, 8, 9, 10, 11, 12, 14, 20, 45]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().log('rightdrawer -> toggleSFonts()');
      crashlytics().recordError(e);
    }
  };

  const toggleMFonts = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([6, 9, 10, 11, 12, 13, 14, 16, 22, 50]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().log('rightdrawer -> toggleMFonts()');
      crashlytics().recordError(e);
    }
  };

  const toggleLFonts = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([8, 10, 12, 13, 14, 15, 16, 18, 24, 50]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().log('rightdrawer -> toggleLFonts()');
      crashlytics().recordError(e);
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('username');
      if (currentUser !== null) {
        setUser(currentUser);
      }
    } catch (e) {
      alert(e);
    }
  };

  const openFilelist = async () => {
    const supported = await Linking.canOpenURL(
      'https://filelist.io',
    );
    if (supported) {
      Alert.alert(
        'Info',
        'Doreşti să navighezi spre Filelist.io ?',
        [
          {
            text: 'DA',
            onPress: () => Linking.openURL('https://filelist.io'),
          },
          {
            text: 'NU',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      Alert.alert(
        'Info',
        'Navigarea spre Filelist.io nu a funcţionat.',
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
  }

  const switchTheme = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    try {
      const currentTheme = await AsyncStorage.getItem('theme');
      if (currentTheme !== null) {
        if (currentTheme === 'dark') {
          await AsyncStorage.setItem('theme', 'light');
          dispatch(AppConfigActions.toggleLightTheme());
          Animated.timing(darkLight, {
            toValue: 1,
            duration: 500,
            easing: Easing.cubic,
            useNativeDriver: true,
          }).start();
        } else {
          await AsyncStorage.setItem('theme', 'dark');
          dispatch(AppConfigActions.toggleLightTheme());
          Animated.timing(darkLight, {
            toValue: 2,
            duration: 500,
            easing: Easing.cubic,
            useNativeDriver: true,
          }).start();
        }
      } else {
        await AsyncStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleLogout = async () => {
    const keys = ['username', 'passkey', 'latest'];
    try {
      await AsyncStorage.multiRemove(keys);
      dispatch(AppConfigActions.retrieveLatest());
      dispatch(AppConfigActions.latestError());
    } catch (e) {
      alert(e);
    }
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

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  // Component render

  return (
    <>
        <Overlay
          statusBarTranslucent
          animationType="slide"
          overlayStyle={[
            RightDrawerStyle.infoOverlay,
            {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
            paddingTop: Platform.OS === 'android' ? statusHeight : statusHeight * 2},
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
            <ScrollView
              showsVerticalScrollIndicator={true}
              overScrollMode={'never'}
              bounces={false}
              contentContainerStyle={[
                RightDrawerStyle.infoOverlayScrollView,
                {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
              paddingBottom: Platform.OS === 'android' ? statusHeight : statusHeight * 1.5},
              ]}>
              <View style={RightDrawerStyle.infoTitleContainer}>
                <Text
                  style={{
                    fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                    color: lightTheme ? 'black' : 'white',
                    fontWeight: 'bold',
                  }}>
                  Informaţii folosire
                </Text>
              </View>
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
              <View style={RightDrawerStyle.btnMainContainer}>
                <View style={RightDrawerStyle.btnContainer}>
                  <Pressable
                    onPress={() => {
                      setActiveSections([]);
                      dispatch(AppConfigActions.toggleAppInfo());
                    }}
                    android_ripple={{
                      color: 'white',
                      borderless: false,
                    }}
                    style={RightDrawerStyle.btn}>
                    <FontAwesomeIcon size={20} color={'white'} icon={faCheck} />
                  </Pressable>
                </View>
              </View>
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
                Informaţii folosire
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
              onPress={() => switchTheme()}>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: spinIt,
                    },
                  ],
                }}>
                <FontAwesomeIcon
                  color={lightTheme ? 'black' : MAIN_LIGHT}
                  size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                  icon={faAdjust}
                />
              </Animated.View>
              <Text
                style={[
                  RightDrawerStyle.settingsOverlayText,
                  {
                    fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                    color: lightTheme ? 'black' : 'white',
                  },
                ]}>
                Temă culori
              </Text>
              <View
                style={{
                  paddingLeft: statusHeight / 1.5,
                }}
                pointerEvents={'none'}>
                <Switch
                  trackColor={{false: 'black', true: '#505050'}}
                  thumbColor={lightTheme ? 'white' : MAIN_LIGHT}
                  ios_backgroundColor="#909090"
                  value={!lightTheme}
                />
              </View>
            </Pressable>
          </View>
          <View style={[RightDrawerStyle.settingsOverlayFont, {marginTop: statusHeight / 2.5,}]}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: statusHeight / 1.5,
              }}>
              <FontAwesomeIcon
                color={lightTheme ? 'black' : MAIN_LIGHT}
                size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
                icon={faTextHeight}
              />
              <Text
                style={[
                  RightDrawerStyle.settingsOverlayText,
                  {
                    fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                    color: lightTheme ? 'black' : 'white',
                  },
                ]}>
                Dimensiune text
              </Text>
            </View>
            {Platform.OS === 'android' ? <Picker
              selectedValue={
                fontSizes !== null
                  ? fontSizes[0] === 6
                    ? 'm'
                    : fontSizes[0] === 4
                    ? 's'
                    : fontSizes[0] === 8
                    ? 'l'
                    : 'm'
                  : 'm'
              }
              style={[
                RightDrawerStyle.settingsPicker,
                {
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
                },
              ]}
              mode="dropdown"
              onValueChange={(itemValue) =>
                itemValue === 's'
                  ? toggleSFonts()
                  : itemValue === 'm'
                  ? toggleMFonts()
                  : itemValue === 'l'
                  ? toggleLFonts()
                  : null
              }>
              <Picker.Item label="Mic" value="s" />
              <Picker.Item label="Mediu" value="m" />
              <Picker.Item label="Mare" value="l" />
            </Picker> : <PickerIOS
              selectedValue={
                fontSizes !== null
                  ? fontSizes[0] === 6
                    ? 'm'
                    : fontSizes[0] === 4
                    ? 's'
                    : fontSizes[0] === 8
                    ? 'l'
                    : 'm'
                  : 'm'
              }
              style={RightDrawerStyle.settingsPicker}
              itemStyle={{
                  color: 'white',
                  backgroundColor: lightTheme ? 'black' : 'transparent',
                  height: statusHeight,
                  width: width / 2,
                  borderRadius: 10,
                }}
              onValueChange={(itemValue) =>
                itemValue === 's'
                  ? toggleSFonts()
                  : itemValue === 'm'
                  ? toggleMFonts()
                  : itemValue === 'l'
                  ? toggleLFonts()
                  : null
              }>
              <PickerIOS.Item label="Mic" value="s" />
              <PickerIOS.Item label="Mediu" value="m" />
              <PickerIOS.Item label="Mare" value="l" />
            </PickerIOS>}
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
              onPress={() => {
                navigation.closeDrawer();
                handleLogout();
              }}>
              <FontAwesomeIcon
                style={{
                  transform: [
                    {
                      rotate: darkLight === 0 ? '0deg' : '0deg',
                    },
                  ],
                }}
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
  settingsOverlayFont: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: statusHeight / 1.5,
  },
  settingsPicker: {
    position: 'relative',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    marginTop: Platform.OS === 'android' ? '1rem' : '1.5rem',
    marginBottom: Platform.OS === 'android' ? 0 : '1rem'
  },
  pickerIcon: {position: 'absolute', bottom: '0.9rem', right: '5rem'},
  infoOverlay: {
    width: width,
    height: height + statusHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    padding: 5,
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
  },
  renderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: '1rem',
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
