import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import StudentFormScreen from "../screens/StudentFormScreen";
import TeacherFormScreen from "../screens/TeacherFormScreen";
import SubjectFormScreen from "../screens/SubjectFormScreen";
import ReportScreen from "../screens/ReportScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Students" component={StudentFormScreen} />
          <Stack.Screen name="Teachers" component={TeacherFormScreen} />
          <Stack.Screen name="Subjects" component={SubjectFormScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}