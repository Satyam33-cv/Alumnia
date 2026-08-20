// apps/mobile/src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Button, ErrorBox, Input, Tag, Avatar } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    batchYear: user?.batchYear?.toString() || '', department: user?.department || '',
    currentCompany: user?.currentCompany || '', jobTitle: user?.jobTitle || '',
    location: user?.location || '', linkedinUrl: user?.linkedinUrl || '',
    bio: user?.bio || '', skills: user?.skills || '', interests: user?.interests || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setError(''); setMessage(''); setLoading(true);
    try {
      const updated = await api.patch('/api/users/me', { ...form, batchYear: form.batchYear ? parseInt(form.batchYear) : null });
      await refreshUser();
      setMessage('✅ Profile saved');
      setForm((f) => ({ ...f, name: updated.user?.name || f.name }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar name={user?.name} size={64} />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.meta}>{user?.email}</Text>
          <View style={styles.rolesRow}>
            <Tag color={colors.primaryLight} textColor={colors.primary}>{user?.role}</Tag>
            {user?.isVerified ? <Tag color="#dcfce7" textColor="#166534">Verified</Tag> : null}
          </View>
        </View>
      </View>

      <ErrorBox message={error} />
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Input label="Full Name" value={form.name} onChangeText={set('name')} autoCapitalize="words" />
      <Input label="Phone (for WhatsApp alerts)" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+919876543210" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}><Input label="Batch Year" value={form.batchYear} onChangeText={set('batchYear')} keyboardType="number-pad" /></View>
        <View style={{ flex: 1, marginLeft: 10 }}><Input label="Department" value={form.department} onChangeText={set('department')} autoCapitalize="words" /></View>
      </View>

      {user?.role === 'ALUMNI' && (
        <View style={styles.row}>
          <View style={{ flex: 1 }}><Input label="Current Company" value={form.currentCompany} onChangeText={set('currentCompany')} autoCapitalize="words" /></View>
          <View style={{ flex: 1, marginLeft: 10 }}><Input label="Job Title" value={form.jobTitle} onChangeText={set('jobTitle')} autoCapitalize="words" /></View>
        </View>
      )}

      <Input label="Location" value={form.location} onChangeText={set('location')} autoCapitalize="words" />
      <Input label="LinkedIn URL" value={form.linkedinUrl} onChangeText={set('linkedinUrl')} keyboardType="url" />
      <Input label="Skills (comma-separated)" value={form.skills} onChangeText={set('skills')} placeholder="React, Python, DSA" autoCapitalize="words" />
      <Input label="Interests (comma-separated)" value={form.interests} onChangeText={set('interests')} placeholder="AI, Product, Startups" autoCapitalize="words" />
      <Input label="Bio" value={form.bio} onChangeText={set('bio')} multiline />

      <Button title="Save Profile" onPress={save} loading={loading} />

      <Pressable onPress={logout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 20, fontWeight: '800', color: colors.ink },
  meta: { color: colors.muted, fontSize: 14, marginTop: 2 },
  rolesRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  row: { flexDirection: 'row' },
  message: { color: colors.success, marginBottom: 12, fontWeight: '600' },
  logoutBtn: { marginTop: 20, alignItems: 'center', paddingVertical: 12 },
  logoutText: { color: colors.danger, fontWeight: '700' },
});
