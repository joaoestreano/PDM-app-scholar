import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function BoletimScreen() {
  const [matricula, setMatricula] = useState('');
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarBoletim = async () => {
    if (!matricula.trim()) {
      Alert.alert('Erro', 'Digite uma matrícula para consultar');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/boletim/${matricula}`);
      setBoletim(response.data);
    } catch (error) {
      console.error('Erro ao buscar boletim:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível buscar o boletim');
      setBoletim(null);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.disciplina}>{item.disciplina}</Text>
      <View style={styles.notasRow}>
        <View style={styles.notaBox}>
          <Text style={styles.notaLabel}>N1</Text>
          <Text style={styles.notaValor}>{item.nota1}</Text>
        </View>
        <View style={styles.notaBox}>
          <Text style={styles.notaLabel}>N2</Text>
          <Text style={styles.notaValor}>{item.nota2}</Text>
        </View>
        <View style={styles.notaBox}>
          <Text style={styles.notaLabel}>Média</Text>
          <Text style={styles.notaValor}>{item.media}</Text>
        </View>
      </View>
      <View style={[styles.situacaoBadge, item.situacao === 'Aprovado' ? styles.aprovado : styles.reprovado]}>
        <Text style={styles.situacaoText}>{item.situacao}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Consulta de Boletim</Text>
      <Input label="Matrícula do Aluno" value={matricula} onChangeText={setMatricula} placeholder="Digite a matrícula" keyboardType="numeric" />
      <Button title={loading ? 'Buscando...' : 'Buscar Boletim'} onPress={buscarBoletim} loading={loading} variant="primary" />

      {boletim && (
        <View style={styles.resultContainer}>
          <Text style={styles.alunoNome}>{boletim.aluno}</Text>
          <Text style={styles.alunoMatricula}>Matrícula: {boletim.matricula}</Text>
          <Text style={styles.alunoCurso}>Curso: {boletim.curso}</Text>

          {boletim.disciplinas.length === 0 ? (
            <Text style={styles.semNotas}>Nenhuma disciplina encontrada</Text>
          ) : (
            <FlatList
              data={boletim.disciplinas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.lg },
  resultContainer: { marginTop: SPACING.lg, backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: 12, elevation: 2 },
  alunoNome: { fontSize: 20, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.xs },
  alunoMatricula: { fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.xs },
  alunoCurso: { fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.md },
  semNotas: { textAlign: 'center', color: COLORS.textLight, padding: SPACING.md },
  card: { backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.sm },
  disciplina: { fontSize: 16, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.sm },
  notasRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  notaBox: { flex: 1, alignItems: 'center' },
  notaLabel: { fontSize: 12, color: COLORS.textLight, marginBottom: 4 },
  notaValor: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text },
  situacaoBadge: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, borderRadius: 16, alignSelf: 'flex-start' },
  aprovado: { backgroundColor: COLORS.secondary },
  reprovado: { backgroundColor: COLORS.danger },
  situacaoText: { color: COLORS.white, fontWeight: FONTS.bold, fontSize: 12 },
});