import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { UserStorage } from "@/utils/userStorage";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

// Mock Data for now (will replace with real DB later)
const MOCK_LEADERBOARD = [
  { id: "HappyPanda-92", score: 1540 },
  { id: "SwiftEagle-04", score: 1200 },
  { id: "NobleBadger-33", score: 980 },
  { id: "BraveHelper-12", score: 850 },
  { id: "WittyWatcher-09", score: 720 },
  { id: "CalmGiver-55", score: 600 },
  { id: "EagerKnight-88", score: 450 },
  { id: "HappyWizard-21", score: 300 },
];

export default function LeaderboardScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    UserStorage.getUserId().then(setUserId);
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof MOCK_LEADERBOARD)[0];
    index: number;
  }) => {
    // Check if this row belongs to the current user
    const isCurrentUser = item.id === userId;
    const rank = index + 1;

    // Determine Rank Icon
    let rankIcon = null;
    let rankColor = "#888";

    if (rank === 1) {
      rankIcon = "trophy.fill";
      rankColor = "#FFD700";
    } // Gold
    else if (rank === 2) {
      rankIcon = "medal.fill";
      rankColor = "#C0C0C0";
    } // Silver
    else if (rank === 3) {
      rankIcon = "medal.fill";
      rankColor = "#CD7F32";
    } // Bronze

    return (
      <View
        style={[
          styles.itemContainer,
          isCurrentUser && { backgroundColor: tintColor + "15" }, // Light highlight for user
        ]}
      >
        <View style={styles.rankContainer}>
          {rankIcon ? (
            <IconSymbol name={rankIcon as any} size={24} color={rankColor} />
          ) : (
            <ThemedText style={styles.rankText}>#{rank}</ThemedText>
          )}
        </View>

        <View style={styles.userContainer}>
          <ThemedText type="defaultSemiBold" style={styles.userIdText}>
            {item.id} {isCurrentUser && "(You)"}
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.scoreText}>
          {item.score}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Global Rankings</ThemedText>
        <ThemedText style={styles.subtitle}>
          Top philanthropists this week
        </ThemedText>
      </View>

      <FlatList
        data={MOCK_LEADERBOARD}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#88888840",
  },
  rankContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: "bold",
  },
  userContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userIdText: {
    fontSize: 16,
  },
  scoreText: {
    fontSize: 18,
    fontVariant: ["tabular-nums"],
  },
});
