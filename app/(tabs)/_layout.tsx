// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

function SimpleIcon({ name }: { name: string }) {
  // Se você não quer usar lucide-react-native agora
  return <Text style={{ fontSize: 24 }}>{name}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e90ff",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => <SimpleIcon name="🏠" />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: () => <SimpleIcon name="👤" />,
        }}
      />
    </Tabs>
  );
}
