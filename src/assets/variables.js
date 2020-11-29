import {Dimensions, PixelRatio, StatusBar} from 'react-native';

// Colors
export const MAIN_LIGHT = '#E8E6E6';
export const ACCENT_COLOR = '#15ABF4';

// Dimensions
export const pixelRatio = PixelRatio.get();
export const statusHeight = StatusBar.currentHeight;
export const {width, height} = Dimensions.get('window');