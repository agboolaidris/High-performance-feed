import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { COLORS } from '@/constants/color';

import { Typography } from './Typography';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputWrapperStyle?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  placeholder,
  value = '',
  onChangeText,
  containerStyle,
  secureTextEntry,
  editable = true,
  inputWrapperStyle,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const showError = !!error;

  const borderColor = showError
    ? COLORS.red // Error → red
    : isFocused
      ? COLORS.black[900] // Focused → Primary/900
      : COLORS.black[300]; // Resting → light gray

  // BACKGROUND
  const backgroundColor = editable ? 'transparent' : COLORS.black[100]; // Always filled (light gray)

  // LABEL COLOR
  const labelColor = showError
    ? COLORS.red
    : isFocused || hasValue
      ? COLORS.black[900]
      : COLORS.black[500];

  return (
    <View style={[styles.container, containerStyle]}>
      {/* LABEL — Typography */}
      {label && (
        <Typography
          variant="body3"
          style={[styles.label, { color: labelColor }]}
        >
          {label}
        </Typography>
      )}

      {/* INPUT FIELD — EXACT FIGMA "FOCUS" STATE */}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor,
          },
          inputWrapperStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.black[400]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          editable={editable}
          selectionColor={COLORS.black[900]}
          cursorColor={COLORS.black[900]}
          {...inputProps}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {/* ERROR MESSAGE */}
      {showError && (
        <Typography variant="body3" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    alignSelf: 'stretch',
  },

  label: {
    marginLeft: 4,
  },

  // EXACT FIGMA MATCH — ALL STATES
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 9,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.black[100], // Filled background
    borderColor: COLORS.black[300], // Default border
  },

  input: {
    flex: 1,
    fontFamily: 'GeneralSans-Regular',
    fontSize: 16,
    color: COLORS.black[900],
    padding: 0,
  },

  iconLeft: { marginRight: 12 },
  iconRight: { marginLeft: 12 },

  errorText: {
    color: COLORS.red,
    marginLeft: 4,
  },
});
