import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "../styles/theme";

// Importação das telas
import AlterarSenhaScreen from "../screens/AlterarSenhaScreen";
import BoletimScreen from "../screens/BoletimScreen";
import CadastroAlunoScreen from "../screens/CadastroAlunoScreen";
import CadastroDisciplinaScreen from "../screens/CadastroDisciplinaScreen";
import CadastroProfessorScreen from "../screens/CadastroProfessorScreen";
import CadastroUsuarioScreen from "../screens/CadastroUsuarioScreen";
import DashboardScreen from "../screens/DashboardScreen";
import EditarUsuarioScreen from "../screens/EditarUsuarioScreen";
import LancarNotasScreen from "../screens/LancarNotasScreen";
import ListaUsuariosScreen from "../screens/ListaUsuariosScreen";
import LoginScreen from "../screens/LoginScreen";
import MeuBoletimScreen from "../screens/MeuBoletimScreen";
import MinhasDisciplinasScreen from "../screens/MinhasDisciplinasScreen";
import PesquisaDisciplinasScreen from "../screens/PesquisaDisciplinasScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "Início" }}
        />
        <Stack.Screen
          name="CadastroAluno"
          component={CadastroAlunoScreen}
          options={{ title: "Novo Aluno" }}
        />
        <Stack.Screen
          name="CadastroProfessor"
          component={CadastroProfessorScreen}
          options={{ title: "Novo Professor" }}
        />
        <Stack.Screen
          name="CadastroDisciplina"
          component={CadastroDisciplinaScreen}
          options={{ title: "Nova Disciplina" }}
        />
        <Stack.Screen
          name="Boletim"
          component={BoletimScreen}
          options={{ title: "Boletim" }}
        />
        <Stack.Screen
          name="CadastroUsuario"
          component={CadastroUsuarioScreen}
          options={{ title: "Novo Usuário" }}
        />
        <Stack.Screen
          name="AlterarSenha"
          component={AlterarSenhaScreen}
          options={{ title: "Alterar Senha" }}
        />
        <Stack.Screen
          name="MeuBoletim"
          component={MeuBoletimScreen}
          options={{ title: "Meu Boletim" }}
        />
        <Stack.Screen
          name="MinhasDisciplinas"
          component={MinhasDisciplinasScreen}
          options={{ title: "Minhas Disciplinas" }}
        />
        <Stack.Screen
          name="LancarNotas"
          component={LancarNotasScreen}
          options={{ title: "Lançar Notas" }}
        />
        <Stack.Screen
          name="ListaUsuarios"
          component={ListaUsuariosScreen}
          options={{ title: "Gerenciar Usuários" }}
        />
        <Stack.Screen
          name="EditarUsuario"
          component={EditarUsuarioScreen}
          options={{ title: "Editar Usuário" }}
        />
        <Stack.Screen
          name="PesquisaDisciplinas"
          component={PesquisaDisciplinasScreen}
          options={{ title: "Pesquisar Disciplinas" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
