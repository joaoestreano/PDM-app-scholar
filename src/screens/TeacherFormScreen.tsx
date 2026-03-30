import { useState } from "react";
import { View, TextInput, Button } from "react-native";

export default function TeacherFormScreen() {
  const [form, setForm] = useState({
    nome: "",
    titulacao: "",
    area: "",
    tempo: "",
    email: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <View style={{ padding: 20 }}>
      {Object.keys(form).map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          onChangeText={(v) => handleChange(field, v)}
          style={input}
        />
      ))}
      <Button title="Cadastrar" onPress={() => console.log(form)} />
    </View>
  );
}

const input = { borderWidth: 1, marginBottom: 10, padding: 10 };