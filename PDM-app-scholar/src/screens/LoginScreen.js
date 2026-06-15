import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import { COLORS, SPACING, FONTS } from '../styles/theme';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const { values, errors, handleChange, validate } = useForm({
        login: '',
        senha: '',
    });

    const handleLogin = async () => {
        console.log('🔐 Tentando fazer login...');

        const ok = validate({
            login: { required: true, message: 'Informe o login' },
            senha: { required: true, message: 'Informe a senha' },
        });

        if (!ok) {
            console.log('❌ Validação falhou');
            Alert.alert('Erro de Validação', 'Preencha todos os campos obrigatórios');
            return;
        }

        console.log('✅ Validação passou, dados:', values);
        setLoading(true);

        try {
            console.log('📡 Enviando requisição para API...');
            const result = await login(values);
            console.log('📥 Resposta da API:', result);

            if (result.success) {
                console.log('✅ Login bem-sucedido!');
                navigation.replace('Dashboard');
            } else {
                console.log('❌ Login falhou:', result.error);
                Alert.alert(
                    '❌ Erro no Login',
                    result.error || 'Login ou senha inválidos. Verifique suas credenciais.'
                );
            }
        } catch (error) {
            console.error('💥 Erro na requisição:', error);
            Alert.alert(
                '❌ Erro de Conexão',
                'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.logo}>🎓</Text>
                    <Text style={styles.title}>App Scholar</Text>
                    <Text style={styles.subtitle}>Sistema de Gerenciamento Acadêmico</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Login ou E-mail"
                        value={values.login}
                        onChangeText={(text) => handleChange('login', text)}
                        error={errors.login}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="Digite seu login"
                    />

                    <Input
                        label="Senha"
                        value={values.senha}
                        onChangeText={(text) => handleChange('senha', text)}
                        error={errors.senha}
                        secureTextEntry
                        placeholder="Digite sua senha"
                    />

                    <Button
                        title={loading ? 'Entrando...' : 'Entrar'}
                        onPress={handleLogin}
                        loading={loading}
                        variant="primary"
                    />
                </View>

                <Text style={styles.footer}>© 2026 App Scholar</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl * 2,
    },
    logo: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 32,
        fontWeight: FONTS.bold,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    form: {
        backgroundColor: COLORS.white,
        padding: SPACING.lg,
        borderRadius: 16,
        elevation: 3,
    },
    footer: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: SPACING.xl,
        fontSize: 12,
    },
});