import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or FontAwesome
import Ionicons from 'react-native-vector-icons/Ionicons'; // or FontAwesome

const Place = ({item, index, placeItems, setPlaceItems}) => {
  const choosePlaces = name => {
    setPlaceItems(prevItem => {
      if (prevItem.includes(name)) {
        return prevItem.filter(item => item !== name);
      } else {
        return [...prevItem, name];
      }
    });
  };
  return (
    <Pressable onPress={() => choosePlaces(item?.name)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'orange',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: 500}}>{index + 1}</Text>
            </View>
            <Text
              numberOfLines={2}
              style={{fontSize: 16, fontWeight: 500, width: '82%'}}>
              {item.name}
            </Text>
          </View>
          <Text
            numberOfLines={3}
            style={{color: 'gray', marginTop: 7, width: '80%'}}>
            {item.briefDescription}
          </Text>
        </View>
        <View>
          <Image
            source={{uri: item?.photos[0]}}
            style={{width: 100, height: 100, borderRadius: 10}}
            resizeMode="cover"
          />
        </View>
      </View>
      <View>
        {placeItems?.includes(item?.name) && (
          <>
            {item?.phoneNumber && (
              <View
                style={{
                  marginHorizontal: 8,
                  marginVertical: 3,
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}>
                <Icon name="phone-enabled" size={23} color="black"></Icon>
                <Text style={{fontSize: 14, fontWeight: 500, color: '#00a6cb'}}>
                  {item?.phoneNumber}
                </Text>
              </View>
            )}
            <View
              style={{
                marginHorizontal: 8,
                gap: 8,
                alignItems: 'center',
                flexDirection: 'row',
                marginVertical: 3,
              }}>
              <Ionicons name="time-outline" size={23} color="black" />
              <Text style={{fontSize: 14, fontWeight: 500, color: '#00a6cb'}}>
                Open {item?.openingHours[0]?.split(': ')[1]}
              </Text>
            </View>
            {item?.website && (
              <View
                style={{
                  marginHorizontal: 8,
                  marginVertical: 3,
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}>
                <Icon name="travel-explore" size={23} color="black"></Icon>
                <Text style={{fontSize: 14, fontWeight: 500, color: '#00a6cb'}}>
                  {item?.website}
                </Text>
              </View>
            )}

            {item?.formatted_address && (
              <View
                style={{
                  marginHorizontal: 8,
                  marginVertical: 3,
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}>
                <Icon name="travel-explore" size={23} color="black"></Icon>
                <Text style={{fontSize: 14, fontWeight: 500, color: '#00a6cb'}}>
                  {item?.formatted_address}
                </Text>
              </View>
            )}
            {item?.types && (
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 8,
                  marginBottom: 6,
                  marginTop: 14,
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}>
                {item?.types?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 23,
                      backgroundColor: '#ffa928ff',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 500,
                        color: 'white',
                        fontSize: 13,
                      }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default Place;

const styles = StyleSheet.create({});
