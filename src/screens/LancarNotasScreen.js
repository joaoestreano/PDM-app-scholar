import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function LancarNotasScreen({ route }) {
  const { disciplina } = route.params;
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(null);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/boletim/professor/disciplina/${disciplina.id}/alunos`);
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar os alunos');
    } finally {
      setLoading(false);
    }
  };

  const salvarNota = async (aluno) => {
    if (aluno.nota1 === '' || aluno.nota2 === '') {
      Alert.alert('Erro', 'Preencha as duas notas');
      return;
    }

    const nota1 = parseFloat(aluno.nota1);
    const nota2 = parseFloat(aluno.nota2);

    if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
      Alert.alert('Erro', 'As notas devem estar entre 0 e 10');
      return;
    }

    setSalvando(aluno.aluno_id);
    try {
      await api.post('/boletim/professor/lancar-nota', {
        aluno_id: aluno.aluno_id,
        disciplina_id: disciplina.id,
        nota1,
        nota2,
      });
      Alert.alert('Sucesso', `Nota de ${aluno.nome} salva!`);
      carregarAlunos();
    } catch (error) {
      console.error('Erro ao salvar nota:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível salvar a nota');
    } finally {
      setSalvando(null);
    }
  };

  const atualizarNota = (alunoId, campo, valor) => {
    setAlunos(alunos.map(a => 
      a.aluno_id === alunoId ? { ...a, [campo]: valor } : a
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.alunoNome}>{item.nome}</Text>
      <Text style={styles.alunoMatricula}>Matrícula: {item.matricula}</Text>

      <View style={styles.notasContainer}>
        <Input
          label="Nota 1"
          value={item.nota1?.toString() || ''}
          onChangeText={(text) => atualizarNota(item.aluno_id, 'nota1', text)}
          keyboardType="numeric"
          placeholder="0-10"
        />
        <Input
          label="Nota 2"
          value={item.nota2?.toString() || ''}
          onChangeText={(text) => atualizarNota(item.aluno_id, 'nota2', text)}
          keyboardType="numeric"
          placeholder="0-10"
        />
      </View>

      {item.media && (
        <View style={styles.mediaContainer}>
          <Text style={styles.mediaLabel}>Média: </Text>
          <Text style={styles.mediaValor}>{item.media}</Text>
          <Text style={[styles.situacao, 
            item.situacao === 'Aprovado' ? styles.aprovado : 
            item.situacao === 'Recuperação' ? styles.recuperacao : styles.reprovado
          ]}>
            {item.situacao}
          </Text>
        </View>
      )}

      <Button
        title={salvando === item.aluno_id ? 'Salvando...' : 'Salvar Nota'}
        onPress={() => salvarNota(item)}
        loading={salvando === item.aluno_id}
        variant="primary"
      />
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
      <Text style={styles.title}>{disciplina.nome}</Text>
      <Text style={styles.subtitle}>Lançamento de Notas</Text>

      {alunos.length === 0 ? (
        <Text style={styles.semDados}>Nenhum aluno encontrado</Text>
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item) => item.aluno_id.toString()}
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
  title: { fontSize: 24, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: SPACING.lg },
  semDados: { textAlign: 'center', color: COLORS.textLight, padding: SPACING.md },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    elevation: 2,
  },
  alunoNome: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.xs },
  alunoMatricula: { fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.md },
  notasContainer: { flexDirection: 'row', gap: SPACING.sm },
  mediaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  mediaLabel: { fontSize: 14, color: COLORS.textLight },
  mediaValor: { fontSize: 16, fontWeight: FONTS.bold, color: COLORS.text, marginRight: SPACING.md },
  situacao: { fontSize: 12, fontWeight: FONTS.bold, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12 },
  aprovado: { backgroundColor: COLORS.secondary, color: COLORS.white },
  recuperacao: { backgroundColor: COLORS.warning, color: COLORS.white },
  reprovado: { backgroundColor: COLORS.danger, color: COLORS.white },
});