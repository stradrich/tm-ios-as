import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding Screen</Text>
      <Button title="Finish Onboarding" onPress={onComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
