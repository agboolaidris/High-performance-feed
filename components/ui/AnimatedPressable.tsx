// components/ui/AnimatedPressable.tsx

import React from "react";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  Animated,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";

type AnimatedStyle = StyleProp<ViewStyle>;

interface AnimatedPressableProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  scale?: number; // e.g. 0.95
  opacity?: number; // e.g. 0.7
  style?:
    | AnimatedStyle
    | ((state: PressableStateCallbackType) => AnimatedStyle);
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  scale = 0.95,
  opacity = 0.7,
  style,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: GestureResponderEvent) => {
    Animated.spring(animatedValue, {
      toValue: scale,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
    onPressOut?.(e);
  };

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ scale: animatedValue }],
    opacity: animatedValue.interpolate({
      inputRange: [scale, 1],
      outputRange: [opacity, 1],
    }),
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={(state) => {
        const baseStyle = typeof style === "function" ? style(state) : style;
        return [baseStyle, state.pressed && styles.pressedFallback];
      }}
      {...rest}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressedFallback: {
    opacity: 0.7,
  },
});
