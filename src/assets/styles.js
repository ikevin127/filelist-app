import {StatusBar} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Colors
const MAIN_COLOR = '#E8E6E6';
const RIPPLE_COLOR = '#808080';
const ACCENT_COLOR = '#1598F4';

// MAIN //
export const Main = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
    paddingTop: StatusBar.currentHeight,
  },
  profilePicContainer: {
    width: '100%',
    height: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    height: '60%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  picture: {
    width: '200rem',
    height: '200rem',
    justifyContent: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inputContainerInner: {
    borderBottomWidth: 0,
    width: '85%',
    backgroundColor: 'transparent',
  },
  input: {
    height: '40rem',
    color: 'black',
    fontSize: '13rem',
  },
  error: {
    textAlign: 'center',
    width: '60%',
    color: 'red',
  },
  btnContainer: {
    elevation: 5,
    width: '50%',
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40rem',
    margin: '10rem',
    padding: 0,
    borderRadius: 34,
    backgroundColor: 'transparent',
  },
  btn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40rem',
    borderRadius: 34,
    backgroundColor: ACCENT_COLOR,
  },
  btnText: {
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontWeight: 'bold',
    fontSize: '13rem',
  },
  checkBox: {
    width: '85%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  checkBoxFont: {
    fontSize: '13rem',
  },
});
