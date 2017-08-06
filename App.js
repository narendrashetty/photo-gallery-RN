import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions
} from 'react-native';
import PHOTOS from './src/data';
import { processImages, buildRows, normalizeRows } from './src/utils';

const maxWidth = Dimensions.get('window').width;

const Item = ({ item }) =>
  <Image
    source={{ uri: item.url }}
    style={{
      width: item.width,
      height: item.height
    }}
  />;

export default class App extends React.Component {
  componentWillMount() {
    const processedImages = processImages(PHOTOS);
    let rows = buildRows(processedImages, maxWidth);
    rows = normalizeRows(rows, maxWidth);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows(rows)
    };
  }

  renderRow = row =>
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between'
      }}
    >
      {row.map(item => <Item item={item} key={item.id} />)}
    </View>;

  render() {
    return (
      <ListView dataSource={this.state.dataSource} renderRow={this.renderRow} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
