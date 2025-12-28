import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "goodads_has_onboarded";
const USER_ID_KEY = "goodads_user_id";

// Funny prefixes for random IDs
const ADJECTIVES = [
  "Happy",
  "Swift",
  "Noble",
  "Brave",
  "Kind",
  "Witty",
  "Calm",
  "Eager",
];
const NOUNS = [
  "Panda",
  "Eagle",
  "Badger",
  "Helper",
  "Watcher",
  "Giver",
  "Knight",
  "Wizard",
];

export const UserStorage = {
  // Check if user has finished onboarding
  hasOnboarded: async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  },

  // Mark onboarding as complete
  setOnboardingComplete: async (userId: string) => {
    await AsyncStorage.multiSet([
      [ONBOARDING_KEY, "true"],
      [USER_ID_KEY, userId],
    ]);
  },

  // Get the stored User ID
  getUserId: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(USER_ID_KEY);
  },

  // Generate a random fun ID (e.g., "HappyBadger-92")
  generateRandomId: (): string => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj}${noun}-${num}`;
  },
};
