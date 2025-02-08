import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';

const MapScreen = () => {
  const route = useRoute();
  const mapView = useRef(null);
  const places = route?.params?.places || [];
  const firstPlace = places.length > 0 ? places[0] : null;
  const [selectedMarker, setSelectedMarker] = useState(null);

  console.log('🚀 Received places from route:', places);

  const coordinates = places.map(place => ({
    latitude: place.geometry?.location?.lat || 0,
    longitude: place.geometry?.location?.lng || 0,
  }));

  console.log('📍 Generated coordinates:', coordinates);

  useEffect(() => {
    if (places.length > 0 && mapView.current) {
      console.log('🔄 Fitting map to coordinates:', coordinates);
      mapView.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
      });
    }
  }, [places]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mapContainer}>
        {firstPlace ? (
          <MapView
            initialRegion={{
              latitude: firstPlace.geometry.location.lat,
              longitude: firstPlace.geometry.location.lng,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
            style={styles.map}
            showsCompass={true}
            showsUserLocation={true}
            followsUserLocation={true} // Hide default compass
            ref={mapView}
            provider="google"
            showsMyLocationButton={true} // Disables the default location button
            // Disables the compass
            showsTraffic={true} // Disables the traffic layer
            toolbarEnabled={true}
            disableKineticMovement={true}>
            {places.map((item, index) => (
              <Marker
                key={index}
                title={item?.name}
                description={item?.briefDescription}
                coordinate={{
                  latitude: item.geometry.location.lat,
                  longitude: item.geometry.location.lng,
                }}
                onPress={() => {
                  console.log('📌 Marker pressed:', item);
                  setSelectedMarker(item);
                }}
              />
            ))}
          </MapView>
        ) : (
          <Text style={styles.errorText}>No places available</Text>
        )}

        {selectedMarker && (
          <View style={styles.markerDetails}>
            <View style={styles.markerHeader}>
              <Text>📍</Text>
              <Text style={styles.markerTitle}>{selectedMarker.name}</Text>
              <Entypo
                onPress={() => {
                  console.log('❌ Marker closed:', selectedMarker);
                  setSelectedMarker(null);
                }}
                name="cross"
                size={25}
                color="gray"
              />
            </View>
            <Text numberOfLines={3} style={styles.markerDescription}>
              {selectedMarker?.briefDescription}
            </Text>
            {selectedMarker.photos && selectedMarker.photos[0] && (
              <Image
                source={{uri: selectedMarker.photos[0]}}
                style={styles.markerImage}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, paddingTop: 10, paddingHorizontal: 10},
  mapContainer: {
    width: '100%',
    height: '100%',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 40,
  },
  map: {width: '100%', height: '100%'},
  errorText: {textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20},
  markerDetails: {
    padding: 5,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 70,
    width: '95%',
    alignSelf: 'center',
  },
  markerHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  markerTitle: {fontSize: 16, fontWeight: '500', flex: 1},
  markerDescription: {color: 'gray', marginBottom: 10},
  markerImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
  },
});
