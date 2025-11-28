import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';

import { COLORS } from '@/constants/color';

// All your text variants
export type TextVariant =
  | 'header2'
  | 'header3'
  | 'header4'
  | 'body1'
  | 'body2'
  | 'body3';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  font?: FontWeight; // override weight if needed
}

const getFontFamily = (weight: FontWeight): string => {
  switch (weight) {
    case 'regular':
      return 'GeneralSans-Regular';
    case 'medium':
      return 'GeneralSans-Medium';
    case 'semibold':
      return 'GeneralSans-Semibold';
    case 'bold':
      return 'GeneralSans-Bold';
    default:
      return 'GeneralSans-Regular';
  }
};

export const Typography: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  font,
  style,
  children,
  ...props
}) => {
  // Determine default font weight per variant
  const defaultWeight: FontWeight = variant.startsWith('header')
    ? 'semibold'
    : 'regular';

  const finalWeight = font || defaultWeight;

  return (
    <RNText
      style={[
        styles[variant],
        { fontFamily: getFontFamily(finalWeight) },
        color ? { color } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

// All styles — exactly matching your Figma
const styles = StyleSheet.create({
  header2: {
    fontSize: 32,
    lineHeight: 32 * 1.2,
    letterSpacing: -1.6,
    color: COLORS.black[900],
  },
  header3: {
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: COLORS.black[900],
    includeFontPadding: false,
  },
  header4: {
    fontSize: 20,
    lineHeight: 20 * 1.2,
    color: COLORS.black[900],
    includeFontPadding: false,
  },
  body1: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: COLORS.black[900],
    includeFontPadding: false,
  },
  body2: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: COLORS.black[900],
    includeFontPadding: false,
  },
  body3: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: COLORS.black[900],
    includeFontPadding: false,
  },
});
