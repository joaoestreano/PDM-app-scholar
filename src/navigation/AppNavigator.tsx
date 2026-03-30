import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}