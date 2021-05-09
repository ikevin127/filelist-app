/* eslint-disable curly */
import {
  Dimensions,
  PixelRatio,
  Platform,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

// Colors
export const MAIN_LIGHT = '#E8E6E6';
export const ACCENT_COLOR = '#15ABF4';

// Dimensions
export const pixelRatio = PixelRatio.get();
export const statusHeight = getStatusBarHeight();
export const {width, height} = Dimensions.get('window');

// Font sizes
export const S = JSON.stringify([4, 6, 8, 9, 10, 11, 12, 14, 20, 45]);
export const M = JSON.stringify([6, 9, 10, 11, 12, 13, 14, 16, 22, 50]);
export const L = JSON.stringify([8, 10, 12, 13, 14, 15, 16, 18, 24, 50]);

// Keep only one search keyword if multiple
export const removeDublicate = (arr) => {
  let result = [];
  let deQuery = [...arr.map((item) => item.query)];
  deQuery.forEach((item, index) => {
    deQuery.indexOf(item) === index && result.push({id: index, query: item});
  });
  return result;
};

// Sort search keywords (query) array based on  search keyword
export const sortArrayHistory = (array, keyword) => {
  array.sort((a, b) => {
    if (a.query.indexOf(keyword) !== -1 && b.query.indexOf(keyword) !== -1)
      return a.query.localeCompare(b.query);
    else if (a.query.indexOf(keyword) !== -1) return -1;
    else if (b.query.indexOf(keyword) !== -1) return 1;

    return a.query.localeCompare(b.query);
  });
};

// Platform specific Pressable / Touchable
export const PressableOpacity = Platform.select({
  ios: TouchableOpacity,
  android: Pressable,
});
