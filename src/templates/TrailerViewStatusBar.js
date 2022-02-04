import React from 'react';
import { StatusBar } from 'react-native';

export default function TrailerViewStatusBar({ focusedLandscape }) {
    if (focusedLandscape) return <StatusBar backgroundColor="black" />;
    return null;
}
