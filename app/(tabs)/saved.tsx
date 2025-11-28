import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";

import { SearchIcon } from "@/components/icons/Search";
import { ProductCard } from "@/components/modules/product/ProductCard";
import { CustomFlashList } from "@/components/ui/CustomFlashList";
import { EmptyState, ErrorState } from "@/components/ui/StateComponents";
import { COLORS } from "@/constants/color";
import { useSavedProductstore } from "@/stores/savedProductsStore";
import { Button } from "@/ui/Button";
import { Typography } from "@/ui/Typography";

const FavouritesScreen = () => {
  const { push } = useRouter();
  const { favorites, clearFavorites } = useSavedProductstore();

  const [sortBy, setSortBy] = useState<"recent" | "name" | "price">("recent");

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    // Apply sorting
    switch (sortBy) {
      case "recent":
        return filtered.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      case "name":
        return filtered.sort((a, b) =>
          a.product.title.localeCompare(b.product.title)
        );
      case "price":
        return filtered.sort((a, b) => a.product.price - b.product.price);
      default:
        return filtered;
    }
  }, [favorites, sortBy]);

  const getFavoritesCount = useMemo(() => {
    return filteredFavorites.length;
  }, [filteredFavorites]);

  const handleClearAllFavorites = () => {
    if (favorites.length === 0) return;

    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all items from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearFavorites,
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteItem}>
      <ProductCard
        onPress={() => push(`/products/${item.product.id}`)}
        product={item.product}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Sort and Clear Actions */}
      {favorites.length > 0 && (
        <View style={styles.actionsSection}>
          <View style={styles.sortSection}>
            <Typography
              variant="body2"
              color={COLORS.black[600]}
              style={styles.sortLabel}
            >
              Sort by:
            </Typography>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === "recent" && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy("recent")}
              >
                <Typography
                  variant="body3"
                  color={sortBy === "recent" ? COLORS.white : COLORS.black[600]}
                  font="medium"
                >
                  Recent
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === "name" && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy("name")}
              >
                <Typography
                  variant="body3"
                  color={sortBy === "name" ? COLORS.white : COLORS.black[600]}
                  font="medium"
                >
                  Name
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === "price" && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy("price")}
              >
                <Typography
                  variant="body3"
                  color={sortBy === "price" ? COLORS.white : COLORS.black[600]}
                  font="medium"
                >
                  Price
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            variant="outline"
            onPress={handleClearAllFavorites}
            style={styles.clearButton}
          >
            <Typography variant="body3" color={COLORS.red} font="medium">
              Clear All
            </Typography>
          </Button>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft(props) {
            return (
              <View style={styles.headerTop}>
                <Typography
                  variant="header3"
                  color={COLORS.black[900]}
                  font="bold"
                >
                  Saved
                </Typography>
                <Typography variant="body2" color={COLORS.black[600]}>
                  {getFavoritesCount}{" "}
                  {getFavoritesCount === 1 ? "item" : "items"}
                </Typography>
              </View>
            );
          },
          headerTitleStyle: {
            fontFamily: "GeneralSans-Semibold",
            fontSize: 16,
            color: COLORS.black[900],
          },
        }}
      />
      {renderHeader()}
      <>
        {favorites.length === 0 ? (
          <EmptyState
            title="No Saved Products Found"
            message={`No saved products found. Try adding some products to your favorites.`}
            actionLabel="Add Products"
            onAction={() => push("/")}
            icon={<SearchIcon size={64} color={COLORS.black[300]} />}
          />
        ) : (
          <CustomFlashList
            data={filteredFavorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.product.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ErrorState
                title="Failed to Load Favorites"
                message="We couldn't load your saved products. Please check your connection and try again."
                actionLabel="Try Again"
              />
            }
          />
        )}
      </>
    </>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    gap: 4,
    paddingHorizontal: 16,
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sortSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sortLabel: {
    marginRight: 8,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.black[100],
    borderWidth: 1,
    borderColor: COLORS.black[200],
  },
  sortButtonActive: {
    backgroundColor: COLORS.black[900],
    borderColor: COLORS.black[900],
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 40,
    borderColor: COLORS.red,
  },
  favoriteItem: {
    marginBottom: 16,
  },
});

export default FavouritesScreen;
