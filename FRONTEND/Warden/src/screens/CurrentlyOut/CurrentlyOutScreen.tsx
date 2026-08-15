import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import AppShell from '../../components/AppShell/AppShell';
import HeroHeader from '../../components/HeroHeader/HeroHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import StudentCard from '../../components/StudentCard/StudentCard';
import { getMe, getCurrentlyOut, type Pass } from '../../api/wardenApi';
import type { CurrentlyOutStudent } from '../../services/wardenService';
import { styles } from './CurrentlyOutScreen.styles';

type FilterTab = 'ALL' | 'DAYPASS' | 'HOMEPASS';
const tabs: FilterTab[] = ['ALL', 'DAYPASS', 'HOMEPASS'];

function passToStudent(p: Pass): CurrentlyOutStudent {
  return {
    id: p.passID,
    name: p.student?.Roll_No ?? p.RollNo,
    rollNo: p.RollNo,
    passType: p.passType === 'HOME_PASS' ? 'HOMEPASS' : 'DAYPASS',
    schedule:
      p.passType === 'HOME_PASS'
        ? `Until ${p.Expected_Date}`
        : `Until ${p.Expected_Date} ${p.Expected_Time}`,
    destination: p.Destination,
  };
}

export default function CurrentlyOutScreen() {
  const [students, setStudents] = useState<CurrentlyOutStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      const hid = me.hostel?.Block_Id;
      if (hid) {
        const passes = await getCurrentlyOut(hid);
        setStudents(passes.map(passToStudent));
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const tabMatch = activeTab === 'ALL' || s.passType === activeTab;
      const queryMatch =
        !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
      return tabMatch && queryMatch;
    });
  }, [students, activeTab, query]);

  return (
    <AppShell activeTab="out">
      <HeroHeader
        title="Students Currently Out"
        meta="Live Monitoring Active"
        compactTitle
      />
      <View style={styles.main}>
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === tab }}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tab, activeTab === tab && styles.tabActive]}>{tab}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.searchShell}>
          <SearchBar
            placeholder="Search by name or roll no..."
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <ActivityIndicator size="large" color="#002147" />
          </View>
        ) : error ? (
          <Text style={{ color: '#BA1A1A', textAlign: 'center', margin: 16 }}>{error}</Text>
        ) : (
          <View style={styles.list}>
            {filtered.length ? (
              filtered.map((s) => <StudentCard key={s.id} student={s} />)
            ) : (
              <Text style={{ color: '#74777F', textAlign: 'center', marginTop: 32 }}>
                No students currently out.
              </Text>
            )}
          </View>
        )}
      </View>
    </AppShell>
  );
}

