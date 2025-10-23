import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
interface SettingsScreenProps {
  onReset?: () => void;
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SettingsScreen({ onReset, isOffline, setIsOffline, isDarkMode, setIsDarkMode }: SettingsScreenProps) {
  // const [isDarkMode, setIsDarkMode] = useState(false);
  // const [isOffline, setIsOffline] = useState(false);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" },
      ]}
    >
      {/* 🔻 Offline warning banner */}
      {/* {isOffline && (
        <View style={styles.offlineBanner}>
          <Icon name="alert-circle-outline" size={20} color="#fff" />
          <Text style={styles.offlineText}>You are currently offline</Text>
        </View>
      )} */}

      <Text style={[styles.header, { color: isDarkMode ? "#fff" : "#000" }]}>
        Settings
      </Text>

      {/* 🌙 Dark Mode */}
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={styles.content}>
          <View style={styles.row}>
            <Icon
              name={isDarkMode ? "moon-waxing-crescent" : "white-balance-sunny"}
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Dark Mode
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: isDarkMode ? "#bbb" : "#555" },
                ]}
              >
                {isDarkMode ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            thumbColor="#fff"
            trackColor={{ false: "#ccc", true: "#007bff" }}
          />
        </View>
      </View>

      {/* 📶 Offline Mode */}
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={styles.content}>
          <View style={styles.row}>
            <Icon
              name="wifi-off"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Simulate Offline
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: isDarkMode ? "#bbb" : "#555" },
                ]}
              >
                For demo purposes
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsOffline(!isOffline)}
            style={[
              styles.button,
              { backgroundColor: isOffline ? "#007bff" : "#f8a50cff" },
            ]}
          >
            <Text style={styles.buttonText}>
              {isOffline ? "Go Online" : "Go Offline"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ℹ️ App Version */}
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={styles.row}>
          <Icon
            name="information-outline"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              App Version
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: isDarkMode ? "#bbb" : "#555" },
              ]}
            >
              1.0.0 (Build 1)
            </Text>
          </View>
        </View>
      </View>

      {/* 🔄 Reset */}
      <TouchableOpacity
        onPress={() => {
          onReset?.();           // reset app
          setIsOffline(false);   // go back online
          setIsDarkMode(false);
        }}
        style={[styles.card, isDarkMode && styles.cardDark]}
      >
        <View style={styles.row}>
          <Icon
            name="rotate-3d-variant"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Reset Demo
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: isDarkMode ? "#bbb" : "#555" },
              ]}
            >
              Go back to splash screen
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 🧠 Platform Info */}
      <View style={{ marginTop: 30, marginBottom: 40 }}>
        <Text
          style={[
            styles.platformText,
            { color: isDarkMode ? "#bbb" : "#555" },
          ]}
        >
          Platform: {Platform.OS === "ios" ? "iOS" : "Android"}
        </Text>
        <Text
          style={[
            styles.platformSub,
            { color: isDarkMode ? "#777" : "#888" },
          ]}
        >
          This is a visual preview of the React Native app
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 28, fontWeight: "700", top: 20, marginBottom: 35 },
  // 🔻 Offline Banner
  // offlineBanner: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#f8a50cff",
  //   paddingVertical: 20,
  //   paddingHorizontal: 16,
  //   borderRadius: 8,
  //   marginTop: 0,
  //   marginBottom: 0,
  // },
  // offlineText: {
  //   color: "#fff",
  //   marginLeft: 8,
  //   fontWeight: "600",
  //   fontSize: 14,
  // },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: { backgroundColor: "#1e1e1e" },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { fontSize: 13, marginTop: 3 },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  platformText: { textAlign: "center", fontSize: 13 },
  platformSub: { textAlign: "center", fontSize: 11, marginTop: 3 },
});
