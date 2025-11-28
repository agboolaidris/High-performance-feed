import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import { COLORS } from '@/constants/color';

interface CustomRefreshControlProps extends RefreshControlProps {}

export const CustomRefreshControl = (props: CustomRefreshControlProps) => {
  return (
    <RefreshControl
      colors={[COLORS.black[600], COLORS.black[600], COLORS.black[600]]}
      progressBackgroundColor={COLORS.white}
      tintColor={COLORS.black[600]}
      titleColor={COLORS.black[600]}
      {...props}
    />
  );
};
