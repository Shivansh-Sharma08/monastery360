
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

interface ContentItem {
  id: string;
  title: string;
  type: 'tour' | 'audio' | 'image' | 'manuscript' | '360view';
  status: 'published' | 'draft' | 'archived';
  thumbnail: string;
  lastModified: string;
  views: number;
  language: string;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Sacred Architecture Virtual Tour',
    type: 'tour',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    lastModified: '2024-02-10',
    views: 1247,
    language: 'English',
  },
  {
    id: '2',
    title: 'Main Chapel 360° View',
    type: '360view',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=300&h=200&fit=crop',
    lastModified: '2024-02-08',
    views: 892,
    language: 'English',
  },
  {
    id: '3',
    title: 'Welcome Audio Guide',
    type: 'audio',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    lastModified: '2024-02-05',
    views: 2134,
    language: 'English',
  },
  {
    id: '4',
    title: 'Chronicle of Sacred Wisdom',
    type: 'manuscript',
    status: 'draft',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    lastModified: '2024-02-12',
    views: 0,
    language: 'Latin',
  },
];

export default function ContentScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tour' | 'audio' | 'manuscript' | '360view'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'audio' | 'video' | 'document'>('image');

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

  const contentTypes = [
    { key: 'all', label: 'All Content', icon: 'collections' },
    { key: 'tour', label: 'Virtual Tours', icon: 'view-in-ar' },
    { key: 'audio', label: 'Audio Guides', icon: 'headset' },
    { key: 'manuscript', label: 'Manuscripts', icon: 'book' },
    { key: '360view', label: '360° Views', icon: 'panorama' },
  ];

  const uploadTypes = [
    { key: 'image', label: 'Images & Photos', icon: 'image', description: 'Upload monastery photos and artwork' },
    { key: 'audio', label: 'Audio Guides', icon: 'mic', description: 'Upload narrated tour guides' },
    { key: 'video', label: 'Video Tours', icon: 'videocam', description: 'Upload virtual tour videos' },
    { key: 'document', label: 'Documents', icon: 'description', description: 'Upload manuscripts and historical documents' },
  ];

  const filteredContent = selectedFilter === 'all' 
    ? mockContent 
    : mockContent.filter(item => item.type === selectedFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tour': return 'view-in-ar';
      case 'audio': return 'headset';
      case 'image': return 'image';
      case 'manuscript': return 'book';
      case '360view': return 'panorama';
      default: return 'file-present';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tour': return Colors.primary[500];
      case 'audio': return Colors.gold[500];
      case 'image': return Colors.red[500];
      case 'manuscript': return Colors.neutral[600];
      case '360view': return Colors.primary[600];
      default: return Colors.text.secondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return Colors.primary[500];
      case 'draft': return Colors.gold[500];
      case 'archived': return Colors.neutral[500];
      default: return Colors.text.secondary;
    }
  };

  const handleDeleteContent = (contentId: string) => {
    showWebAlert(
      'Delete Content',
      'Are you sure you want to delete this content? This action cannot be undone.',
      () => {
        console.log('Delete content:', contentId);
        showWebAlert('Success', 'Content has been deleted successfully.');
      }
    );
  };

  const handleUpload = () => {
    setShowUploadModal(false);
    showWebAlert('Upload Started', `Your ${uploadType} content is being uploaded. You will be notified when it is complete.`);
  };

  const renderContentCard = ({ item }: { item: ContentItem }) => (
    <Card style={styles.contentCard}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.contentThumbnail}
        contentFit="cover"
      />
      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <View style={styles.contentBadges}>
            <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(item.type)}20` }]}>
              <MaterialIcons 
                name={getTypeIcon(item.type) as any} 
                size={14} 
                color={getTypeColor(item.type)} 
              />
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contentMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="language" size={14} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.language}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="visibility" size={14} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.views} views</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="update" size={14} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{item.lastModified}</Text>
          </View>
        </View>

        <View style={styles.contentActions}>
          <Button
            title="Edit"
            variant="outline"
            size="small"
            onPress={() => console.log('Edit content:', item.id)}
            style={styles.actionButton}
          />
          <Button
            title="Analytics"
            variant="ghost"
            size="small"
            onPress={() => console.log('View analytics:', item.id)}
            style={styles.actionButton}
          />
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteContent(item.id)}
          >
            <MaterialIcons name="delete" size={18} color={Colors.red[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Content</Text>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setShowUploadModal(true)}
        >
          <MaterialIcons name="cloud-upload" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {contentTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.filterChip,
              selectedFilter === type.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(type.key as any)}
          >
            <MaterialIcons 
              name={type.icon as any} 
              size={18} 
              color={selectedFilter === type.key ? Colors.surface : Colors.text.secondary} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === type.key && styles.filterTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Analytics Summary */}
      <Card style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Content Performance</Text>
        <View style={styles.analyticsRow}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>{mockContent.reduce((sum, item) => sum + item.views, 0).toLocaleString()}</Text>
            <Text style={styles.analyticsLabel}>Total Views</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>{mockContent.filter(item => item.status === 'published').length}</Text>
            <Text style={styles.analyticsLabel}>Published</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>{mockContent.filter(item => item.status === 'draft').length}</Text>
            <Text style={styles.analyticsLabel}>Drafts</Text>
          </View>
        </View>
      </Card>

      {/* Content List */}
      <FlatList
        data={filteredContent}
        renderItem={renderContentCard}
        keyExtractor={(item) => item.id}
        style={styles.contentList}
        contentContainerStyle={styles.contentListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Upload Modal */}
      <Modal visible={showUploadModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Content</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionLabel}>Content Type</Text>
              <View style={styles.uploadTypesGrid}>
                {uploadTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.uploadTypeCard,
                      uploadType === type.key && styles.uploadTypeCardActive
                    ]}
                    onPress={() => setUploadType(type.key as any)}
                  >
                    <MaterialIcons 
                      name={type.icon as any} 
                      size={32} 
                      color={uploadType === type.key ? Colors.primary[500] : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.uploadTypeTitle,
                      uploadType === type.key && styles.uploadTypeTextActive
                    ]}>
                      {type.label}
                    </Text>
                    <Text style={styles.uploadTypeDescription}>
                      {type.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.uploadArea}>
                <MaterialIcons name="cloud-upload" size={48} color={Colors.text.tertiary} />
                <Text style={styles.uploadText}>Drop files here or click to browse</Text>
                <Text style={styles.uploadSubtext}>Supports JPG, PNG, PDF, MP3, MP4 (max 50MB)</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter content title"
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Enter content description"
                  placeholderTextColor={Colors.text.tertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowUploadModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Upload"
                onPress={handleUpload}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Web Alert Modal */}
      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alertConfig.title}</Text>
              <Text style={styles.alertMessage}>{alertConfig.message}</Text>
              <TouchableOpacity 
                style={styles.alertButton}
                onPress={() => {
                  alertConfig.onOk?.();
                  setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={styles.alertButtonText}>OK</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    ...Typography.display.small,
    color: Colors.text.primary,
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Filters
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginHorizontal: 3,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  
  // Analytics Card
  analyticsCard: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  analyticsTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticsItem: {
    alignItems: 'center',
  },
  analyticsNumber: {
    ...Typography.heading.h2,
    color: Colors.primary[500],
  },
  analyticsLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  
  // Content List
  contentList: {
    flex: 1,
  },
  contentListContent: {
    padding: 24,
    paddingTop: 0,
  },
  contentCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  contentThumbnail: {
    width: 100,
    height: 100,
  },
  contentInfo: {
    flex: 1,
    padding: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contentTitle: {
    ...Typography.label.large,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  contentBadges: {
    flexDirection: 'row',
  },
  typeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    ...Typography.body.small,
    fontSize: 10,
    fontWeight: '600',
  },
  contentMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
  contentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 'auto',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  sectionLabel: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  uploadTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  uploadTypeCard: {
    width: '48%',
    backgroundColor: Colors.neutral[50],
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTypeCardActive: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  uploadTypeTitle: {
    ...Typography.label.medium,
    color: Colors.text.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  uploadTypeTextActive: {
    color: Colors.primary[700],
  },
  uploadTypeDescription: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.neutral[25],
  },
  uploadText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  uploadSubtext: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    ...Typography.label.large,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    ...Typography.body.medium,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text.primary,
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  
  // Alert modal styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 280,
    maxWidth: 400,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: Colors.primary[500],
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
