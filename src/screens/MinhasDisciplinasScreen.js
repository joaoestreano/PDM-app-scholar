import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function MinhasDisciplinasScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/boletim/professor/disciplinas');
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar as disciplinas');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LancarNotas', { disciplina: item })}
    >
      <Text style={styles.disciplina}>{item.nome}</Text>
      <Text style={styles.info}>Curso: {item.curso}</Text>
      <Text style={styles.info}>Semestre: {item.semestre}</Text>
      <Text style={styles.info}>Carga Horária: {item.carga_horaria}h</Text>
      <Text style={styles.tapHint}>Toque para lançar notas →</Text>
    </TouchableOpacity>
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
      <Text style={styles.title}>Minhas Disciplinas</Text>

      {disciplinas.length === 0 ? (
        <Text style={styles.semDados}>Nenhuma disciplina encontrada</Text>
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
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.lg },
  semDados: { textAlign: 'center', color: COLORS.textLight, padding: SPACING.md },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  disciplina: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.xs },
  info: { fontSize: 14, color: COLORS.textLight, marginBottom: 4 },
  tapHint: { fontSize: 12, color: COLORS.primary, marginTop: SPACING.sm, fontWeight: FONTS.medium },
});