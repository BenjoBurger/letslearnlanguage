import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '../constants/theme';

export default function ThemedView({ children, style, ...rest }: ViewProps) {
  return (
    <View
      {...rest}
      style={[
        { flex: 1, backgroundColor: theme.colors.background },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: theme.colors.accent,
          right: -30,
          bottom: -30,
          opacity: 0.18,
        }}
      />
      {children}
    </View>
  );
}
