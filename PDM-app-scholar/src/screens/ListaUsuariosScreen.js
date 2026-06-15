import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function ListaUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [excluindoId, setExcluindoId] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarUsuarios();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO SIMPLIFICADA - Exclui direto sem confirmar
  const excluirUsuarioDireto = async (id, nome) => {
    console.log('🗑️ Excluindo usuário:', id, nome);
    
    setExcluindoId(id);
    
    try {
      const response = await api.delete(`/usuarios/${id}`);
      console.log('✅ Sucesso:', response.data);
      
      Alert.alert('Sucesso', `Usuário "${nome}" excluído!`);
      
      // Remove da lista
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível excluir');
    } finally {
      setExcluindoId(null);
    }
  };

  const renderItem = ({ item }) => {
    const isExcluindo = excluindoId === item.id;
    
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.login}>Login: {item.login}</Text>
          <View style={styles.perfilBadge}>
            <Text style={styles.perfilText}>{item.perfil.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() => {
              console.log('✏️ Editar clicado:', item);
              navigation.navigate('EditarUsuario', { usuario: item });
            }}
            disabled={isExcluindo}
          >
            <Text style={styles.btnText}>✏️ Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.btnDelete, isExcluindo && styles.btnDisabled]}
            onPress={() => excluirUsuarioDireto(item.id, item.nome)}
            disabled={isExcluindo}
          >
            <Text style={styles.btnText}>
              {isExcluindo ? '⏳ Excluindo...' : '🗑️ Excluir'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciar Usuários</Text>
      
      <TouchableOpacity
        style={styles.btnNovo}
        onPress={() => navigation.navigate('CadastroUsuario')}
      >
        <Text style={styles.btnNovoText}>+ Novo Usuário</Text>
      </TouchableOpacity>

      {usuarios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
        </View>
      ) : (
        <FlatList
          data={usuarios}
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
  },
  title: { 
    fontSize: 24, 
    fontWeight: FONTS.bold, 
    color: COLORS.text, 
    marginBottom: SPACING.md 
  },
  btnNovo: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  btnNovoText: { 
    color: COLORS.white, 
    fontWeight: FONTS.bold, 
    fontSize: 16 
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
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
  info: { 
    marginBottom: SPACING.sm 
  },
  nome: { 
    fontSize: 16, 
    fontWeight: FONTS.bold, 
    color: COLORS.text 
  },
  login: { 
    fontSize: 14, 
    color: COLORS.textLight, 
    marginVertical: 4 
  },
  perfilBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  perfilText: { 
    color: COLORS.white, 
    fontSize: 10, 
    fontWeight: FONTS.bold 
  },
  actions: { 
    flexDirection: 'row', 
    gap: SPACING.sm 
  },
  btnEdit: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnDelete: {
    flex: 1,
    backgroundColor: COLORS.danger,
    padding: SPACING.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: { 
    color: COLORS.white, 
    fontWeight: FONTS.bold, 
    fontSize: 12 
  },
});