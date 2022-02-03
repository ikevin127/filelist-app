import React from 'react';
import { View, Text, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import { ACCENT_COLOR, statusHeight, PressableOpacity } from '../assets/variables';
import Adjust from '../components/AdjustText';

const returnViewHeight = (hasNotch) => {
    if (Platform.OS === 'ios' && !hasNotch) return statusHeight * 5
    return statusHeight * 3.5;
}

const returnPressableTop = (hasNotch) => {
    if (Platform.OS === 'ios' && !hasNotch) return statusHeight * 2.3;
    if (Platform.OS === 'ios' && hasNotch) return statusHeight * 2.2;
    return statusHeight * 1.6;
}

const returnTitleMarginTop = (hasNotch) => {
    if (Platform.OS === 'ios' && hasNotch) return statusHeight * 2.1;
    return statusHeight * 1.1;
}

export default function TrailerViewHeader({ navigation, isPortrait, hasNotch }) {
    console.log(isPortrait, hasNotch);
    if (isPortrait) return (
        <View
            style={{
                height: returnViewHeight(hasNotch),
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
                    top: returnPressableTop(hasNotch),
                    left: statusHeight / 1.5,
                }}
                android_ripple={{
                    color: 'white',
                    borderless: true,
                    radius: statusHeight / 1.3,
                }}
                onPress={navigation.goBack}>
                <FontAwesomeIcon
                    color={'white'}
                    size={Adjust(22)}
                    icon={faArrowLeft}
                />
            </PressableOpacity>
            <Text
                style={{
                    fontSize: Adjust(16),
                    marginTop: returnTitleMarginTop(hasNotch),
                    marginBottom: statusHeight / 2,
                    fontWeight: 'bold',
                    color: 'white',
                }}>
                IMDb Trailer
            </Text>
        </View>
    );

    return null;
}
