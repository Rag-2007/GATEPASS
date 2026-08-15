import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import AppShell from '../../components/AppShell/AppShell';
import HeroHeader from '../../components/HeroHeader/HeroHeader';
import MetricTile from '../../components/MetricTile/MetricTile';
import {
  getMe,
  getApprovalsByHostel,
  getCurrentlyOut,
  getAllBlocked,
} from '../../api/wardenApi';
import { styles } from './DashboardScreen.styles';

interface Counts {
  awaiting: number;
  out: number;
  blocked: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [hostelId, setHostelId] = useState<string | null>(null);
  const [wardenName, setWardenName] = useState('');
  const [counts, setCounts] = useState<Counts>({ awaiting: 0, out: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await getMe();
        const hid = me.hostel?.Block_Id ?? null;
        if (!active) return;
        setHostelId(hid);
        setWardenName(me.user?.Name ?? 'Warden');

        if (hid) {
          const [approvals, out, blocked] = await Promise.all([
            getApprovalsByHostel(hid).catch(() => []),
            getCurrentlyOut(hid).catch(() => []),
            getAllBlocked().catch(() => []),
          ]);
          if (!active) return;

          const myBlocked = blocked.filter((b) => b.Hostel_id === hid);
          setCounts({
            awaiting: approvals.length,
            out: out.length,
            blocked: myBlocked.length,
          });
        }
      } catch (e: any) {
        if (active) setError(e?.message ?? 'Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const metrics = [
    { id: 'awaiting', label: 'AWAITING APPROVAL', value: String(counts.awaiting).padStart(2, '0'), tone: 'danger' as const },
    { id: 'out', label: 'CURRENTLY OUT', value: String(counts.out).padStart(2, '0') },
    { id: 'blocked', label: 'BLOCKED STUDENTS', value: String(counts.blocked).padStart(2, '0') },
  ];

  if (loading) {
    return (
      <AppShell activeTab="dashboard" contentContainerStyle={styles.content}>
        <HeroHeader height={192} title="Loading…" subtitle="Fetching data" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#002147" />
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="dashboard" contentContainerStyle={styles.content}>
      <HeroHeader
        height={192}
        title={`Block ${hostelId ?? ''} Control Center`}
        subtitle={`Welcome, ${wardenName} · Hostel Management & Gatepass Oversight`}
      />
      {error ? (
        <Text style={{ color: '#BA1A1A', textAlign: 'center', margin: 16 }}>{error}</Text>
      ) : null}
      <View style={styles.metrics}>
        {metrics.map((metric) => (
          <MetricTile
            key={metric.id}
            label={metric.label}
            value={metric.value}
            tone={metric.tone}
            icon={metric.id === 'blocked' ? 'account-cancel-outline' : undefined}
            onPress={() => {
              if (metric.id === 'awaiting') router.push('/approvals' as Href);
              if (metric.id === 'out') router.push('/currently-out' as Href);
              if (metric.id === 'blocked') router.push('/blocked-students' as Href);
            }}
          />
        ))}
      </View>
    </AppShell>
  );
}

