import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Animated } from "react-native";
import { Plus } from "lucide-react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback } from "react";


export default function Home() {
  const router = useRouter();
  const today = new Date();
  const dayMonth = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}`;
  const year = today.getFullYear();

  // Estado das notas
  const [notes, setNotes] = useState([]);

  // Estado do menu flutuante
  const [menuVisible, setMenuVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Função para adicionar nova nota
  const params = useLocalSearchParams();

// Quando voltar da tela de criação com uma nova nota
useFocusEffect(
  useCallback(() => {
    if (params.title && params.color) {
      const newNote = {
        id: Date.now(),
        title: params.title,
        color: params.color,
      };
      setNotes((prev) => [...prev, newNote]);
    }
  }, [params])
);


  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: `Nova nota ${notes.length + 1}`,
      color: getRandomColor(),
    };
    setNotes([...notes, newNote]);
    toggleMenu(); // fecha o menu depois de criar
  };

  // Cores aleatórias pras notas novas
  const getRandomColor = () => {
    const colors = ["#4A6FA5", "#8C6BB1", "#4B8252", "#5BAF9F", "#3F3F3F", "#C9A84F"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{dayMonth}</Text>
            <Text style={styles.dateText}>{year}</Text>
          </View>

          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.username}>Username</Text>
            <Image
              source={{ uri: "http://i.pravatar.cc/100" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Eventos */}
        <View style={styles.eventsContainer}>
          <View style={[styles.eventCard, { backgroundColor: "#C07A84" }]}>
            <Text style={styles.eventMonth}>DEZ</Text>
            <Text style={styles.eventTime}>15 • 12:40</Text>
            <Text style={styles.eventText}>Aniversário da best</Text>
          </View>

          <View style={[styles.eventCard, { backgroundColor: "#A0A48B" }]}>
            <Text style={styles.eventMonth}>JAN</Text>
            <Text style={styles.eventTime}>16 • 18:40</Text>
            <Text style={styles.eventText}>Aniversário da Ruby</Text>
          </View>
        </View>

        {/* Notas */}
        <View style={styles.notesContainer}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              onPress={() => router.push(`/note/${note.id}`)}
              style={[styles.noteCard, { backgroundColor: note.color }]}
            >
              <Text style={styles.noteTitle}>{note.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fundo escuro quando o menu estiver ativo */}
      {menuVisible && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.overlayTouchable} onPress={toggleMenu} />
        </Animated.View>
      )}

      {/* Botões flutuantes (menu) */}
      {menuVisible && (
        <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              alert("Criar Pasta");
              toggleMenu();
            }}
          >
            <Text style={styles.menuText}>Pasta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/notes/create")}>
            <Text style={styles.menuText}>Notas</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Botão principal */}
      <TouchableOpacity style={styles.floatingButton} onPress={toggleMenu}>
        <Plus color="rgba(206, 208, 181, 1)" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EADB",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateText: {
    color: "#232622",
    fontSize: 14,
    fontWeight: "600",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    color: "#232622",
    fontWeight: "600",
    fontSize: 14,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#888",
  },
  eventsContainer: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  eventCard: {
    borderRadius: 16,
    padding: 12,
  },
  eventMonth: {
    color: "#232622",
    fontWeight: "700",
    fontSize: 14,
  },
  eventTime: {
    color: "#232622",
    fontSize: 12,
  },
  eventText: {
    color: "#232622",
    fontSize: 12,
    marginTop: 4,
  },
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noteCard: {
    width: "48%",
    height: 110,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: {
    color: "#E9EADB",
    fontWeight: "600",
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "rgba(38, 38, 38, 1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  // novos estilos
  overlay: {
    ...StyleSheet.absoluteFillObject,  //essa é a cor de fundo quando aperta o botão de
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    bottom: 100,
    right: 25,
    alignItems: "flex-end",
    gap: 10,
  },
  menuItem: {
    backgroundColor: "rgba(38, 38, 38, 0.9)",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    color: "#E9EADB",
    fontWeight: "500",
    fontSize: 14,
  },
});
