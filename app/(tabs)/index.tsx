import React, { useMemo, useCallback, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useRouter } from "expo-router";
import { FilterIcon } from "@/components/icons/Filter";
import { COLORS } from "@/constants/colors";
import { CustomFlashList } from "@/ui/CustomFlashList";
import { ProductCategoriesList } from "@/components/modules/product/ProductCategoriesList";
import { ProductCard } from "@/components/modules/product/ProductCard";
import { useInfiniteProducts } from "@/hooks/useProducts";
import { CustomRefreshControl } from "@/ui/CustomRefreshControl";
import { Typography } from "@/ui/Typography";
import { ProductsParams } from "@/types/product";
import {
  ProductEmptyState,
  ProductErrorState,
  ProductLoadingState,
} from "@/components/modules/product/ProductState";
import { MicrophoneIcon } from "@/components/icons/Microphone";
import { SearchIcon } from "@/components/icons/Search";

const Screen = () => {
  const { push } = useRouter();
  const [params, setParams] = useState<ProductsParams>({
    sortBy: "rating",
    sortOrder: "desc",
    category: "all",
  });

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isFetchingNextPage,
    error,
  } = useInfiniteProducts(params);

  // Memoized data transformation
  const productions = useMemo(
    () => data?.pages.flatMap((page) => page.products) || [],
    [data]
  );

  // Memoized callbacks
  const handleProductPress = useCallback(
    (productId: number) => {
      push(`/products/${productId}`);
    },
    [push]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCategoryPress = useCallback((category: string) => {
    setParams((prev) => ({
      ...prev,
      category: category.toLowerCase() === "all" ? undefined : category,
    }));
  }, []);

  // Footer component for loading more
  const ListFooterComponent = useMemo(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator color={COLORS.black[600]} size="small" />
        <Typography
          variant="body3"
          color={COLORS.black[600]}
          style={styles.footerText}
        >
          Loading more products...
        </Typography>
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextField
            containerStyle={styles.searchField}
            placeholder="Search for anything..."
            leftIcon={<SearchIcon />}
            rightIcon={<MicrophoneIcon />}
          />
          <Button style={styles.filterButton}>
            <FilterIcon color={COLORS.white} />
          </Button>
        </View>
        <View>
          <ProductCategoriesList
            selectedCategory={params.category}
            onPress={handleCategoryPress}
          />
        </View>
      </View>

      {!isLoading && error ? (
        <ProductErrorState refresh={handleRefresh} />
      ) : null}

      {isLoading ? <ProductLoadingState /> : null}
      {!isLoading && productions.length === 0 && <ProductEmptyState />}
      {!isLoading && productions.length > 0 ? (
        <CustomFlashList
          refreshControl={
            <CustomRefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={() => <ProductEmptyState />}
          data={productions}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.productItem,
                {
                  paddingLeft: index % 2 === 0 ? 16 : 8,
                  paddingRight: index % 2 === 0 ? 8 : 16,
                  width: "100%",
                },
              ]}
            >
              <ProductCard
                onPress={() => handleProductPress(item.id)}
                product={item}
              />
            </View>
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          numColumns={2}
          ListFooterComponent={ListFooterComponent}
          estimatedItemSize={250}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  // Header styles
  headerContainer: {
    gap: 10,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
  },
  searchField: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 20,
  },

  // List styles
  listContent: {
    paddingHorizontal: 0,
    flexGrow: 1,
  },

  productItem: {
    paddingVertical: 8,
    width: "100%",
  },

  // Footer
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  footerText: {
    // Additional text styling if needed
  },
});

export default Screen;
