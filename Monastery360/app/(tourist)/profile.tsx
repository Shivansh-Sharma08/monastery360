
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState({
    notifications: true,
    offlineMode: false,
    autoPlay: true,
    highQuality: false,
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

  const handleLogout = () => {
    showWebAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      async () => {
        try {
          await logout();
          router.replace('/login');
        } catch (error) {
          showWebAlert('Error', 'Failed to sign out. Please try again.');
        }
      }
    );
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Receive updates about events and tours',
      icon: 'notifications',
      type: 'toggle' as const,
      value: preferences.notifications,
    },
    {
      id: 'offlineMode',
      title: 'Offline Content',
      subtitle: 'Download content for offline access',
      icon: 'cloud-download',
      type: 'toggle' as const,
      value: preferences.offlineMode,
    },
    {
      id: 'autoPlay',
      title: 'Auto-play Audio',
      subtitle: 'Automatically start audio guides',
      icon: 'play-circle-outline',
      type: 'toggle' as const,
      value: preferences.autoPlay,
    },
    {
      id: 'highQuality',
      title: 'High Quality Media',
      subtitle: 'Download HD images and audio (uses more data)',
      icon: 'high-quality',
      type: 'toggle' as const,
      value: preferences.highQuality,
    },
  ];

  const actionItems = [
    {
      id: 'downloads',
      title: 'My Downloads',
      subtitle: 'Manage offline content',
      icon: 'download',
      action: () => console.log('Downloads'),
    },
    {
      id: 'bookings',
      title: 'My Bookings',
      subtitle: 'View and manage reservations',
      icon: 'book-online',
      action: () => console.log('Bookings'),
    },
    {
      id: 'favorites',
      title: 'Favorites',
      subtitle: 'Saved tours and locations',
      icon: 'favorite',
      action: () => console.log('Favorites'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help',
      action: () => console.log('Support'),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      icon: 'info',
      action: () => console.log('About'),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image
              source={{ 
                uri: user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=150&h=150&fit=crop&crop=face' 
              }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
              <View style={styles.userBadge}>
                <MaterialIcons name="verified-user" size={16} color={Colors.gold[500]} />
                <Text style={styles.badgeText}>Verified Explorer</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Tours Taken</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Places Visited</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Events Attended</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card style={styles.sectionCard}>
            {settingsItems.map((item, index) => (
              <View key={item.id}>
                <View style={styles.settingItem}>
                  <View style={styles.settingIcon}>
                    <MaterialIcons name={item.icon as any} size={24} color={Colors.primary[500]} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={(value) => updatePreference(item.id as keyof typeof preferences, value)}
                    trackColor={{ false: Colors.neutral[200], true: Colors.primary[200] }}
                    thumbColor={item.value ? Colors.primary[500] : Colors.neutral[400]}
                  />
                </View>
                {index < settingsItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.sectionCard}>
            {actionItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.actionItem} onPress={item.action}>
                  <View style={styles.settingIcon}>
                    <MaterialIcons name={item.icon as any} size={24} color={Colors.text.secondary} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={Colors.text.tertiary} />
                </TouchableOpacity>
                {index < actionItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Logout */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />

        {/* Version Info */}
        <Text style={styles.versionText}>MonasteryTours v1.0.0</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    ...Typography.display.small,
    color: Colors.text.primary,
  },
  
  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  
  // User Card
  userCard: {
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.body.small,
    color: Colors.gold[700],
    marginLeft: 4,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    ...Typography.heading.h1,
    color: Colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sectionCard: {
    padding: 0,
  },
  
  // Settings
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.label.large,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72,
  },
  
  // Logout
  logoutButton: {
    marginBottom: 16,
  },
  
  // Version
  versionText: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    textAlign: 'center',
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
