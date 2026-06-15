import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function EditarUsuarioScreen({ route, navigation }) {
  const { usuario } = route.params;
  
  const { values, errors, handleChange, validate } = useForm({
    login: usuario.login,
    nome: usuario.nome,
    perfil: usuario.perfil,
    senha: '', // opcional
  });

  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    const ok = validate({
      login: { required: true, message: 'Login é obrigatório' },
      nome: { required: true, message: 'Nome é obrigatório' },
      perfil: { required: true, message: 'Perfil é obrigatório' },
    });

    if (!ok) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (values.senha && values.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const dados = { ...values };
      if (!dados.senha) delete dados.senha;
      
      await api.put(`/usuarios/${usuario.id}`, dados);
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível atualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <Input
        label="Nome Completo *"
        value={values.nome}
        onChangeText={(text) => handleChange('nome', text)}
        error={errors.nome}
      />

      <Input
        label="Login *"
        value={values.login}
        onChangeText={(text) => handleChange('login', text)}
        error={errors.login}
        autoCapitalize="none"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Perfil *</Text>
        <Picker
          selectedValue={values.perfil}
          onValueChange={(itemValue) => handleChange('perfil', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Aluno" value="aluno" />
          <Picker.Item label="Professor" value="professor" />
          <Picker.Item label="Coordenador" value="coordenador" />
          <Picker.Item label="Administrador" value="admin" />
        </Picker>
      </View>

      <Input
        label="Nova Senha (deixe em branco para manter)"
        value={values.senha}
        onChangeText={(text) => handleChange('senha', text)}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
      />

      <Button
        title={loading ? 'Salvando...' : 'Salvar Alterações'}
        onPress={handleSalvar}
        loading={loading}
        variant="primary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.lg },
  pickerContainer: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  label: {
    color: COLORS.text,
    fontWeight: FONTS.medium,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  picker: { height: 50, width: '100%' },
});