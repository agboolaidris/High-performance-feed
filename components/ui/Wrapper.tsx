import { View, ViewProps, ScrollViewProps, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/co';

export const Wrapper = ({
  style,
  parentBackground,
  children,
  ...rest
}: ViewProps & { parentBackground?: string }) => {
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: parentBackground,
          flex: 1,
        },
      ]}
    >
      <View style={[{ paddingHorizontal: 16 }, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export const CustomScrollView = ({
  style,
  contentContainerStyle,
  ...props
}: ScrollViewProps) => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: COLORS.white,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    />
  );
};
