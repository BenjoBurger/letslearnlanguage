import { cssInterop } from 'nativewind';
import React, { useMemo, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    GestureResponderEvent,
    Text,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

const StyledTouchable = cssInterop(TouchableOpacity, {
  className: 'style',
});

const StyledText = cssInterop(Text, {
  className: 'style',
});

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  outline?: boolean;
  borderColor?: string;
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  className = '',
  loading,
  disabled,
  outline = true,
  borderColor = '#000',
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.97, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start();
  };

  const containerStyle = useMemo<ViewStyle>(() => {
    const base: ViewStyle = { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 };
    if (outline) {
      return { ...base, borderWidth: 2, borderColor: borderColor, backgroundColor: 'transparent', ...style };
    }
    return { ...base, ...style };
  }, [outline, borderColor, style]);

  const stateOpacity = disabled ? 0.5 : 1;

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: stateOpacity }}>
      <StyledTouchable
        className={className}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={containerStyle as any}
      >
        {loading ? (
          <ActivityIndicator color={outline ? borderColor : '#fff'} />
        ) : (
          <StyledText className={outline ? `text-[${borderColor}] font-semibold` : 'text-white font-semibold'}>{title}</StyledText>
        )}
      </StyledTouchable>
    </Animated.View>
  );
}
