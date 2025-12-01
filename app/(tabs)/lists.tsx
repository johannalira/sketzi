import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// --- Constantes ---
const FALLBACK_CARD_COLOR = "#a8a8a399";

// --- Componente Principal ---
export default function Lists() {
  const router = useRouter();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega todas as notas do AsyncStorage e filtra apenas as que são listas
  async function loadLists() {
    try {
      const stored = await AsyncStorage.getItem("notes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const onlyLists = parsed.filter((item) => item.mode === "list");
          setLists(onlyLists.reverse()); // Mais recentes primeiro
        }
      }
    } catch (e) {
      console.error("Erro ao carregar listas:", e);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => { loadLists(); }, []));

  // Remove uma lista específica do estado e do AsyncStorage
  const handleDeleteList = async (listId: string) => {
    try {
      const stored = await AsyncStorage.getItem("notes");
      let allNotes: any[] = stored ? JSON.parse(stored) : [];

      const updatedAllNotes = allNotes.filter((n) => n.id !== listId);
      const updatedLists = lists.filter((l) => l.id !== listId);
      setLists(updatedLists);

      await AsyncStorage.setItem("notes", JSON.stringify(updatedAllNotes));
      console.log(`Lista ${listId} excluída com sucesso.`);
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
      Alert.alert("Erro", "Não foi possível excluir a lista.");
    }
  };

  // --- Renderização ---
  return (
    <View style={styles.container}>
      <Text style={styles.header}>LISTAS</Text>

      <View style={{ flex: 1 }}>
        {loading && <ActivityIndicator size="large" color="#000" />}

        <ScrollView contentContainerStyle={styles.scroll}>
          {lists.length === 0 && !loading && (
            <Text style={styles.emptyText}>Nenhuma lista ainda.</Text>
          )}

          {lists.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              style={[
                styles.cardBase,
                { backgroundColor: item.color || FALLBACK_CARD_COLOR },
              ]}
              onPress={() => router.push(`/notes/view?id=${item.id}`)}
              onLongPress={() => {
                Alert.alert(
                  "Apagar Lista?",
                  "Deseja realmente apagar esta lista?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Apagar",
                      style: "destructive",
                      onPress: () => handleDeleteList(item.id),
                    },
                  ]
                );
              }}
            >
              <Text style={styles.title}>
                {item.title || "Sem título"}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#252323ff" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EADB",
    paddingHorizontal: 23,
    paddingTop: 50,
  },

  header: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2626267c",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 25,
  },

  scroll: {
    paddingBottom: 80,
  },

  cardBase: {
    flexDirection: "row",
    padding: 25,
    marginBottom: 15,
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },

  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1A1A1A",
    lineHeight: 28,
    marginTop: 5,
    opacity: 0.85,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});
