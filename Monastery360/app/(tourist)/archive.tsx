import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

interface Manuscript {
  id: string;
  title: string;
  period: string;
  description: string;
  imageUrl: string;
  tags: string[];
  pages: number;
  language: string;
  digitized: boolean;
}

const mockManuscripts: Manuscript[] = [
  {
    id: '1',
    title: 'The Chronicle of Sacred Wisdom',
    period: '13th Century',
    description: 'Illuminated manuscript detailing the foundation and early history of the monastery.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    tags: ['illuminated', 'chronicle', 'foundation', 'medieval'],
    pages: 124,
    language: 'Old Church Slavonic',
    digitized: true
  },
  {
    id: '2',
    title: 'Botanical Codex',
    period: '15th Century',
    description: 'Detailed illustrations and descriptions of medicinal plants cultivated in monastery gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    tags: ['botanical', 'medicinal', 'illustrations', 'gardens'],
    pages: 87,
    language: 'Latin',
    digitized: true
  },
  {
    id: '3',
    title: 'Sacred Music Notations',
    period: '16th Century',
    description: 'Collection of liturgical chants and sacred music compositions used in monastery services.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    tags: ['music', 'liturgical', 'chants', 'compositions'],
    pages: 156,
    language: 'Latin',
    digitized: false
  }
];

export default function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'manuscripts' | 'murals' | 'documents'>('all');

  const categories = [
    { key: 'all', label: 'All Archives', icon: 'library-books' },
    { key: 'manuscripts', label: 'Manuscripts', icon: 'book' },
    { key: 'murals', label: 'Murals', icon: 'palette' },
    { key: 'documents', label: 'Documents', icon: 'description' }
  ];

  const filteredManuscripts = mockManuscripts.filter(manuscript => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manuscript.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderManuscriptCard = ({ item }: { item: Manuscript }) => (
    <Card style={styles.manuscriptCard} onPress={() => console.log('Open manuscript:', item.id)}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.manuscriptImage}
        contentFit="cover"
      />
      <View style={styles.manuscriptContent}>
        <View style={styles.manuscriptHeader}>
          <Text style={styles.manuscriptTitle}>{item.title}</Text>
          <View style={styles.periodBadge}>
            <Text style={styles.periodText}>{item.period}</Text>
          </View>
        </View>
        
        <Text style={styles.manuscriptDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.manuscriptMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="pages" size={16} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.pages} pages</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="language" size={16} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.language}</Text>
          </View>
        </View>
        
        <View style={styles.tagContainer}>
          {item.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.manuscriptActions}>
          <Button
            title={item.digitized ? "View Digital" : "Request Access"}
            size="small"
            variant={item.digitized ? "primary" : "outline"}
            onPress={() => console.log('View manuscript:', item.id)}
            style={styles.viewButton}
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialIcons name="favorite-border" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Archives</Text>
        <Text style={styles.headerSubtitle}>Sacred manuscripts & historical documents</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={Colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search manuscripts, documents..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
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

      {/* AI Search Banner */}
      <Card style={styles.aiBanner} variant="outlined">
        <View style={styles.bannerContent}>
          <MaterialIcons name="auto-awesome" size={24} color={Colors.gold[500]} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>AI-Powered Search</Text>
            <Text style={styles.bannerSubtitle}>Find content by meaning, not just keywords</Text>
          </View>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Try AI</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Manuscripts List */}
      <FlatList
        data={filteredManuscripts}
        renderItem={renderManuscriptCard}
        keyExtractor={(item) => item.id}
        style={styles.manuscriptsList}
        contentContainerStyle={styles.manuscriptsContent}
        showsVerticalScrollIndicator={false}
      />
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
  
  // AI Banner
  aiBanner: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: Colors.gold[50],
    borderColor: Colors.gold[200],
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
    marginLeft: 16,
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
  
  // Manuscripts List
  manuscriptsList: {
    flex: 1,
  },
  manuscriptsContent: {
    padding: 24,
    paddingTop: 0,
  },
  manuscriptCard: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
  },
  manuscriptImage: {
    width: 100,
    height: 140,
  },
  manuscriptContent: {
    flex: 1,
    padding: 16,
  },
  manuscriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  manuscriptTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  periodBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodText: {
    ...Typography.body.small,
    color: Colors.primary[700],
    fontWeight: '600',
  },
  manuscriptDescription: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  manuscriptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontSize: 10,
  },
  manuscriptActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButton: {
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
  },
});