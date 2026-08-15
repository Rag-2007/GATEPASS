import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import AppShell from '../../components/AppShell/AppShell';
import HeroHeader from '../../components/HeroHeader/HeroHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import {
  getMe,
  getAllPassActions,
  getPassesByHostel,
  getStudentsByHostel,
} from '../../api/wardenApi';
import type { AuditEntry } from '../../services/wardenService';
import { styles } from './AuditScreen.styles';

export default function AuditScreen() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      const hid = me.hostel?.Block_Id;
      if (!hid) {
        setEntries([]);
        return;
      }

      const [actions, passes, students] = await Promise.all([
        getAllPassActions().catch(() => []),
        getPassesByHostel(hid).catch(() => []),
        getStudentsByHostel(hid).catch(() => []),
      ]);

      const passMap = new Map(passes.map((p) => [p.passID, p]));
      const studentMap = new Map(students.map((s) => [s.Roll_NO, s]));

      const mapped: AuditEntry[] = [];

      for (const action of actions) {
        let name = '';
        let rollNo = '';

        if (passMap.has(action.passID)) {
          const pass = passMap.get(action.passID)!;
          rollNo = pass.RollNo;
          name = pass.student?.Roll_No ?? pass.RollNo;

          const s = studentMap.get(rollNo);
          if (s && s.Name) name = s.Name;
        }
        // If passID is a roll number (for block/unblock actions)
        else if (studentMap.has(action.passID)) {
          const s = studentMap.get(action.passID)!;
          rollNo = s.Roll_NO;
          name = s.Name ?? s.Roll_NO;
        } else {
          continue;
        }

        mapped.push({
          id: action.id,
          name,
          rollNo,
          action: action.Action_Type,
          time: new Date(action.Timestamp).toLocaleString(),
          remarks: action.Remarks,
        });
      }

      setEntries(mapped);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesQuery =
        !normalizedQuery ||
        [entry.name, entry.rollNo, entry.action, entry.remarks].some(
          (value) => value && value.toLowerCase().includes(normalizedQuery)
        );

      return matchesQuery;
    });
  }, [query, entries]);

  return (
    <AppShell activeTab="audit">
      <HeroHeader
        height={192}
        title="Audit Records"
        subtitle="Student Movement Logs"
      />
      <View style={styles.main}>
        <View style={styles.filterCard}>
          <SearchBar
            placeholder="Search by Student Name or Roll No..."
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
          <View style={styles.logCard}>
            {visibleEntries.map((entry, index) => (
              <View
                key={entry.id || `audit-${index}`}
                style={[styles.logRow, index > 0 && styles.logRowBorder]}
              >
                <View style={styles.logIdentity}>
                  <Text style={styles.logName}>{entry.name}</Text>
                  <Text style={styles.rollNo}>{entry.rollNo}</Text>
                </View>
                <View style={styles.logMeta}>
                  <View
                    style={[
                      styles.statusChip,
                      entry.action.toLowerCase().includes('out')
                        ? styles.outChip
                        : styles.inChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        entry.action.toLowerCase().includes('out')
                          ? styles.outChipText
                          : styles.inChipText,
                      ]}
                    >
                      {entry.action}
                    </Text>
                  </View>
                  <Text style={styles.time}>{entry.time}</Text>
                  {entry.remarks ? (
                    <View
                      style={[
                        styles.statusChip,
                        styles.neutralChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          styles.neutralText,
                        ]}
                      >
                        {entry.remarks}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
            {!visibleEntries.length && (
              <Text style={{ textAlign: 'center', marginTop: 16, color: '#74777F' }}>No records found</Text>
            )}
          </View>
        )}
      </View>
    </AppShell>
  );
}

