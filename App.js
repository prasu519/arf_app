import React, { useEffect, useState } from "react";

import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import AddNewCustomerScreen from "./src/screens/AddNewCustomerScreen";
import CustomerSearchScreen from "./src/screens/CustomerSearchScreen";
import CustomerDetailsScreen from "./src/screens/CustomerDetailsScreen";

const COLORS = {
  navy: "#07143D",
  gold: "#D9A928",
  goldLight: "#F4D77C",
  background: "#F4F6FA",
  text: "#172033",
  muted: "#6B7280",
  white: "#FFFFFF",
  green: "#16834A",
  red: "#C62828",
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

function ResultScreen({ values, message, onAgain }) {
  return (
    <View style={styles.resultPage}>
      <View style={styles.resultIcon}>
        <Text style={styles.successIcon}>✓</Text>
      </View>

      <Text style={styles.resultTitle}>Customer saved successfully!</Text>

      <Text style={styles.resultMessage}>{message}</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>CUSTOMER</Text>

        <Text style={styles.summaryValue}>{values?.name}</Text>

        <Text style={styles.summaryMeta}>
          Document No: {values?.documentNumber}
        </Text>

        <Text style={styles.summaryMeta}>Vehicle: {values?.vehicleNumber}</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onAgain}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [mainScreen, setMainScreen] = useState("home");

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [savedValues, setSavedValues] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  // Handle Android hardware Back button and edge-swipe Back gesture
  useEffect(() => {
    const backAction = () => {
      switch (mainScreen) {
        case "add":
          setMainScreen("home");
          return true;

        case "search":
          setMainScreen("home");
          return true;

        case "details":
          setMainScreen("search");
          return true;

        case "success":
          setSavedValues(null);
          setResultMessage("");
          setMainScreen("home");
          return true;

        case "home":
        default:
          // Allow Android to perform its default Back action on Home
          return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [mainScreen]);

  // Return to home after successful registration
  const resetToHome = () => {
    setSavedValues(null);
    setResultMessage("");
    setMainScreen("home");
  };
  const renderScreen = (screenComponent) => (
    <>
      <ExpoStatusBar
        style="light"
        backgroundColor={COLORS.navy}
        translucent={false}
      />
      {screenComponent}
    </>
  );
  // HOME SCREEN
  if (mainScreen === "home") {
    return renderScreen(
      <HomeScreen
        onAddCustomer={() => setMainScreen("add")}
        onSearchCustomer={() => setMainScreen("search")}
      />
    );
  }

  // ADD NEW CUSTOMER SCREEN
  if (mainScreen === "add") {
    return renderScreen(
      <AddNewCustomerScreen
        onBack={() => setMainScreen("home")}
        onSaved={(values, message) => {
          setSavedValues(values);
          setResultMessage(message);
          setMainScreen("success");
        }}
      />
    );
  }

  // CUSTOMER SEARCH SCREEN
  if (mainScreen === "search") {
    return renderScreen(
      <CustomerSearchScreen
        onBack={() => setMainScreen("home")}
        onSelectCustomer={(customer) => {
          setSelectedCustomerId(customer._id);
          setMainScreen("details");
        }}
      />
    );
  }

  // CUSTOMER DETAILS SCREEN
  if (mainScreen === "details") {
    return renderScreen(
      <CustomerDetailsScreen
        customerId={selectedCustomerId}
        onBack={() => setMainScreen("search")}
      />
    );
  }

  // REGISTRATION SUCCESS SCREEN
  if (mainScreen === "success") {
    return renderScreen(
      <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
        <BrandHeader />

        <ResultScreen
          values={savedValues}
          message={resultMessage}
          onAgain={resetToHome}
        />
      </SafeAreaView>
    );
  }

  return null;
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

  resultPage: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
  },

  resultIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#E6F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  successIcon: {
    fontSize: 42,
    color: COLORS.green,
  },

  resultTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
  },

  resultMessage: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },

  summaryCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E8ECF2",
  },

  summaryLabel: {
    color: "#9A7A2A",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "900",
  },

  summaryValue: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 6,
  },

  summaryMeta: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },

  primaryButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 30,
    width: "100%",
  },

  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },
});
