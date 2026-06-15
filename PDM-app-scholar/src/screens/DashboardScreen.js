import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../contexts/AuthContext";
import { COLORS, FONTS, SPACING } from "../styles/theme";

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  // Se não houver usuário, redireciona para login
  React.useEffect(() => {
    if (!user) {
      navigation.replace("Login");
    }
  }, [user]);

  const handleLogout = async () => {
    console.log("🚪 Iniciando logout...");
    try {
      await logout();
      console.log("✅ Logout concluído");

      // Usa reset para limpar toda a stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      // Mesmo com erro, força a navegação
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  const confirmarLogout = () => {
    setModalVisible(true);
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcome}>Olá, {user?.nome}! 👋</Text>
          <Text style={styles.greeting}>Bem-vindo ao App Scholar</Text>
          <View style={styles.perfilBadge}>
            <Text style={styles.perfilText}>{user?.perfil?.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Principal</Text>

          {/* MENU DO ALUNO */}
          {user?.perfil === "aluno" && (
            <>
              <Card
                icon="📊"
                title="Meu Boletim"
                subtitle="Veja suas notas e médias"
                onPress={() => navigation.navigate("MeuBoletim")}
              />
              <Card
                icon="🔐"
                title="Alterar Senha"
                subtitle="Altere sua senha de acesso"
                onPress={() => navigation.navigate("AlterarSenha")}
              />
            </>
          )}

          {/* MENU DO PROFESSOR */}
          {user?.perfil === "professor" && (
            <>
              <Card
                icon="📚"
                title="Minhas Disciplinas"
                subtitle="Gerencie notas das suas disciplinas"
                onPress={() => navigation.navigate("MinhasDisciplinas")}
              />
              <Card
                icon="🔍"
                title="Buscar Aluno"
                subtitle="Consultar boletim de qualquer aluno"
                onPress={() => navigation.navigate("Boletim")}
              />
              <Card
                icon="🔐"
                title="Alterar Senha"
                subtitle="Altere sua senha de acesso"
                onPress={() => navigation.navigate("AlterarSenha")}
              />
            </>
          )}

          {/* MENU DO COORDENADOR */}
          {user?.perfil === "coordenador" && (
            <>
              <Card
                icon="👨‍🎓"
                title="Cadastro de Alunos"
                subtitle="Matricule novos alunos"
                onPress={() => navigation.navigate("CadastroAluno")}
              />
              <Card
                icon="👨‍🏫"
                title="Cadastro de Professores"
                subtitle="Cadastre o corpo docente"
                onPress={() => navigation.navigate("CadastroProfessor")}
              />
              <Card
                icon="📊"
                title="Consultar Boletim"
                subtitle="Veja notas e médias dos alunos"
                onPress={() => navigation.navigate("Boletim")}
              />
              <Card
                icon="🔐"
                title="Alterar Senha"
                subtitle="Altere sua senha de acesso"
                onPress={() => navigation.navigate("AlterarSenha")}
              />
            </>
          )}

          {/* MENU DO ADMIN */}
          {user?.perfil === "admin" && (
            <>
              <Card
                icon="👨‍🎓"
                title="Cadastro de Alunos"
                subtitle="Matricule novos alunos"
                onPress={() => navigation.navigate("CadastroAluno")}
              />
              <Card
                icon="👨‍🏫"
                title="Cadastro de Professores"
                subtitle="Cadastre o corpo docente"
                onPress={() => navigation.navigate("CadastroProfessor")}
              />
              <Card
                icon="📚"
                title="Cadastro de Disciplinas"
                subtitle="Gerencie a grade curricular"
                onPress={() => navigation.navigate("CadastroDisciplina")}
              />
              <Card
                icon="📊"
                title="Consultar Boletim"
                subtitle="Veja notas e médias dos alunos"
                onPress={() => navigation.navigate("Boletim")}
              />
              <Card
                icon="👥"
                title="Gerenciar Usuários"
                subtitle="Listar, editar e excluir usuários"
                onPress={() => navigation.navigate("ListaUsuarios")}
              />
              <Card
                icon="🔍"
                title="Pesquisar Disciplinas"
                subtitle="Busque disciplinas por nome ou curso"
                onPress={() => navigation.navigate("PesquisaDisciplinas")}
              />
              <Card
                icon="🔐"
                title="Alterar Senha"
                subtitle="Altere sua senha de acesso"
                onPress={() => navigation.navigate("AlterarSenha")}
              />
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title="Sair do Sistema"
            onPress={confirmarLogout}
            variant="danger"
          />
        </View>
      </ScrollView>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🚪</Text>
            <Text style={styles.modalTitle}>Sair do Sistema</Text>
            <Text style={styles.modalMessage}>
              Deseja realmente sair do App Scholar?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnSair}
                onPress={() => {
                  setModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.modalBtnSairText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  welcome: {
    fontSize: 24,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  perfilBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: SPACING.sm,
  },
  perfilText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: 12,
  },
  menuSection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  footer: {
    padding: SPACING.lg,
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 5,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  modalButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
    width: "100%",
  },
  modalBtnCancelar: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalBtnCancelarText: {
    color: COLORS.text,
    fontWeight: FONTS.bold,
    fontSize: 14,
  },
  modalBtnSair: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.danger,
    alignItems: "center",
  },
  modalBtnSairText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: 14,
  },
});
