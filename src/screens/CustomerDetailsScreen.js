import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Linking } from "react-native";
import { getCustomer, API_BASE_URL } from "../services/api";

const COLORS = {
  navy: "#07143D",
  navy2: "#10265C",
  gold: "#D9A928",
  goldLight: "#F4D77C",
  background: "#F4F6FA",
  text: "#172033",
  muted: "#6B7280",
  border: "#DCE2EC",
  white: "#FFFFFF",
  blue: "#0755B8",
  red: "#C62828",
};

const DETAIL_FIELDS = [
  { key: "documentNumber", label: "Document Number" },
  { key: "name", label: "Customer Name" },
  { key: "area", label: "Area" },
  { key: "contactNumber", label: "Contact Number" },
  { key: "agreementDate", label: "Agreement Date", date: true },
  { key: "vehicleType", label: "Vehicle Type" },
  { key: "vehicleNumber", label: "Vehicle Number" },
  { key: "tenure", label: "Tenure" },
  { key: "dueDate", label: "Due Date", date: true },
  { key: "emiAmount", label: "EMI Amount", money: true },
  { key: "emiStartDate", label: "EMI Start Date", date: true },
  {
    key: "currentMonthInstallment",
    label: "Current Month Installment",
    money: true,
  },
  { key: "overdueInstallment", label: "Overdue Installment", money: true },
  { key: "openingOverdueAmount", label: "Opening Overdue Amount", money: true },
  { key: "currentMonthEmi", label: "Current Month EMI", money: true },
  { key: "totalPendingAmount", label: "Total Pending Amount", money: true },
  { key: "guarantorContactNumber", label: "Guarantor Contact Number" },
];

function formatDate(value) {
  if (!value) return "-";

  const datePart = String(value).slice(0, 10);
  const parts = datePart.split("-");

  if (parts.length !== 3) return String(value);

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function displayValue(value, field) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (field.date) return formatDate(value);

  if (field.money) {
    return `₹ ${Number(value).toLocaleString("en-IN")}`;
  }

  if (field.key === "tenure") {
    return `${value} months`;
  }

  return String(value);
}

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

export default function CustomerDetailsScreen({ customerId, onBack }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomer(customerId);

      if (!data) {
        throw new Error("Customer details not found.");
      }

      setCustomer(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load customer details."
      );
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPDF = async () => {
    try {
      const filePath = customer?.document?.filePath;

      if (!filePath) {
        Alert.alert(
          "No Document",
          "No PDF document has been uploaded for this customer."
        );
        return;
      }

      const serverUrl = API_BASE_URL.replace(/\/api\/?$/, "");
      const pdfUrl = `${serverUrl}${filePath}`;

      const supported = await Linking.canOpenURL(pdfUrl);

      if (!supported) {
        Alert.alert(
          "Unable to Open PDF",
          "No application is available to open this document."
        );
        return;
      }

      await Linking.openURL(pdfUrl);
    } catch (error) {
      console.log("PDF Opening Error:", error);

      Alert.alert(
        "Unable to Open PDF",
        error.message || "Please check your internet connection."
      );
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={COLORS.navy}
        barStyle="light-content"
        translucent={false}
      />

      <BrandHeader />

      <View style={styles.titleBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Customer Details</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.blue} />
          <Text style={styles.message}>Loading customer details...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={loadCustomer}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backLink} onPress={onBack}>
            <Text style={styles.backLinkText}>Back to search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.contentArea}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.customerBanner}>
            <Text style={styles.customerName}>{customer.name}</Text>

            <Text style={styles.documentNumber}>
              Document No: {customer.documentNumber}
            </Text>

            <Text style={styles.vehicleNumber}>
              Vehicle: {customer.vehicleNumber}
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Customer Information</Text>

            {DETAIL_FIELDS.map((field, index) => (
              <View
                key={field.key}
                style={[
                  styles.detailRow,
                  index === DETAIL_FIELDS.length - 1 ? styles.lastRow : null,
                ]}
              >
                <Text style={styles.detailLabel}>{field.label}</Text>

                <Text style={styles.detailValue}>
                  {displayValue(customer[field.key], field)}
                </Text>
              </View>
            ))}

            {customer?.document?.filePath ? (
              <TouchableOpacity
                style={styles.pdfButton}
                onPress={openCustomerPDF}
                activeOpacity={0.8}
              >
                <Text style={styles.pdfButtonText}>📄 View Uploaded PDF</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noDocumentText}>
                No PDF document uploaded
              </Text>
            )}
          </View>

          <Text style={styles.footer}>ARF • Anish Reddy Finance</Text>
        </ScrollView>
      )}
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
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.gold,
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "900",
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
    marginTop: 4,
    fontWeight: "700",
  },
  titleBar: {
    backgroundColor: COLORS.navy2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  backButton: {
    paddingRight: 15,
  },
  backText: {
    color: COLORS.white,
    fontSize: 35,
    lineHeight: 38,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  customerBanner: {
    backgroundColor: COLORS.navy2,
    borderRadius: 15,
    padding: 19,
    marginBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.gold,
  },
  customerName: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
  },
  documentNumber: {
    color: COLORS.goldLight,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 9,
  },
  vehicleNumber: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 5,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingTop: 17,
    borderWidth: 1,
    borderColor: "#E8ECF2",
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 9,
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF0F5",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 5,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: "#9AA3B2",
    fontSize: 11,
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  message: {
    color: COLORS.muted,
    marginTop: 12,
  },
  error: {
    color: COLORS.red,
    textAlign: "center",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 12,
    marginTop: 18,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: "800",
  },
  backLink: {
    marginTop: 15,
    padding: 8,
  },
  backLinkText: {
    color: COLORS.blue,
    fontWeight: "700",
  },
  pdfButton: {
    backgroundColor: "#07143D",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  pdfButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  noDocumentText: {
    color: "#777777",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
  },
});
