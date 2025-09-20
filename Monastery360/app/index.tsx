import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Colors, Typography } from '@/constants';

export default function IndexPage() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe auth hook usage with error boundary
  let authData: ReturnType<typeof useAuth> | null = null;
  
  try {
    authData = useAuth();
  } catch (err) {
    console.error('Auth context error:', err);
    setError('Authentication system not available');
  }

  const { user, isLoading } = authData || { user: null, isLoading: false };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading || error) return;

    // Simple navigation logic
    if (!user) {
      router.replace('/login');
    } else if (user.role === 'tourist') {
      router.replace('/(tourist)');
    } else if (user.role === 'admin') {
      router.replace('/(admin)');
    } else {
      router.replace('/login');
    }
  }, [user, isLoading, mounted, error]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>Please restart the app</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoadingSpinner size="large" />
      <Text style={styles.loadingText}>
        {isLoading ? 'Loading...' : 'Initializing...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  errorText: {
    ...Typography.heading.h3,
    color: Colors.red[500],
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});