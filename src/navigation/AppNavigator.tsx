import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      )}
    </Stack.Navigator>
  );
}