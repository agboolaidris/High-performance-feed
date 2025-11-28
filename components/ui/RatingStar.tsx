import { View, StyleSheet } from 'react-native';

import { COLORS } from '@/constants/co';

import { Typography } from './Typography';

export type RatingSize = 'sm' | 'md' | 'lg';

interface RatingStarsProps {
  rating: number;
  size?: RatingSize;
  showRatingText?: boolean;
}

export const RatingStars = ({
  rating,
  size = 'md',
  showRatingText = true,
}: RatingStarsProps) => {
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  // Size configuration
  const sizeConfig = {
    sm: {
      starVariant: 'body3' as const,
      textVariant: 'body3' as const,
      gap: 4,
    },
    md: {
      starVariant: 'body2' as const,
      textVariant: 'body2' as const,
      gap: 8,
    },
    lg: {
      starVariant: 'body1' as const,
      textVariant: 'body1' as const,
      gap: 8,
    },
  };

  const config = sizeConfig[size];

  return (
    <View style={[styles.ratingStars, { gap: config.gap }]}>
      <Typography variant={config.starVariant} color={COLORS.black[500]}>
        {'★'.repeat(filledStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(5 - filledStars - (halfStar ? 1 : 0))}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    // marginLeft is now handled by gap
  },
});
