import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import AppShell from '../../components/AppShell/AppShell';
import HeroHeader from '../../components/HeroHeader/HeroHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import StudentDirectoryRow from '../../components/StudentDirectoryRow/StudentDirectoryRow';
import { getMe, getStudentsByHostel, type StudentRecord } from '../../api/wardenApi';
import type { DirectoryStudent } from '../../services/wardenService';
import { styles } from './StudentDirectoryScreen.styles';

function studentToRow(s: StudentRecord, index: number): DirectoryStudent {
  return {
    id: s.Roll_NO,
    name: s.Name ?? s.Roll_NO,
    rollNo: s.Roll_NO,
    hostelId: s.Hostel_Id,
    accent: index % 2 === 0 ? 'navy' : 'brown',
  };
}

export default function StudentDirectoryScreen() {
  const [students, setStudents] = useState<DirectoryStudent[]>([]);
  const [hostelId, setHostelId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      const hid = me.hostel?.Block_Id ?? '';
      setHostelId(hid);
      if (hid) {
        const data = await getStudentsByHostel(hid);
        setStudents(data.map(studentToRow));
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.rollNo, s.hostelId].some((v) => v.toLowerCase().includes(q)),
    );
  }, [students, query]);

  return (
    <AppShell activeTab="students">
      <HeroHeader
        title={`${hostelId || '...'} Student Directory`}
        subtitle={`Manage and search students in ${hostelId || 'your block'}.`}
      />
      <View style={styles.main}>
        <SearchBar
          placeholder="Search by name or roll no."
          elevated
          value={query}
          onChangeText={setQuery}
        />
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <ActivityIndicator size="large" color="#002147" />
          </View>
        ) : error ? (
          <Text style={{ color: '#BA1A1A', textAlign: 'center', margin: 16 }}>{error}</Text>
        ) : (
          <View style={styles.list}>
            {filtered.map((s) => (
              <StudentDirectoryRow key={s.id} student={s} />
            ))}
            {!filtered.length && (
              <Text style={{ color: '#74777F', textAlign: 'center', marginTop: 32 }}>
                No students found.
              </Text>
            )}
          </View>
        )}
      </View>
    </AppShell>
  );
}

