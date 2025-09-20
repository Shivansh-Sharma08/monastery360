
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

export default function AdminSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    autoApproveBookings: false,
    emailNotifications: true,
    pushNotifications: true,
    analyticsTracking: true,
    maintenanceMode: false,
    allowGuestBookings: true,
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

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'maintenanceMode') {
      showWebAlert(
        'Maintenance Mode',
        value ? 'Maintenance mode enabled. Visitors will see a maintenance message.'
              : 'Maintenance mode disabled. Site is now accessible to visitors.'
      );
    }
  };

  const generalSettings = [
    {
      id: 'autoApproveBookings',
      title: 'Auto-approve Bookings',
      subtitle: 'Automatically approve new booking requests',
      icon: 'check-circle',
      value: settings.autoApproveBookings,
    },
    {
      id: 'allowGuestBookings',
      title: 'Allow Guest Bookings',
      subtitle: 'Let visitors book without creating an account',
      icon: 'person-add',
      value: settings.allowGuestBookings,
    },
    {
      id: 'maintenanceMode',
      title: 'Maintenance Mode',
      subtitle: 'Temporarily disable public access',
      icon: 'build',
      value: settings.maintenanceMode,
    },
  ];

  const notificationSettings = [
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      subtitle: 'Receive booking and event notifications via email',
      icon: 'email',
      value: settings.emailNotifications,
    },
    {
      id: 'pushNotifications',
      title: 'Push Notifications',
      subtitle: 'Real-time notifications on your device',
      icon: 'notifications',
      value: settings.pushNotifications,
    },
    {
      id: 'analyticsTracking',
      title: 'Analytics Tracking',
      subtitle: 'Collect visitor analytics and usage data',
      icon: 'analytics',
      value: settings.analyticsTracking,
    },
  ];

  const managementActions = [
    {
      id: 'users',
      title: 'User Management',
      subtitle: 'Manage tourist accounts and permissions',
      icon: 'people',
      action: () => console.log('User management'),
    },
    {
      id: 'backup',
      title: 'Backup & Export',
      subtitle: 'Download content and data backups',
      icon: 'backup',
      action: () => showWebAlert('Backup', 'Backup functionality will be available soon.'),
    },
    {
      id: 'integration',
      title: 'Integrations',
      subtitle: 'Connect with external services',
      icon: 'extension',
      action: () => console.log('Integrations'),
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'Generate detailed performance reports',
      icon: 'assessment',
      action: () => console.log('Reports'),
    },
  ];

  const renderSettingItem = (item: any, onToggle: (key: string, value: boolean) => void) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={item.value ? Colors.primary[500] : Colors.text.secondary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <Switch
        value={item.value}
        onValueChange={(value) => onToggle(item.id, value)}
        trackColor={{ false: Colors.neutral[200], true: Colors.primary[200] }}
        thumbColor={item.value ? Colors.primary[500] : Colors.neutral[400]}
      />
    </View>
  );

  const renderActionItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.actionItem} onPress={item.action}>
      <View style={styles.settingIcon}>
        <MaterialIcons name={item.icon} size={24} color={Colors.text.secondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={Colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Profile */}
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="admin-panel-settings" size={40} color={Colors.primary[500]} />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.adminName}>{user?.name || 'Administrator'}</Text>
              <Text style={styles.adminEmail}>{user?.email || 'admin@monastery.com'}</Text>
              <View style={styles.roleBadge}>
                <MaterialIcons name="verified" size={16} color={Colors.gold[500]} />
                <Text style={styles.roleText}>Site Administrator</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          <Card style={styles.sectionCard}>
            {generalSettings.map(item => renderSettingItem(item, updateSetting))}
          </Card>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card style={styles.sectionCard}>
            {notificationSettings.map(item => renderSettingItem(item, updateSetting))}
          </Card>
        </View>

        {/* Management Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <Card style={styles.sectionCard}>
            {managementActions.map(renderActionItem)}
          </Card>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusIndicator, { backgroundColor: Colors.primary[500] }]} />
                <Text style={styles.statusLabel}>Website Status</Text>
                <Text style={styles.statusValue}>Online</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusIndicator, { backgroundColor: Colors.gold[500] }]} />
                <Text style={styles.statusLabel}>Server Load</Text>
                <Text style={styles.statusValue}>Normal</Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusIndicator, { backgroundColor: Colors.primary[500] }]} />
                <Text style={styles.statusLabel}>Database</Text>
                <Text style={styles.statusValue}>Connected</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusIndicator, { backgroundColor: Colors.red[500] }]} />
                <Text style={styles.statusLabel}>Backup</Text>
                <Text style={styles.statusValue}>2 days ago</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.dangerCard}>
            <View style={styles.dangerItem}>
              <MaterialIcons name="warning" size={24} color={Colors.red[500]} />
              <View style={styles.dangerContent}>
                <Text style={styles.dangerTitle}>Sign Out</Text>
                <Text style={styles.dangerSubtitle}>Sign out of administrator account</Text>
              </View>
              <Button
                title="Sign Out"
                variant="outline"
                size="small"
                onPress={handleLogout}
                style={styles.dangerButton}
              />
            </View>
          </Card>
        </View>

        {/* Version Info */}
        <Text style={styles.versionText}>MonasteryTours Admin v1.0.0</Text>
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

  // Profile Card
  profileCard: {
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 16,
  },
  adminName: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  adminEmail: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    ...Typography.body.small,
    color: Colors.gold[700],
    marginLeft: 4,
    fontWeight: '600',
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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

  // Status Card
  statusCard: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  statusValue: {
    ...Typography.label.medium,
    color: Colors.text.primary,
  },

  // Danger Zone
  dangerCard: {
    backgroundColor: Colors.red[50],
    borderWidth: 1,
    borderColor: Colors.red[200],
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dangerContent: {
    flex: 1,
    marginLeft: 16,
  },
  dangerTitle: {
    ...Typography.label.large,
    color: Colors.red[700],
    marginBottom: 2,
  },
  dangerSubtitle: {
    ...Typography.body.small,
    color: Colors.red[600],
  },
  dangerButton: {
    borderColor: Colors.red[500],
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
