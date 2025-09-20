import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Colors, Typography } from '@/constants';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, signup, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Web alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showWebAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      showWebAlert('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp && !formData.name) {
      showWebAlert('Error', 'Please enter your name');
      return;
    }

    try {
      let user;
      if (isSignUp) {
        user = await signup(formData.name, formData.email, formData.password);
      } else {
        user = await login(formData.email, formData.password);
      }
      
      // Navigate based on user role
      if (user.role === 'tourist') {
        router.replace('/(tourist)');
      } else if (user.role === 'admin') {
        router.replace('/(admin)');
      }
    } catch (error) {
      showWebAlert('Authentication Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const showDemoCredentials = () => {
    showWebAlert(
      'Demo Credentials',
      'Tourist Account:\nemail: tourist@monastery.com\npassword: 123456\n\nAdmin Account:\nemail: admin@monastery.com\npassword: 123456'
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.scrollView, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="account-balance" size={48} color={Colors.primary[500]} />
          </View>
          <Text style={styles.title}>MonasteryTours</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Text>
        </View>

        {/* Demo Notice */}
        <Card style={styles.demoCard} variant="outlined">
          <View style={styles.demoHeader}>
            <MaterialIcons name="info-outline" size={20} color={Colors.gold[500]} />
            <Text style={styles.demoTitle}>Demo Mode</Text>
          </View>
          <Text style={styles.demoText}>
            This is a demonstration version. Click below to see demo credentials.
          </Text>
          <TouchableOpacity onPress={showDemoCredentials}>
            <Text style={styles.demoLink}>View Demo Credentials</Text>
          </TouchableOpacity>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              placeholder="Enter your password"
              placeholderTextColor={Colors.text.tertiary}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Button
            title={isSignUp ? 'Create Account' : 'Sign In'}
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </Card>

        {/* Toggle Mode */}
        <TouchableOpacity 
          style={styles.toggleContainer}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account? ' : "Do not have an account? "}
            <Text style={styles.toggleLink}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Web Alert Modal */}
      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{alertConfig.title}</Text>
              <Text style={styles.modalMessage}>{alertConfig.message}</Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  alertConfig.onOk?.();
                  setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.display.medium,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body.large,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  
  // Demo Card
  demoCard: {
    marginBottom: 24,
    backgroundColor: Colors.gold[50],
    borderColor: Colors.gold[200],
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoTitle: {
    ...Typography.label.large,
    color: Colors.gold[700],
    marginLeft: 8,
  },
  demoText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  demoLink: {
    ...Typography.label.medium,
    color: Colors.gold[600],
    textDecorationLine: 'underline',
  },
  
  // Form
  formCard: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...Typography.label.large,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    ...Typography.body.large,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text.primary,
    minHeight: 48,
  },
  submitButton: {
    marginTop: 8,
  },
  
  // Toggle
  toggleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
  },
  toggleLink: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 280,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: Colors.primary[500],
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});