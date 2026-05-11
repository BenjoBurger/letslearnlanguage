import { cssInterop } from 'nativewind';
import React from 'react';
import { Text, TextProps } from 'react-native';

const StyledText = cssInterop(Text, {
    className: 'style'
});

export default function ThemedText(props: TextProps) {
  return <StyledText {...props} />;
}
