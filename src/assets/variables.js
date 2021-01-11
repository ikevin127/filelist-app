import {Dimensions, PixelRatio} from 'react-native';
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

// Calculate 2 strings matching results: 0 to 1
// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}

export function similarity(s1, s2) {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}
