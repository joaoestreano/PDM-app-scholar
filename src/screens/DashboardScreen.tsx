import { View, Button } from "react-native";

export default function DashboardScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Button title="Alunos" onPress={() => navigation.navigate("Students")} />
      <Button title="Professores" onPress={() => navigation.navigate("Teachers")} />
      <Button title="Disciplinas" onPress={() => navigation.navigate("Subjects")} />
      <Button title="Boletim" onPress={() => navigation.navigate("Report")} />
    </View>
  );
}