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
    // validação simples
    if (!form.nome || !form.matricula || !form.email) {
      setError("Preencha os campos obrigatórios");
      return;
    }

    setError("");
    console.log("Aluno cadastrado:", form);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="Nome" onChangeText={(v) => handleChange("nome", v)} style={inputStyle} />
      <TextInput placeholder="Matrícula" onChangeText={(v) => handleChange("matricula", v)} style={inputStyle} />
      <TextInput placeholder="Curso" onChangeText={(v) => handleChange("curso", v)} style={inputStyle} />
      <TextInput placeholder="Email" onChangeText={(v) => handleChange("email", v)} style={inputStyle} />
      <TextInput placeholder="Telefone" onChangeText={(v) => handleChange("telefone", v)} style={inputStyle} />
      <TextInput placeholder="CEP" onChangeText={(v) => handleChange("cep", v)} style={inputStyle} />
      <TextInput placeholder="Endereço" onChangeText={(v) => handleChange("endereco", v)} style={inputStyle} />
      <TextInput placeholder="Cidade" onChangeText={(v) => handleChange("cidade", v)} style={inputStyle} />
      <TextInput placeholder="Estado" onChangeText={(v) => handleChange("estado", v)} style={inputStyle} />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Cadastrar" onPress={handleSubmit} />
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  marginBottom: 10,
  padding: 10,
  borderRadius: 5,
};