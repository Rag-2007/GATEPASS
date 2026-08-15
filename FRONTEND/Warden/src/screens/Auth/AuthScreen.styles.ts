import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 537,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  panel: {
    width: "100%",
    maxWidth: 392,
    minHeight: 537,
    paddingTop: 35,
    paddingHorizontal: 64,
    alignItems: "center",
  },
  logo: {
    width: 92,
    height: 92,
    marginBottom: 9,
  },
  title: {
    color: "#000A1E",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 3,
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginTop: 30,
  },
  labelRow: {
    minHeight: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#202124",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  forgot: {
    color: "#111827",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  inputBox: {
    height: 46,
    borderWidth: 1,
    borderColor: "#C0C6D0",
    borderRadius: 4,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 23,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    color: COLORS.textStrong,
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 0,
  },
  signInButton: {
    height: 40,
    borderRadius: 4,
    backgroundColor: "#002147",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
  },
  signInButtonPressed: {
    opacity: 0.88,
  },
  signInText: {
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
});

