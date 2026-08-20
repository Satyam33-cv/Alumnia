// apps/mobile/App.js
// Entry point: auth gate + tab navigation
import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { AppHeader, BottomTabBar } from './src/components/premium';
import {
  EventsPremiumScreen, GivingScreen, HomeScreen, JobsPremiumScreen, MessagesScreen,
  MentorshipScreen, NetworkScreen, ProfilePremiumScreen,
} from './src/screens/PremiumScreens';

function MainTabs() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('home');
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSection, setProfileSection] = useState(null);

  if (profileOpen) {
    if (profileSection === 'giving') return <View style={styles.secondaryScreen}><View style={styles.secondaryHeader}><Text style={styles.secondaryBack} onPress={() => setProfileSection(null)}>Back to profile</Text></View><GivingScreen /></View>;
    if (profileSection === 'mentorship') return <View style={styles.secondaryScreen}><View style={styles.secondaryHeader}><Text style={styles.secondaryBack} onPress={() => setProfileSection(null)}>Back to profile</Text></View><MentorshipScreen /></View>;
    return <ProfilePremiumScreen onBack={() => setProfileOpen(false)} onNavigate={setProfileSection} onLogout={logout} />;
  }

  function renderScreen() {
    switch (tab) {
      case 'home': return <><AppHeader user={user} onProfile={() => setProfileOpen(true)} /><HomeScreen goTo={setTab} onProfile={() => setProfileOpen(true)} /></>;
      case 'network': return <><AppHeader user={user} onProfile={() => setProfileOpen(true)} /><NetworkScreen /></>;
      case 'events': return <><AppHeader user={user} onProfile={() => setProfileOpen(true)} /><EventsPremiumScreen /></>;
      case 'jobs': return <><AppHeader user={user} onProfile={() => setProfileOpen(true)} /><JobsPremiumScreen /></>;
      case 'chat': return <><AppHeader user={user} onProfile={() => setProfileOpen(true)} /><MessagesScreen /></>;
      default: return <HomeScreen goTo={setTab} onProfile={() => setProfileOpen(true)} />;
    }
  }

  return (
    <View style={styles.tabScreen}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomTabBar active={tab} onChange={setTab} />
    </View>
  );
}

function Root() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState('login');

  if (loading) {
    return <View style={styles.splash}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (!user) {
    return mode === 'login'
      ? <LoginScreen onSwitch={() => setMode('register')} />
      : <RegisterScreen onSwitch={() => setMode('login')} />;
  }

  return <MainTabs />;
}

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });

  if (!fontsLoaded) {
    return <View style={styles.splash}><ActivityIndicator size="small" color={colors.secondary} /></View>;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  tabScreen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
  secondaryScreen: { flex: 1, backgroundColor: colors.bg },
  secondaryHeader: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.bg },
  secondaryBack: { color: colors.secondary, fontSize: 14, fontWeight: '600' },
});
