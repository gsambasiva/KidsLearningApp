/**
 * SmartKids Learning App - Signup Screen
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    role: 'parent', // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name required';
    if (!form.email.trim()) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await signup({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    });
    setLoading(false);
    if (!result.success) {
      Alert.alert('Signup Failed', result.error || 'Could not create account.');
    }
  };

  const inputField = (field, label, placeholder, props = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        <TextInput
          style={styles.input}
          value={form[field]}
          onChangeText={v => update(field, v)}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          {...props}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <LinearGradient colors={[Colors.accent, '#1565C0']} style={styles.gradient}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Text style={styles.logo}>🌟</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SmartKids today!</Text>
          </View>

          <View style={styles.card}>
            {/* Role Selection */}
            <Text style={styles.sectionLabel}>I am a...</Text>
            <View style={styles.roleRow}>
              {['parent', 'child'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleBtn, form.role === role && styles.roleBtnSelected]}
                  onPress={() => update('role', role)}
                >
                  <Text style={styles.roleEmoji}>{role === 'parent' ? '👨‍👩‍👧' : '🧒'}</Text>
                  <Text style={[styles.roleLabel, form.role === role && styles.roleLabelSelected]}>
                    {role === 'parent' ? 'Parent' : 'Child'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name Row */}
            <View style={styles.nameRow}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>First Name</Text>
                <View style={[styles.inputWrapper, errors.firstName && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={form.firstName}
                    onChangeText={v => update('firstName', v)}
                    placeholder="First"
                    placeholderTextColor={Colors.textLight}
                    autoCapitalize="words"
                  />
                </View>
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>
              <View style={{ width: 10 }} />
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={form.lastName}
                    onChangeText={v => update('lastName', v)}
                    placeholder="Last"
                    placeholderTextColor={Colors.textLight}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </View>

            {inputField('email', 'Email', 'your@email.com', { keyboardType: 'email-address', autoCapitalize: 'none' })}

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  value={form.password}
                  onChangeText={v => update('password', v)}
                  placeholder="Min 6 characters"
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {inputField('confirmPassword', 'Confirm Password', 'Re-enter password', { secureTextEntry: !showPassword })}

            <Button
              title={loading ? 'Creating Account...' : 'Create Account 🎉'}
              onPress={handleSignup}
              loading={loading}
              fullWidth
              size="large"
              variant="accent"
              style={{ marginTop: 8 }}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { fontSize: 56 },
  title: { fontSize: 30, fontWeight: '900', color: Colors.white, marginTop: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  roleBtn: {
    flex: 1, alignItems: 'center', borderRadius: 16,
    padding: 14, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  roleBtnSelected: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  roleEmoji: { fontSize: 28, marginBottom: 4 },
  roleLabel: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  roleLabelSelected: { color: Colors.accent },
  nameRow: { flexDirection: 'row' },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border, borderRadius: 14,
    paddingHorizontal: 14, backgroundColor: Colors.background,
  },
  inputError: { borderColor: Colors.wrong },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.textPrimary },
  errorText: { fontSize: 12, color: Colors.wrong, marginTop: 3, marginLeft: 4 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, alignItems: 'center' },
  loginText: { fontSize: 15, color: Colors.textSecondary },
  loginLink: { fontSize: 15, color: Colors.accent, fontWeight: '700' },
});

export default SignupScreen;
