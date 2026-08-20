// apps/mobile/src/screens/EventsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Screen, Card, Tag, Button, ErrorBox, Empty, Avatar } from '../components/ui';
import { api } from '../api';
import { colors } from '../theme';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get('/api/events?upcoming=true');
      setEvents(data.events || []);
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

  const fmtDate = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <Text style={styles.heading}>Upcoming Events</Text>
      {loading ? <Empty text="Loading events..." /> : events.length === 0 ? <Empty text="No upcoming events" /> : (
        events.map((e) => (
          <Pressable key={e.id} onPress={() => setDetail(e)}>
            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.eventTitle}>{e.title}</Text>
                <Tag color={colors.primaryLight} textColor={colors.primary}>{e.mode}</Tag>
              </View>
              <Text style={styles.eventMeta}>{fmtDate(e.date)}</Text>
              <Text style={styles.eventMeta}>{e.location || 'Online'}</Text>
              <Text numberOfLines={2} style={styles.desc}>{e.description}</Text>
              <View style={styles.tagsRow}>
                <Tag>{e._count?.rsvps || 0} going</Tag>
                {e.maxCapacity ? <Tag>capacity {e.maxCapacity}</Tag> : null}
              </View>
            </Card>
          </Pressable>
        ))
      )}
      <EventModal event={detail} onClose={() => setDetail(null)} onDone={() => { setDetail(null); load(); }} />
    </Screen>
  );
}

function EventModal({ event, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!event) return null;

  async function rsvp() {
    setError(''); setLoading(true);
    try {
      await api.post(`/api/events/${event.id}/rsvp`);
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={styles.modalCard} onPress={() => {}}>
        <Text style={styles.modalTitle}>{event.title}</Text>
        <Text style={styles.eventMeta}>{new Date(event.date).toLocaleString()}</Text>
        <Text style={styles.eventMeta}>{event.location || 'Online'} · {event.mode}</Text>
        <Text style={styles.modalDesc}>{event.description}</Text>
        <ErrorBox message={error} />
        <Button title="RSVP to event" onPress={rsvp} loading={loading} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { fontSize: 17, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  eventMeta: { color: colors.muted, marginTop: 3, fontSize: 13 },
  desc: { color: colors.ink, marginTop: 8, fontSize: 14, opacity: 0.8 },
  tagsRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  modalDesc: { color: colors.muted, marginTop: 10, marginBottom: 12, fontSize: 14 },
});
