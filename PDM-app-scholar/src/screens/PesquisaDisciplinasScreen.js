import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../services/api";
import { COLORS, FONTS, SPACING } from "../styles/theme";

export default function PesquisaDisciplinasScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const pesquisarDisciplinas = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Atenção", "Digite pelo menos um termo para pesquisar");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/disciplinas/search", {
        params: { query: searchQuery },
      });
      setDisciplinas(response.data);
      setSearched(true);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      Alert.alert("Erro", "Erro ao pesquisar disciplinas");
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (id, nome) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir a disciplina "${nome}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirDisciplina(id),
        },
      ],
    );
  };

  const excluirDisciplina = async (id) => {
    try {
      await api.delete(`/disciplinas/${id}`);
      Alert.alert("Sucesso", "Disciplina excluída com sucesso!");

      // Remove da lista local
      setDisciplinas(disciplinas.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      const errorMsg =
        error.response?.data?.error || "Não foi possível excluir a disciplina";
      Alert.alert("Erro ao excluir", errorMsg);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.disciplinaNome}>{item.nome}</Text>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => confirmarExclusao(item.id, item.nome)}
        >
          <Text style={styles.btnDeleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}> Carga Horária: {item.carga_horaria}h</Text>
      <Text style={styles.info}>
        👨‍🏫 Professor: {item.professor_nome || "Não atribuído"}
      </Text>
      <Text style={styles.info}>📚 Curso: {item.curso}</Text>
      <Text style={styles.info}>📅 Semestre: {item.semestre}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pesquisa de Disciplinas</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome da disciplina ou curso..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={pesquisarDisciplinas}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={pesquisarDisciplinas}
        >
          <Text style={styles.searchButtonText}>🔍 Pesquisar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Pesquisando...</Text>
        </View>
      )}

      {!loading && searched && disciplinas.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}></Text>
          <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
          <Text style={styles.emptySubtext}>
            Tente buscar com outros termos
          </Text>
        </View>
      )}

      {!loading && searched && disciplinas.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            {disciplinas.length} disciplina(s) encontrada(s)
          </Text>

          <FlatList
            data={disciplinas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
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
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: 14,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
  emptyContainer: {
    padding: SPACING.xl * 2,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
  },
  resultContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  btnDelete: {
    backgroundColor: COLORS.danger,
    padding: SPACING.sm,
    borderRadius: 6,
    marginLeft: SPACING.sm,
  },
  btnDeleteText: {
    fontSize: 16,
  },
  info: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
});
