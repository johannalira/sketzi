import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsFigmaClone() {
  const router = useRouter();

  const Item = ({ label, danger, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Text style={[styles.rowText, danger && styles.dangerText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back('../(tabs)/index')}>
          <Ionicons name="chevron-back" size={28} color="#0000009d" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Username</Text>

        <Image
          source={{ uri: "https://i.pravatar.cc/009" }}
          style={styles.avatar}
        />
      </View>

      <Item label="Editar Perfil" />
      <Item label="Lixeira" />
      <Item label="Backup" />


      <Item label="Sobre"
      onPress={() => router.push('/configura/sobre')} />

      <Item label="Sair" danger 
      onPress={() => router.push('/login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8d8", // bege claro igual ao Figma
    paddingTop: 60,
    paddingHorizontal: 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 40,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  row: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#d1d1c2", // cinza suave igual ao Figma
  },

  rowText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "400",
  },

  dangerText: {
    color: "#8b0000",
    fontWeight: "600",
  },
});
