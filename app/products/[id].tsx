import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartIcon } from '@/components/icons/Cart';
import { PackageIcon } from '@/components/icons/Pacakge';
import { SearchIcon } from '@/components/icons/Search';
import { ProductReviewCard } from '@/components/modules/product/ProductReviewCard';
import { Badge } from '@/components/ui/Badge';
import { CustomRefreshControl } from '@/components/ui/CustomRefreshControl';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui/StateComponents';
import { COLORS } from '@/constants/color';
import { useProduct } from '@/hooks/useProducts';
import { HeartIcon } from '@/icons/Heart';
import { currencyFormat } from '@/lib/currencyFormat';
import { useProductsCartStore } from '@/stores/cartProductsStore';
import { useSavedProductstore } from '@/stores/savedProductsStore';
import { Button } from '@/ui/Button';
import { RatingStars } from '@/ui/RatingStar';
import { Typography } from '@/ui/Typography';
import { CustomScrollView } from '@/ui/Wrapper';

const ProductDetail = () => {
  const { push } = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [localQuantity, setLocalQuantity] = useState(1);

  const { addItem, removeItem, items, updateQuantity } = useProductsCartStore();
  const { toggleFavorite, isFavorite } = useSavedProductstore();
  const { getTotalItems } = useProductsCartStore();
  const cartItemCount = getTotalItems();
  const {
    data: productData,
    isLoading,
    refetch,
    error,
    isRefetching,
  } = useProduct(id || '');

  // Check if product is already in cart and get current quantity
  const cartItem = items.find((item) => item.product.id === productData?.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // Sync local quantity with cart quantity when product is in cart
  useEffect(() => {
    if (isInCart && cartQuantity > 0) {
      setLocalQuantity(cartQuantity);
    }
  }, [isInCart, cartQuantity]);

  // Calculate discounted price
  const calculateDiscountedPrice = useMemo(() => {
    if (!productData) return 0;
    if (productData.discountPercentage > 0) {
      const discountAmount =
        (productData.price * productData.discountPercentage) / 100;
      return productData.price - discountAmount;
    }
    return productData.price;
  }, [productData]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return calculateDiscountedPrice * localQuantity;
  }, [calculateDiscountedPrice, localQuantity]);

  // Toggle favourite
  const toggleFavourite = () => {
    if (productData) {
      toggleFavorite(productData);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!productData) return;
    addItem(productData, localQuantity);
  };

  // Update quantity in cart handler
  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (!productData) return;

    if (newQuantity <= 0) {
      // Remove from cart if quantity becomes 0
      removeItem(productData.id);
      setLocalQuantity(1);
    } else {
      // Update quantity in cart
      updateQuantity(productData.id, newQuantity);
    }
  };

  // Remove from cart handler
  const handleRemoveFromCart = () => {
    if (!productData) return;
    removeItem(productData.id);
    setLocalQuantity(1);
  };

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);

    if (isInCart) {
      handleUpdateCartQuantity(newQuantity);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(1, localQuantity - 1);
    setLocalQuantity(newQuantity);

    if (isInCart) {
      handleUpdateCartQuantity(newQuantity);
    }
  };

  const currentImage =
    productData?.images?.[selectedImageIndex] || productData?.thumbnail;

  if (isLoading)
    return (
      <LoadingState
        title="Loading Product Details..."
        message="Please wait while we fetch the product information"
        size="large"
      />
    );

  if (error)
    return (
      <ErrorState
        title="Product Not Found"
        message={
          id
            ? `We couldn't find product #${id}. It might be unavailable or removed from our catalog.`
            : "The product you're looking for doesn't exist or has been removed."
        }
        actionLabel="Try Again"
        onAction={refetch}
        icon={<SearchIcon size={64} color={COLORS.black[300]} />}
      />
    );

  if (!productData)
    return (
      <EmptyState
        title="Product Unavailable"
        message="This product is currently not available for viewing. It might be out of stock, discontinued, or undergoing updates."
        actionLabel="Browse Products"
        onAction={() => push('/')}
        icon={<PackageIcon size={64} color={COLORS.black[300]} />}
      />
    );

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
              {productData.title}
            </Typography>
          ),
          headerTitleStyle: {
            fontSize: 12,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ position: 'relative' }}
              onPress={() => push('/cart')}
            >
              <CartIcon size={28} />
              <Badge count={cartItemCount} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Main content without SafeAreaView */}
      <CustomScrollView
        refreshControl={
          <CustomRefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Image Gallery with Favourite Button */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentImage }}
              style={styles.mainImage}
              resizeMode="contain"
            />

            {/* Favourite Button - Top Right Corner */}
            <TouchableOpacity
              style={styles.favouriteButton}
              onPress={toggleFavourite}
            >
              <HeartIcon filled={isFavorite(productData.id)} size={20} />
            </TouchableOpacity>
          </View>

          {/* Thumbnail Gallery */}
          {productData.images && productData.images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
            >
              {productData.images.map((image: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Brand & Title with Rating */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Typography
                variant="body3"
                color={COLORS.black[600]}
                font="medium"
                style={styles.brand}
              >
                {productData.brand}
              </Typography>
            </View>
            <Typography
              variant="header4"
              color={COLORS.black[900]}
              style={styles.title}
            >
              {productData.title}
            </Typography>
            <RatingStars rating={productData.rating} />
          </View>

          {/* Price & Stock Section */}
          <View style={styles.priceStockSection}>
            <View style={styles.priceSection}>
              {productData.discountPercentage > 0 ? (
                <>
                  <Typography
                    variant="header3"
                    color={COLORS.black[900]}
                    font="bold"
                  >
                    {currencyFormat(calculateDiscountedPrice)}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={COLORS.black[400]}
                    font="medium"
                    style={styles.originalPrice}
                  >
                    {currencyFormat(productData.price)}
                  </Typography>
                  <View style={styles.discountBadge}>
                    <Typography
                      variant="body3"
                      color={COLORS.white}
                      font="semibold"
                    >
                      Save {productData.discountPercentage}%
                    </Typography>
                  </View>
                </>
              ) : (
                <Typography
                  variant="header3"
                  color={COLORS.black[900]}
                  font="bold"
                >
                  {currencyFormat(productData.price)}
                </Typography>
              )}
            </View>

            {/* Stock Status */}
            <View style={styles.stockSection}>
              <Typography
                variant="body2"
                color={productData.stock > 0 ? COLORS.green : COLORS.red}
                font="semibold"
              >
                {productData.availabilityStatus} • {productData.stock} left
              </Typography>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Typography variant="body1" color={COLORS.black[800]} font="medium">
              Description
            </Typography>
            <Typography
              variant="body2"
              color={COLORS.black[700]}
              style={styles.description}
            >
              {productData.description}
            </Typography>
          </View>

          {/* Key Features */}
          <View style={styles.featuresSection}>
            <Typography variant="body1" color={COLORS.black[800]} font="medium">
              Product Details
            </Typography>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Typography variant="body2" color={COLORS.black[600]}>
                  SKU:
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.black[800]}
                  font="medium"
                >
                  {productData.sku}
                </Typography>
              </View>
              <View style={styles.featureItem}>
                <Typography variant="body2" color={COLORS.black[600]}>
                  Weight:
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.black[800]}
                  font="medium"
                >
                  {productData.weight} oz
                </Typography>
              </View>
              <View style={styles.featureItem}>
                <Typography variant="body2" color={COLORS.black[600]}>
                  Dimensions:
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.black[800]}
                  font="medium"
                >
                  {productData.dimensions.width} ×{' '}
                  {productData.dimensions.height} ×{' '}
                  {productData.dimensions.depth} cm
                </Typography>
              </View>
              <View style={styles.featureItem}>
                <Typography variant="body2" color={COLORS.black[600]}>
                  Shipping:
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.black[800]}
                  font="medium"
                >
                  {productData.shippingInformation}
                </Typography>
              </View>
              <View style={styles.featureItem}>
                <Typography variant="body2" color={COLORS.black[600]}>
                  Warranty:
                </Typography>
                <Typography
                  variant="body2"
                  color={COLORS.black[800]}
                  font="medium"
                >
                  {productData.warrantyInformation}
                </Typography>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <Typography variant="body1" color={COLORS.black[800]} font="medium">
              Customer Reviews ({productData.reviews?.length || 0})
            </Typography>
            {productData.reviews?.map((review, idx) => (
              <ProductReviewCard key={idx} data={review} />
            ))}
          </View>
        </View>
      </CustomScrollView>

      {/* Fixed Action Bar with SafeAreaView only for bottom */}
      <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
        <View style={styles.actionBar}>
          {/* Quantity Selector - Show if product is in stock */}
          {productData.stock > 0 && (
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecreaseQuantity}
                disabled={localQuantity <= 1}
              >
                <Typography
                  variant="body1"
                  color={
                    localQuantity <= 1 ? COLORS.black[400] : COLORS.black[800]
                  }
                  font="bold"
                >
                  -
                </Typography>
              </TouchableOpacity>
              <Typography
                variant="body1"
                color={COLORS.black[800]}
                font="semibold"
                style={styles.quantity}
              >
                {localQuantity}
              </Typography>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncreaseQuantity}
                disabled={localQuantity >= productData.stock}
              >
                <Typography
                  variant="body1"
                  color={
                    localQuantity >= productData.stock
                      ? COLORS.black[400]
                      : COLORS.black[800]
                  }
                  font="bold"
                >
                  +
                </Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Cart Action Button */}
          {isInCart ? (
            <Button style={styles.cartButton} disabled={true}>
              <Typography variant="body2" color={COLORS.white} font="semibold">
                {cartQuantity} in Cart • {currencyFormat(totalPrice)}
              </Typography>
            </Button>
          ) : productData.stock > 0 ? (
            <Button style={styles.cartButton} onPress={handleAddToCart}>
              <Typography variant="body2" color={COLORS.white} font="semibold">
                Add to Cart • {currencyFormat(totalPrice)}
              </Typography>
            </Button>
          ) : (
            <Button
              style={{ ...styles.cartButton, ...styles.outOfStockButton }}
              disabled={true}
            >
              <Typography variant="body2" color={COLORS.white} font="semibold">
                Out of Stock
              </Typography>
            </Button>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaBottom: {
    backgroundColor: COLORS.white,
  },
  imageSection: {
    backgroundColor: COLORS.black[100],
    paddingVertical: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  favouriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: COLORS.black[800],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  infoSection: {
    padding: 16,
    gap: 20,
  },
  titleSection: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: 4,
  },
  priceStockSection: {
    gap: 12,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionSection: {
    gap: 8,
  },
  description: {
    lineHeight: 20,
  },
  featuresSection: {
    gap: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewsSection: {
    gap: 12,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.black[100],
    gap: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black[100],
    borderRadius: 8,
    padding: 4,
    flex: 1,
    height: 48,
  },
  quantityButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  quantity: {
    width: 40,
    textAlign: 'center',
  },
  cartButton: {
    flex: 2,
  },
  outOfStockButton: {
    backgroundColor: COLORS.black[400],
  },
});

export default ProductDetail;
