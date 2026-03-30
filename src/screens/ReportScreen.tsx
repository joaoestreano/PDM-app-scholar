import { View, Text } from "react-native";

export default function ReportScreen() {
  const data = [
    { disciplina: "Math", n1: 8, n2: 7 },
    { disciplina: "Physics", n1: 5, n2: 6 },
  ];

  return (
    <View style={{ padding: 20 }}>
      {data.map((item, i) => {
        const media = (item.n1 + item.n2) / 2;
        const status = media >= 6 ? "Aprovado" : "Reprovado";

        return (
          <Text key={i}>
            {item.disciplina} - Média: {media} ({status})
          </Text>
        );
      })}
    </View>
  );
}