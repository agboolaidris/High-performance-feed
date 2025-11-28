import { View, StyleSheet } from "react-native";
import { COLORS } from "@/constants/color";
import { Typography } from "./Typography";

export type RatingSize = "sm" | "md" | "lg";

interface RatingStarsProps {
  rating: number;
  size?: RatingSize;
  showRatingText?: boolean;
}

export const RatingStars = ({
  rating,
  size = "md",
  showRatingText = true,
}: RatingStarsProps) => {
  // 1. Calculate the number of filled stars by rounding the rating to the nearest whole number.
  const roundedRating = Math.round(rating);
  const filledStars = Math.min(5, Math.max(0, roundedRating)); // Ensure it stays between 0 and 5
  const emptyStars = 5 - filledStars;

  const sizeConfig = {
    sm: {
      starVariant: "body3" as const,
      textVariant: "body3" as const,
      gap: 4,
    },
    md: {
      starVariant: "body2" as const,
      textVariant: "body2" as const,
      gap: 8,
    },
    lg: {
      starVariant: "body1" as const,
      textVariant: "body1" as const,
      gap: 8,
    },
  };

  const config = sizeConfig[size];

  return (
    <View style={[styles.ratingStars, { gap: config.gap }]}>
      <Typography
        variant={config.starVariant}
        color={COLORS.black[500]}
        style={styles.starsText}
      >
        {/* Render only full stars (★) and empty stars (☆) */}
        {"★".repeat(filledStars)}
        {"☆".repeat(emptyStars)}
      </Typography>
      {showRatingText && (
        <Typography
          variant={config.textVariant}
          color={COLORS.black[600]}
          style={styles.ratingText}
        >
          ({rating.toFixed(1)})
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Ensure the star text is vertically aligned correctly
  starsText: {
    // This lineHeight is often necessary to prevent star icons from misaligning vertically
    lineHeight: 20,
  },
  ratingText: {
    // marginLeft is handled by gap on the parent View
  },
});
