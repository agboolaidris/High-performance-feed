import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { CartIcon } from "@/components/icons/Cart";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CartStateProps {
  handleContinueShopping: () => void;
}
export const CartEmptyState = ({ handleContinueShopping }: CartStateProps) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <CartIcon size={64} color={COLORS.black[300]} />
      </View>
      <Typography
        variant="header3"
        color={COLORS.black[600]}
        style={styles.emptyTitle}
      >
        Your cart is empty
      </Typography>
      <Typography
        variant="body2"
        color={COLORS.black[500]}
        style={styles.emptyMessage}
      >
        Add some products to get started
      </Typography>
      <Button onPress={handleContinueShopping}>
        <Typography variant="body2" color={COLORS.white} font="semibold">
          Continue Shopping
        </Typography>
        <ArrowRightIcon size={20} color={COLORS.white} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
});
