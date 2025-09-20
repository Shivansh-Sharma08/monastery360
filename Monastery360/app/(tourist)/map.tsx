import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Colors, Typography } from '@/constants';

const { width, height } = Dimensions.get('window');

interface MapLocation {
  id: string;
  name: string;
  type: 'monastery' | 'attraction' | 'restaurant' | 'accommodation';
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  imageUrl: string;
  description: string;
}

const mockLocations: MapLocation[] = [
  {
    id: '1',
    name: 'Monastery of Sacred Wisdom',
    type: 'monastery',
    latitude: 42.6977,
    longitude: 23.3219,
    distance: 0,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    description: 'A 12th-century monastery renowned for its magnificent frescoes.'
  },
  {
    id: '2',
    name: 'Sacred Mountain Trail',
    type: 'attraction',
    latitude: 42.7000,
    longitude: 23.3200,
    distance: 2.5,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec65b5?w=400&h=300&fit=crop',
    description: 'Scenic hiking trail with panoramic views of the valley.'
  },
  {
    id: '3',
    name: 'Heritage Inn',
    type: 'accommodation',
    latitude: 42.6950,
    longitude: 23.3180,
    distance: 1.2,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
    description: 'Traditional inn with authentic monastery-style rooms.'
  }
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'terrain'>('terrain');

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'monastery': return 'account-balance';
      case 'attraction': return 'landscape';
      case 'restaurant': return 'restaurant';
      case 'accommodation': return 'hotel';
      default: return 'place';
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'monastery': return Colors.primary[500];
      case 'attraction': return Colors.gold[500];
      case 'restaurant': return Colors.red[500];
      case 'accommodation': return Colors.neutral[600];
      default: return Colors.text.secondary;
    }
  };

  const renderLocationCard = (location: MapLocation) => (
    <Card 
      key={location.id}
      style={styles.locationCard} 
      onPress={() => setSelectedLocation(location)}
    >
      <Image
        source={{ uri: location.imageUrl }}
        style={styles.locationImage}
        contentFit="cover"
      />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationDescription} numberOfLines={2}>
          {location.description}
        </Text>
        <View style={styles.locationMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="star" size={16} color={Colors.gold[500]} />
            <Text style={styles.metaText}>{location.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="directions-walk" size={16} color={Colors.text.tertiary} />
            <Text style={styles.metaText}>{location.distance}km</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Interactive Map</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.mapToggle}
            onPress={() => setMapView(mapView === 'terrain' ? 'satellite' : 'terrain')}
          >
            <MaterialIcons 
              name={mapView === 'terrain' ? 'satellite' : 'terrain'} 
              size={20} 
              color={Colors.text.secondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationButton}>
            <MaterialIcons name="my-location" size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="map" size={64} color={Colors.text.tertiary} />
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Explore monasteries and nearby attractions
          </Text>
        </View>

        {/* Map Markers */}
        {mockLocations.map((location, index) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.mapMarker,
              {
                left: 60 + (index * 80),
                top: 120 + (index * 40),
              }
            ]}
            onPress={() => setSelectedLocation(location)}
          >
            <View style={[
              styles.markerIcon,
              { backgroundColor: getLocationColor(location.type) }
            ]}>
              <MaterialIcons 
                name={getLocationIcon(location.type)} 
                size={20} 
                color={Colors.surface} 
              />
            </View>
            {selectedLocation?.id === location.id && (
              <View style={styles.markerLabel}>
                <Text style={styles.markerText}>{location.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <MaterialIcons name="add" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <MaterialIcons name="remove" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Locations List */}
      <View style={styles.locationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Places</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.locationsList}
          showsVerticalScrollIndicator={false}
        >
          {mockLocations.map(renderLocationCard)}
        </ScrollView>
      </View>

      {/* Travel Routes Banner */}
      <Card style={styles.routesBanner} variant="outlined">
        <View style={styles.bannerContent}>
          <MaterialIcons name="alt-route" size={24} color={Colors.primary[500]} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Pilgrimage Routes</Text>
            <Text style={styles.bannerSubtitle}>Discover traditional walking paths</Text>
          </View>
          <Button
            title="Explore"
            size="small"
            variant="outline"
            onPress={() => console.log('Explore routes')}
          />
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
  headerActions: {
    flexDirection: 'row',
  },
  mapToggle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Map
  mapContainer: {
    height: height * 0.4,
    backgroundColor: Colors.neutral[50],
    position: 'relative',
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
  },
  mapPlaceholderText: {
    ...Typography.heading.h3,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    ...Typography.body.medium,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  
  // Map Markers
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerLabel: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  markerText: {
    ...Typography.body.small,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  
  // Map Controls
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Locations Section
  locationsSection: {
    flex: 1,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  seeAllText: {
    ...Typography.label.large,
    color: Colors.primary[500],
  },
  
  // Locations List
  locationsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  locationCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  locationImage: {
    width: 80,
    height: 80,
  },
  locationInfo: {
    flex: 1,
    padding: 12,
  },
  locationName: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationDescription: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  locationMeta: {
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
  
  // Routes Banner
  routesBanner: {
    margin: 24,
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
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
});