import { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setError("");
    login(email, password);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}