import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "@/ui/Typography";
import { COLORS } from "@/constants/colors";
import { ProductReview } from "@/types/product";

export const ProductReviewCard = ({ data }: { data: ProductReview }) => {
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Typography variant="body2" color={COLORS.black[800]} font="semibold">
          {data.reviewerName}
        </Typography>
        <Typography variant="body3" color={COLORS.black[500]}>
          {new Date(data.date).toLocaleDateString()}
        </Typography>
      </View>
      <View style={styles.rating}>
        <Typography variant="body3" color={COLORS.black[500]}>
          {"★".repeat(data.rating)}
          {"☆".repeat(5 - data.rating)}
        </Typography>
      </View>
      <Typography
        variant="body2"
        color={COLORS.black[700]}
        style={styles.comment}
      >
        {data.comment}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  item: {
    backgroundColor: COLORS.black[100],
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
  },
  comment: {
    lineHeight: 18,
  },
});
