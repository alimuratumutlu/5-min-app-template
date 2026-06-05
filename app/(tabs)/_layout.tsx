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
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: "rgba(255,255,255,0.62)",
        tabBarBackground: () => <BlurView intensity={58} tint="dark" style={StyleSheet.absoluteFill} />,
        tabBarStyle: {
          position: "absolute",
          left: 34,
          right: 34,
          bottom: 16,
          height: 66,
          borderRadius: 34,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          backgroundColor: "rgba(28, 29, 31, 0.92)",
          overflow: "hidden",
          boxShadow: "0 18px 42px rgba(0, 0, 0, 0.22)"
        },
        tabBarItemStyle: {
          height: 58,
          paddingTop: 9
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
