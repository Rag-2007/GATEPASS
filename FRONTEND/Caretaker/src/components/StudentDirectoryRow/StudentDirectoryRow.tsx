import { Text, View } from "react-native";

import { type DirectoryStudent } from "../../services/caretakerService";
import { styles } from "./StudentDirectoryRow.styles";

interface StudentDirectoryRowProps {
  student: DirectoryStudent;
}

export default function StudentDirectoryRow({ student }: StudentDirectoryRowProps) {
  const brown = student.accent === "brown";

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, brown && styles.avatarBrown]}>
        <Text style={[styles.avatarText, brown && styles.avatarTextBrown]}>
          {student.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <View style={styles.detailLine}>
          <Text style={styles.label}>ROLL NO:</Text>
          <Text style={styles.rollNo}>{student.rollNo}</Text>
        </View>
        <View style={styles.detailLine}>
          <Text style={styles.label}>HOSTEL:</Text>
          <View style={styles.roomChip}>
            <Text style={styles.roomText}>{student.hostelId}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

