// apps/mobile/src/screens/LoginScreen.js
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Screen, Input, Button, ErrorBox } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function LoginScreen({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setError(''); setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.logo}>🎓 PRO ALUMN</Text>
        <Text style={styles.subtitle}>Alumni Engagement &amp; Career Referral Platform</Text>
      </View>

      <ErrorBox message={error} />
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@college.edu" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

      <Button title="Sign In" onPress={submit} loading={loading} />

      <Text style={styles.switchText}>
        No account yet? <Text style={styles.link} onPress={onSwitch}>Create one</Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: 48, marginBottom: 32, alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: '800', color: colors.primaryDark },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 6, textAlign: 'center' },
  switchText: { textAlign: 'center', color: colors.muted, marginTop: 24, fontSize: 15 },
  link: { color: colors.primary, fontWeight: '700' },
});
