import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

const { width } = Dimensions.get('window');

interface Tour {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'virtual' | 'audio' | 'panoramic';
  thumbnailUrl: string;
  language: string;
  highlights: string[];
}

const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Sacred Architecture Journey',
    description: 'Explore the magnificent Byzantine architecture and intricate stone carvings that tell centuries of spiritual devotion.',
    duration: 25,
    type: 'virtual',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    language: 'English',
    highlights: ['Main Chapel', 'Bell Tower', 'Cloister Walkways', 'Ancient Foundations']
  },
  {
    id: '2',
    title: 'Chapel Interior 360°',
    description: 'Immerse yourself in the breathtaking frescoes and sacred atmosphere of the main chapel.',
    duration: 15,
    type: 'panoramic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&h=400&fit=crop',
    language: 'English',
    highlights: ['Altar Iconostasis', 'Ceiling Frescoes', 'Sacred Relics']
  },
  {
    id: '3',
    title: 'Monastery Garden Walk',
    description: 'A peaceful audio-guided journey through the monastery medicinal gardens.',
    duration: 20,
    type: 'audio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549298916-f52d724204b4?w=600&h=400&fit=crop',
    language: 'English',
    highlights: ['Herb Garden', 'Reflection Pool', 'Ancient Oak Tree']
  }
];

export default function ToursScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'virtual' | 'audio' | 'panoramic'>('all');

  const categories = [
    { key: 'all', label: 'All Tours', icon: 'explore' },
    { key: 'virtual', label: 'Virtual', icon: 'view-in-ar' },
    { key: 'panoramic', label: '360° Views', icon: 'panorama' },
    { key: 'audio', label: 'Audio', icon: 'headset' }
  ];

  const filteredTours = selectedCategory === 'all' 
    ? mockTours 
    : mockTours.filter(tour => tour.type === selectedCategory);

  const getTourIcon = (type: string) => {
    switch (type) {
      case 'virtual': return 'view-in-ar';
      case 'panoramic': return 'panorama';
      case 'audio': return 'headset';
      default: return 'tour';
    }
  };

  const renderTourCard = ({ item }: { item: Tour }) => (
    <Card style={styles.tourCard} onPress={() => console.log('Start tour:', item.id)}>
      <View style={styles.tourImageContainer}>
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.tourImage}
          contentFit="cover"
        />
        <View style={styles.tourTypeIcon}>
          <MaterialIcons 
            name={getTourIcon(item.type)} 
            size={20} 
            color={Colors.surface} 
          />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}min</Text>
        </View>
      </View>
      
      <View style={styles.tourContent}>
        <Text style={styles.tourTitle}>{item.title}</Text>
        <Text style={styles.tourDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tourMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="language" size={16} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.language}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="highlight" size={16} color={Colors.gold[500]} />
            <Text style={styles.metaText}>{item.highlights.length} highlights</Text>
          </View>
        </View>
        
        <View style={styles.tourActions}>
          <Button
            title="Start Tour"
            onPress={() => console.log('Start tour:', item.id)}
            size="small"
            style={styles.startButton}
          />
          <TouchableOpacity style={styles.downloadButton}>
            <MaterialIcons name="cloud-download" size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tours & Experiences</Text>
        <Text style={styles.headerSubtitle}>Immersive spiritual journeys</Text>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.key as any)}
          >
            <MaterialIcons 
              name={category.icon as any} 
              size={20} 
              color={selectedCategory === category.key ? Colors.surface : Colors.text.secondary} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.key && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tours List */}
      <FlatList
        data={filteredTours}
        renderItem={renderTourCard}
        keyExtractor={(item) => item.id}
        style={styles.toursList}
        contentContainerStyle={styles.toursContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Featured Banner */}
      <Card style={styles.featuredBanner} variant="elevated">
        <View style={styles.bannerContent}>
          <View style={styles.bannerIcon}>
            <MaterialIcons name="stars" size={32} color={Colors.gold[500]} />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Premium Tours</Text>
            <Text style={styles.bannerSubtitle}>Unlock exclusive content with guided narration</Text>
          </View>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      </Card>
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
    marginBottom: 8,
  },
  headerTitle: {
    ...Typography.display.small,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    ...Typography.body.large,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  
  // Categories
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginHorizontal: 4,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary[500],
  },
  categoryText: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  categoryTextActive: {
    color: Colors.surface,
  },
  
  // Tours List
  toursList: {
    flex: 1,
  },
  toursContent: {
    padding: 24,
    paddingTop: 8,
  },
  tourCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  
  // Tour Image
  tourImageContainer: {
    position: 'relative',
  },
  tourImage: {
    width: '100%',
    height: 200,
  },
  tourTypeIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    ...Typography.body.small,
    color: Colors.surface,
    fontWeight: '600',
  },
  
  // Tour Content
  tourContent: {
    padding: 16,
  },
  tourTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  tourDescription: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  tourMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  tourActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startButton: {
    flex: 1,
    marginRight: 12,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Featured Banner
  featuredBanner: {
    margin: 24,
    backgroundColor: Colors.gold[50],
    borderWidth: 1,
    borderColor: Colors.gold[200],
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
  },
  bannerSubtitle: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  bannerButton: {
    backgroundColor: Colors.gold[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerButtonText: {
    ...Typography.label.medium,
    color: Colors.surface,
    fontWeight: '600',
  },
});