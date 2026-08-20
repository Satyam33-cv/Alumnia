// apps/mobile/src/components/ui.js
// Small shared UI kit for the mobile app
import React from 'react';
import {
  ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { colors, radius, spacing } from '../theme';

export function Screen({ children, scroll = true, style }) {
  const content = scroll
    ? <ScrollView contentContainerStyle={[styles.scrollContent, style]} keyboardShouldPersistTaps="handled">{children}</ScrollView>
    : <View style={[styles.screenContent, style]}>{children}</View>;
  return <SafeAreaView style={styles.screen}>{content}</SafeAreaView>;
}

export function Button({ title, onPress, loading, variant = 'primary', style, disabled }) {
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : colors.line;
  const fg = variant === 'primary' || variant === 'danger' ? colors.white : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button, { backgroundColor: bg, opacity: (disabled || loading) ? 0.5 : pressed ? 0.85 : 1 }, style,
      ]}>
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, autoCapitalize = 'none' }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#94a3b8"
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Tag({ children, color = '#f1f5f9', textColor = colors.ink }) {
  return <View style={[styles.tag, { backgroundColor: color }]}><Text style={[styles.tagText, { color: textColor }]}>{children}</Text></View>;
}

export function Avatar({ name, size = 40 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ color: colors.primaryDark, fontWeight: '700', fontSize: size * 0.42 }}>{name?.[0]?.toUpperCase() || '?'}</Text>
    </View>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return <View style={styles.errorBox}><Text style={styles.errorText}>{message}</Text></View>;
}

export function Empty({ text }) {
  return <Text style={styles.empty}>{text}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenContent: { padding: spacing.lg, flexGrow: 1 },
  scrollContent: { padding: spacing.lg, flexGrow: 1 },
  button: {
    borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontWeight: '700', fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: radius.md,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.md,
  },
  tag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  tagText: { fontSize: 12, fontWeight: '600' },
  avatar: {
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md,
  },
  errorText: { color: colors.danger, fontSize: 14 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing.xl },
});
