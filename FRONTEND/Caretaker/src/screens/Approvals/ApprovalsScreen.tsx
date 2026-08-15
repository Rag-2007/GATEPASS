import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import AppShell from "../../components/AppShell/AppShell";
import ApprovalCard from "../../components/ApprovalCard/ApprovalCard";
import HeroHeader from "../../components/HeroHeader/HeroHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import {
  getMe,
  getParentApprovedPasses,
  approvePass,
  rejectPass,
  type Pass,
} from "../../api/caretakerApi";
import type { ApprovalRequest } from "../../services/caretakerService";
import { styles } from "./ApprovalsScreen.styles";

function passToApproval(p: Pass): ApprovalRequest {
  return {
    id: p.passID,
    name: p.student?.Roll_No ?? p.RollNo,
    rollNo: p.RollNo,
    passType: p.passType === "HOME_PASS" ? "HOMEPASS" : "DAYPASS",
    duration: `${p.Expected_Date}  ${p.Expected_Time}`,
    reason: p.Purpose,
  };
}

export default function ApprovalsScreen() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [handledIds, setHandledIds] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      const hid = me.hostel?.Block_Id ?? null;
      if (hid) {
        const data = await getParentApprovedPasses(hid);

        setPasses(data.filter((p) => p.passType === "HOME_PASS"));
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (passId: string) => {
    try {
      await approvePass(passId);
      setHandledIds((curr) => [...curr, passId]);
    } catch (e: any) {

      await loadData();
    }
  };

  const handleReject = async (passId: string) => {
    try {
      await rejectPass(passId);
      setHandledIds((curr) => [...curr, passId]);
    } catch (e: any) {

      await loadData();
    }
  };

  const requests: ApprovalRequest[] = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return passes
      .filter((p) => !handledIds.includes(p.passID))
      .map(passToApproval)
      .filter((r) => {
        if (!normalizedQuery) return true;
        return [r.name, r.rollNo, r.duration, r.reason, r.passType].some((v) =>
          v.toLowerCase().includes(normalizedQuery),
        );
      });
  }, [passes, handledIds, query]);

  return (
    <AppShell activeTab="approvals">
      <HeroHeader
        title="Student Approvals"
        subtitle="Review and manage pending home pass requests."
        meta={`PENDING REQUESTS (${requests.length})`}
      />
      <View style={styles.main}>
        <View style={styles.searchShell}>
          <SearchBar
            placeholder="Search by name or roll no."
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {loading ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <ActivityIndicator size="large" color="#002147" />
          </View>
        ) : error ? (
          <Text style={{ color: "#BA1A1A", textAlign: "center", margin: 16 }}>{error}</Text>
        ) : (
          <View style={styles.list}>
            {requests.length ? (
              requests.map((request) => (
                <ApprovalCard
                  key={request.id}
                  request={request}
                  onApprove={() => handleApprove(request.id)}
                  onReject={() => handleReject(request.id)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No pending approvals</Text>
                <Text style={styles.emptyText}>
                  Approved or rejected requests will clear from this queue.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </AppShell>
  );
}

