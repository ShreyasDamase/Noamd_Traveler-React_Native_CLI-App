// React Native Frontend
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';

const TripNote = () => {
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);
  const route = useRoute();
  tripId = route.params.tripId;
  useEffect(() => {
    console.log('Fetching note for tripId:', tripId);
    if (!tripId) {
      console.error('❌ tripId is undefined!');
      return;
    }
    axios
      .get(
        `https://localhost:8000/trip/${tripId}/note`,
      )
      .then(response => setNote(response.data.note))
      .catch(error => console.error('Error fetching note:', error));
  }, [tripId]);
  const updateNote = () => {
    axios
      .put(
        `https://localhost:8000/trip/${tripId}/note`,
        {note},
      )
      .then(response => {
        setNote(response.data.note);
        setEditing(false);
      })
      .catch(error => console.error('Error updating note:', error));
  };
  console.log('hert is id', tripId);
  return (
    <View style={{padding: 20}}>
      <ScrollView style={{maxHeight: 200, borderWidth: 1, padding: 10}}>
        {editing ? (
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            style={{height: 100}}
          />
        ) : (
          <Text>{note}</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => setEditing(true)}
        style={{position: 'absolute', bottom: 10, right: 10}}>
        <Text>Edit</Text>
      </TouchableOpacity>
      {editing && (
        <TouchableOpacity onPress={updateNote}>
          <Text>Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TripNote;
