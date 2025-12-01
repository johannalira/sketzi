import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert, // Importado para uso em Alertas
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Tipagem atualizada para incluir a cor
interface Reminder {
  id: string;
  message: string;
  date: string;
  color?: string; // <-- ADICIONADO: A cor salva
}

// Mapeamento de cores (usado apenas como fallback ou para cores padrão)
const COLORS = {
  CARD_COLOR_1: '#B15A6B', // Rosa/Vinho
  CARD_COLOR_2: '#5A755A', // Verde Musgo
  BACKGROUND: '#E9EADB',
};

// --- Componente Visual: DateCard ---
const DateCard: React.FC<{
  reminder: Reminder;
  backgroundColor: string;
  color?: string;
  onPress: () => void;
  onLongPress: () => void; // ADICIONADO: Propriedade para clique longo
}> = ({ reminder, backgroundColor, color = '#262626', onPress, onLongPress }) => {
  const date = new Date(reminder.date);
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .toUpperCase()
    .slice(0, 3);
  const day = date.getDate();
  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <TouchableOpacity
      style={[styles.dateCardContainer, { backgroundColor }]} // Usa a cor do lembrete (ou fallback)
      onPress={onPress}
      onLongPress={onLongPress} // ADICIONADO: Evento de clique longo
      activeOpacity={0.8}
    >
      <View style={styles.dateCardMonthSection}>
        <Text style={[styles.dateCardMonthText, { color }]}>{month}</Text>
      </View>

      <View style={styles.dateCardSeparator} />

      <View style={styles.dateCardTimeSection}>
        <Text style={[styles.dateCardDayText, { color }]}>{day}</Text>
        <Text style={[styles.dateCardTimeText, { color }]}>{time}</Text>
      </View>

      <View style={styles.dateCardSeparator} />

      <View style={styles.dateCardDescriptionSection}>
        <Text style={[styles.dateCardDescriptionText, { color }]} numberOfLines={2}>
          {reminder.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
// ----------------------------------------------------


export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRemenders = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('reminders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sorted = parsed
            .filter((r: Reminder) => r.date)
            .sort(
              (a: Reminder, b: Reminder) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

          setReminders(sorted as Reminder[]);
        }
      } else {
        setReminders([]);
      }
    } catch (e) {
      console.log('Erro ao carregar lembretes:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRemenders();
    }, [])
  );

  // --- FUNÇÃO PARA APAGAR O LEMBRETE (ADICIONADA) ---
  const handleDeleteReminder = async (reminderId: string) => {
    try {
      const stored = await AsyncStorage.getItem("reminders");
      let allReminders: any[] = stored ? JSON.parse(stored) : [];
      
      const updatedAllReminders = allReminders.filter((r) => r.id !== reminderId);
      const updatedReminders = reminders.filter((r) => r.id !== reminderId);
      setReminders(updatedReminders);
      
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedAllReminders));
      console.log(`Lembrete ${reminderId} excluído com sucesso.`);
    } catch (error) {
      console.error("Erro ao excluir lembrete:", error);
      Alert.alert("Erro", "Não foi possível excluir o lembrete.");
    }
  };
  // --------------------------------------------------

  // --- FUNÇÃO PARA DEFINIR COR DO CARD ---
  const getFallbackCardColor = (reminder: Reminder, index: number) => {
    if (reminder.color) return reminder.color;
    return index % 2 === 0 ? COLORS.CARD_COLOR_1 : COLORS.CARD_COLOR_2;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>DATAS</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#555" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {reminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum lembrete encontrado.</Text>
              <TouchableOpacity onPress={() => router.push('/notes/create')}>
                <Text style={styles.createLink}>Criar primeiro lembrete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {reminders.map((r, index) => (
                <DateCard
                  key={r.id}
                  reminder={r}
                  backgroundColor={getFallbackCardColor(r, index)}
                  color={
                    r.color && ['#B15A6B', '#5A755A'].includes(r.color)
                      ? '#FFF'
                      : '#262626'
                  }
                  onPress={() =>
                    router.push({
                      pathname: '/notes/view',
                      params: { id: r.id },
                    })
                  }
                  // ADICIONADO: Implementação da exclusão no clique longo
                  onLongPress={() => {
                    Alert.alert(
                      "Apagar Lembrete?",
                      "Deseja realmente apagar este lembrete?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Apagar", style: "destructive", onPress: () => handleDeleteReminder(r.id) },
                      ]
                    );
                  }}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2626267c',
    letterSpacing: 2,
  },
  scrollContent: { padding: 20, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888', marginBottom: 10 },
  createLink: {
    fontSize: 16,
    color: '#4E7494',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  grid: { flexDirection: 'column', gap: 15 },

  // DateCard
  dateCardContainer: {
    flexDirection: 'row',
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateCardSeparator: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
    backgroundColor: 'rgba(40, 38, 38, 0.3)',
  },
  dateCardMonthSection: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateCardMonthText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateCardTimeSection: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  dateCardDayText: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateCardTimeText: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateCardDescriptionSection: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateCardDescriptionText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
