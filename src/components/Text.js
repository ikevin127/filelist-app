import React from 'react';
import {Text} from 'react-native';
import Adjust from './AdjustText';

export default function RText({
  t8,
  t10,
  t12,
  t14,
  t16,
  t18,
  t20,
  t22,
  t24,
  t26,
  t28,
  t30,
  bold,
  italic,
  title,
  style,
  ...rest
}) {
  return (
    <Text
      style={[
        t8 && {fontSize: Adjust(8)},
        t10 && {fontSize: Adjust(10)},
        t12 && {fontSize: Adjust(12)},
        t14 && {fontSize: Adjust(14)},
        t16 && {fontSize: Adjust(16)},
        t18 && {fontSize: Adjust(18)},
        t20 && {fontSize: Adjust(20)},
        t22 && {fontSize: Adjust(22)},
        t24 && {fontSize: Adjust(24)},
        t26 && {fontSize: Adjust(26)},
        t28 && {fontSize: Adjust(28)},
        t30 && {fontSize: Adjust(30)},
        bold && {fontWeight: 'bold'},
        italic && {fontStyle: 'italic'},
        style,
      ]}
      {...rest}>
      {title}
    </Text>
  );
}
