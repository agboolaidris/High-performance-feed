import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Typography } from "@/ui/Typography";
import { Button } from "@/ui/Button";
import { COLORS } from "@/constants/colors";
import { CustomScrollView } from "@/components/ui/Wrapper";
import { useProductsCartStore } from "@/stores/cartProductsStore";
import { CartItem } from "@/components/modules/cart/CartItem";
import { TrashIcon } from "@/components/icons/Trash";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { TextField } from "@/components/ui/TextField";
import { CartEmptyState } from "@/components/modules/cart/CartState";
import { currencyFormat } from "@/lib/currencyFormat";

const CartScreen = () => {
  const router = useRouter();
  const { items, clearCart, getTotalPrice, getTotalItems } =
    useProductsCartStore();

  const { subtotal, shipping, tax, total } = useMemo(() => {
    const subtotal = getTotalPrice();
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
    };
  }, [getTotalPrice, items]);

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCart,
        },
      ]
    );
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    // router.push("/checkout");
  };

  const handleContinueShopping = () => {
    router.back();
  };

  // Get current cart count for header
  const cartItemCount = getTotalItems();
  const isEmpty = items.length === 0;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Typography
              variant="body1"
              color={COLORS.black[900]}
              font="semibold"
            >
              Cart ({cartItemCount})
            </Typography>
          ),
          headerRight: () =>
            !isEmpty ? (
              <TouchableOpacity
                onPress={handleClearCart}
                style={styles.clearButton}
              >
                <TrashIcon size={20} color={COLORS.red} />
              </TouchableOpacity>
            ) : null,
        }}
      />

      {/* Empty cart state */}
      {isEmpty ? (
        <CartEmptyState handleContinueShopping={handleContinueShopping} />
      ) : (
        <>
          <CustomScrollView contentContainerStyle={styles.container}>
            {/* Cart Items */}
            <View style={styles.itemsSection}>
              <Typography
                variant="header4"
                color={COLORS.black[900]}
                style={styles.sectionTitle}
              >
                Cart Items ({cartItemCount})
              </Typography>
              <View style={styles.itemsList}>
                {items.map((item, index) => (
                  <CartItem
                    key={`${item.product.id}-${index}`}
                    item={item}
                    isLast={index === items.length - 1}
                  />
                ))}
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.summarySection}>
              <Typography
                variant="header4"
                color={COLORS.black[900]}
                style={styles.sectionTitle}
              >
                Order Summary
              </Typography>

              <View style={styles.summaryList}>
                <View style={styles.summaryRow}>
                  <Typography variant="body2" color={COLORS.black[600]}>
                    Subtotal ({cartItemCount} items)
                  </Typography>
                  <Typography
                    variant="body2"
                    color={COLORS.black[800]}
                    font="medium"
                  >
                    {currencyFormat(subtotal)}
                  </Typography>
                </View>

                <View style={styles.summaryRow}>
                  <Typography variant="body2" color={COLORS.black[600]}>
                    Shipping
                  </Typography>
                  <Typography
                    variant="body2"
                    color={COLORS.black[800]}
                    font="medium"
                  >
                    {currencyFormat(shipping)}
                  </Typography>
                </View>

                <View style={styles.summaryRow}>
                  <Typography variant="body2" color={COLORS.black[600]}>
                    Tax
                  </Typography>
                  <Typography
                    variant="body2"
                    color={COLORS.black[800]}
                    font="medium"
                  >
                    {currencyFormat(tax)}
                  </Typography>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                  <Typography
                    variant="body1"
                    color={COLORS.black[900]}
                    font="semibold"
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="header4"
                    color={COLORS.black[900]}
                    font="bold"
                  >
                    {currencyFormat(total)}
                  </Typography>
                </View>
              </View>
            </View>

            {/* Promo Code Section */}
            <View style={styles.promoSection}>
              <Typography
                variant="body1"
                color={COLORS.black[800]}
                font="medium"
                style={styles.promoTitle}
              >
                Have a promo code?
              </Typography>
              <TextField
                containerStyle={{ width: 160 }}
                placeholder="Enter promo code"
              />
            </View>
          </CustomScrollView>

          {/* Fixed Checkout Button */}
          <View style={styles.checkoutBar}>
            <View style={styles.totalContainer}>
              <Typography variant="body2" color={COLORS.black[600]}>
                Total
              </Typography>
              <Typography
                variant="header4"
                color={COLORS.black[900]}
                font="bold"
              >
                {currencyFormat(total)}
              </Typography>
            </View>
            <Button onPress={handleCheckout} style={styles.checkoutButton}>
              <Typography variant="body2" color={COLORS.white} font="semibold">
                Proceed to Checkout
              </Typography>
              <ArrowRightIcon size={20} color={COLORS.white} />
            </Button>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120, // Space for fixed checkout button
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
  itemsSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  summarySection: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  summaryList: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black[200],
    marginVertical: 8,
  },
  promoSection: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoTitle: {
    flex: 1,
  },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    // borderTopWidth: 1,
    // borderTopColor: COLORS.black[200],
    gap: 12,
  },
  totalContainer: {
    flex: 1,
  },
  checkoutButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});

export default CartScreen;
