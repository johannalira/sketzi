import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { router } from "expo-router"; // <-- importa o router do Expo Router

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (email === "teste@email.com" && senha === "1234") {
      router.push("/home"); // <-- navega pra tela home
    } else {
      Alert.alert("Erro", "Email ou senha incorretos!");
    }
  };

  const handleCreateAccount = () => {
    router.push("/createAccountScreen"); // <-- navega pra criar conta
  };

  const handleGuest = () => {
    router.push("/home"); // <-- navega pra home sem login
  };

  return (
    <View style={styles.container}>
      {/* LOGO no topo */}
      <Image
        source={require("../assets/scrib/logosemnada.png.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Campo de email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão principal de login */}
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Frase + botão "Criar conta" */}
      <Text style={styles.smallText}>
        Não tem conta?{" "}
       <Text style={styles.linkText} onPress={handleCreateAccount}>
        Crie aqui
       </Text>
      </Text>

      {/* Botão discreto “Entrar sem login” */}
      <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
        <Text style={styles.guestText}>Entrar sem login</Text>
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(233, 234, 219, 1)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(122, 111, 155, 0.53)",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dfd9e4ff",
    fontFamily: "Poppins_400Regular",
  },
  buttonLogin: {
    width: "100%",
    backgroundColor: "rgba(48, 48, 48, 1)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  buttonText: {
    color: "#fdfdfdff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
    linkText: {
    color: "rgba(122, 111, 155, 1)",
    fontFamily: "Poppins_400Regular",
    textDecorationLine: "underline",
  },
  smallText: {
    color: "rgba(48, 48, 48, 1)",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  guestButton: {
    position: "absolute",
    bottom: 40,
    left: 25,
  },
  guestText: {
    color: "#3b3232ff",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "Poppins_400Regular",
  },

  
});
