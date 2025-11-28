import React, { useMemo, memo, useCallback } from 'react';
import { View } from 'react-native';

import { useCategories } from '@/hooks/useProducts';
import { Button } from '@/ui/Button';
import { CustomFlashList } from '@/ui/CustomFlashList';
import { Typography } from '@/ui/Typography';

interface CategoryItemProps {
  item: any;
  index: number;
  totalItems: number;
  isSelected: boolean;
  onPress: (category: string) => void;
}

// Memoized individual category item for better performance
const CategoryItem = memo(
  ({ item, index, totalItems, isSelected, onPress }: CategoryItemProps) => (
    <View
      style={{
        marginRight: index === totalItems - 1 ? 16 : 8,
        marginLeft: index === 0 ? 16 : 0,
      }}
    >
      <Button
        variant={isSelected ? 'primary' : 'outline'}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          height: 36,
          minWidth: 60,
        }}
        onPress={() => onPress(item.name)}
      >
        <Typography
          variant="body3"
          font={isSelected ? 'semibold' : 'medium'}
          color={isSelected ? 'white' : undefined}
          numberOfLines={1}
        >
          {item.name}
        </Typography>
      </Button>
    </View>
  ),
);

interface ProductCategoriesListProps {
  onPress: (category: string) => void;
  selectedCategory?: string;
  showAllCategory?: boolean;
}

export const ProductCategoriesList = ({
  onPress,
  selectedCategory = 'All',
  showAllCategory = true,
}: ProductCategoriesListProps) => {
  // ALWAYS call hooks at the top level - no conditions!
  const {
    data: productCategoriesData = [],
    isLoading,
    error,
  } = useCategories();

  // Prepare categories data
  const categories = useMemo(() => {
    // Return empty array if loading, error, or no data
    if (
      isLoading ||
      error ||
      !productCategoriesData ||
      productCategoriesData.length === 0
    ) {
      return [];
    }

    const baseCategories = showAllCategory
      ? [{ id: 'all', name: 'All' }, ...productCategoriesData]
      : productCategoriesData;

    return baseCategories;
  }, [showAllCategory, productCategoriesData, isLoading, error]);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <CategoryItem
        item={item}
        index={index}
        totalItems={categories.length}
        isSelected={item.name.toLowerCase() === selectedCategory.toLowerCase()}
        onPress={onPress}
      />
    ),
    [categories.length, selectedCategory, onPress],
  );

  // Don't render the list if no categories to show
  if (categories.length === 0) {
    return null;
  }

  return (
    <CustomFlashList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      estimatedItemSize={100}
      keyExtractor={(item) => item.name}
      contentContainerStyle={{
        paddingVertical: 12,
        paddingHorizontal: 0,
      }}
      extraData={selectedCategory}
    />
  );
};

CategoryItem.displayName = 'CategoryItem';
