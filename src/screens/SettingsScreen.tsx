import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

interface SettingsScreenProps {
  onReset?: () => void;
}

export default function SettingsScreen({ onReset }: SettingsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      <Button title="Reset App" onPress={onReset!}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
