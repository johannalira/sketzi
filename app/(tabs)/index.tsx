import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  background: "#E9EADB",
  textPrimary: "#232622",
  textContrast: "#141414ff",
  cardReminder1: "#A87070",
  cardNote1: "#6B98B5",
  floatingButton: "rgba(38, 38, 38, 1)",
};

export default function Home() {
  const router = useRouter();
  const today = new Date();

  const dayMonth = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const year = today.getFullYear();

  const [notes, setNotes] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const loadData = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) setNotes(parsedNotes);
      }

      const storedReminders = await AsyncStorage.getItem("reminders");
      if (storedReminders) {
        const parsedReminders = JSON.parse(storedReminders);
        if (Array.isArray(parsedReminders)) {
          parsedReminders.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setReminders(parsedReminders);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddNote = () => {
    router.push("/notes/create");
    setIsSpeedDialOpen(false);
  };

  const handleAddFolder = () => {
    router.push("/notes/createpasta");
    setIsSpeedDialOpen(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      setNotes(updatedNotes);
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a nota.");
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      const updatedReminders = reminders.filter((r) => r.id !== reminderId);
      setReminders(updatedReminders);
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o lembrete.");
    }
  };

  const formatReminderTime = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${d.getDate()}\n${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const formatReminderMonth = (isoDate: string) => {
    const d = new Date(isoDate);
    const months = [
      "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
      "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
    ];
    return months[d.getMonth()];
  };

  const handleViewReminder = (reminderId: string) => {
    router.push({ pathname: "/notes/view", params: { id: reminderId } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateText, styles.dateDayMonth]}>{dayMonth}</Text>
            <Text style={[styles.dateText, styles.dateYear]}>{year}</Text>
          </View>

          <View style={styles.headerSeparator} />

          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/configura")}
            activeOpacity={0.7}
          >
            <Text style={styles.username}>Usernam</Text>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: "http://i.pravatar.cc/009" }}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.textPrimary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <View style={styles.remindersSection}>
              {reminders.slice(0, 2).map((reminder) => (
                <TouchableOpacity
                  key={reminder.id}
                  style={[
                    styles.reminderCard,
                    { backgroundColor: reminder.color || COLORS.cardReminder1 },
                  ]}
                  onPress={() => handleViewReminder(reminder.id)}
                  onLongPress={() => {
                    Alert.alert(
                      "Concluir Lembrete?",
                      "Deseja remover este lembrete?",
                      [
                        { text: "Não", style: "cancel" },
                        {
                          text: "Sim",
                          onPress: () => handleDeleteReminder(reminder.id),
                        },
                      ]
                    );
                  }}
                >
                  <View style={styles.reminderCardMonth}>
                    <Text style={styles.reminderCardMonthText}>
                      {formatReminderMonth(reminder.date)}
                    </Text>
                  </View>

                  <View style={styles.reminderCardTime}>
                    <Text style={styles.reminderCardTimeText}>
                      {formatReminderTime(reminder.date)}
                    </Text>
                  </View>

                  <Text style={styles.reminderCardMessage} numberOfLines={2}>
                    {reminder.message || "Lembrete sem descrição"}
                  </Text>
                </TouchableOpacity>
              ))}

              {reminders.length > 2 && (
                <Text style={styles.moreRemindersText}>
                  +{reminders.length - 2}{" "}
                  {reminders.length - 2 === 1 ? "lembrete" : "lembretes"} pendentes
                </Text>
              )}
            </View>

            <View style={styles.notesSection}>
              <View style={styles.notesContainer}>
                {notes.length === 0 ? (
                  <Text style={styles.noDataText}>
                    Nenhuma nota ou lista ainda.
                  </Text>
                ) : (
                  notes.map((note) => {
                    const isList = note.mode === "list";

                    return (
                      <TouchableOpacity
                        key={note.id}
                        onPress={() =>
                          router.push({
                            pathname: "/notes/view",
                            params: { id: note.id }, //  CORRIGIDO AQUI
                          })
                        }
                        onLongPress={() => {
                          Alert.alert(
                            "Apagar bloco?",
                            "Deseja realmente apagar este bloco?",
                            [
                              { text: "Cancelar", style: "cancel" },
                              {
                                text: "Apagar",
                                style: "destructive",
                                onPress: () => handleDeleteNote(note.id),
                              },
                            ]
                          );
                        }}
                        style={[
                          styles.noteCard,
                          isList ? styles.listNoteCard : styles.textNoteCard,
                          {
                            backgroundColor: note.color || COLORS.cardNote1,
                            width: isList ? "100%" : "48%",
                            minHeight: isList ? 70 : 150,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.noteTitle,
                            isList && styles.listNoteTitle,
                          ]}
                        >
                          {note.title ||
                            (isList ? "Lista de compras" : "Título da nota")}
                        </Text>

                        {!isList && (
                          <Text style={styles.noteContent} numberOfLines={5}>
                            {note.content || "Conteúdo da nota..."}
                          </Text>
                        )}

                        {isList &&
                          Array.isArray(note.list) &&
                          note.list.length > 0 && (
                            <Text
                              style={styles.listItemPreview}
                              numberOfLines={1}
                            >
                              {note.list
                                .filter(
                                  (item: { text: string; }) =>
                                    item.text && item.text.trim() !== ""
                                )
                                .map((item: any) => item.text)
                                .join(" • ")}
                            </Text>
                          )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.speedDialContainer}>
        {isSpeedDialOpen && (
          <TouchableOpacity
            style={[styles.speedDialAction, styles.folderButton]}
            onPress={handleAddFolder}
          >
            <Ionicons name="folder-open-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        {isSpeedDialOpen && (
          <TouchableOpacity
            style={[styles.speedDialAction, styles.noteButton]}
            onPress={handleAddNote}
          >
            <Ionicons name="create-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
        >
          <Ionicons
            name={isSpeedDialOpen ? "close" : "add"}
            size={32}
            color={COLORS.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 20,
    height: 80,
  },
  dateText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    lineHeight: 50,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateDayMonth: {
    fontSize: 32,
  },
  dateYear: {
    fontSize: 36,
    marginTop: -10,
  },
  headerSeparator: {
    backgroundColor: COLORS.textPrimary,
    width: 2,
    height: '80%',
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 22,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif", 
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 0,
    backgroundColor: "#ccc",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  
  // --- Lembretes (Blocos grandes e Coloridos) ---
  remindersSection: {
    marginTop: 15,
    marginBottom: 10,
    gap: 12,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
    height: 120,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  reminderCardMonth: {
    width: 60,
  },
  reminderCardMonthText: {
    letterSpacing: 4,
    color: COLORS.textContrast,
    fontSize: 26,
    fontWeight: "800",
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reminderCardTime: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    height: '80%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.5)',
  },
  reminderCardTimeText: {
    color: COLORS.textContrast,
    fontSize: 18,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reminderCardMessage: {
    flex: 1,
    color: COLORS.textContrast,
    fontWeight: "600",
    fontSize: 16,
    paddingLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  moreRemindersText: {
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontSize: 14,
    marginTop: 10,
    fontWeight: '500',
  },
  
  // --- Notas (Blocos menores) ---
  notesSection: {
    marginTop: 10,
  },
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: 'stretch',
  },
  noDataText: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.textPrimary,
    width: "100%",
    fontSize: 16,
  },
  noteCard: {
    borderRadius: 15,
    marginBottom: 13,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'flex-start',
  },
  textNoteCard: {
    width: "48%",
    minHeight: 300,
  },
  listNoteCard: {
    width: "100%",
    minHeight: 70,
  },
  noteTitle: {
    color: COLORS.textContrast,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  listNoteTitle: {
    fontSize: 14,
  },
  noteContent: {
    color: COLORS.textContrast,
    fontSize: 14,
    lineHeight: 20,
  },
  listItemPreview: {
    color: COLORS.textContrast,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  
  // --- Speed Dial / Floating Button ---
  speedDialContainer: {
    position: "absolute",
    bottom: 30,
    right: 25,
    alignItems: "center",
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: COLORS.floatingButton,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 10,
  },
  speedDialAction: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: COLORS.floatingButton,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  noteButton: {
    backgroundColor: COLORS.floatingButton,
  },
  folderButton: {
    backgroundColor: COLORS.floatingButton,
  },
});

