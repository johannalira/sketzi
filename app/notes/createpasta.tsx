import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface para definir a estrutura de uma Pasta
interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

// Função utilitária para gerar um ID único (usaremos a data/hora para simplicidade)
const generateUniqueId = () => {
  return Date.now().toString();
};

export default function CreateFolderScreen() {
  const [folderName, setFolderName] = useState("");
  const router = useRouter();

  const handleSaveFolder = async () => {
    if (!folderName.trim()) {
      Alert.alert("Erro", "O nome da pasta não pode estar vazio.");
      return;
    }

    try {
      // 1. Carregar as pastas existentes
      const storedFolders = await AsyncStorage.getItem("folders");
      let currentFolders: Folder[] = storedFolders ? JSON.parse(storedFolders) : [];

      // Verificar se a pasta já existe (opcional, mas bom para UX)
      if (currentFolders.some(folder => folder.name.toLowerCase() === folderName.trim().toLowerCase())) {
        Alert.alert("Erro", "Já existe uma pasta com este nome.");
        return;
      }

      // 2. Criar o novo objeto Pasta
      const newFolder: Folder = {
        id: generateUniqueId(),
        name: folderName.trim(),
        createdAt: new Date().toISOString(),
      };

      // 3. Adicionar a nova pasta à lista
      currentFolders.push(newFolder);

      // 4. Salvar a lista atualizada no AsyncStorage
      await AsyncStorage.setItem("folders", JSON.stringify(currentFolders));

      Alert.alert("Sucesso", `Pasta "${folderName}" criada!`);

      // 5. Voltar para a tela inicial (index)
      router.back();
    } catch (error) {
      console.error("Erro ao salvar a pasta:", error);
      Alert.alert("Erro", "Não foi possível salvar a nova pasta.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Pasta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome da Pasta (ex: Trabalho, Pessoal)"
        placeholderTextColor="#666"
        value={folderName}
        onChangeText={setFolderName}
        maxLength={50} // Limite de caracteres
        returnKeyType="done"
      />
      
      <Button 
        title="Salvar Pasta" 
        onPress={handleSaveFolder} 
        color="#2E3A2E" // Cor que combina com seu tema
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E9EADB",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232622",
    marginBottom: 30,
    marginTop: 50,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#232622",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#CCC",
  },
});