import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import api from '../services/api';

export default function CadastroDisciplinaScreen() {
  const { values, errors, handleChange, validate, reset } = useForm({
    nome: '',
    carga_horaria: '',
    professor_id: '',
    curso: '',
    semestre: '',
  });

  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const response = await api.get('/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os professores');
    }
  };

  const handleSalvar = async () => {
    const ok = validate({
      nome: { required: true, message: 'Nome da disciplina é obrigatório' },
      carga_horaria: { required: true, message: 'Carga horária é obrigatória' },
      professor_id: { required: true, message: 'Professor responsável é obrigatório' },
      curso: { required: true, message: 'Curso é obrigatório' },
      semestre: { required: true, message: 'Semestre é obrigatório' },
    });

    if (!ok) {
      Alert.alert('Erro de Validação', 'Preencha todos os campos obrigatórios');
      return;
    }

    // Converter para números
    const dadosParaEnviar = {
      nome: values.nome,
      carga_horaria: parseInt(values.carga_horaria),
      professor_id: parseInt(values.professor_id),
      curso: values.curso,
      semestre: values.semestre,
    };

    setLoading(true);
    try {
      await api.post('/disciplinas', dadosParaEnviar);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
      reset();
    } catch (error) {
      console.error('Erro ao cadastrar disciplina:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível cadastrar a disciplina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Disciplina</Text>
      
      <Input 
        label="Nome da Disciplina *" 
        value={values.nome} 
        onChangeText={(text) => handleChange('nome', text)} 
        error={errors.nome} 
        placeholder="Ex: Programação Mobile" 
      />
      
      <Input 
        label="Carga Horária (horas) *" 
        value={values.carga_horaria} 
        onChangeText={(text) => handleChange('carga_horaria', text)} 
        error={errors.carga_horaria} 
        placeholder="Ex: 80" 
        keyboardType="numeric" 
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Professor Responsável *</Text>
        <Picker
          selectedValue={values.professor_id}
          onValueChange={(itemValue) => handleChange('professor_id', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um professor" value="" />
          {professores.map((prof) => (
            <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
          ))}
        </Picker>
        {errors.professor_id && <Text style={styles.errorText}>{errors.professor_id}</Text>}
      </View>

      <Input 
        label="Curso *" 
        value={values.curso} 
        onChangeText={(text) => handleChange('curso', text)} 
        error={errors.curso} 
        placeholder="Ex: Desenvolvimento de Software" 
      />
      
      <Input 
        label="Semestre *" 
        value={values.semestre} 
        onChangeText={(text) => handleChange('semestre', text)} 
        error={errors.semestre} 
        placeholder="Ex: 2026.1" 
      />
      
      <Button 
        title={loading ? 'Salvando...' : 'Salvar Disciplina'} 
        onPress={handleSalvar} 
        loading={loading} 
        variant="primary" 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    padding: SPACING.md 
  },
  title: { 
    fontSize: 24, 
    fontWeight: FONTS.bold, 
    color: COLORS.text, 
    marginBottom: SPACING.lg 
  },
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
  picker: { 
    height: 50,
    width: '100%',
  },
  errorText: { 
    color: COLORS.danger, 
    fontSize: 12, 
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
});