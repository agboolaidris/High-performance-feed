import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { COLORS } from '@/constants/color';
import { Typography } from '@/ui/Typography';

export interface BadgeProps {
  count: number;
  maxCount?: number;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showZero?: boolean;
  style?: ViewStyle;
  color?: string;
  textColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  size = 'md',
  position = 'top-right',
  showZero = false,
  style,
  color = COLORS.red,
  textColor = COLORS.white,
}) => {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Size configuration
  const sizeConfig = {
    sm: {
      minWidth: 16,
      height: 16,
      fontSize: 9,
      lineHeight: 10,
    },
    md: {
      minWidth: 18,
      height: 18,
      fontSize: 10,
      lineHeight: 12,
    },
    lg: {
      minWidth: 20,
      height: 20,
      fontSize: 11,
      lineHeight: 13,
    },
  };

  const config = sizeConfig[size];

  // Position configuration
  const positionConfig = {
    'top-right': { top: -4, right: -4 },
    'top-left': { top: -4, left: -4 },
    'bottom-right': { bottom: -4, right: -4 },
    'bottom-left': { bottom: -4, left: -4 },
  };

  const positionStyle = positionConfig[position];

  return (
    <View
      style={[
        styles.badge,
        {
          minWidth: config.minWidth,
          height: config.height,
          backgroundColor: color,
          ...positionStyle,
        },
        style,
      ]}
    >
      <Typography
        variant="body3"
        color={textColor}
        font="bold"
        style={{
          fontSize: config.fontSize,
          lineHeight: config.lineHeight,
        }}
      >
        {displayCount}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
