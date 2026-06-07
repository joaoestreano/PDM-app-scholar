import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Picker, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function CadastroAlunoScreen() {
  const { values, errors, handleChange, validate, reset } = useForm({
    nome: '',
    matricula: '',
    curso: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
  });

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((response) => response.json())
      .then((data) => setEstados(data))
      .catch((error) => {
        console.error('Erro ao carregar estados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os estados');
      });
  }, []);

  useEffect(() => {
    if (values.estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${values.estado}/municipios`)
        .then((response) => response.json())
        .then((data) => setCidades(data))
        .catch((error) => console.error('Erro ao carregar cidades:', error));
    }
  }, [values.estado]);

  const buscarCep = async () => {
    const cep = values.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      Alert.alert('CEP Inválido', 'Digite um CEP com 8 dígitos');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('CEP não encontrado', 'Verifique o CEP digitado');
        return;
      }

      handleChange('endereco', data.logradouro);
      handleChange('cidade', data.localidade);
      handleChange('estado', data.uf);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o CEP');
    }
  };

  const handleSalvar = async () => {
    const ok = validate({
      nome: { required: true, message: 'Nome é obrigatório' },
      matricula: { required: true, message: 'Matrícula é obrigatória' },
      curso: { required: true, message: 'Curso é obrigatório' },
      email: { required: true, message: 'E-mail é obrigatório' },
    });

    if (!ok) {
      Alert.alert('Erro de Validação', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/alunos', values);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      reset();
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível cadastrar o aluno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Aluno</Text>

      <Input label="Nome Completo *" value={values.nome} onChangeText={(text) => handleChange('nome', text)} error={errors.nome} placeholder="Digite o nome completo" />
      <Input label="Matrícula *" value={values.matricula} onChangeText={(text) => handleChange('matricula', text)} error={errors.matricula} placeholder="Digite a matrícula" keyboardType="numeric" />
      <Input label="Curso *" value={values.curso} onChangeText={(text) => handleChange('curso', text)} error={errors.curso} placeholder="Digite o curso" />
      <Input label="E-mail *" value={values.email} onChangeText={(text) => handleChange('email', text)} error={errors.email} placeholder="exemplo@email.com" keyboardType="email-address" autoCapitalize="none" />
      <Input label="Telefone" value={values.telefone} onChangeText={(text) => handleChange('telefone', text)} placeholder="(00) 00000-0000" keyboardType="phone-pad" />
      <Input label="CEP" value={values.cep} onChangeText={(text) => handleChange('cep', text.replace(/\D/g, '').slice(0, 8))} onBlur={buscarCep} placeholder="00000000" keyboardType="numeric" />
      <Input label="Endereço" value={values.endereco} onChangeText={(text) => handleChange('endereco', text)} placeholder="Rua, Avenida, etc." />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Estado</Text>
        <Picker selectedValue={values.estado} onValueChange={(itemValue) => handleChange('estado', itemValue)} style={styles.picker}>
          <Picker.Item label="Selecione um estado" value="" />
          {estados.map((uf) => (
            <Picker.Item key={uf.id} label={uf.nome} value={uf.sigla} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Cidade</Text>
        <Picker selectedValue={values.cidade} onValueChange={(itemValue) => handleChange('cidade', itemValue)} style={styles.picker} enabled={!!values.estado}>
          <Picker.Item label="Selecione uma cidade" value="" />
          {cidades.map((cidade) => (
            <Picker.Item key={cidade.id} label={cidade.nome} value={cidade.nome} />
          ))}
        </Picker>
      </View>

      <Button title={loading ? 'Salvando...' : 'Salvar Aluno'} onPress={handleSalvar} loading={loading} variant="primary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { fontSize: 24, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: SPACING.lg },
  pickerContainer: { marginBottom: SPACING.md, backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.sm },
  label: { color: COLORS.text, fontWeight: FONTS.medium, marginBottom: SPACING.xs, marginTop: SPACING.xs },
  picker: { height: 50 },
});