import {Dimensions, PixelRatio, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

// Colors
export const MAIN_LIGHT = '#E8E6E6';
export const ACCENT_COLOR = '#15ABF4';

// Dimensions
export const pixelRatio = PixelRatio.get();
export const statusHeight = getStatusBarHeight();
export const {width, height} = Dimensions.get('window');