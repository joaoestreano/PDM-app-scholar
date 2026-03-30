import { useState } from "react";
import { View, TextInput, Button, Text, ScrollView } from "react-native";

export default function StudentFormScreen() {
  const [form, setForm] = useState({
    nome: "",
    matricula: "",
    curso: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    cidade: "",
    estado: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.nome || !form.matricula || !form.email) {
      setError("Preencha os campos obrigatórios");
      return;
    }
    setError("");
    console.log(form);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {Object.keys(form).map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          onChangeText={(v) => handleChange(field, v)}
          style={input}
        />
      ))}
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Cadastrar" onPress={handleSubmit} />
    </ScrollView>
  );
}

const input = { borderWidth: 1, marginBottom: 10, padding: 10 };