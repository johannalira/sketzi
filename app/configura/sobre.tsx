// Tela "Sobre" idêntica ao layout do Figma enviado
// Minimalista, fundo bege, texto alinhado à esquerda, título centralizado

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SobreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SOBRE</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* TÍTULO + ÍCONE */}
      <View style={styles.topRow}>
        <Text style={styles.appName}>Sketzi</Text>
        <Image
          source={require("../../assets/scrib/icondoapp.png")} // ícone placeholder
          style={styles.icon}
        />
      </View>

      <View style={styles.separator} />

      {/* DESCRIÇÃO */}
      <Text style={styles.description}>
        O Sketzi é uma agenda digital inteligente feita para deixar sua rotina mais simples e organizada. Ele não serve apenas para anotar compromissos, mas para ajudar você a planejar seu tempo, definir prioridades e receber lembretes no momento certo.
      </Text>

      {/* INTEGRANTES */}
      <Text style={styles.sectionTitle}>INTEGRANTES:</Text>

      <Text style={styles.name}>Johanna Lira Azevedo</Text>
      <Text style={styles.role}>Desenvolvedora & UI/UX Design</Text>

      <Text style={styles.name}>Rayra Mello de Castro</Text>
      <Text style={styles.role}>Desenvolvedora & Testes</Text>

      <Text style={styles.name}>Fernanda da Silva Viana</Text>
      <Text style={styles.role}>Documentação</Text>

      <Text style={styles.name}>Kaylan Maciel da Silva</Text>
      <Text style={styles.role}>Documentação</Text>

      <Text style={styles.version}>Versão 0.1</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8d8",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  appName: {
    fontSize: 32,
    fontWeight: "600",
    color: "#000",
  },

  icon: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#bfbfb3",
    marginBottom: 20,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },

  role: {
    fontSize: 14,
    marginBottom: 10,
  },

  version: {
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
    fontSize: 12,
    opacity: 0.7,
  },
});
