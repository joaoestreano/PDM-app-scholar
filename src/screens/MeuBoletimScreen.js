import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function MeuBoletimScreen() {
  const { user } = useAuth();
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarBoletim();
  }, []);

  const carregarBoletim = async () => {
    setLoading(true);
    try {
      const response = await api.get('/boletim/meu-boletim');
      setBoletim(response.data);
    } catch (error) {
      console.error('Erro ao buscar boletim:', error.response?.data || error.message);
      Alert.alert(
        'Erro ao carregar boletim', 
        error.response?.data?.error || 'Não foi possível buscar o boletim. Verifique se você está vinculado a um cadastro de aluno.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarBoletim();
  };

  const renderItem = ({ item }) => {
    const temNotas = item.nota1 !== null && item.nota2 !== null;
    
    return (
      <View style={styles.card}>
        <Text style={styles.disciplina}>{item.disciplina}</Text>
        {item.semestre && (
          <Text style={styles.semestre}>Semestre: {item.semestre}</Text>
        )}
        
        <View style={styles.notasRow}>
          <View style={styles.notaBox}>
            <Text style={styles.notaLabel}>N1</Text>
            <Text style={[styles.notaValor, !temNotas && styles.notaVazia]}>
              {temNotas ? item.nota1 : '-'}
            </Text>
          </View>
          <View style={styles.notaBox}>
            <Text style={styles.notaLabel}>N2</Text>
            <Text style={[styles.notaValor, !temNotas && styles.notaVazia]}>
              {temNotas ? item.nota2 : '-'}
            </Text>
          </View>
          <View style={styles.notaBox}>
            <Text style={styles.notaLabel}>Média</Text>
            <Text style={[styles.notaValor, !temNotas && styles.notaVazia]}>
              {temNotas ? item.media : '-'}
            </Text>
          </View>
        </View>
        
        {temNotas && item.situacao && (
          <View style={[
            styles.situacaoBadge, 
            item.situacao === 'Aprovado' ? styles.aprovado : 
            item.situacao === 'Recuperação' ? styles.recuperacao : styles.reprovado
          ]}>
            <Text style={styles.situacaoText}>{item.situacao}</Text>
          </View>
        )}
        
        {!temNotas && (
          <View style={styles.semNotasContainer}>
            <Text style={styles.semNotas}>⏳ Aguardando lançamento de notas</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
      <Text style={styles.emptySubtext}>
        Entre em contato com a coordenação do seu curso.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando boletim...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <Text style={styles.title}>Meu Boletim</Text>

      {boletim && (
        <View style={styles.resultContainer}>
          <View style={styles.headerAluno}>
            <Text style={styles.alunoNome}>{boletim.aluno}</Text>
            <Text style={styles.alunoInfo}>Matrícula: {boletim.matricula}</Text>
            <Text style={styles.alunoInfo}>Curso: {boletim.curso}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Disciplinas</Text>

          {boletim.disciplinas.length === 0 ? (
            renderEmpty()
          ) : (
            <FlatList
              data={boletim.disciplinas}
              keyExtractor={(item, index) => `${item.disciplina_id || index}`}
              renderItem={renderItem}
              scrollEnabled={false}
              ListEmptyComponent={renderEmpty}
            />
          )}
        </View>
      )}

      {!boletim && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyText}>Boletim não disponível</Text>
          <Text style={styles.emptySubtext}>
            Não foi possível carregar seu boletim. Verifique se você está cadastrado como aluno.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    padding: SPACING.md 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.background 
  },
  loadingText: { 
    marginTop: SPACING.md, 
    color: COLORS.textLight,
    fontSize: 14
  },
  title: { 
    fontSize: 24, 
    fontWeight: FONTS.bold, 
    color: COLORS.text, 
    marginBottom: SPACING.lg 
  },
  resultContainer: { 
    backgroundColor: COLORS.white, 
    padding: SPACING.md, 
    borderRadius: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerAluno: {
    marginBottom: SPACING.sm,
  },
  alunoNome: { 
    fontSize: 20, 
    fontWeight: FONTS.bold, 
    color: COLORS.text, 
    marginBottom: SPACING.xs 
  },
  alunoInfo: { 
    fontSize: 14, 
    color: COLORS.textLight, 
    marginBottom: SPACING.xs 
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: { 
    backgroundColor: COLORS.background, 
    padding: SPACING.md, 
    borderRadius: 8, 
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disciplina: { 
    fontSize: 16, 
    fontWeight: FONTS.bold, 
    color: COLORS.text, 
    marginBottom: SPACING.xs 
  },
  semestre: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  notasRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: SPACING.sm 
  },
  notaBox: { 
    flex: 1, 
    alignItems: 'center' 
  },
  notaLabel: { 
    fontSize: 12, 
    color: COLORS.textLight, 
    marginBottom: 4 
  },
  notaValor: { 
    fontSize: 18, 
    fontWeight: FONTS.bold, 
    color: COLORS.text 
  },
  notaVazia: {
    color: COLORS.textLight,
  },
  situacaoBadge: { 
    paddingVertical: SPACING.xs, 
    paddingHorizontal: SPACING.md, 
    borderRadius: 16, 
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  aprovado: { 
    backgroundColor: COLORS.secondary 
  },
  recuperacao: { 
    backgroundColor: COLORS.warning 
  },
  reprovado: { 
    backgroundColor: COLORS.danger 
  },
  situacaoText: { 
    color: COLORS.white, 
    fontWeight: FONTS.bold, 
    fontSize: 12 
  },
  semNotasContainer: {
    marginTop: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  semNotas: { 
    fontSize: 12, 
    color: '#856404',
    fontStyle: 'italic',
  },
});