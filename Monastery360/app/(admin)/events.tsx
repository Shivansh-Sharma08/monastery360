
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

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'festival' | 'workshop' | 'ceremony' | 'exhibition';
  capacity: number;
  registered: number;
  price: number;
  imageUrl: string;
  status: 'draft' | 'published' | 'cancelled';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Autumn Harvest Festival',
    description: 'Traditional celebration with local music and blessed harvest',
    date: '2024-09-21',
    time: '14:00',
    location: 'Monastery Courtyard',
    type: 'festival',
    capacity: 200,
    registered: 145,
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    status: 'published',
  },
  {
    id: '2',
    title: 'Manuscript Illumination Workshop',
    description: 'Learn the ancient art of manuscript illumination',
    date: '2024-10-05',
    time: '10:00',
    location: 'Scriptorium',
    type: 'workshop',
    capacity: 12,
    registered: 8,
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    status: 'published',
  },
  {
    id: '3',
    title: 'Evening Vespers Service',
    description: 'Traditional evening prayer service open to visitors',
    date: '2024-09-15',
    time: '18:00',
    location: 'Main Chapel',
    type: 'ceremony',
    capacity: 50,
    registered: 23,
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400&h=300&fit=crop',
    status: 'draft',
  },
];

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

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

  const filters = [
    { key: 'all', label: 'All Events', icon: 'event' },
    { key: 'published', label: 'Published', icon: 'publish' },
    { key: 'draft', label: 'Drafts', icon: 'edit' },
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.status === selectedFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'festival': return Colors.gold[500];
      case 'workshop': return Colors.primary[500];
      case 'ceremony': return Colors.red[500];
      case 'exhibition': return Colors.neutral[600];
      default: return Colors.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'festival': return 'celebration';
      case 'workshop': return 'school';
      case 'ceremony': return 'church';
      case 'exhibition': return 'museum';
      default: return 'event';
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    showWebAlert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      () => {
        console.log('Delete event:', eventId);
        showWebAlert('Success', 'Event has been deleted successfully.');
      }
    );
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <Card style={styles.eventCard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.eventImage}
        contentFit="cover"
      />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { 
              backgroundColor: item.status === 'published' ? Colors.primary[100] : Colors.gold[100]
            }]}>
              <Text style={[styles.statusText, {
                color: item.status === 'published' ? Colors.primary[700] : Colors.gold[700]
              }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(item.type)}20` }]}>
            <MaterialIcons 
              name={getTypeIcon(item.type) as any} 
              size={16} 
              color={getTypeColor(item.type)} 
            />
            <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={16} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>{item.date} at {item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="people" size={16} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>
              {item.registered}/{item.capacity} registered
            </Text>
          </View>
          {item.price > 0 && (
            <View style={styles.detailRow}>
              <MaterialIcons name="attach-money" size={16} color={Colors.text.tertiary} />
              <Text style={styles.detailText}>€{item.price}</Text>
            </View>
          )}
        </View>

        <View style={styles.eventActions}>
          <Button
            title="Edit"
            variant="outline"
            size="small"
            onPress={() => console.log('Edit event:', item.id)}
            style={styles.actionButton}
          />
          <Button
            title="Duplicate"
            variant="ghost"
            size="small"
            onPress={() => console.log('Duplicate event:', item.id)}
            style={styles.actionButton}
          />
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteEvent(item.id)}
          >
            <MaterialIcons name="delete" size={20} color={Colors.red[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <MaterialIcons 
              name={filter.icon as any} 
              size={20} 
              color={selectedFilter === filter.key ? Colors.surface : Colors.text.secondary} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        style={styles.eventsList}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Event Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Event</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Event Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter event title"
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Enter event description"
                  placeholderTextColor={Colors.text.tertiary}
                  multiline
                  numberOfLines={4}
                />
              </View>
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity style={styles.dateInput}>
                    <Text style={styles.dateText}>Select date</Text>
                    <MaterialIcons name="calendar-today" size={20} color={Colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TouchableOpacity style={styles.dateInput}>
                    <Text style={styles.dateText}>Select time</Text>
                    <MaterialIcons name="access-time" size={20} color={Colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Create Event"
                onPress={() => {
                  setShowAddModal(false);
                  showWebAlert('Success', 'Event has been created successfully.');
                }}
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
  addButton: {
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginHorizontal: 4,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  
  // Events List
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: 24,
    paddingTop: 0,
  },
  eventCard: {
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: 16,
  },
  
  // Event Header
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    ...Typography.body.small,
    fontWeight: '600',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeText: {
    ...Typography.body.small,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Event Details
  eventDescription: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginLeft: 8,
  },
  
  // Event Actions
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
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
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  dateText: {
    ...Typography.body.medium,
    color: Colors.text.tertiary,
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
