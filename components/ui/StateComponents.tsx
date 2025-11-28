import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/constants/co';

// Base interface for all state components
interface BaseStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

// Loading State
interface LoadingStateProps extends BaseStateProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading...',
  message,
  size = 'large',
  color = COLORS.black[600],
  compact = false,
}) => {
  return (
    <View style={[styles.loadingContainer, compact && styles.compactContainer]}>
      <ActivityIndicator size={size} color={color} />
      <View style={styles.textContainer}>
        <Typography
          variant={compact ? 'body1' : 'header3'}
          color={COLORS.black[800]}
          style={styles.loadingTitle}
        >
          {title}
        </Typography>
        {message && (
          <Typography
            variant="body2"
            color={COLORS.black[600]}
            style={styles.loadingMessage}
          >
            {message}
          </Typography>
        )}
      </View>
    </View>
  );
};

// Error State
interface ErrorStateProps extends BaseStateProps {
  icon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Please check your connection and try again.',
  actionLabel = 'Try Again',
  onAction,
  compact = false,
  icon,
}) => {
  return (
    <View style={[styles.errorContainer, compact && styles.compactContainer]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Typography
          variant={compact ? 'body1' : 'header3'}
          color={COLORS.black[800]}
          style={styles.errorTitle}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color={COLORS.black[600]}
          style={styles.errorMessage}
        >
          {message}
        </Typography>
      </View>
      {onAction && actionLabel && (
        <Button onPress={onAction} style={styles.actionButton}>
          <Typography variant="body2" color={COLORS.white} font="semibold">
            {actionLabel}
          </Typography>
        </Button>
      )}
    </View>
  );
};

// Empty State
interface EmptyStateProps extends BaseStateProps {
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  message = 'Try adjusting your search or filters.',
  actionLabel,
  onAction,
  compact = false,
  icon,
}) => {
  return (
    <View style={[styles.emptyContainer, compact && styles.compactContainer]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Typography
          variant={compact ? 'body1' : 'header3'}
          color={COLORS.black[800]}
          style={styles.emptyTitle}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color={COLORS.black[600]}
          style={styles.emptyMessage}
        >
          {message}
        </Typography>
      </View>
      {onAction && actionLabel && (
        <Button
          onPress={onAction}
          style={styles.actionButton}
          variant={compact ? 'outline' : 'primary'}
        >
          <Typography
            variant="body2"
            color={compact ? COLORS.black[800] : COLORS.white}
            font="semibold"
          >
            {actionLabel}
          </Typography>
        </Button>
      )}
    </View>
  );
};

// Success State
interface SuccessStateProps extends BaseStateProps {
  icon?: React.ReactNode;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title = 'Success!',
  message,
  actionLabel,
  onAction,
  compact = false,
  icon,
}) => {
  return (
    <View style={[styles.successContainer, compact && styles.compactContainer]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Typography
          variant={compact ? 'body1' : 'header3'}
          color={COLORS.black[800]}
          style={styles.successTitle}
        >
          {title}
        </Typography>
        {message && (
          <Typography
            variant="body2"
            color={COLORS.black[600]}
            style={styles.successMessage}
          >
            {message}
          </Typography>
        )}
      </View>
      {onAction && actionLabel && (
        <Button onPress={onAction} style={styles.actionButton}>
          <Typography variant="body2" color={COLORS.white} font="semibold">
            {actionLabel}
          </Typography>
        </Button>
      )}
    </View>
  );
};

// Offline State
export const OfflineState: React.FC<BaseStateProps> = ({
  title = 'No Internet Connection',
  message = 'Please check your connection and try again.',
  actionLabel = 'Retry',
  onAction,
  compact = false,
}) => {
  return (
    <ErrorState
      title={title}
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
      compact={compact}
    />
  );
};

// Search Empty State (Specialized)
interface SearchEmptyStateProps {
  query: string;
  onClearSearch?: () => void;
  compact?: boolean;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  onClearSearch,
  compact = false,
}) => {
  return (
    <EmptyState
      title="No results found"
      message={`No items found for "${query}". Try adjusting your search terms.`}
      actionLabel="Clear Search"
      onAction={onClearSearch}
      compact={compact}
    />
  );
};

// Product Specific States (for backward compatibility)
export const ProductLoadingState: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => <LoadingState title="Loading products..." compact={compact} />;

export const ProductErrorState: React.FC<{
  refresh: () => void;
  compact?: boolean;
}> = ({ refresh, compact = false }) => (
  <ErrorState
    title="Failed to load products"
    message="Please check your connection and try again."
    actionLabel="Try Again"
    onAction={refresh}
    compact={compact}
  />
);

export const ProductEmptyState: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => (
  <EmptyState
    title="No products found"
    message="Try adjusting your search or filters."
    compact={compact}
  />
);

const styles = StyleSheet.create({
  // Common styles
  compactContainer: {
    padding: 20,
    minHeight: 200,
  },
  textContainer: {
    gap: 8,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  actionButton: {
    marginTop: 16,
    paddingHorizontal: 24,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  loadingTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  loadingMessage: {
    lineHeight: 20,
    textAlign: 'center',
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  errorTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  errorMessage: {
    lineHeight: 20,
    textAlign: 'center',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyMessage: {
    lineHeight: 20,
    textAlign: 'center',
  },

  // Success state
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  successTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  successMessage: {
    lineHeight: 20,
  },
});
