import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import PHOTOS from './src/data';
const Item = ({ item }) =>
  <Image source={{ uri: item.url }} style={{ width: 200, height: 200 }} />;

export default class App extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        {PHOTOS.map(photo => <Item key={photo.id} item={photo} />)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
