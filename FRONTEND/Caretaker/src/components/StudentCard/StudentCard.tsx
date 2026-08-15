import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { type CurrentlyOutStudent } from "../../services/caretakerService";
import { styles } from "./StudentCard.styles";

interface StudentCardProps {
  student: CurrentlyOutStudent;
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <View style={[styles.card, student.overdue && styles.cardOverdue]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.rollNo}>{student.rollNo}</Text>
        </View>
        <View style={styles.badgeStack}>
          {student.overdue ? (
            <View style={[styles.badge, styles.overdueBadge]}>
              <Text style={[styles.badgeText, styles.overdueBadgeText]}>OVERDUE</Text>
            </View>
          ) : null}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{student.passType}</Text>
          </View>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons
            name={student.passType === "HOMEPASS" ? "calendar-outline" : "time-outline"}
            size={16}
            color={student.overdue ? "#BA1A1A" : "#44474E"}
          />
          <Text style={[styles.detailText, student.overdue && styles.detailDanger]}>
            {student.schedule}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#44474E" />
          <Text style={styles.detailText}>{student.destination}</Text>
        </View>
      </View>
    </View>
  );
}

