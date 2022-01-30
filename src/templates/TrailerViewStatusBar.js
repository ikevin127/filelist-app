import React from 'react';
import { StatusBar } from 'react-native';

export default function TrailerViewStatusBar({ focusedLandscape }) {
    if (focusedLandscape) return <StatusBar hidden />;
    return null;
}
