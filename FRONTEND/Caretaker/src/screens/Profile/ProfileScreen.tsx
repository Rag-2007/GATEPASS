import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { caretakerImages } from "../../assets";
import AppShell from "../../components/AppShell/AppShell";
import HeroHeader from "../../components/HeroHeader/HeroHeader";
import ProfileField from "../../components/ProfileField/ProfileField";
import { getMe, updateMyProfile } from "../../api/caretakerApi";
import { clearTokens } from "../../utils/tokenStore";
import { styles } from "./ProfileScreen.styles";

const initialProfile = { name: "", email: "", phone: "", hostelBlock: "" };

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile]   = useState(initialProfile);
  const [draft, setDraft]       = useState(initialProfile);
  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      const data = {
        name: me.user?.Name ?? "",
        email: me.user?.Email ?? "",
        phone: me.user?.Phone ?? "",
        hostelBlock: me.hostel?.Block_Id ?? "Unassigned",
      };
      setProfile(data);
      setDraft(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile({ Name: draft.name, Phone: draft.phone });
      setProfile(draft);
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await clearTokens();
    router.replace("/auth");
  };

  return (
    <AppShell activeTab="dashboard">
      <HeroHeader title="My Profile" subtitle="Account & Settings" />
      <View style={styles.main}>
        {loading ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <ActivityIndicator size="large" color="#002147" />
          </View>
        ) : error ? (
          <Text style={{ color: "#BA1A1A", textAlign: "center", margin: 16 }}>{error}</Text>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <Image source={caretakerImages.profile} resizeMode="cover" style={styles.avatar} />
              <View style={styles.profileCopy}>
                <Text style={styles.name}>{profile.name}</Text>
                <View style={styles.staffBadge}>
                  <MaterialCommunityIcons name="shield-check" size={13} color="#54647A" />
                  <Text style={styles.staffBadgeText}>AUTHORIZED STAFF</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.fields}>
              <ProfileField
                label="FULL NAME"
                value={editing ? draft.name : profile.name}
                icon="person-outline"
                editable={editing}
                onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))}
              />
              <ProfileField
                label="EMAIL ADDRESS"
                value={profile.email}
                icon="mail-outline"
                editable={false}
                onChangeText={() => {}}
              />
              <ProfileField
                label="PHONE NUMBER"
                value={editing ? draft.phone : profile.phone}
                icon="call-outline"
                editable={editing}
                onChangeText={(v) => setDraft((d) => ({ ...d, phone: v }))}
              />
              <ProfileField
                label="HOSTEL BLOCK"
                value={profile.hostelBlock}
                icon="office-building-outline"
                editable={false}
                strong
                onChangeText={() => {}}
              />
            </View>

            {editing ? (
              <View style={styles.buttonRow}>
                <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={handleCancel}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.primaryButton, saving && { opacity: 0.6 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={styles.primaryButtonText}>Save Changes</Text>
                  }
                </Pressable>
              </View>
            ) : (
              <Pressable style={[styles.actionButton, styles.primaryButton, { minHeight: 46 }]} onPress={handleEdit}>
                <Ionicons name="pencil" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </Pressable>
            )}

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#BA1A1A" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
            <View style={styles.officialBadge}>
              <MaterialCommunityIcons name="shield-check-outline" size={13} color="#74777F" />
              <Text style={styles.officialBadgeText}>OFFICIAL STAFF PROFILE</Text>
            </View>
          </>
        )}
      </View>
    </AppShell>
  );
}

