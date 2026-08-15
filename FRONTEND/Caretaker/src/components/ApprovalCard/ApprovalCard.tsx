import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { type ApprovalRequest } from "../../services/caretakerService";
import { styles } from "./ApprovalCard.styles";

interface ApprovalCardProps {
  request: ApprovalRequest;
  onApprove: () => void;
  onReject?: () => void;
}

export default function ApprovalCard({
  request,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <Text style={styles.name}>{request.name}</Text>
          <Text style={styles.rollNo}>{request.rollNo}</Text>
        </View>
        <View style={styles.badgeStack}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{request.passType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#44474E" />
          <Text style={styles.detailText}>{request.duration}</Text>
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>REASON</Text>
          <Text style={styles.reasonText}>{request.reason}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.submitted}>
          <MaterialCommunityIcons name="clock-check-outline" size={15} color="#74777F" />
          <Text style={styles.submittedText}>HOME PASS</Text>
        </View>
        <View style={styles.actions}>
          {onReject && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Reject ${request.name}`}
              onPress={onReject}
              style={[styles.actionButton, styles.rejectButton]}
            >
              <Ionicons name="close" size={18} color="#BA1A1A" />
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Approve ${request.name}`}
            onPress={onApprove}
            style={[styles.actionButton, styles.approveButton]}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

