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
  Alert 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

export default function FoldersScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar as notas do banco
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) {
          // Filtra apenas notas do tipo "note"
          const onlyNotes = parsedNotes.filter(n => n.mode === "note");
          setNotes(onlyNotes.reverse());
        }
      }
    } catch (error) {
      console.log("Erro ao carregar notas na grade:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que você entra nesta aba
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  // --- FUNÇÃO PARA APAGAR A NOTA (ADICIONADA) ---
  const handleDeleteNote = async (noteId: string) => {
    try {
      // 1. Carregar TODAS as notas/listas do AsyncStorage
      const stored = await AsyncStorage.getItem("notes");
      let allNotes: any[] = stored ? JSON.parse(stored) : [];
      
      // 2. Filtrar para remover o item com o noteId do array completo
      const updatedAllNotes = allNotes.filter((n) => n.id !== noteId);
      
      // 3. Atualizar o estado local de `notes` (apenas os itens de nota na tela)
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      setNotes(updatedNotes);
      
      // 4. Salvar o array completo e atualizado de volta no AsyncStorage
      await AsyncStorage.setItem("notes", JSON.stringify(updatedAllNotes));
      
      console.log(`Nota ${noteId} excluída com sucesso.`);

    } catch (error) {
      console.error("Erro ao excluir nota:", error);
      Alert.alert("Erro", "Não foi possível excluir a nota.");
    }
  };
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NOTAS</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#555" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {notes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma nota encontrada.</Text>
                <TouchableOpacity onPress={() => router.push('/notes/create')}>
                  <Text style={styles.createLink}>Criar primeira nota</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.grid}>
                {notes.map((note) => (
                  <TouchableOpacity 
                    key={note.id} 
                    style={[
                      styles.card, 
                      { backgroundColor: note.color || '#82789E' } // Usa a cor da nota ou Roxo padrão
                    ]}
                    activeOpacity={0.8}
                    onPress={() => router.push({ pathname: "/notes/view", params: note })}
                    // Ação de clique longo para APAGAR a nota
                    onLongPress={() => {
                      Alert.alert(
                        "Apagar Nota?",
                        "Deseja realmente apagar esta nota?",
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Apagar",
                            style: "destructive",
                            onPress: () => handleDeleteNote(note.id), // Chama a nova função
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.cardText} numberOfLines={4}>
                      {note.title || "Sem título"}
                    </Text>
                    
                    {/* Ícone discreto indicando se é lista ou texto (Embora só mostre notas, foi mantido por segurança) */}
                    {note.mode === 'list' && (
                      <Ionicons name="checkbox-outline" size={20} color="rgba(0,0,0,0.4)" style={styles.typeIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBECE2', 
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#EBECE2',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2626267c',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    width: '47%', 
    height: 207,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between', // Espalha o conteúdo (texto em cima, ícone embaixo)
    shadowColor: "#262626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 24, // Letra grande igual ao design
    color: '#1A1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    lineHeight: 28,
    marginTop: 5,
    opacity: 0.85,
  },
  typeIcon: {
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  createLink: {
    fontSize: 16,
    color: '#4E7494',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});
