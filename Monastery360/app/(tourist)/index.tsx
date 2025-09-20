import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { MonasteryService } from '@/services/monastery';
import { Monastery, CulturalEvent } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Colors, Typography } from '@/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [monasteries, setMonasteries] = useState<Monastery[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [monasteriesData, eventsData] = await Promise.all([
        MonasteryService.getMonasteries(),
        MonasteryService.getCulturalEvents()
      ]);
      setMonasteries(monasteriesData);
      setCulturalEvents(eventsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    
    try {
      const results = await MonasteryService.searchMonasteries(searchQuery);
      setMonasteries(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const renderMonasteryCard = ({ item }: { item: Monastery }) => (
    <Card style={styles.monasteryCard} onPress={() => console.log('Open monastery:', item.id)}>
      <Image
        source={{ uri: item.images[0] }}
        style={styles.monasteryImage}
        contentFit="cover"
      />
      <View style={styles.monasteryContent}>
        <Text style={styles.monasteryName}>{item.name}</Text>
        <Text style={styles.monasteryDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.monasteryMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={16} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.location.city}, {item.location.country}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="star" size={16} color={Colors.gold[500]} />
            <Text style={styles.metaText}>4.8</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderEventCard = ({ item }: { item: CulturalEvent }) => (
    <Card style={styles.eventCard} onPress={() => console.log('Open event:', item.id)}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.eventImage}
        contentFit="cover"
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>
          {new Date(item.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Discovering sacred places...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Explorer'}</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=150&h=150&fit=crop&crop=face' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={Colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search monasteries, tours, events..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Filter')}>
          <MaterialIcons name="tune" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Monastery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Destinations</Text>
          <FlatList
            data={monasteries}
            renderItem={renderMonasteryCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="view-in-ar" size={32} color={Colors.primary[500]} />
              <Text style={styles.actionTitle}>Virtual Tours</Text>
              <Text style={styles.actionSubtitle}>360° experiences</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="headset" size={32} color={Colors.gold[500]} />
              <Text style={styles.actionTitle}>Audio Guides</Text>
              <Text style={styles.actionSubtitle}>Narrated walks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="book" size={32} color={Colors.red[500]} />
              <Text style={styles.actionTitle}>Manuscripts</Text>
              <Text style={styles.actionSubtitle}>Digital archive</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cultural Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cultural Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={culturalEvents}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Offline Mode Banner */}
        <Card style={styles.offlineBanner} variant="outlined">
          <View style={styles.offlineContent}>
            <MaterialIcons name="cloud-download" size={24} color={Colors.primary[500]} />
            <View style={styles.offlineText}>
              <Text style={styles.offlineTitle}>Download for Offline</Text>
              <Text style={styles.offlineSubtitle}>Access content without internet in remote areas</Text>
            </View>
          </View>
          <Button
            title="Download"
            size="small"
            variant="outline"
            onPress={() => console.log('Download offline content')}
          />
        </Card>
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
  greeting: {
    flex: 1,
  },
  welcomeText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
  },
  userName: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginTop: 2,
  },
  profileIcon: {
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    ...Typography.body.medium,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  seeAllText: {
    ...Typography.label.large,
    color: Colors.primary[500],
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  
  // Monastery Cards
  monasteryCard: {
    width: CARD_WIDTH * 0.85,
    marginHorizontal: 4,
    padding: 0,
  },
  monasteryImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  monasteryContent: {
    padding: 16,
  },
  monasteryName: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  monasteryDescription: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  monasteryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionTitle: {
    ...Typography.label.large,
    color: Colors.text.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Event Cards
  eventCard: {
    width: 200,
    marginHorizontal: 4,
    padding: 0,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  eventDate: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  
  // Offline Banner
  offlineBanner: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  offlineContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    flex: 1,
    marginLeft: 16,
  },
  offlineTitle: {
    ...Typography.label.large,
    color: Colors.text.primary,
  },
  offlineSubtitle: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});