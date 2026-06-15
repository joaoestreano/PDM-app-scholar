import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../services/api";
import { COLORS, FONTS, SPACING } from "../styles/theme";

export default function GerenciarDisciplinasScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDisciplinas();

    const unsubscribe = navigation.addListener("focus", () => {
      carregarDisciplinas();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/disciplinas");
      setDisciplinas(response.data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      Alert.alert("Erro", "Não foi possível carregar as disciplinas");
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (id, nome) => {
    Alert.alert("Confirmar Exclusão", `Deseja realmente excluir "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => excluirDisciplina(id),
      },
    ]);
  };

  const excluirDisciplina = async (id) => {
    try {
      await api.delete(`/disciplinas/${id}`);
      Alert.alert("Sucesso", "Disciplina excluída!");
      carregarDisciplinas();
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Não foi possível excluir";
      Alert.alert("Erro", errorMsg);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.disciplinaNome}>{item.nome}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() =>
              navigation.navigate("EditarDisciplina", { disciplina: item })
            }
          >
            <Text style={styles.btnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => confirmarExclusao(item.id, item.nome)}
          >
            <Text style={styles.btnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.info}>Carga: {item.carga_horaria}h</Text>
      <Text style={styles.info}>Professor: {item.professor_nome || "N/A"}</Text>
      <Text style={styles.info}>Curso: {item.curso}</Text>
      <Text style={styles.info}>Semestre: {item.semestre}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciar Disciplinas</Text>

      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate("CadastroDisciplina")}
      >
        <Text style={styles.btnNovoText}>+ Nova Disciplina</Text>
      </TouchableOpacity>

      {disciplinas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma disciplina cadastrada</Text>
        </View>
      ) : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  btnNovo: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  btnNovoText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: SPACING.xl * 2,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  disciplinaNome: {
    flex: 1,
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  btnEdit: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    borderRadius: 6,
  },
  btnDelete: {
    backgroundColor: COLORS.danger,
    padding: SPACING.sm,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 14,
  },
  info: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
});
