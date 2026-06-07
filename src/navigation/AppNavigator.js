import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../styles/theme';

// Importação das telas
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import CadastroProfessorScreen from '../screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';
import BoletimScreen from '../screens/BoletimScreen';
import CadastroUsuarioScreen from '../screens/CadastroUsuarioScreen';
import AlterarSenhaScreen from '../screens/AlterarSenhaScreen';
import MeuBoletimScreen from '../screens/MeuBoletimScreen';
import MinhasDisciplinasScreen from '../screens/MinhasDisciplinasScreen';
import LancarNotasScreen from '../screens/LancarNotasScreen';
import ListaUsuariosScreen from '../screens/ListaUsuariosScreen';
import EditarUsuarioScreen from '../screens/EditarUsuarioScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
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
          options={{ title: 'Início' }} 
        />
        <Stack.Screen 
          name="CadastroAluno" 
          component={CadastroAlunoScreen} 
          options={{ title: 'Novo Aluno' }} 
        />
        <Stack.Screen 
          name="CadastroProfessor" 
          component={CadastroProfessorScreen} 
          options={{ title: 'Novo Professor' }} 
        />
        <Stack.Screen 
          name="CadastroDisciplina" 
          component={CadastroDisciplinaScreen} 
          options={{ title: 'Nova Disciplina' }} 
        />
        <Stack.Screen 
          name="Boletim" 
          component={BoletimScreen} 
          options={{ title: 'Boletim' }} 
        />
        <Stack.Screen 
          name="CadastroUsuario" 
          component={CadastroUsuarioScreen} 
          options={{ title: 'Novo Usuário' }} 
        />
        <Stack.Screen 
          name="AlterarSenha" 
          component={AlterarSenhaScreen} 
          options={{ title: 'Alterar Senha' }} 
        />
        <Stack.Screen 
          name="MeuBoletim" 
          component={MeuBoletimScreen} 
          options={{ title: 'Meu Boletim' }} 
        />
        <Stack.Screen 
          name="MinhasDisciplinas" 
          component={MinhasDisciplinasScreen} 
          options={{ title: 'Minhas Disciplinas' }} 
        />
        <Stack.Screen 
          name="LancarNotas" 
          component={LancarNotasScreen} 
          options={{ title: 'Lançar Notas' }} 
        />
        <Stack.Screen 
          name="ListaUsuarios" 
          component={ListaUsuariosScreen} 
          options={{ title: 'Gerenciar Usuários' }} 
        />
        <Stack.Screen 
          name="EditarUsuario" 
          component={EditarUsuarioScreen} 
          options={{ title: 'Editar Usuário' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}