import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function CadastroProfessorScreen() {
  const { values, errors, handleChange, validate, reset } = useForm({
    nome: '',
    titulacao: '',
    area: '',
    tempo_docencia: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    const ok = validate({
      nome: { required: true, message: 'Nome é obrigatório' },
      titulacao: { required: true, message: 'Titulação é obrigatória' },
      area: { required: true, message: 'Área de atuação é obrigatória' },
      email: { required: true, message: 'E-mail é obrigatório' },
    });

    if (!ok) {
      Alert.alert('Erro de Validação', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await api.post('/professores', values);
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
      reset();
    } catch (error) {
      console.error('Erro ao cadastrar professor:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível cadastrar o professor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Professor</Text>
      <Input label="Nome Completo *" value={values.nome} onChangeText={(text) => handleChange('nome', text)} error={errors.nome} placeholder="Digite o nome do professor" />
      <Input label="Titulação *" value={values.titulacao} onChangeText={(text) => handleChange('titulacao', text)} error={errors.titulacao} placeholder="Ex: Doutor, Mestre, Especialista" />
      <Input label="Área de Atuação *" value={values.area} onChangeText={(text) => handleChange('area', text)} error={errors.area} placeholder="Ex: Ciência da Computação" />
      <Input label="Tempo de Docência (anos)" value={values.tempo_docencia} onChangeText={(text) => handleChange('tempo_docencia', text)} placeholder="Ex: 5" keyboardType="numeric" />
      <Input label="E-mail *" value={values.email} onChangeText={(text) => handleChange('email', text)} error={errors.email} placeholder="professor@instituicao.com" keyboardType="email-address" autoCapitalize="none" />
      <Button title={loading ? 'Salvando...' : 'Salvar Professor'} onPress={handleSalvar} loading={loading} variant="primary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.lg },
});