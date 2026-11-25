import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  navy: "#07143D",
  navy2: "#10265C",
  gold: "#D9A928",
  goldLight: "#F4D77C",
  background: "#F4F6FA",
  white: "#FFFFFF",
  muted: "#6B7280",
};

function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>ARF</Text>
      </View>

      <View>
        <Text style={styles.brandTitle}>ANISH REDDY FINANCE</Text>
        <Text style={styles.brandSubtitle}>CUSTOMER MANAGEMENT</Text>
      </View>
    </View>
  );
}

export default function HomeScreen({ onAddCustomer, onSearchCustomer }) {
  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={COLORS.navy}
        barStyle="light-content"
        translucent={false}
      />

      <BrandHeader />

      {/* Light background starts below the brand header */}
      <View style={styles.contentArea}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to ARF</Text>

            <Text style={styles.welcomeSubtitle}>
              Customer Management System
            </Text>

            <View style={styles.goldLine} />
          </View>

          <View style={styles.actionContainer}>
            <Text style={styles.sectionTitle}>CUSTOMER SERVICES</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={onAddCustomer}
              activeOpacity={0.85}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>＋</Text>
              </View>

              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Add New Customer</Text>

                <Text style={styles.actionDescription}>
                  Register a new customer and enter finance agreement details
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={onSearchCustomer}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, styles.searchIconBox]}>
                <Text style={styles.icon}>⌕</Text>
              </View>

              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Search Customer</Text>

                <Text style={styles.actionDescription}>
                  Find customers by document number, name or vehicle number
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>ARF • ANISH REDDY FINANCE</Text>
            <Text style={styles.footerSubtext}>
              Customer Management Application
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  contentArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.gold,
  },

  brandMark: {
    width: 62,
    height: 62,
    borderRadius: 15,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  brandMarkText: {
    color: COLORS.navy,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -1,
  },

  brandTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  brandSubtitle: {
    color: COLORS.goldLight,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 5,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  welcomeSection: {
    marginTop: 38,
    marginBottom: 42,
  },

  welcomeTitle: {
    color: COLORS.navy,
    fontSize: 29,
    fontWeight: "900",
  },

  welcomeSubtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 8,
  },

  goldLine: {
    width: 65,
    height: 4,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
    marginTop: 18,
  },

  actionContainer: {
    gap: 18,
  },

  sectionTitle: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 3,
  },

  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 17,
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E8F0",
    borderLeftWidth: 5,
    borderLeftColor: COLORS.gold,
    elevation: 3,
  },

  iconBox: {
    width: 59,
    height: 59,
    borderRadius: 15,
    backgroundColor: "#FFF4D5",
    alignItems: "center",
    justifyContent: "center",
  },

  searchIconBox: {
    backgroundColor: "#E7EFFB",
  },

  icon: {
    color: COLORS.navy,
    fontSize: 39,
    fontWeight: "600",
    lineHeight: 45,
  },

  actionTextContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 7,
  },

  actionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "900",
  },

  actionDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  arrow: {
    color: COLORS.navy,
    fontSize: 31,
    fontWeight: "700",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 35,
    alignItems: "center",
    paddingBottom: 12,
  },

  footerText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  footerSubtext: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
});
