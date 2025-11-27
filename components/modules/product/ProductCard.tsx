// components/modules/product/ProductCard.tsx
import React, { useMemo } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { Typography } from "@/ui/Typography";
import { RatingStars } from "@/components/ui/RatingStar";
import { currencyFormat } from "@/lib/currencyFormat";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: object;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: any[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: object;
  images: string[];
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const router = useRouter();

  const calculateDiscountedPrice = useMemo(() => {
    const discountAmount = (product.price * product.discountPercentage) / 100;
    return product.price - discountAmount;
  }, [product.price, product.discountPercentage]);

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    } else {
      //router.push(`/product/${product.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Product Image with Badges */}
      <View style={styles.imageContainer}>
        {product.thumbnail ? (
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Typography variant="body3" color={COLORS.black[600]} font="medium">
              No Image
            </Typography>
          </View>
        )}

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Typography variant="body3" color={COLORS.white} font="semibold">
              -{product.discountPercentage}%
            </Typography>
          </View>
        )}

        {/* Stock Status Badge */}
        <View
          style={[
            styles.stockBadge,
            { backgroundColor: product.stock > 0 ? COLORS.green : COLORS.red },
          ]}
        >
          <Typography variant="body3" color={COLORS.white} font="semibold">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </Typography>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        {/* Brand */}
        <Typography
          variant="body3"
          color={COLORS.black[600]}
          font="medium"
          numberOfLines={1}
          style={styles.brandText}
        >
          {product.brand}
        </Typography>

        {/* Product Title */}
        <Typography
          variant="body3"
          color={COLORS.black[800]}
          font="semibold"
          numberOfLines={2}
          style={styles.titleText}
        >
          {product.title}
        </Typography>

        {/* Rating */}
        <RatingStars size="sm" rating={product.rating} />

        {/* Price Section */}
        <View style={styles.priceContainer}>
          {product.discountPercentage > 0 ? (
            <>
              <Typography variant="body2" color={COLORS.black[800]} font="bold">
                {currencyFormat(calculateDiscountedPrice)}
              </Typography>
              <Typography
                variant="body3"
                color={COLORS.black[400]}
                font="medium"
                style={styles.originalPrice}
              >
                ${product.price.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color={COLORS.black[800]} font="bold">
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 224,
    gap: 8,
    margin: 6,
  },
  imageContainer: {
    width: "100%",
    height: 149,
    backgroundColor: COLORS.black[100],
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black[200],
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.red,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  infoContainer: {
    gap: 4,
    flex: 1,
  },
  brandText: {
    textTransform: "uppercase",
  },
  titleText: {
    lineHeight: 14,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
});
