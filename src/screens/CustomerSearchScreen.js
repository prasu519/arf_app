import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchCustomers } from "../services/api";

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

function CustomerCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.customerCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.vehicleIcon}>
        <Text style={styles.vehicleIconText}>🚘</Text>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.customerInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Document No.</Text>
          <Text style={styles.documentNumber}>{item.documentNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Customer Name</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vehicle Number</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {item.vehicleNumber}
          </Text>
        </View>

        {!!item.area && (
          <Text style={styles.areaText} numberOfLines={1}>
            {item.area}
          </Text>
        )}
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function CustomerSearchScreen({ onBack, onSelectCustomer }) {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const searchValue = query.trim();

    if (!searchValue) {
      setError(
        "Please enter document number, customer name or vehicle number."
      );
      setCustomers([]);
      setSearched(false);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await searchCustomers(searchValue, 1, 50);

      setCustomers(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setCustomers([]);
      setError(
        err.response?.data?.message ||
          "Unable to search customers. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setCustomers([]);
    setError("");
    setSearched(false);
  };

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
        <Text style={styles.title}>Customer Search</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setError("");
            }}
            placeholder="Search by document number, customer name or vehicle number"
            placeholderTextColor="#929AAA"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCapitalize="characters"
          />

          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>⌕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.searchHint}>
          Search using document number, customer name or vehicle number
        </Text>

        {loading && (
          <View style={styles.centerMessage}>
            <ActivityIndicator size="large" color={COLORS.blue} />
            <Text style={styles.messageText}>Searching customers...</Text>
          </View>
        )}

        {!loading && !!error && (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && searched && !error && (
          <>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {customers.length} Customers Found
              </Text>

              <View style={styles.totalBadge}>
                <Text style={styles.totalText}>Total: {customers.length}</Text>
              </View>
            </View>

            {customers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>⌕</Text>
                <Text style={styles.emptyTitle}>No customers found</Text>
                <Text style={styles.messageText}>
                  Please check the search value and try again.
                </Text>
              </View>
            ) : (
              <FlatList
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <CustomerCard
                    item={item}
                    onPress={() => onSelectCustomer(item)}
                  />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </>
        )}

        {!loading && !searched && !error && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>⌕</Text>
            <Text style={styles.emptyTitle}>Find a customer</Text>
            <Text style={styles.messageText}>
              Enter a document number, customer name or vehicle number to
              search.
            </Text>
          </View>
        )}
      </View>
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
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  searchBox: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 5,
  },
  searchIcon: {
    fontSize: 30,
    color: COLORS.navy,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  clearText: {
    color: COLORS.muted,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  searchButton: {
    width: 53,
    height: 53,
    borderRadius: 12,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 34,
    lineHeight: 38,
  },
  searchHint: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 8,
    marginBottom: 18,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  resultTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "800",
  },
  totalBadge: {
    backgroundColor: "#E1ECFA",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  totalText: {
    color: COLORS.blue,
    fontWeight: "800",
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 25,
  },
  customerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E1E5ED",
    borderLeftWidth: 5,
    borderLeftColor: "#1683E8",
    padding: 12,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  vehicleIcon: {
    width: 58,
    height: 58,
    borderRadius: 13,
    backgroundColor: "#E6F1FC",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleIconText: {
    fontSize: 27,
  },
  cardDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: COLORS.border,
    marginHorizontal: 11,
  },
  customerInfo: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 5,
  },
  infoLabel: {
    color: COLORS.muted,
    fontSize: 10,
  },
  documentNumber: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: "900",
  },
  infoValue: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "800",
  },
  areaText: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 1,
  },
  chevron: {
    color: COLORS.navy,
    fontSize: 29,
    fontWeight: "700",
    marginLeft: 5,
  },
  centerMessage: {
    alignItems: "center",
    marginTop: 50,
  },
  messageCard: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  errorText: {
    color: COLORS.red,
    textAlign: "center",
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    marginTop: 25,
  },
  emptyIcon: {
    color: COLORS.blue,
    fontSize: 55,
    marginBottom: 8,
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 7,
  },
  messageText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
  },
});
