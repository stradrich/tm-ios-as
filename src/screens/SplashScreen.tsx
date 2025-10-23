import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, Easing, useColorScheme } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const bounceValue = useRef(new Animated.Value(0)).current;
  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    // Run bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -20,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Timeout before navigation
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, bounceValue]);

  return (
    <LinearGradient
      colors={isDarkMode ? ["#0f0f0f", "#1c1c1e"] : ["#22aeffff", "#ff04046e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* <Animated.View
        style={[styles.iconContainer, { transform: [{ translateY: bounceValue }] }]}
      >
        <Icon name="check-circle" size={96} color="#fff" />
      </Animated.View> */}

      <Text style={styles.title}>arbeit macht frei</Text>
      <Text style={styles.subtitle}>manage your tasks "efficiently" ... </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    color: "#dbeafe",
    marginTop: 6,
  },
});
