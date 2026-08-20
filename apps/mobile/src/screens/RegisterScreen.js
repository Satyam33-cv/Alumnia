// apps/mobile/src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Screen, Input, Button, ErrorBox } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const ROLES = [
  { key: 'STUDENT', label: 'Student' },
  { key: 'ALUMNI', label: 'Alumni' },
  { key: 'FACULTY', label: 'Faculty' },
];

export default function RegisterScreen({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setError(''); setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Create your account</Text>

      <ErrorBox message={error} />

      <View style={styles.roles}>
        {ROLES.map((r) => (
          <Pressable key={r.key} onPress={() => set('role')(r.key)}
            style={[styles.roleBtn, form.role === r.key && styles.roleActive]}>
            <Text style={[styles.roleText, form.role === r.key && styles.roleTextActive]}>{r.label}</Text>
          </Pressable>
        ))}
      </View>

      <Input label="Full Name" value={form.name} onChangeText={set('name')} placeholder="Your name" autoCapitalize="words" />
      <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="you@college.edu" keyboardType="email-address" />
      <Input label="Password" value={form.password} onChangeText={set('password')} placeholder="Min 6 characters" secureTextEntry />

      {form.role === 'STUDENT' && (
        <>
          <Input label="Batch Year" value={form.batchYear} onChangeText={set('batchYear')} placeholder="2026" keyboardType="number-pad" autoCapitalize="words" />
          <Input label="Department" value={form.department} onChangeText={set('department')} placeholder="CSE, ECE, MECH..." autoCapitalize="words" />
        </>
      )}

      {form.role === 'ALUMNI' && (
        <>
          <Input label="Current Company" value={form.currentCompany} onChangeText={set('currentCompany')} placeholder="Company" autoCapitalize="words" />
          <Input label="Job Title" value={form.jobTitle} onChangeText={set('jobTitle')} placeholder="Software Engineer" autoCapitalize="words" />
        </>
      )}

      <Button title="Create Account" onPress={submit} loading={loading} />

      <Text style={styles.switchText}>
        Already have an account? <Text style={styles.link} onPress={onSwitch}>Sign in</Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.ink, marginTop: 24, marginBottom: 16 },
  roles: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  roleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line,
    alignItems: 'center', backgroundColor: colors.white,
  },
  roleActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  roleText: { fontWeight: '600', color: colors.muted },
  roleTextActive: { color: colors.primary },
  switchText: { textAlign: 'center', color: colors.muted, marginTop: 24, fontSize: 15 },
  link: { color: colors.primary, fontWeight: '700' },
});
