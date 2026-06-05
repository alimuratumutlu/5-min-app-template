import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { BrainCircuit, Home, PlayCircle, Trophy, UserCircle } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { colors, TabBarIcon } from "@/components/app-shell";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: "rgba(112,115,122,0.68)",
        tabBarBackground: () => <BlurView intensity={64} tint="light" style={StyleSheet.absoluteFill} />,
        tabBarStyle: {
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 16,
          height: 64,
          borderRadius: 34,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.92)",
          backgroundColor: "rgba(255,255,255,0.9)",
          overflow: "hidden",
          boxShadow: "0 18px 42px rgba(36, 123, 255, 0.14)"
        },
        tabBarItemStyle: {
          alignItems: "center",
          height: 64,
          justifyContent: "center",
          paddingBottom: 0,
          paddingTop: 0
        },
        tabBarIconStyle: {
          alignItems: "center",
          height: 50,
          justifyContent: "center",
          marginTop: 0,
          width: 58
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={Home} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          title: "Session",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={PlayCircle} color={color} focused={focused} size={27} />
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "AI Report",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={BrainCircuit} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={Trophy} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={UserCircle} color={color} focused={focused} />
        }}
      />
    </Tabs>
  );
}
