import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: "check-circle",
    title: "Manage Your Tasks",
    description: "Create, organize, and complete your daily tasks with ease.",
    colors: ["#3b82f6", "#2563eb"], // blue gradient
  },
  {
    icon: "bell",
    title: "Stay Notified",
    description: "Get reminders for upcoming tasks and never miss a deadline.",
    colors: ["#8b5cf6", "#7c3aed"], // purple gradient
  },
  {
    icon: "cloud",
    title: "Works Offline",
    description: "Access your tasks anytime, anywhere, even without internet.",
    colors: ["#6366f1", "#4f46e5"], // indigo gradient
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Top Gradient Section */}
      <LinearGradient colors={slide.colors} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <Icon name={slide.icon} size={96} color="#fff" style={styles.icon} />
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </LinearGradient>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          {currentSlide < slides.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  bottomSection: {
    padding: 24,
    backgroundColor: "#fff",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#2563eb",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
