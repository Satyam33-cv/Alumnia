// apps/mobile/src/screens/ReferralsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Screen, Card, Tag, ErrorBox, Empty } from '../components/ui';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const STATUS_COLORS = {
  PENDING: { bg: '#fef3c7', fg: '#92400e' },
  ACCEPTED: { bg: '#dbeafe', fg: '#1e40af' },
  REJECTED: { bg: '#fee2e2', fg: '#991b1b' },
  REFERRED: { bg: '#dcfce7', fg: '#166534' },
  HIRED: { bg: '#dcfce7', fg: '#166534' },
  NOT_HIRED: { bg: '#f1f5f9', fg: '#475569' },
  WITHDRAWN: { bg: '#f1f5f9', fg: '#475569' },
};

export default function ReferralsScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState(user?.role === 'ALUMNI' ? 'received' : 'sent');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await api.get(`/api/referrals/me/${tab}`);
      setList(data.referrals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { setLoading(true); load(); }, [tab, load]);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function setStatus(id, status) {
    setError('');
    try {
      await api.patch(`/api/referrals/${id}/status`, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <Text style={styles.heading}>My Referrals</Text>

      <View style={styles.tabs}>
        {['sent', 'received'].map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'sent' ? 'Sent' : 'Received'}</Text>
          </Pressable>
        ))}
      </View>

      <ErrorBox message={error} />

      {loading ? <Empty text="Loading..." /> : list.length === 0 ? <Empty text="Nothing here yet" /> : (
        list.map((r) => {
          const c = STATUS_COLORS[r.status] || STATUS_COLORS.PENDING;
          const job = r.job;
          const other = r.referredBy || r.requestedBy;
          return (
            <Card key={r.id}>
              <View style={styles.rowBetween}>
                <Text style={styles.jobTitle}>{job?.title}</Text>
                <Tag color={c.bg} textColor={c.fg}>{r.status}</Tag>
              </View>
              <Text style={styles.meta}>{job?.company}</Text>
              <Text style={styles.meta}>
                {tab === 'sent' ? `Referrer: ${other?.name}` : `Student: ${other?.name}`}
              </Text>
              {r.studentNote ? <Text style={styles.note}>"{r.studentNote}"</Text> : null}
              {tab === 'received' && r.status === 'PENDING' && (
                <View style={styles.actions}>
                  <Pressable style={[styles.actBtn, styles.actOk]} onPress={() => setStatus(r.id, 'ACCEPTED')}>
                    <Text style={styles.actOkText}>Accept</Text>
                  </Pressable>
                  <Pressable style={[styles.actBtn, styles.actNo]} onPress={() => setStatus(r.id, 'REJECTED')}>
                    <Text style={styles.actNoText}>Reject</Text>
                  </Pressable>
                </View>
              )}
              {tab === 'received' && r.status === 'ACCEPTED' && (
                <View style={styles.actions}>
                  <Pressable style={[styles.actBtn, styles.actOk]} onPress={() => setStatus(r.id, 'REFERRED')}>
                    <Text style={styles.actOkText}>Mark Referred</Text>
                  </Pressable>
                </View>
              )}
              {tab === 'received' && r.status === 'REFERRED' && (
                <View style={styles.actions}>
                  <Pressable style={[styles.actBtn, styles.actOk]} onPress={() => setStatus(r.id, 'HIRED')}>
                    <Text style={styles.actOkText}>Mark Hired</Text>
                  </Pressable>
                  <Pressable style={[styles.actBtn, styles.actNo]} onPress={() => setStatus(r.id, 'NOT_HIRED')}>
                    <Text style={styles.actNoText}>Not Hired</Text>
                  </Pressable>
                </View>
              )}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, marginBottom: 12 },
  tabs: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontWeight: '700', color: colors.muted },
  tabTextActive: { color: colors.white },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  meta: { color: colors.muted, marginTop: 3, fontSize: 14 },
  note: { fontStyle: 'italic', color: colors.ink, marginTop: 8, fontSize: 14, opacity: 0.8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  actOk: { backgroundColor: colors.primary },
  actNo: { backgroundColor: '#f1f5f9' },
  actOkText: { color: colors.white, fontWeight: '700' },
  actNoText: { color: colors.ink, fontWeight: '700' },
});
