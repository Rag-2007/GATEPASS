import { Pressable, Text, View } from "react-native";

import { type ApprovalRequest } from "../../services/wardenService";
import { styles } from "./ApprovalCard.styles";

interface ApprovalCardProps {
  request: ApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
}

export default function ApprovalCard({
  request,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.requestStrip}>
        <Text style={styles.requestId}>REQUEST #{request.id}</Text>
        <View style={styles.passBadge}>
          <Text style={styles.passBadgeText}>
            {request.passType === "HOMEPASS" ? "HOME PASS" : "DAY PASS"}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.name}>{request.name}</Text>
          <Text style={styles.rollNo}>Roll: {request.rollNo}</Text>
        </View>
        <View style={styles.detailRows}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>DURATION</Text>
            <Text style={styles.detailValue}>{request.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>REASON</Text>
            <Text style={styles.detailValue}>{request.reason}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Reject ${request.name}`}
          onPress={onReject}
          style={[styles.actionButton, styles.rejectButton]}
        >
          <Text style={styles.actionText}>Reject</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Approve ${request.name}`}
          onPress={onApprove}
          style={[styles.actionButton, styles.approveButton]}
        >
          <Text style={styles.actionText}>Approve</Text>
        </Pressable>
      </View>
    </View>
  );
}

