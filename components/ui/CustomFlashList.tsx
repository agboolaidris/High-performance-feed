import { FlashList, FlashListProps } from '@shopify/flash-list';

import { COLORS } from '@/constants/color';

interface CustomFlashListProps<T> extends FlashListProps<T> {}

export const CustomFlashList = <T,>({
  style,
  estimatedItemSize,
  contentContainerStyle, // Make this required or provide default
  ...props
}: CustomFlashListProps<T>) => {
  return (
    <FlashList<T>
      keyboardShouldPersistTaps="handled"
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        ...contentContainerStyle,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      estimatedItemSize={estimatedItemSize || 100} // Provide default
      {...props}
    />
  );
};
