import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { UserStorage } from "@/utils/userStorage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const SLIDES = [
  {
    id: "1",
    icon: "heart.fill",
    title: "Ads for Good?",
    description:
      "Yes, it’s weird. You watch ads, and 100% of the revenue goes to charity.\n\nTurn your procrastination into donation.",
  },
  {
    id: "2",
    icon: "chart.bar.fill",
    title: "Climb the Ranks",
    description:
      "Compete on the global leaderboard. Become the ultimate philanthropist without spending a dime.\n\nWarning: Can cause feelings of extreme smugness.",
  },
  {
    id: "3",
    icon: "person.fill",
    title: "Who are you?",
    description:
      "This is your unique Philanthropist ID. You can change it now, or keep it mysterious.",
    isInput: true,
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User ID State
  const [userId, setUserId] = useState("");

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "tint");

  useEffect(() => {
    // Generate a fresh ID when component mounts
    setUserId(UserStorage.generateRandomId());
  }, []);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    if (userId.trim().length < 3) {
      Alert.alert(
        "Too short!",
        "Your ID needs to be at least 3 characters long."
      );
      return;
    }
    await UserStorage.setOnboardingComplete(userId.trim());
    router.replace("/(tabs)");
  };

  const renderItem = ({ item }: { item: (typeof SLIDES)[0] }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <IconSymbol
          name={item.icon as any}
          size={80}
          color={iconColor}
          style={styles.icon}
        />
        <ThemedText type="title" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.description}>{item.description}</ThemedText>

        {item.isInput && (
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>YOUR ID:</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: iconColor },
              ]}
              value={userId}
              onChangeText={setUserId}
              placeholder="Enter your ID"
              placeholderTextColor="#888"
              autoCorrect={false}
              maxLength={15}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={(item) => item.id}
          scrollEnabled={currentIndex !== SLIDES.length - 1} // Disable scroll on last slide to focus on input
        />

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex ? iconColor : "#ccc",
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: iconColor }]}
            onPress={handleNext}
          >
            <ThemedText style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? "Let's Go!" : "Next"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  icon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 28,
  },
  inputContainer: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 10,
    opacity: 0.6,
  },
  input: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 2,
    width: "80%",
    textAlign: "center",
    paddingBottom: 8,
  },
  footer: {
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
