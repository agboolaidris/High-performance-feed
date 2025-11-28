import { useRouter } from "expo-router";
import React, { useMemo, useCallback, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useDebouncedCallback } from "use-debounce";

import { FilterIcon } from "@/components/icons/Filter";
import { PackageIcon } from "@/components/icons/Pacakge";
import { CloseIcon } from "@/components/icons/Close";
import { SearchIcon } from "@/components/icons/Search";
import { ProductCard } from "@/components/modules/product/ProductCard";
import { ProductCategoriesList } from "@/components/modules/product/ProductCategoriesList";
import { Button } from "@/components/ui/Button";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/StateComponents";
import { TextField } from "@/components/ui/TextField";
import { COLORS } from "@/constants/color";
import { useInfiniteProducts } from "@/hooks/useProducts";
import { ProductsParams } from "@/types/product";
import { CustomFlashList } from "@/ui/CustomFlashList";
import { CustomRefreshControl } from "@/ui/CustomRefreshControl";
import { Typography } from "@/ui/Typography";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

const Screen = () => {
  const { push } = useRouter();
  const [search, setSearch] = useState("");
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
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) || [],
    [data]
  );

  // Memoized callbacks
  const handleProductPress = useCallback(
    (productId: number) => {
      push(`/product/${productId}`);
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
      q: "",
    }));
    setSearch(""); // Clear search when category changes
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setParams((prev) => ({ ...prev, q: "" }));
  }, []);

  const debounceSearchText = useDebouncedCallback((value: string) => {
    setParams((prev) => ({
      ...prev,
      q: value,
    }));
  }, 500); // Reduced debounce time for better UX

  // Search right icon
  const searchRightIcon = useMemo(() => {
    if (search.length > 0) {
      return (
        <AnimatedPressable onPress={handleClearSearch}>
          <CloseIcon size={20} color={COLORS.black[400]} />
        </AnimatedPressable>
      );
    }
    return null;
  }, [search, handleClearSearch]);

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

  // Handle search change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      debounceSearchText(value);
    },
    [debounceSearchText]
  );

  // Determine which content to show
  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingState
          title="Loading Products..."
          message="Please wait while we fetch the latest products"
          size="large"
        />
      );
    }

    if (error && products.length === 0) {
      return (
        <ErrorState
          title="Failed to Load Products"
          message="We couldn't load the product catalog. Please check your connection and try again."
          actionLabel="Try Again"
          onAction={handleRefresh}
          icon={<PackageIcon size={64} color={COLORS.black[300]} />}
        />
      );
    }

    if (products.length === 0) {
      if (params.q) {
        return (
          <EmptyState
            title="No Products Found"
            message={`No results found for "${params.q}". Try adjusting your search terms.`}
            actionLabel="Clear Search"
            onAction={handleClearSearch}
            icon={<SearchIcon size={64} color={COLORS.black[300]} />}
          />
        );
      }

      return (
        <EmptyState
          title="No Products Available"
          message="There are currently no products in this category. Check back later for new arrivals."
          actionLabel="Browse All Products"
          onAction={() => handleCategoryPress("all")}
          icon={<PackageIcon size={64} color={COLORS.black[300]} />}
        />
      );
    }

    return (
      <CustomFlashList
        refreshControl={
          <CustomRefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
          />
        }
        data={products}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.productItem,
              {
                paddingLeft: index % 2 === 0 ? 16 : 8,
                paddingRight: index % 2 === 0 ? 8 : 16,
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
        onEndReachedThreshold={0.3} // More responsive threshold
        numColumns={2}
        ListFooterComponent={ListFooterComponent}
        estimatedItemSize={224} // Match ProductCard height
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true} // Performance optimization
      />
    );
  }, [
    isLoading,
    error,
    products,
    params.q,
    isRefetching,
    handleRefresh,
    handleClearSearch,
    handleCategoryPress,
    handleProductPress,
    handleEndReached,
    ListFooterComponent,
  ]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextField
            containerStyle={styles.searchField}
            placeholder="Search for anything..."
            leftIcon={<SearchIcon size={20} color={COLORS.black[400]} />}
            rightIcon={searchRightIcon}
            value={search}
            keyboardType="web-search"
            returnKeyType="search"
            onChangeText={handleSearchChange}
            onSubmitEditing={() => debounceSearchText.flush()} // Immediate search on submit
          />
          <Button style={styles.filterButton}>
            <FilterIcon size={20} color={COLORS.white} />
          </Button>
        </View>

        <ProductCategoriesList
          selectedCategory={params.category}
          onPress={handleCategoryPress}
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>{renderContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
  },
  // Header styles
  headerContainer: {
    gap: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    minWidth: 52, // Consistent button size
  },

  // List styles
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    flexGrow: 1,
  },

  productItem: {
    paddingVertical: 8,
    width: "50%", // More reliable than 100% with padding
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
