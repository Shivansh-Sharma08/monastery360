
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

interface Booking {
  id: string;
  guestName: string;
  email: string;
  tourType: string;
  date: string;
  time: string;
  visitors: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    guestName: 'Elena Rodriguez',
    email: 'elena@example.com',
    tourType: 'Sacred Architecture Tour',
    date: '2024-02-15',
    time: '10:00 AM',
    visitors: 2,
    status: 'confirmed',
    amount: 30,
  },
  {
    id: '2',
    guestName: 'Michael Thompson',
    email: 'michael@example.com',
    tourType: 'Manuscript Collection',
    date: '2024-02-16',
    time: '2:00 PM',
    visitors: 1,
    status: 'pending',
    amount: 15,
  },
  {
    id: '3',
    guestName: 'Anna Kowalski',
    email: 'anna@example.com',
    tourType: 'Garden Meditation',
    date: '2024-02-14',
    time: '9:00 AM',
    visitors: 3,
    status: 'completed',
    amount: 45,
  },
];

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { key: 'all', label: 'All Bookings', count: mockBookings.length },
    { key: 'pending', label: 'Pending', count: mockBookings.filter(b => b.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: mockBookings.filter(b => b.status === 'confirmed').length },
    { key: 'completed', label: 'Completed', count: mockBookings.filter(b => b.status === 'completed').length },
  ];

  const filteredBookings = mockBookings.filter(booking => {
    const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter;
    const matchesSearch = booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.tourType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.gold[500];
      case 'confirmed': return Colors.primary[500];
      case 'completed': return Colors.neutral[500];
      case 'cancelled': return Colors.red[500];
      default: return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'confirmed': return 'check-circle';
      case 'completed': return 'task-alt';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  };

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <Card style={styles.bookingCard} onPress={() => console.log('View booking:', item.id)}>
      <View style={styles.bookingHeader}>
        <View style={styles.guestInfo}>
          <Text style={styles.guestName}>{item.guestName}</Text>
          <Text style={styles.guestEmail}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <MaterialIcons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.tourType}>{item.tourType}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialIcons name="calendar-today" size={16} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="access-time" size={16} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="people" size={16} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>{item.visitors} visitor{item.visitors > 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.amount}>€{item.amount}</Text>
        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <>
              <Button
                title="Accept"
                size="small"
                onPress={() => console.log('Accept booking:', item.id)}
                style={styles.acceptButton}
              />
              <Button
                title="Decline"
                variant="outline"
                size="small"
                onPress={() => console.log('Decline booking:', item.id)}
                style={styles.declineButton}
              />
            </>
          )}
          {item.status === 'confirmed' && (
            <Button
              title="Contact"
              variant="outline"
              size="small"
              onPress={() => console.log('Contact guest:', item.id)}
            />
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={Colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterCount,
              selectedFilter === filter.key ? styles.filterCountActive : styles.filterCountInactive
            ]}>
              <Text style={[
                styles.countText,
                selectedFilter === filter.key ? styles.countTextActive : styles.countTextInactive
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        style={styles.bookingsList}
        contentContainerStyle={styles.bookingsContent}
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
  
  // Search
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    ...Typography.body.medium,
    color: Colors.text.primary,
    marginLeft: 12,
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
    marginRight: 8,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountInactive: {
    backgroundColor: Colors.primary[100],
  },
  countText: {
    ...Typography.body.small,
    fontWeight: '600',
  },
  countTextActive: {
    color: Colors.surface,
  },
  countTextInactive: {
    color: Colors.primary[700],
  },
  
  // Bookings List
  bookingsList: {
    flex: 1,
  },
  bookingsContent: {
    padding: 24,
    paddingTop: 0,
  },
  bookingCard: {
    marginBottom: 16,
  },
  
  // Booking Card Header
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  guestEmail: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.body.small,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Booking Details
  bookingDetails: {
    marginBottom: 12,
  },
  tourType: {
    ...Typography.label.large,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
  
  // Booking Footer
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    ...Typography.heading.h3,
    color: Colors.primary[500],
  },
  actionButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    marginRight: 8,
  },
  declineButton: {
    marginLeft: 8,
  },
});
