
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { MonasteryService } from '@/services/monastery';
import { AdminStats } from '@/types';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Colors, Typography } from '@/constants';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await MonasteryService.getAdminStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const quickActions = [
    { id: 'add-event', title: 'Add Event', icon: 'add-circle', color: Colors.primary[500] },
    { id: 'new-tour', title: 'New Tour', icon: 'tour', color: Colors.gold[500] },
    { id: 'upload-content', title: 'Upload Media', icon: 'cloud-upload', color: Colors.red[500] },
    { id: 'manage-users', title: 'Manage Users', icon: 'people', color: Colors.neutral[600] },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{user?.name || 'Administrator'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={Colors.text.secondary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <MaterialIcons name="people" size={32} color={Colors.primary[500]} />
              <Text style={styles.metricNumber}>
                {stats?.totalVisitors.toLocaleString() || '0'}
              </Text>
              <Text style={styles.metricLabel}>Total Visitors</Text>
              <Text style={styles.metricChange}>+{stats?.monthlyGrowth || 0}% this month</Text>
            </Card>

            <Card style={styles.metricCard}>
              <MaterialIcons name="attach-money" size={32} color={Colors.gold[500]} />
              <Text style={styles.metricNumber}>
                €{stats?.totalRevenue.toLocaleString() || '0'}
              </Text>
              <Text style={styles.metricLabel}>Revenue</Text>
              <Text style={styles.metricChange}>+12% this month</Text>
            </Card>

            <Card style={styles.metricCard}>
              <MaterialIcons name="star" size={32} color={Colors.gold[400]} />
              <Text style={styles.metricNumber}>{stats?.averageRating || '0'}</Text>
              <Text style={styles.metricLabel}>Avg Rating</Text>
              <Text style={styles.metricChange}>+0.2 this month</Text>
            </Card>

            <Card style={styles.metricCard}>
              <MaterialIcons name="event" size={32} color={Colors.red[500]} />
              <Text style={styles.metricNumber}>{stats?.upcomingEvents || '0'}</Text>
              <Text style={styles.metricLabel}>Upcoming Events</Text>
              <Text style={styles.metricChange}>3 this week</Text>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <MaterialIcons name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Tours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Tours</Text>
          <Card style={styles.toursCard}>
            {stats?.popularTours.map((tour, index) => (
              <View key={index} style={styles.tourItem}>
                <View style={styles.tourRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.tourInfo}>
                  <Text style={styles.tourName}>{tour}</Text>
                  <Text style={styles.tourStats}>
                    {Math.floor(Math.random() * 500) + 100} visitors this month
                  </Text>
                </View>
                <MaterialIcons name="trending-up" size={20} color={Colors.primary[500]} />
              </View>
            ))}
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.primary[100] }]}>
                <MaterialIcons name="book-online" size={20} color={Colors.primary[500]} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>New booking for Sacred Architecture Tour</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.gold[100] }]}>
                <MaterialIcons name="event" size={20} color={Colors.gold[500]} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Harvest Festival registration opened</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.red[100] }]}>
                <MaterialIcons name="star" size={20} color={Colors.red[500]} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>New 5-star review received</Text>
                <Text style={styles.activityTime}>3 hours ago</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  welcomeText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
  },
  adminName: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.red[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...Typography.body.small,
    color: Colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  
  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 64) / 2,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 20,
  },
  metricNumber: {
    ...Typography.display.medium,
    color: Colors.text.primary,
    marginVertical: 8,
  },
  metricLabel: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  metricChange: {
    ...Typography.body.small,
    color: Colors.primary[500],
    marginTop: 4,
    fontWeight: '600',
  },
  
  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    ...Typography.label.medium,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  
  // Tours Card
  toursCard: {
    padding: 0,
  },
  tourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tourRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    ...Typography.label.medium,
    color: Colors.primary[700],
    fontWeight: 'bold',
  },
  tourInfo: {
    flex: 1,
  },
  tourName: {
    ...Typography.label.large,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  tourStats: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  
  // Activity Card
  activityCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
  },
});
