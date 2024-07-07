/* eslint-disable curly */
import {
  Dimensions,
  PixelRatio,
  Platform,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { CDN_FALLBACK_URL } from '../../env';

// Colors
const MAIN_LIGHT = '#E8E6E6';
const ACCENT_COLOR = '#15ABF4';

// Dimensions
const pixelRatio = PixelRatio.get();
const statusHeight = getStatusBarHeight();
const { width, height } = Dimensions.get('window');

// Font sizes
const S = JSON.stringify([4, 6, 8, 9, 10, 11, 12, 14, 20, 45]);
const M = JSON.stringify([6, 9, 10, 11, 12, 13, 14, 16, 22, 50]);
const L = JSON.stringify([8, 10, 12, 13, 14, 15, 16, 18, 24, 50]);

/**
 * Keep only one search keyword if multiple
 */
function removeDublicate(arr) {
  let result = [];
  let deQuery = [...arr.map((item) => item.query)];
  deQuery.forEach((item, index) => {
    deQuery.indexOf(item) === index && result.push({ id: index, query: item });
  });
  return result;
};

/**
 * Sort search keywords (query) array based on  search keyword
 */
function sortArrayHistory(array, keyword) {
  array.sort((a, b) => {
    if (a.query.indexOf(keyword) !== -1 && b.query.indexOf(keyword) !== -1)
      return a.query.localeCompare(b.query);
    else if (a.query.indexOf(keyword) !== -1) return -1;
    else if (b.query.indexOf(keyword) !== -1) return 1;

    return a.query.localeCompare(b.query);
  });
};

/**
 * Platform specific Pressable / Touchable
 */
const PressableOpacity = Platform.select({
  ios: TouchableOpacity,
  android: Pressable,
});

/**
 * Return black / white based on lightTheme variable
 */
function getColor(lightTheme) {
  return lightTheme ? 'black' : 'white';
}

/**
 * Adds prefix to bucket assets and returns the resource URI
 * @param asset {String}
 * Asset name and extension as a string, e.g. 'logo.png'
 * @returns {String}
 * Returns URI formed with CDN + asset, e.g. 'https://s3.cdn.com/logo.png'
 */
function addMediaPrefix(asset) {
	return `${CDN_FALLBACK_URL}/${asset}`;
}

/**
 * Returns category icon based on category type
 */
function getCategoryIcon(category, variables) {
  const { CDN_URL, CATEGORY_ICONS } = variables || {};
  const {
    anime,
    audio,
    desene,
    diverse,
    doc,
    filme3d,
    filme4k,
    filme4kbd,
    filmeBD,
    filmeDvd,
    filmeDvdRo,
    filmeHd,
    filmeHdRo,
    filmeSd,
    flac,
    jocConsole,
    jocPc,
    lin,
    mob,
    software,
    seriale4k,
    serialeHd,
    serialeSd,
    sports,
    videos,
    porn
  } = CATEGORY_ICONS || {};

  switch (category) {
    case 'Audio':
      return CDN_URL ? `${CDN_URL}/${audio}` : addMediaPrefix('music_cd9b7f11da.png');
    case 'Jocuri PC':
      return CDN_URL ? `${CDN_URL}/${jocPc}` : addMediaPrefix('games_5836318be4.png');
    case 'Filme HD':
      return CDN_URL ? `${CDN_URL}/${filmeHd}` : addMediaPrefix('hd_cdd7e597bc.png');
    case 'Filme HD-RO':
      return CDN_URL ? `${CDN_URL}/${filmeHdRo}` : addMediaPrefix('hd_ro_ffa9ebd99d.png');
    case 'Filme Blu-Ray':
      return CDN_URL ? `${CDN_URL}/${filmeBD}` : addMediaPrefix('bluray_92e94707ca.png');
    case 'Docs':
      return CDN_URL ? `${CDN_URL}/${doc}` : addMediaPrefix('docs_0cfda0b27f.png');
    case 'Anime':
      return CDN_URL ? `${CDN_URL}/${anime}` : addMediaPrefix('anime_f1a22405c2.png');
    case 'Jocuri Console':
      return CDN_URL ? `${CDN_URL}/${jocConsole}` : addMediaPrefix('console_40a0c46f53.png');
    case 'XXX':
      return CDN_URL ? `${CDN_URL}/${porn}` : addMediaPrefix('xxx_404dbeba4c.png');
    case 'Seriale HD':
      return CDN_URL ? `${CDN_URL}/${serialeHd}` : addMediaPrefix('hdtv_55248db2c1.png');
    case 'Filme SD':
      return CDN_URL ? `${CDN_URL}/${filmeSd}` : addMediaPrefix('sd_212e370c26.png');
    case 'Filme DVD':
      return CDN_URL ? `${CDN_URL}/${filmeDvd}` : addMediaPrefix('dvd_c94fdbb6ba.png');
    case 'Filme DVD-RO':
      return CDN_URL ? `${CDN_URL}/${filmeDvdRo}` : addMediaPrefix('dvd_ro_dcd54bb381.png');
    case 'FLAC':
      return CDN_URL ? `${CDN_URL}/${flac}` : addMediaPrefix('flac_62700f82b0.png');
    case 'Filme 4K':
      return CDN_URL ? `${CDN_URL}/${filme4k}` : addMediaPrefix('4k_ef13973b5b.png');
    case 'Programe':
      return CDN_URL ? `${CDN_URL}/${software}` : addMediaPrefix('apps_fec1fa7978.png');
    case 'Videoclip':
      return CDN_URL ? `${CDN_URL}/${videos}` : addMediaPrefix('vids_c40e1b46eb.png');
    case 'Sport':
      return CDN_URL ? `${CDN_URL}/${sports}` : addMediaPrefix('sport_7b640a59da.png');
    case 'Desene':
      return CDN_URL ? `${CDN_URL}/${desene}` : addMediaPrefix('cartoons_437d4d360c.png');
    case 'Linux':
      return CDN_URL ? `${CDN_URL}/${lin}` : addMediaPrefix('linux_eaa6b8360a.png');
    case 'Diverse':
      return CDN_URL ? `${CDN_URL}/${diverse}` : addMediaPrefix('misc_cbbc5b1c4e.png');
    case 'Mobile':
      return CDN_URL ? `${CDN_URL}/${mob}` : addMediaPrefix('mobile_4282d01acc.png');
    case 'Seriale SD':
      return CDN_URL ? `${CDN_URL}/${serialeSd}` : addMediaPrefix('sdtv_68098f1c71.png');
    case 'Filme 3D':
      return CDN_URL ? `${CDN_URL}/${filme3d}` : addMediaPrefix('3d_e61efadbfd.png');
    case 'Filme 4K Blu-Ray':
      return CDN_URL ? `${CDN_URL}/${filme4kbd}` : addMediaPrefix('4k_BD_e2e37997f7.png');
    case 'Seriale 4K':
      return CDN_URL ? `${CDN_URL}/${seriale4k}` : addMediaPrefix('4ks_48d61c3ea1.png');
    default:
      return '';
  }
};

export {
  MAIN_LIGHT,
  ACCENT_COLOR,
  pixelRatio,
  statusHeight,
  width,
  height,
  S,
  M,
  L,
  removeDublicate,
  sortArrayHistory,
  PressableOpacity,
  getColor,
  addMediaPrefix,
  getCategoryIcon,
}
