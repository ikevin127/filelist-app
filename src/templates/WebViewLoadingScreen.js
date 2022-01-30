import React from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { height, statusHeight } from '../assets/variables';

const returnViewHeight = (hasNotch) => {
    if (Platform.OS === 'ios' && !hasNotch) return statusHeight * 5
    return statusHeight * 3.5;
}

export default function WebViewLoadingScreen({ isPortrait, lightTheme, hasNotch }) {
	return (
		<View
			style={{
				zIndex: 999,
				elevation: 999,
				flex: 1,
				position: 'absolute',
				top: isPortrait ? returnViewHeight(hasNotch) : 0,
				right: 0,
				bottom: 0,
				left: 0,
				width: '100%',
				height: isPortrait ? height - returnViewHeight(hasNotch) : '100%',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
			}}>
			<ActivityIndicator
				size={Platform.OS === 'ios' ? 'small' : 'large'}
				color={lightTheme ? 'black' : '#deb522'}
			/>
		</View>
	);
}
