import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerCustomer } from "../services/api";
import * as DocumentPicker from "expo-document-picker";

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
  red: "#C62828",
};

const FIELDS = [
  {
    key: "documentNumber",
    label: "Document number",
    type: "integer",
    keyboard: "number-pad",
  },
  { key: "name", label: "Name", type: "varchar", keyboard: "default" },
  { key: "area", label: "Area", type: "varchar", keyboard: "default" },
  {
    key: "contactNumber",
    label: "Contact number",
    type: "number",
    keyboard: "phone-pad",
  },
  { key: "agreementDate", label: "Agreement date", type: "date" },
  {
    key: "vehicleType",
    label: "Vehicle type",
    type: "varchar",
    keyboard: "default",
  },
  {
    key: "vehicleNumber",
    label: "Vehicle number",
    type: "varchar",
    keyboard: "default",
  },
  { key: "tenure", label: "Tenure", type: "integer", keyboard: "number-pad" },
  { key: "dueDate", label: "Due date", type: "date" },
  {
    key: "emiAmount",
    label: "EMI amount",
    type: "integer",
    keyboard: "number-pad",
  },
  {
    key: "emiStartDate",
    label: "EMI start date",
    type: "date",
  },
  {
    key: "currentMonthInstallment",
    label: "Current month installment",
    type: "float",
    keyboard: "decimal-pad",
  },
  {
    key: "overdueInstallment",
    label: "Overdue installment",
    type: "float",
    keyboard: "decimal-pad",
  },
  {
    key: "openingOverdueAmount",
    label: "Opening overdue amount",
    type: "integer",
    keyboard: "number-pad",
  },
  {
    key: "currentMonthEmi",
    label: "Current month EMI",
    type: "integer",
    keyboard: "number-pad",
  },
  {
    key: "totalPendingAmount",
    label: "Total pending amount",
    type: "integer",
    keyboard: "number-pad",
  },
  {
    key: "guarantorContactNumber",
    label: "Guarantor contact number",
    type: "number",
    keyboard: "phone-pad",
  },
];

const EMPTY = Object.fromEntries(FIELDS.map((field) => [field.key, ""]));

function validate(values) {
  const errors = {};

  FIELDS.forEach((field) => {
    const value = String(values[field.key] ?? "").trim();

    if (!value) {
      errors[field.key] = `${field.label} is required.`;
      return;
    }

    if (field.type === "integer" && !/^\d+$/.test(value)) {
      errors[field.key] = `${field.label} must be a whole number.`;
    } else if (field.type === "float" && !/^\d+(\.\d+)?$/.test(value)) {
      errors[field.key] = `${field.label} must be a valid decimal number.`;
    } else if (field.type === "number" && !/^\d+$/.test(value)) {
      errors[field.key] = `${field.label} must contain digits only.`;
    } else if (field.type === "date") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        errors[field.key] = `${field.label} must use YYYY-MM-DD format.`;
      } else {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month - 1 ||
          date.getDate() !== day
        ) {
          errors[field.key] = `${field.label} is not a valid calendar date.`;
        }
      }
    } else if (field.key === "vehicleNumber" && !/^[A-Z0-9]+$/.test(value)) {
      errors[field.key] =
        "Vehicle number must contain only letters and numbers.";
    }
  });

  ["contactNumber", "guarantorContactNumber"].forEach((key) => {
    const value = String(values[key] || "").trim();

    if (value && !/^\d{10}$/.test(value)) {
      errors[key] = "Please enter a 10-digit mobile number.";
    }
  });

  // DATE COMPARISON VALIDATION
  const agreementDate = values.agreementDate;
  const emiStartDate = values.emiStartDate;
  const dueDate = values.dueDate;

  if (agreementDate && emiStartDate && emiStartDate <= agreementDate) {
    errors.emiStartDate =
      "EMI Start Date cannot be earlier than Agreement Date.";
  }

  if (agreementDate && dueDate && dueDate <= agreementDate) {
    errors.dueDate = "Due Date cannot be earlier than Agreement Date.";
  }

  return errors;
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

function Field({ field, value, onChange, error }) {
  const [showPicker, setShowPicker] = useState(false);

  const displayDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);

    if (event.type === "set" && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      onChange(`${year}-${month}-${day}`);
    }
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{field.label}</Text>

      {field.type === "date" ? (
        <>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, error && styles.inputError]}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: value ? COLORS.text : "#9AA3B2", fontSize: 14 }}
            >
              {value ? displayDate(value) : `Select ${field.label}`}
            </Text>
            <Text style={{ fontSize: 19 }}>📅</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={
                value
                  ? new Date(
                      Number(value.split("-")[0]),
                      Number(value.split("-")[1]) - 1,
                      Number(value.split("-")[2])
                    )
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      ) : (
        <TextInput
          value={value}
          editable={field.key !== "totalPendingAmount"}
          onChangeText={(text) => {
            if (field.key === "vehicleNumber") {
              onChange(text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
            } else {
              onChange(text);
            }
          }}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          placeholderTextColor="#9AA3B2"
          keyboardType={field.keyboard || "default"}
          autoCapitalize={
            field.key === "vehicleNumber" ? "characters" : "words"
          }
          style={[styles.input, error && styles.inputError]}
        />
      )}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default function AddNewCustomerScreen({ onBack, onSaved }) {
  const [values, setValues] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log("PDF Picker Result:", result);

      if (result.canceled) {
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert("No Document", "No PDF was selected.");
        return;
      }

      const file = result.assets[0];

      if (
        file.mimeType !== "application/pdf" &&
        !file.name?.toLowerCase().endsWith(".pdf")
      ) {
        Alert.alert("Invalid File", "Please select a PDF file only.");
        return;
      }

      setSelectedDocument({
        uri: file.uri,
        name: file.name,
        mimeType: "application/pdf",
        size: file.size,
      });
    } catch (error) {
      console.log("PDF Selection Error:", error);

      Alert.alert(
        "Document Selection Error",
        error?.message || "Unable to select PDF."
      );
    }
  };

  const errorCount = useMemo(
    () => Object.keys(errors).filter((key) => errors[key]).length,
    [errors]
  );

  const update = (key, value) => {
    setValues((old) => {
      const next = { ...old, [key]: value };

      // Automatically calculate Total Pending Amount
      if (key === "openingOverdueAmount" || key === "currentMonthEmi") {
        const openingOverdue = Number(next.openingOverdueAmount || 0);

        const currentEmi = Number(next.currentMonthEmi || 0);

        const hasValue =
          next.openingOverdueAmount.trim() !== "" ||
          next.currentMonthEmi.trim() !== "";

        next.totalPendingAmount = hasValue
          ? String(openingOverdue + currentEmi)
          : "";
      }

      return next;
    });

    if (
      errors[key] ||
      key === "openingOverdueAmount" ||
      key === "currentMonthEmi"
    ) {
      setErrors((old) => ({
        ...old,
        [key]: undefined,
        totalPendingAmount: undefined,
      }));
    }
  };

  const submit = async () => {
    if (isSaving) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        "Please check the form",
        `Please correct ${
          Object.keys(nextErrors).length
        } field(s) highlighted in the form.`
      );
      return;
    }

    const payload = {
      ...values,
      documentNumber: Number(values.documentNumber),
      tenure: Number(values.tenure),
      emiAmount: Number(values.emiAmount),
      currentMonthInstallment: Number(values.currentMonthInstallment),
      overdueInstallment: Number(values.overdueInstallment),
      openingOverdueAmount: Number(values.openingOverdueAmount),
      currentMonthEmi: Number(values.currentMonthEmi),
      totalPendingAmount: Number(values.totalPendingAmount),
      contactNumber: String(values.contactNumber).trim(),
      guarantorContactNumber: String(values.guarantorContactNumber).trim(),
    };

    try {
      setIsSaving(true);

      const customer = await registerCustomer(payload, selectedDocument);

      onSaved(
        {
          ...values,
          documentNumber: customer?.documentNumber ?? values.documentNumber,
        },
        "Customer details have been saved successfully to MongoDB."
      );
    } catch (error) {
      console.log(
        "Customer registration failed:",
        error?.response?.data || error?.message || error
      );

      const response = error?.response?.data;

      // Duplicate document number
      if (
        error?.response?.status === 409 ||
        response?.message?.toLowerCase().includes("already exists")
      ) {
        setErrors((old) => ({
          ...old,
          documentNumber: "This document number already exists.",
        }));

        Alert.alert(
          "Duplicate Document Number",
          "This document number already exists. Please enter a different document number."
        );

        return;
      }

      // Other validation errors
      if (response?.message === "Validation failed") {
        Alert.alert(
          "Validation Failed",
          response.errors?.join("\n") || "Please check the entered details."
        );
        return;
      }

      const message =
        response?.message ||
        response?.error ||
        error?.message ||
        "Please check your internet connection and try again.";

      Alert.alert("Unable to Save Customer", message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <StatusBar backgroundColor={COLORS.navy} barStyle="light-content" />
      <BrandHeader />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBar}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Add New Customer</Text>
          </View>

          {/*<View style={styles.headingBlock}>
            <Text style={styles.screenSubtitle}>
              Enter the customer and finance agreement details
            </Text>
  </View>*/}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Customer information</Text>
              <Text style={styles.sectionCount}>18 FIELDS</Text>
            </View>

            {FIELDS.map((field) => (
              <Field
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={(value) => update(field.key, value)}
                error={errors[field.key]}
              />
            ))}
            {/* UPLOAD PDF DOCUMENT */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Upload Document (PDF)</Text>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickPDF}
                activeOpacity={0.7}
              >
                <Text style={styles.uploadButtonText}>
                  {selectedDocument ? "Change PDF" : "＋ Select PDF Document"}
                </Text>
              </TouchableOpacity>

              {selectedDocument && (
                <View style={styles.selectedFile}>
                  <Text style={styles.fileName}>
                    📄 {selectedDocument.name}
                  </Text>

                  <TouchableOpacity onPress={() => setSelectedDocument(null)}>
                    <Text style={styles.removeFile}>Remove ✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {errorCount > 0 && (
            <Text style={styles.formErrorSummary}>
              {errorCount} field(s) need attention.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, isSaving && { opacity: 0.65 }]}
            onPress={submit}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? "Saving customer..." : "Save customer"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>ARF • Anish Reddy Finance</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
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
    letterSpacing: -1,
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  brandSubtitle: {
    color: COLORS.goldLight,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 4,
    fontWeight: "700",
  },
  keyboardArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 150,
  },
  headingBlock: {
    marginBottom: 12,
    marginTop: 4,
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "800",
  },
  screenSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#E7ECF5",
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 13,
    marginBottom: 15,
  },
  backButtonText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "800",
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8ECF2",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "800",
  },
  sectionCount: {
    color: "#967018",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  fieldWrap: {
    marginBottom: 15,
  },
  label: {
    color: "#30394B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 13,
    color: COLORS.text,
    backgroundColor: "#FCFDFE",
    fontSize: 14,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  inputError: {
    borderColor: COLORS.red,
    backgroundColor: "#FFF9F9",
  },
  errorText: {
    color: COLORS.red,
    fontSize: 11,
    marginTop: 5,
  },
  formErrorSummary: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },
  footerNote: {
    textAlign: "center",
    color: "#9AA3B2",
    fontSize: 11,
    marginTop: 18,
  },
  titleBar: {
    backgroundColor: COLORS.navy2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 15,
  },

  backButton: {
    paddingRight: 15,
    paddingVertical: 3,
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
  uploadButton: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    borderStyle: "dashed",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
  },

  uploadButtonText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "800",
  },

  selectedFile: {
    backgroundColor: "#EAF4EC",
    borderRadius: 9,
    padding: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fileName: {
    color: COLORS.text,
    fontSize: 12,
    flex: 1,
  },

  removeFile: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 8,
  },
});
