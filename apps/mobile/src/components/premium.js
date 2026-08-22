import React from 'react';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { colors, radius, spacing, type } from '../theme';

export const iconMap = {
  home: 'home', network: 'group', events: 'calendar-today', jobs: 'work', chat: 'chat-bubble-outline',
  profile: 'account-circle', search: 'search', bookmark: 'bookmark-border', settings: 'settings',
  logout: 'logout', match: 'person-search', mentor: 'volunteer-activism', arrow: 'arrow-forward',
  back: 'arrow-back', add: 'add', notifications: 'notifications-none', location: 'place',
  schedule: 'schedule', send: 'send', close: 'close', chevron: 'chevron-right', campaign: 'volunteer-activism',
};

export function Icon({ name, size = 22, color = colors.ink }) {
  return <MaterialIcons name={iconMap[name] || name} size={size} color={color} />;
}

export function AppHeader({ user, onProfile, onSearch, title = 'PRO ALUMN', showSearch = true }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onProfile} accessibilityLabel="Open profile">
        <Avatar name={user?.name} size={42} />
      </Pressable>
      <View style={styles.headerTitle}>
        <Text style={styles.brand}>{title}</Text>
        <Text style={styles.headerCaption}>ALUMNI NETWORK</Text>
      </View>
      {showSearch && <Pressable onPress={onSearch} style={styles.iconButton} accessibilityLabel="Search"><Icon name="search" /></Pressable>}
      <Pressable style={styles.iconButton} accessibilityLabel="Notifications"><Icon name="notifications" /></Pressable>
    </View>
  );
}

export function BottomTabBar({ active, onChange }) {
  const tabs = [
    ['home', 'Home'], ['network', 'Network'], ['events', 'Events'], ['jobs', 'Jobs'], ['chat', 'Chat'],
  ];
  return (
    <BlurView intensity={28} tint="light" style={styles.tabBar}>
      {tabs.map(([key, label]) => {
        const selected = active === key;
        return (
          <Pressable key={key} onPress={() => onChange(key)} style={styles.tabItem} accessibilityLabel={label}>
            <Icon name={key} size={22} color={selected ? colors.secondary : colors.muted} />
            <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{label}</Text>
            {selected && <View style={styles.tabDot} />}
          </Pressable>
        );
      })}
    </BlurView>
  );
}

export function Screen({ children, refreshing, onRefresh, style }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      >{children}</ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress }) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

export function Chip({ children, active = false, onPress }) {
  const content = <View style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{children}</Text></View>;
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

export function Badge({ children, tone = 'gold' }) {
  const palette = tone === 'green'
    ? { backgroundColor: '#d8eee8', color: colors.tertiaryOnContainer }
    : tone === 'error' ? { backgroundColor: '#f9dada', color: colors.danger }
      : { backgroundColor: colors.secondaryContainer, color: colors.secondary };
  return <View style={[styles.badge, { backgroundColor: palette.backgroundColor }]}><Text style={[styles.badgeText, { color: palette.color }]}>{children}</Text></View>;
}

export function ProgressBar({ value = 0, color = colors.primary }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} /></View>;
}

export function Avatar({ name, size = 44 }) {
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}><Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{name?.[0]?.toUpperCase() || '?'}</Text></View>;
}

export function SearchBox({ value, onChangeText, placeholder = 'Search' }) {
  return <View style={styles.searchBox}><Icon name="search" size={20} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.searchInput} /></View>;
}

export function ActionButton({ title, onPress, variant = 'dark', icon = 'arrow', disabled = false }) {
  const light = variant === 'light';
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.actionButton, light && styles.actionButtonLight, disabled && { opacity: 0.45 }]}><Text style={[styles.actionText, light && styles.actionTextLight]}>{title}</Text>{icon && <Icon name={icon} size={18} color={light ? colors.primary : colors.white} />}</Pressable>;
}

export function EmptyState({ title, detail, loading = false }) {
  return <View style={styles.empty}>{loading ? <ActivityIndicator color={colors.secondary} /> : <Icon name="search" size={28} color={colors.secondary} />}<Text style={styles.emptyTitle}>{title}</Text>{detail && <Text style={styles.emptyDetail}>{detail}</Text>}</View>;
}

export function SectionTitle({ title, action, onAction }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>{title}</Text>{action && <Pressable onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable>}</View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 34 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.bg },
  headerTitle: { flex: 1, marginLeft: 12 },
  brand: { ...type.headlineMD, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  headerCaption: { ...type.label, fontFamily: 'Inter_500Medium', color: colors.secondary, letterSpacing: 1.1, marginTop: 2 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  tabBar: { flexDirection: 'row', minHeight: 76, paddingBottom: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(196,198,206,0.7)' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabLabel: { ...type.label, fontFamily: 'Inter_500Medium', color: colors.muted },
  tabLabelActive: { color: colors.secondary, fontFamily: 'Inter_600SemiBold' },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.secondary, marginTop: 1 },
  card: { backgroundColor: colors.surfaceLow, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, marginBottom: 12, shadowColor: '#1b1c19', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  chip: { borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surfaceHigh, marginRight: 8 },
  chipActive: { backgroundColor: colors.secondaryContainer },
  chipText: { ...type.label, fontFamily: 'Inter_500Medium', color: colors.muted },
  chipTextActive: { color: colors.secondary, fontFamily: 'Inter_600SemiBold' },
  badge: { alignSelf: 'flex-start', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { ...type.label, fontFamily: 'Inter_600SemiBold' },
  progressTrack: { height: 8, borderRadius: 8, backgroundColor: colors.surfaceHigh, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8 },
  avatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer },
  avatarText: { color: colors.secondaryContainer, fontFamily: 'Inter_700Bold' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 12, minHeight: 48, marginBottom: 14 },
  searchInput: { flex: 1, marginLeft: 8, color: colors.ink, fontFamily: 'Inter_400Regular', fontSize: 14 },
  actionButton: { minHeight: 46, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  actionButtonLight: { backgroundColor: colors.secondaryContainer },
  actionText: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.white },
  actionTextLight: { color: colors.secondary },
  empty: { alignItems: 'center', paddingVertical: 56, paddingHorizontal: 28 },
  emptyTitle: { ...type.headlineMD, fontFamily: 'Inter_600SemiBold', color: colors.ink, marginTop: 12, textAlign: 'center' },
  emptyDetail: { ...type.body, fontFamily: 'Inter_400Regular', color: colors.muted, marginTop: 6, textAlign: 'center' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 12 },
  sectionHeading: { ...type.headlineMD, fontFamily: 'Inter_600SemiBold', color: colors.ink },
  sectionAction: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
