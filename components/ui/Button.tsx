import React from 'react';
import {
  View,
  ActivityIndicator,
  PressableStateCallbackType,
  StyleSheet,
  ViewStyle,
  PressableProps,
} from 'react-native';

import { COLORS } from '@/constants/color';
import { Typography } from '@/ui/Typography';

import { AnimatedPressable } from './AnimatedPressable';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  textColor?: string;
  style?: ViewStyle | ((state: PressableStateCallbackType) => ViewStyle);
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  textColor,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const getDefaultTextColor = () => {
    if (isDisabled) return COLORS.white;
    return variant === 'primary' ? COLORS.white : COLORS.black[900];
  };

  const renderChildren = () => {
    return React.Children.toArray(children).map((child, index) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return (
          <Typography
            key={index}
            variant="header4"
            font="semibold"
            style={{ color: textColor || getDefaultTextColor() }}
          >
            {child}
          </Typography>
        );
      }
      return child;
    });
  };

  return (
    <AnimatedPressable
      disabled={isDisabled}
      style={(state) => {
        const baseStyles = [
          styles.button,
          styles[`${variant}Button`],
          isDisabled && styles.disabled,
        ];

        // Only change: opacity on press
        const opacity = state.pressed ? 0.6 : 1;

        if (typeof style === 'function') {
          return style(state);
        }

        return [{ opacity }, baseStyles, style];
      }}
      android_ripple={{
        color:
          variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)',
      }}
      {...rest}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            color={textColor || getDefaultTextColor()}
            size="small"
            style={{ marginRight: 10 }}
          />
        )}
        {renderChildren()}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 54,
    borderRadius: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  primaryButton: { backgroundColor: COLORS.black[900] },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.black[200],
  },
  ghostButton: { backgroundColor: 'transparent' },

  disabled: {
    backgroundColor: COLORS.black[200],
    borderColor: COLORS.black[200],
  },
});
