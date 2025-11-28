import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { TrashIcon } from '@/components/icons/Trash';
import { COLORS } from '@/constants/co';
import { useProductsCartStore } from '@/stores/cartProductsStore';
import { Product } from '@/types/product';
import { Typography } from '@/ui/Typography';

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
  isLast?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({ item, isLast = false }) => {
  const { updateQuantity, removeItem } = useProductsCartStore();

  const calculateItemPrice = () => {
    const price =
      item.product.discountPercentage > 0
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;
    return (price * item.quantity).toFixed(2);
  };

  const handleIncrease = () => {
    if (item.quantity >= item.product.stock) {
      Alert.alert(
        'Stock Limit',
        `Only ${item.product.stock} items available in stock.`,
      );
      return;
    }
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    Alert.alert('Remove Item', `Remove ${item.product.title} from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeItem(item.product.id),
      },
    ]);
  };

  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      {/* Product Image */}
      <Image
        source={{ uri: item.product.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Product Details */}
      <View style={styles.details}>
        <Typography
          variant="body2"
          color={COLORS.black[800]}
          font="semibold"
          numberOfLines={2}
          style={styles.title}
        >
          {item.product.title}
        </Typography>

        <Typography
          variant="body3"
          color={COLORS.black[600]}
          style={styles.brand}
        >
          {item.product.brand}
        </Typography>

        {/* Price */}
        <View style={styles.priceContainer}>
          {item.product.discountPercentage > 0 ? (
            <>
              <Typography variant="body2" color={COLORS.black[900]} font="bold">
                $
                {(
                  item.product.price *
                  (1 - item.product.discountPercentage / 100)
                ).toFixed(2)}
              </Typography>
              <Typography
                variant="body3"
                color={COLORS.black[400]}
                font="medium"
                style={styles.originalPrice}
              >
                ${item.product.price.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color={COLORS.black[900]} font="bold">
              ${item.product.price.toFixed(2)}
            </Typography>
          )}
        </View>

        {/* Quantity Controls */}
        <View style={styles.controls}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrease}
            >
              <Typography variant="body2" color={COLORS.black[800]} font="bold">
                -
              </Typography>
            </TouchableOpacity>

            <Typography
              variant="body2"
              color={COLORS.black[800]}
              font="semibold"
              style={styles.quantity}
            >
              {item.quantity}
            </Typography>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrease}
            >
              <Typography variant="body2" color={COLORS.black[800]} font="bold">
                +
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Remove Button */}
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <TrashIcon size={16} color={COLORS.red} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Price */}
      <View style={styles.total}>
        <Typography variant="body1" color={COLORS.black[900]} font="bold">
          ${calculateItemPrice()}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black[100],
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.black[100],
  },
  details: {
    flex: 1,
    gap: 4,
  },
  title: {
    lineHeight: 18,
  },
  brand: {
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black[100],
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  quantity: {
    width: 32,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  total: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
