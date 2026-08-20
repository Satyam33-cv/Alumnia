// apps/mobile/src/screens/MatchingScreen.js
// AI Smart Matching — top 5 alumni (students only)
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, RefreshControl, Linking } from 'react-native';
import { Screen, Card, Tag, Button, ErrorBox, Empty, Avatar } from '../components/ui';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function MatchingScreen() {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reMatching, setReMatching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await api.get('/api/matching/top-alumni?limit=5');
      setAlumni(data.alumni);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user?.role === 'STUDENT') load(); }, [user, load]);

  async function reMatch() {
    setReMatching(true); setError('');
    try {
      await api.post('/api/matching/sync-me');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setReMatching(false);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (user?.role !== 'STUDENT') {
    return <Screen><Empty text="AI matching is available for students" /></Screen>;
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <View style={styles.rowBetween}>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.heading}>Top 5 Alumni</Text>
          <Text style={styles.sub}>Matched to your skills &amp; interests</Text>
        </View>
        <Pressable onPress={reMatch} style={styles.rematchBtn}>
          <Text style={styles.rematchText}>{reMatching ? 'Matching...' : 'Re-match'}</Text>
        </Pressable>
      </View>

      <ErrorBox message={error} />

      {loading ? <Empty text="Computing matches..." /> : !alumni || alumni.length === 0 ? (
        <Empty text="No matches yet — an admin needs to sync embeddings." />
      ) : (
        alumni.map((a) => (
          <Card key={a.id}>
            <View style={styles.rowBetween}>
              <View style={styles.authorRow}>
                <Avatar name={a.name} size={44} />
                <View style={{ flexShrink: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{a.name}</Text>
                    {a.isVerified ? <Tag color="#dcfce7" textColor="#166534">✓</Tag> : null}
                  </View>
                  <Text style={styles.meta}>
                    {a.jobTitle ? `${a.jobTitle} @ ${a.currentCompany}` : a.department}
                  </Text>
                </View>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.score}>{a.matchScore}%</Text>
                <Text style={styles.scoreLabel}>match</Text>
              </View>
            </View>
            {a.skills ? (
              <View style={styles.skills}>
                {a.skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5).map((s) => <Tag key={s}>{s}</Tag>)}
              </View>
            ) : null}
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink },
  sub: { color: colors.muted, marginTop: 2, fontSize: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  rematchBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  rematchText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontWeight: '700', fontSize: 16 },
  meta: { color: colors.muted, fontSize: 13, marginTop: 2 },
  scoreBox: { alignItems: 'center' },
  score: { fontSize: 22, fontWeight: '800', color: colors.primary },
  scoreLabel: { fontSize: 11, color: colors.muted },
  skills: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
});
