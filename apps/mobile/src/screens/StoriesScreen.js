// apps/mobile/src/screens/StoriesScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Modal, RefreshControl } from 'react-native';
import { Screen, Card, Tag, Button, Input, ErrorBox, Empty, Avatar } from '../components/ui';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function StoriesScreen() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get('/api/stories');
      setStories(data.stories || []);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <View style={styles.rowBetween}>
        <Text style={styles.heading}>Success Stories</Text>
        {(user?.role === 'ALUMNI' || user?.role === 'ADMIN') && (
          <Pressable onPress={() => setShowSubmit(true)} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Share story</Text>
          </Pressable>
        )}
      </View>

      {loading ? <Empty text="Loading stories..." /> : stories.length === 0 ? <Empty text="No stories yet" /> : (
        stories.map((s) => (
          <Card key={s.id}>
            <View style={styles.rowBetween}>
              <View style={styles.authorRow}>
                <Avatar name={s.alumni?.name} size={36} />
                <View>
                  <Text style={styles.authorName}>{s.alumni?.name}</Text>
                  <Text style={styles.authorMeta}>{s.role} @ {s.company}</Text>
                </View>
              </View>
              {s.isFeatured && <Tag color="#fef3c7" textColor="#92400e">⭐ Featured</Tag>}
            </View>
            <Text style={styles.storyTitle}>{s.title}</Text>
            <Text numberOfLines={4} style={styles.storyBody}>{s.story}</Text>
          </Card>
        ))
      )}
      <SubmitModal visible={showSubmit} onClose={() => setShowSubmit(false)} onDone={() => { setShowSubmit(false); load(); }} />
    </Screen>
  );
}

function SubmitModal({ visible, onClose, onDone }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', story: '', company: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setError(''); setLoading(true);
    try {
      await api.post('/api/stories', {
        ...form,
        batchYear: user?.batchYear,
      });
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Share your story</Text>
          <ErrorBox message={error} />
          <Input label="Title" value={form.title} onChangeText={set('title')} placeholder="How I cracked Google" autoCapitalize="words" />
          <Input label="Company" value={form.company} onChangeText={set('company')} placeholder="Google" autoCapitalize="words" />
          <Input label="Role" value={form.role} onChangeText={set('role')} placeholder="Software Engineer" autoCapitalize="words" />
          <Input label="Story" value={form.story} onChangeText={set('story')} placeholder="Your journey..." multiline />
          <Button title="Submit for review" onPress={submit} loading={loading} />
          <Pressable onPress={onClose} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authorName: { fontWeight: '700', fontSize: 15 },
  authorMeta: { color: colors.muted, fontSize: 13 },
  storyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: 12 },
  storyBody: { color: colors.ink, marginTop: 6, fontSize: 14, opacity: 0.8 },
  submitBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  submitBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 },
  cancelBtn: { alignItems: 'center', paddingTop: 12 },
  cancelText: { color: colors.muted, fontWeight: '600' },
});
