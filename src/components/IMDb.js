/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Adjust from './AdjustText';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Axios from 'axios';
import {
  faArrowLeft,
  faPlay,
  faStar,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  ACCENT_COLOR,
  MAIN_LIGHT,
  statusHeight,
  PressableOpacity,
  getColor,
} from '../assets/variables';
import { EN, RO } from '../assets/lang';
// Redux
import { useSelector } from 'react-redux';

export default function IMDb({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [IMDbData, setIMDbData] = useState(null);
  const [isNetReachable, setIsNetReachable] = useState(true);
  const {
    autoplay,
    enLang,
    fontSizes,
    lightTheme,
    hasNotch,
    variables,
  } = useSelector((state) => state.appConfig);
  const netRef = useRef(false);
  // Connection listener effect
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable) {
        if (netRef.current) {
          setIsNetReachable(true);
        } else {
          netRef.current = true;
        }
      } else {
        setIsNetReachable(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [isNetReachable]);

  // IMDb axios
  useEffect(() => {
    const source = Axios.CancelToken.source();
    fetchIMDbInfo(route.params.id, source);
    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BackHandler effect
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
  const handleBack = () => navigation.goBack();
  // eslint-disable-next-line no-shadow
  const goTrailer = (trailer, autoPlay) => () => {
    if (trailer !== '') {
      navigation.navigate('Trailer', {
        trailer,
        autoplay: autoPlay,
      });
    } else {
      Alert.alert(
        'Info',
        enLang ? EN.imdbNoTrailer : RO.imdbNoTrailer,
        [
          {
            text: EN.ok,
            onPress: () => { },
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    }
  };

  const checkYearExists = (title) => {
    let regex = new RegExp(/((\d\d\d\d))/);
    return regex.test(title);
  };
  const fetchIMDbInfo = async (id, cancel) => {
    const { SCRAPER_URL } = variables || {};
    if (isNetReachable) {
      await Axios.get(`${SCRAPER_URL}/${id}`, {
        cancelToken: cancel.token,
      })
        .then((res) => {
          if (res.status === 200) {
            setIMDbData(Array(res.data));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const openIMDbBrowser = (link) => async () => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      Alert.alert(
        'Info',
        enLang ? EN.imdbNav : RO.imdbNav,
        [
          {
            text: enLang ? EN.yes : RO.yes,
            onPress: () => Linking.openURL(link),
          },
          {
            text: enLang ? EN.no : RO.no,
            onPress: () => { },
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    }
  };

  return (
    <>
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
                ? statusHeight * 2.2
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
              Platform.OS === 'ios' && hasNotch
                ? statusHeight * 2
                : statusHeight * 1.1,
            marginBottom: statusHeight / 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          IMDb Info
        </Text>
      </View>
      {loading ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: statusHeight * 5,
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
          }}>
          <ActivityIndicator
            size={Platform.OS === 'ios' ? 'small' : 'large'}
            color={ACCENT_COLOR}
          />
        </View>
      ) : IMDbData ? (
        IMDbData.map((item, index) => {
          return (
            <ScrollView
              key={index}
              style={{
                backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
              }}
              contentContainerStyle={{ alignItems: 'center' }}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  width: 350,
                  height: 450,
                  marginTop: statusHeight,
                  backgroundColor: 'transparent',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={openIMDbBrowser(item.link)}>
                  <FastImage
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: item.posterhq,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: Adjust(18),
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: getColor(lightTheme),
                  marginTop: statusHeight,
                  marginBottom: statusHeight / 4,
                  paddingHorizontal: statusHeight,
                }}>
                {`${item.title} ${checkYearExists(item.title) ? '' : `(${item.year})`
                  }`}
                {'\n'}
                <Text
                  style={[
                    {
                      fontSize: Adjust(18),
                      color: lightTheme ? 'black' : 'white',
                      fontWeight: 'bold',
                    },
                  ]}>
                  {item.rating}
                </Text>{' '}
                {item.rating === '' ? null : Platform.OS === 'ios' &&
                  hasNotch ? (
                  <Text style={{ fontSize: Adjust(15) }}>⭐</Text>
                ) : Platform.OS === 'ios' && !hasNotch ? (
                  <Text style={{ fontSize: Adjust(15) }}>⭐</Text>
                ) : (
                  <FontAwesomeIcon
                    icon={faStar}
                    size={Adjust(15)}
                    color={lightTheme ? 'goldenrod' : 'gold'}
                  />
                )}
              </Text>
              <Text
                style={{
                  fontSize: Adjust(12),
                  paddingHorizontal: statusHeight * 2,
                  textAlign: 'center',
                  color: lightTheme ? 'black' : 'white',
                }}>
                {`${item.duration !== '' ? item.duration + ' | ' : ''} ${item.genre
                  }`}
              </Text>
              <Text
                style={{
                  fontSize: Adjust(12),
                  marginTop: statusHeight / 3,
                  marginBottom: statusHeight,
                  paddingHorizontal: statusHeight / 2,
                  textAlign: 'center',
                  color: lightTheme ? 'black' : 'white',
                }}>
                {item.plot}
              </Text>
              <View
                style={{
                  width: '60%',
                  height:
                    Platform.OS === 'ios' && !hasNotch
                      ? statusHeight * 2
                      : Platform.OS === 'ios' && hasNotch
                        ? statusHeight
                        : statusHeight * 1.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 34,
                  overflow: 'hidden',
                  marginVertical: statusHeight / 2,
                  marginBottom: statusHeight * 2,
                  backgroundColor: ACCENT_COLOR,
                }}>
                <PressableOpacity
                  activeOpacity={0.5}
                  style={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 34,
                  }}
                  android_ripple={{
                    color: 'black',
                    borderless: false,
                  }}
                  onPress={goTrailer(item.trailer, autoplay)}>
                  <FontAwesomeIcon
                    size={Adjust(fontSizes !== null ? fontSizes[6] : 14)}
                    style={{ marginRight: 10 }}
                    color={'white'}
                    icon={faPlay}
                  />
                  <Text
                    style={[
                      {
                        fontSize: Adjust(
                          fontSizes !== null ? fontSizes[6] : 14,
                        ),
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    ]}>
                    Watch trailer
                  </Text>
                </PressableOpacity>
              </View>
            </ScrollView>
          );
        })
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
            paddingBottom: statusHeight * 7,
          }}>
          <FontAwesomeIcon
            size={Adjust(100)}
            style={{ marginBottom: statusHeight / 5 }}
            color={lightTheme ? 'black' : 'white'}
            icon={faExclamationTriangle}
          />
          <Text
            style={{
              fontSize: Adjust(20),
              fontWeight: 'bold',
              textAlign: 'center',
              color: lightTheme ? 'black' : 'white',
              paddingHorizontal: statusHeight,
              marginBottom: statusHeight / 5,
            }}>
            {enLang ? EN.imdbNetErrH : RO.imdbNetErrH}
          </Text>
          <Text
            style={{
              fontSize: Adjust(14),
              textAlign: 'center',
              color: lightTheme ? 'black' : 'white',
              paddingHorizontal: statusHeight,
            }}>
            {enLang ? EN.imdbNetErrP : RO.imdbNetErrP}
          </Text>
        </View>
      )}
    </>
  );
}
