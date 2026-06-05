import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { BarChart3, Bookmark, Home, PlayCircle, UserCircle } from "lucide-react-native";
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
          height: 72,
          borderRadius: 40,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.92)",
          backgroundColor: "rgba(255,255,255,0.9)",
          overflow: "hidden",
          boxShadow: "0 18px 42px rgba(36, 123, 255, 0.14)"
        },
        tabBarItemStyle: {
          height: 64,
          paddingTop: 10
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
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={BarChart3} color={color} focused={focused} />
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
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon={Bookmark} color={color} focused={focused} />
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
