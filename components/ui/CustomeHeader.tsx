import { Header as RHeader } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Platform, StatusBar } from 'react-native';

import { COLORS } from '@/constants/color';
import { ArrowLeftIcon } from '@/icons/ArrowLeft';

import { AnimatedPressable } from './AnimatedPressable';
import { Typography } from './Typography';

export const CustomHeader: React.FC<NativeStackHeaderProps> = ({
  options,
  back,
  navigation,
}) => {
  const canGoBack = !!back;
  const userHasCustomHeaderLeft = !!options.headerLeft;

  // Decide what to show on the left
  const headerLeft = userHasCustomHeaderLeft
    ? options.headerLeft // ← User wins — use their custom headerLeft
    : canGoBack
      ? () => (
          <AnimatedPressable
            onPress={navigation.goBack}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              justifyContent: 'center',
            }}
            hitSlop={20}
          >
            <ArrowLeftIcon />
          </AnimatedPressable>
        )
      : undefined; // nothing

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <RHeader
        title=""
        // Big, beautiful title
        headerTitle={() => (
          <Typography variant="header2" font="semibold">
            {options.title || ' '}
          </Typography>
        )}
        // Smart left side — respects user override
        headerLeft={headerLeft}
        headerStyle={{
          backgroundColor: COLORS.white,
          height: Platform.OS === 'ios' ? 120 : 100,
          shadowColor: 'transparent',
          elevation: 0,
        }}
        headerRightContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
        // Spread last so user can override anything
        {...options}
      />
    </>
  );
};
