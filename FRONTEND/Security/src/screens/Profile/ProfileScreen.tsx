import React from "react";
import { Text, View } from "react-native";

import campusImage from "../../assets/images/gatepass/campus-profile.png";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { styles } from "./ProfileScreen.styles";

export default function ProfileScreen() {
  return (
    <GatepassLayout activeTab="profile" heroSource={campusImage} heroHeight={192} heroOverlap={40} heroTone="dark">
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <GatepassSymbol name="person" fallback="P" size={28} color="#002147" />
          </View>
          <View style={styles.profileIdentity}>
            <Text style={styles.name}>Raghuveer</Text>
            <View style={styles.statusBadge}>
              <GatepassSymbol name="checkmark.circle.fill" fallback="Y" size={12} color="#1D7A42" />
              <Text style={styles.statusText}>NOT BLOCKED</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.fields}>
          <View style={styles.fullField}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.valueBox}>
              <GatepassSymbol name="envelope" fallback="M" size={16} color="#505F76" />
              <Text style={styles.valueText}>raghuveer.k24@iiits.in</Text>
            </View>
          </View>

          <View style={styles.fullField}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <View style={styles.valueBox}>
              <GatepassSymbol name="phone" fallback="P" size={16} color="#505F76" />
              <Text style={styles.valueText}>+91 8977568680</Text>
            </View>
          </View>

          <View style={styles.splitRow}>
            <View style={styles.splitField}>
              <Text style={styles.label}>ROLL NUMBER</Text>
              <View style={styles.valueBoxCompact}>
                <Text style={styles.strongValue}>S20240010107</Text>
              </View>
            </View>
            <View style={styles.splitField}>
              <Text style={styles.label}>HOSTEL BLOCK</Text>
              <View style={styles.valueBoxBetween}>
                <Text style={styles.strongValue}>BH1</Text>
                <GatepassSymbol name="building.2" fallback="B" size={20} color="#505F76" />
              </View>
            </View>
          </View>

          <View style={styles.fullField}>
            <Text style={styles.label}>ROOM NUMBER</Text>
            <View style={styles.valueBoxBetween}>
              <Text style={styles.strongValue}>515</Text>
              <View style={styles.floorRow}>
                <GatepassSymbol name="door.left.hand.open" fallback="D" size={14} color="#505F76" />
                <Text style={styles.floorText}>5th Floor</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <GatepassSymbol name="checkmark.shield" fallback="S" size={13} color="#74777F" />
          <Text style={styles.footerText}>OFFICIAL STUDENT PROFILE</Text>
        </View>
      </View>
    </GatepassLayout>
  );
}

