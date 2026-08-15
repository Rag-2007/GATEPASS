import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { createPassApi, CreatePassDto, PassType } from "../../api/passes.api";

const PASS_TYPES: { label: string; value: PassType; desc: string }[] = [
  { label: "Day Pass", value: "DAY_PASS", desc: "Return same day by midnight" },
  { label: "Home Pass", value: "HOME_PASS", desc: "Overnight / multi-day" },
];

const TRANSPORT_OPTIONS = ["Bus", "Train", "Car", "Auto", "Bike", "Cab", "Walking"];

const ALL_TIME_SLOTS: { label: string; value: string }[] = (() => {
  const slots: { label: string; value: string }[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m > 0) break;
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      slots.push({ label: `${hour12}:${mm} ${ampm}`, value: `${hh}:${mm}` });
    }
  }
  return slots;
})();

function getAvailableSlots(forDateStr: string): { label: string; value: string }[] {
  const now = new Date();
  const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  if (forDateStr === today || forDateStr === "") {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return ALL_TIME_SLOTS.filter(slot => {
      const [h, m] = slot.value.split(":").map(Number);
      return h * 60 + m > nowMinutes;
    });
  }
  return ALL_TIME_SLOTS;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEK_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DayCell = {
  day: number;
  dateStr: string | null;
  inMonth: boolean;
  isToday: boolean;
  isPast: boolean;
};

function generateCells(year: number, month: number): DayCell[] {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = 0; i < firstDow; i++) {
    cells.push({ day: daysInPrev - firstDow + 1 + i, dateStr: null, inMonth: false, isToday: false, isPast: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d); dateObj.setHours(0, 0, 0, 0);
    const str = `${year}-${(month + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
    cells.push({ day: d, dateStr: str, inMonth: true, isToday: dateObj.getTime() === now.getTime(), isPast: dateObj < now });
  }
  const rem = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= rem; d++) {
    cells.push({ day: d, dateStr: null, inMonth: false, isToday: false, isPast: true });
  }
  return cells;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function CalendarPicker({
  visible, selected, onClose, onSelect,
}: { visible: boolean; selected: string; onClose: () => void; onSelect: (d: string) => void }) {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const cells = useMemo(() => generateCells(vy, vm), [vy, vm]);

  const canPrev = vy > now.getFullYear() || (vy === now.getFullYear() && vm > now.getMonth());
  const prev = () => vm === 0 ? (setVm(11), setVy(y => y - 1)) : setVm(m => m - 1);
  const next = () => vm === 11 ? (setVm(0), setVy(y => y + 1)) : setVm(m => m + 1);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={PS.overlay} onPress={onClose}>
        <Pressable style={PS.calCard} onPress={() => { }}>
          <Text style={PS.sheetTitle}>Select Return Date</Text>

          <View style={PS.monthNav}>
            <TouchableOpacity onPress={prev} disabled={!canPrev} style={PS.navBtn}>
              <Text style={[PS.navText, !canPrev && { opacity: 0.25 }]}>‹</Text>
            </TouchableOpacity>
            <Text style={PS.monthLabel}>{MONTH_NAMES[vm]} {vy}</Text>
            <TouchableOpacity onPress={next} style={PS.navBtn}>
              <Text style={PS.navText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={PS.weekRow}>
            {WEEK_LABELS.map(w => <Text key={w} style={PS.weekLabel}>{w}</Text>)}
          </View>

          <View style={PS.daysGrid}>
            {cells.map((cell, i) => {
              const isSel = cell.dateStr === selected;
              const disabled = !cell.inMonth || cell.isPast;
              return (
                <TouchableOpacity
                  key={i}
                  disabled={disabled}
                  onPress={() => cell.dateStr && onSelect(cell.dateStr)}
                  style={[
                    PS.dayCell,
                    isSel && PS.dayCellSel,
                    cell.isToday && !isSel && PS.dayCellToday,
                  ]}
                >
                  <Text style={[
                    PS.dayText,
                    !cell.inMonth && PS.dayTextOther,
                    disabled && !isSel && PS.dayTextDisabled,
                    isSel && PS.dayTextSel,
                    cell.isToday && !isSel && PS.dayTextToday,
                  ]}>
                    {cell.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={onClose} style={PS.closeBtn}>
            <Text style={PS.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function TimePicker({
  visible, selected, forDate, onClose, onSelect,
}: { visible: boolean; selected: string; forDate: string; onClose: () => void; onSelect: (t: string) => void }) {
  const slots = useMemo(() => getAvailableSlots(forDate), [forDate]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={PS.timeOverlay}>
        <View style={PS.timeSheet}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ width: "100%", alignItems: "center", paddingVertical: 8 }}>
            <View style={PS.sheetHandle} />
          </TouchableOpacity>
          <Text style={PS.sheetTitle}>Select Return Time</Text>
          <Text style={PS.timeSubtitle}>Maximum allowed: 10:00 PM</Text>

          <ScrollView style={PS.timeList} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {slots.length === 0 ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <Text style={{ color: "#74777F", textAlign: "center" }}>
                  No time slots available.{"\n"}All slots for today have passed.
                </Text>
              </View>
            ) : slots.map(slot => {
              const isSel = slot.value === selected;
              return (
                <TouchableOpacity
                  key={slot.value}
                  onPress={() => { onSelect(slot.value); onClose(); }}
                  style={[PS.timeItem, isSel && PS.timeItemSel]}
                >
                  <Text style={[PS.timeItemText, isSel && PS.timeItemTextSel]}>{slot.label}</Text>
                  {isSel && <Text style={PS.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 24 }} />
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={PS.doneBtn}>
            <Text style={PS.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={FS.fieldGroup}>
      <Text style={FS.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function ApplyPassFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [passtype, setPasstype] = useState<PassType>("DAY_PASS");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [modeOfTransport, setModeOfTransport] = useState("Bus");

  const [expectedDate, setExpectedDate] = useState("");
  const [expectedTime, setExpectedTime] = useState("");

  const [calOpen, setCalOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTimeLabel = expectedTime
    ? (ALL_TIME_SLOTS.find(s => s.value === expectedTime)?.label ?? expectedTime)
    : "Select time";

  const validate = (): string | null => {
    if (!destination.trim()) return "Destination is required.";
    if (!purpose.trim()) return "Purpose is required.";
    if (!expectedTime) return "Please select a return time.";
    if (passtype === "HOME_PASS") {
      if (!expectedDate) return "Please select a return date.";
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(expectedDate) < today) return "Return date must be today or in the future.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);

    const dto: CreatePassDto = {
      passtype,
      destination: destination.trim(),
      purpose: purpose.trim(),
      modeOfTransport: modeOfTransport.trim(),
      expectedDate: passtype === "DAY_PASS" ? todayStr() : expectedDate,
      expectedTime: expectedTime,
    };

    try {
      await createPassApi(dto);
      Alert.alert(
        "Pass Raised!",
        "Your pass has been submitted. Track its status in My Passes.",
        [{ text: "View Passes", onPress: () => router.replace("/passes" as never) }]
      );
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to create pass.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#F5F7FA" }}
    >

      <CalendarPicker
        visible={calOpen}
        selected={expectedDate}
        onClose={() => setCalOpen(false)}
        onSelect={(d) => {
          setExpectedDate(d);
          setCalOpen(false);

          setExpectedTime("");
        }}
      />
      <TimePicker
        visible={timeOpen}
        selected={expectedTime}
        forDate={passtype === "DAY_PASS" ? todayStr() : expectedDate}
        onClose={() => setTimeOpen(false)}
        onSelect={setExpectedTime}
      />

      <View style={[FS.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={FS.backBtn}>
          <Text style={FS.backText}>‹</Text>
        </Pressable>
        <Text style={FS.headerTitle}>Raise New Pass</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[FS.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <View style={FS.errorBox}>
            <Text style={FS.errorText}>{error}</Text>
          </View>
        ) : null}

        <Field label="PASS TYPE">
          <View style={FS.toggleRow}>
            {PASS_TYPES.map(pt => (
              <TouchableOpacity
                key={pt.value}
                onPress={() => setPasstype(pt.value)}
                style={[FS.toggleBtn, passtype === pt.value && FS.toggleBtnActive]}
              >
                <Text style={[FS.toggleText, passtype === pt.value && FS.toggleTextActive]}>{pt.label}</Text>
                <Text style={[FS.toggleDesc, passtype === pt.value && FS.toggleDescActive]}>{pt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        <Field label="DESTINATION">
          <View style={FS.inputBox}>
            <TextInput
              style={FS.inputField}
              placeholder="e.g. Hyderabad"
              placeholderTextColor="#9AA5B4"
              value={destination}
              onChangeText={setDestination}
              editable={!loading}
            />
          </View>
        </Field>

        <Field label="PURPOSE">
          <View style={FS.inputBox}>
            <TextInput
              style={FS.inputField}
              placeholder="e.g. Festival Vacation"
              placeholderTextColor="#9AA5B4"
              value={purpose}
              onChangeText={setPurpose}
              editable={!loading}
            />
          </View>
        </Field>

        <Field label="MODE OF TRANSPORT">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
          >
            {TRANSPORT_OPTIONS.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setModeOfTransport(t)}
                style={[FS.chip, modeOfTransport === t && FS.chipActive]}
              >
                <Text style={[FS.chipText, modeOfTransport === t && FS.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Field>

        {passtype === "DAY_PASS" && (
          <>
            <View style={FS.infoBanner}>
              <Text style={FS.infoBannerTitle}>Same-day return</Text>
              <Text style={FS.infoBannerBody}>
                You must return to the hostel by today.
              </Text>
            </View>

            <Field label="EXPECTED RETURN TIME  ·  Max 10:00 PM">
              <TouchableOpacity
                onPress={() => setTimeOpen(true)}
                style={FS.pickerBtn}
                activeOpacity={0.7}
              >
                <View style={FS.pickerBtnContent}>
                  <View style={[FS.pickerIconBox, { backgroundColor: "#002147" }]}>
                    <Text style={[FS.pickerIconText, { color: "#FFFFFF" }]}>CLK</Text>
                  </View>
                  <View style={FS.pickerTextBox}>
                    <Text style={FS.pickerBtnLabel}>Return Time</Text>
                    <Text style={FS.pickerBtnValue}>{selectedTimeLabel}</Text>
                  </View>
                </View>
                <Text style={FS.pickerChevron}>›</Text>
              </TouchableOpacity>
            </Field>
          </>
        )}

        {passtype === "HOME_PASS" && (
          <>
            <Field label="EXPECTED RETURN DATE">
              <TouchableOpacity
                onPress={() => setCalOpen(true)}
                style={FS.pickerBtn}
                activeOpacity={0.7}
              >
                <View style={FS.pickerBtnContent}>
                  <View style={FS.pickerIconBox}>
                    <Text style={FS.pickerIconText}>CAL</Text>
                  </View>
                  <View style={FS.pickerTextBox}>
                    <Text style={FS.pickerBtnLabel}>Return Date</Text>
                    <Text style={[FS.pickerBtnValue, !expectedDate && FS.pickerPlaceholder]}>
                      {expectedDate || "Tap to select a date"}
                    </Text>
                  </View>
                </View>
                <Text style={FS.pickerChevron}>›</Text>
              </TouchableOpacity>
            </Field>

            <Field label="EXPECTED RETURN TIME  ·  Max 10:00 PM">
              <TouchableOpacity
                onPress={() => setTimeOpen(true)}
                style={FS.pickerBtn}
                activeOpacity={0.7}
              >
                <View style={FS.pickerBtnContent}>
                  <View style={[FS.pickerIconBox, { backgroundColor: "#002147" }]}>
                    <Text style={[FS.pickerIconText, { color: "#FFFFFF" }]}>CLK</Text>
                  </View>
                  <View style={FS.pickerTextBox}>
                    <Text style={FS.pickerBtnLabel}>Return Time</Text>
                    <Text style={FS.pickerBtnValue}>{selectedTimeLabel}</Text>
                  </View>
                </View>
                <Text style={FS.pickerChevron}>›</Text>
              </TouchableOpacity>
            </Field>
          </>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [FS.submitBtn, (pressed || loading) && { opacity: 0.7 }]}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={FS.submitText}>Submit Pass Request</Text>
          }
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PS = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,10,30,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  sheetTitle: {
    color: "#000A1E",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  navBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#F5F7FA",
  },
  navText: {
    fontSize: 22,
    color: "#002147",
    fontWeight: "700",
    lineHeight: 26,
  },
  monthLabel: {
    color: "#000A1E",
    fontSize: 16,
    fontWeight: "700",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    color: "#74777F",
    fontSize: 12,
    fontWeight: "700",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  dayCellSel: {
    backgroundColor: "#002147",
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: "#708AB5",
  },
  dayText: {
    color: "#191C1E",
    fontSize: 14,
    fontWeight: "600",
  },
  dayTextOther: {
    color: "#DDE2E8",
  },
  dayTextDisabled: {
    color: "#C4C6CF",
  },
  dayTextSel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#002147",
    fontWeight: "800",
  },
  closeBtn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#DDE2E8",
  },
  closeBtnText: {
    color: "#44474E",
    fontSize: 15,
    fontWeight: "600",
  },

  timeOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,10,30,0.5)",
    justifyContent: "flex-end",
  },
  timeSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    height: "70%",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDE2E8",
    marginBottom: 14,
  },
  timeSubtitle: {
    color: "#74777F",
    fontSize: 13,
    textAlign: "center",
    marginTop: -10,
    marginBottom: 14,
  },
  timeList: {
    flex: 1,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: "#F5F7FA",
  },
  timeItemSel: {
    backgroundColor: "#002147",
  },
  timeItemText: {
    color: "#191C1E",
    fontSize: 16,
    fontWeight: "600",
  },
  timeItemTextSel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  doneBtn: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#002147",
    borderRadius: 14,
    marginTop: 14,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

const FS = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 30,
    color: "#002147",
    lineHeight: 36,
  },
  headerTitle: {
    color: "#000A1E",
    fontSize: 17,
    fontWeight: "700",
  },
  scroll: {
    padding: 20,
    gap: 20,
  },
  errorBox: {
    backgroundColor: "#FFF0F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    padding: 14,
  },
  errorText: {
    color: "#BA1A1A",
    fontSize: 13,
    textAlign: "center",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#44474E",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  inputWrap: { display: "none" },
  inputText: { display: "none" },
  inputReal: { display: "none" },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE2E8",
    paddingHorizontal: 16,
    height: 52,
    justifyContent: "center",
  },
  inputField: {
    color: "#000A1E",
    fontSize: 15,
    padding: 0,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DDE2E8",
    gap: 3,
  },
  toggleBtnActive: {
    backgroundColor: "#002147",
    borderColor: "#002147",
  },
  toggleText: {
    color: "#44474E",
    fontSize: 15,
    fontWeight: "700",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  toggleDesc: {
    color: "#9AA5B4",
    fontSize: 11,
    textAlign: "center",
  },
  toggleDescActive: {
    color: "#A0B4D4",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#DDE2E8",
  },
  chipActive: {
    backgroundColor: "#002147",
    borderColor: "#002147",
  },
  chipText: {
    color: "#44474E",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  infoBanner: {
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C4D3F0",
    padding: 16,
    gap: 6,
  },
  infoBannerTitle: {
    color: "#002147",
    fontSize: 14,
    fontWeight: "700",
  },
  infoBannerBody: {
    color: "#44474E",
    fontSize: 13,
    lineHeight: 20,
  },

  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DDE2E8",
    padding: 14,
    paddingRight: 16,
  },
  pickerBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  pickerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerIconText: {
    color: "#002147",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pickerTextBox: {
    gap: 2,
  },
  pickerBtnLabel: {
    color: "#74777F",
    fontSize: 11,
    fontWeight: "600",
  },
  pickerBtnValue: {
    color: "#000A1E",
    fontSize: 15,
    fontWeight: "600",
  },
  pickerPlaceholder: {
    color: "#9AA5B4",
    fontWeight: "400",
  },
  pickerChevron: {
    color: "#9AA5B4",
    fontSize: 20,
    fontWeight: "300",
    lineHeight: 24,
  },

  submitBtn: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#002147",
    borderRadius: 14,
    marginTop: 8,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

