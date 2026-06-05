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
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: "#7C8797",
        tabBarBackground: () => <BlurView intensity={72} tint="light" style={StyleSheet.absoluteFill} />,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 16,
          height: 66,
          borderRadius: 8,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "rgba(54, 87, 255, 0.15)",
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          overflow: "hidden"
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
