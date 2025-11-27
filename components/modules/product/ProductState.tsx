import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { COLORS } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const ProductErrorState = ({ refresh }: { refresh: () => void }) => {
  return (
    <View style={styles.errorContainer}>
      <Typography
        variant="header3"
        color={COLORS.black[800]}
        style={styles.errorTitle}
      >
        Failed to load products
      </Typography>
      <Typography
        variant="body2"
        color={COLORS.black[600]}
        style={styles.errorMessage}
      >
        Please check your connection and try again.
      </Typography>
      <Button onPress={refresh} style={styles.retryButton}>
        <Typography variant="body2" color={COLORS.white}>
          Try Again
        </Typography>
      </Button>
    </View>
  );
};

export const ProductLoadingState = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.black[600]} />
      <Typography
        variant="body1"
        color={COLORS.black[600]}
        style={styles.loadingText}
      >
        Loading products...
      </Typography>
    </View>
  );
};

export const ProductEmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Typography
        variant="header3"
        color={COLORS.black[800]}
        style={styles.emptyTitle}
      >
        No products found
      </Typography>
      <Typography
        variant="body2"
        color={COLORS.black[600]}
        style={styles.emptyMessage}
      >
        Try adjusting your search or filters.
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    marginTop: 12,
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  errorTitle: {
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 24,
  },

  // Empty state
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    minHeight: 300,
    flex: 1,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyActionButton: {
    paddingHorizontal: 24,
  },
});
