import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { View, Button } from "react-native";

export default function DashboardScreen({ navigation }: any) {
  return (
    <View>
      <Button title="Alunos" onPress={() => navigation.navigate("Students")} />
      <Button title="Professores" onPress={() => navigation.navigate("Teachers")} />
      <Button title="Disciplinas" onPress={() => navigation.navigate("Subjects")} />
      <Button title="Boletim" onPress={() => navigation.navigate("Report")} />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}