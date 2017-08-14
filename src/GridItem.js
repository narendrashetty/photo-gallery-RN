import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PhotoGallery from './PhotoGallery';

const Item = ({ item, onPhotoOpen }) =>
  <TouchableWithoutFeedback onPress={() => onPhotoOpen(item)}>
    <View>
      <PhotoGallery.Photo
        photo={item}
        style={{
          width: item.width,
          height: item.height
        }}
      />
    </View>
  </TouchableWithoutFeedback>;

export default Item;
