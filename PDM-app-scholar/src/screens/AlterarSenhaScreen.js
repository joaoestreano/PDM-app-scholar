import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function AlterarSenhaScreen({ navigation }) {
  const { values, errors, handleChange, validate, reset } = useForm({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    const ok = validate({
      senhaAtual: { required: true, message: 'Senha atual é obrigatória' },
      novaSenha: { required: true, message: 'Nova senha é obrigatória' },
      confirmarSenha: { required: true, message: 'Confirme a nova senha' },
    });

    if (!ok) {
      Alert.alert('Erro de Validação', 'Preencha todos os campos');
      return;
    }

    if (values.novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (values.novaSenha !== values.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await api.post('/usuarios/alterar-senha', {
        senhaAtual: values.senhaAtual,
        novaSenha: values.novaSenha,
      });
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      reset();
    } catch (error) {
      console.error('Erro ao alterar senha:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível alterar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>

      <Input
        label="Senha Atual *"
        value={values.senhaAtual}
        onChangeText={(text) => handleChange('senhaAtual', text)}
        error={errors.senhaAtual}
        placeholder="Digite sua senha atual"
        secureTextEntry
      />

      <Input
        label="Nova Senha *"
        value={values.novaSenha}
        onChangeText={(text) => handleChange('novaSenha', text)}
        error={errors.novaSenha}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
      />

      <Input
        label="Confirmar Nova Senha *"
        value={values.confirmarSenha}
        onChangeText={(text) => handleChange('confirmarSenha', text)}
        error={errors.confirmarSenha}
        placeholder="Repita a nova senha"
        secureTextEntry
      />

      <Button
        title={loading ? 'Alterando...' : 'Alterar Senha'}
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
});