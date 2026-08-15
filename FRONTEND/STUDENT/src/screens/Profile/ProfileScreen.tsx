import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import campusImage from "../../assets/images/gatepass/campus-profile.png";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import { getMeApi, StudentProfile } from "../../api/student.api";
import { styles } from "./ProfileScreen.styles";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMeApi()
      .then(setProfile)
      .catch((e: any) => setError(e?.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const avatarLetter = profile?.Name?.charAt(0).toUpperCase() ?? "?";
  const isBlocked = profile?.IS_BLOCKED ?? false;

  return (
    <GatepassLayout activeTab="profile" heroSource={campusImage} heroHeight={192} heroOverlap={40} heroTone="dark">
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
          <ActivityIndicator size="large" color="#708AB5" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
          <Text style={{ color: "#FF8A80", fontSize: 14 }}>{error}</Text>
        </View>
      ) : (
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{avatarLetter}</Text>
            </View>
            <View style={styles.profileIdentity}>
              <Text style={styles.name}>{profile?.Name ?? "—"}</Text>
              <View style={[styles.statusBadge, isBlocked && { backgroundColor: "#FFE8E8" }]}>
                <Text style={[styles.statusText, isBlocked && { color: "#BA1A1A" }]}>
                  {isBlocked ? "BLOCKED" : "NOT BLOCKED"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.fields}>
            <View style={styles.fullField}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{profile?.Email ?? "—"}</Text>
              </View>
            </View>

            <View style={styles.fullField}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{profile?.PhoneNo ?? "—"}</Text>
              </View>
            </View>

            <View style={styles.splitRow}>
              <View style={styles.splitField}>
                <Text style={styles.label}>ROLL NUMBER</Text>
                <View style={styles.valueBoxCompact}>
                  <Text
                    style={styles.strongValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}
                  >
                    {profile?.Roll_NO ?? "—"}
                  </Text>
                </View>
              </View>
              <View style={styles.splitField}>
                <Text style={styles.label}>HOSTEL BLOCK</Text>
                <View style={styles.valueBoxCompact}>
                  <Text style={styles.strongValue}>{profile?.Hostel_Id ?? "—"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.fullField}>
              <Text style={styles.label}>PARENT NAME</Text>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{profile?.Parent_Name ?? "—"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>OFFICIAL STUDENT PROFILE</Text>
          </View>
        </View>
      )}
    </GatepassLayout>
  );
}

