// apps/mobile/src/screens/JobsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Modal, RefreshControl } from 'react-native';
import { Screen, Card, Tag, Button, Input, ErrorBox, Empty } from '../components/ui';
import { api } from '../api';
import { colors } from '../theme';

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get('/api/jobs');
      setJobs(data.jobs || []);
    } catch (_) {
      // surfaced via empty state
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
      <Text style={styles.heading}>Job Board</Text>
      {loading ? <Empty text="Loading jobs..." /> : jobs.length === 0 ? <Empty text="No jobs posted yet" /> : (
        jobs.map((job) => (
          <Pressable key={job.id} onPress={() => setSelected(job)}>
            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Tag color={colors.primaryLight} textColor={colors.primary}>{job.status}</Tag>
              </View>
              <Text style={styles.company}>{job.company} · {job.location}</Text>
              <Text numberOfLines={2} style={styles.desc}>{job.description}</Text>
              <View style={styles.tagsRow}>
                {job.jobType && <Tag>{job.jobType}</Tag>}
                {job.salaryMin ? <Tag>{job.salaryMin.toLocaleString()}{job.salaryMax ? `–${job.salaryMax.toLocaleString()}` : ''}</Tag> : null}
                <Tag>{(job._count?.referrals || 0)} referrals</Tag>
              </View>
            </Card>
          </Pressable>
        ))
      )}
      <JobModal job={selected} onClose={() => setSelected(null)} onDone={() => setSelected(null)} />
    </Screen>
  );
}

function JobModal({ job, onClose, onDone }) {
  const [resumeUrl, setResumeUrl] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!job) return null;

  async function submit() {
    setError(''); setLoading(true);
    try {
      await api.post('/api/referrals', { jobId: job.id, resumeUrl, coverLetter: '', studentNote });
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{job.title}</Text>
          <Text style={styles.company}>{job.company} · {job.location}</Text>
          <Text style={styles.modalDesc}>{job.description}</Text>

          <ErrorBox message={error} />

          <Input label="Resume link (Google Drive / Dropbox)" value={resumeUrl} onChangeText={setResumeUrl}
            placeholder="https://drive.google.com/..." keyboardType="url" />
          <Input label="Note to alumni" value={studentNote} onChangeText={setStudentNote}
            placeholder="Why are you a good fit?" multiline />

          <Button title="Send Referral Request" onPress={submit} loading={loading} />
          <Pressable onPress={onClose} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 17, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  company: { color: colors.muted, marginTop: 4, fontSize: 14 },
  desc: { color: colors.ink, marginTop: 8, fontSize: 14, opacity: 0.8 },
  tagsRow: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  modalDesc: { color: colors.muted, marginTop: 6, marginBottom: 12, fontSize: 14 },
  cancelBtn: { alignItems: 'center', paddingTop: 12 },
  cancelText: { color: colors.muted, fontWeight: '600' },
});
