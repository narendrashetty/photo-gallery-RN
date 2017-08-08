import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native';

import PropTypes from 'prop-types';

const maxWidth = Dimensions.get('window').width;
const maxHeight = Dimensions.get('window').height;

class DetailView extends React.Component {
  state = {
    openProgress: new Animated.Value(0),
    openMeasurements: null
  };
  animationComplete = false;

  componentDidUpdate(lastProps, lastState) {
    if (!lastState.openMeasurements && this.state.openMeasurements) {
      Animated.timing(this.state.openProgress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true
      }).start(() => {
        this.animationComplete = true;
      });
    }
  }

  componentDidMount() {
    this.props.sourceImageOpacity(
      this.state.openProgress.interpolate({
        inputRange: [0.005, 0.01, 0.99, 1],
        outputRange: [1, 0, 0, 1]
      })
    );
    setTimeout(() => {
      this._openingImageRef
        .getNode()
        .measure(
          (destX, destY, destWidth, destHeight, destPageX, destPageY) => {
            this.props.sourceImageRef
              .getNode()
              .measure(
                (
                  soruceX,
                  soruceY,
                  sourceWidth,
                  sourceHeight,
                  sourcePageX,
                  sourcePageY
                ) => {
                  this.setState({
                    openMeasurements: {
                      soruceX,
                      soruceY,
                      sourceWidth,
                      sourceHeight,
                      sourcePageX,
                      sourcePageY,
                      destX,
                      destY,
                      destWidth,
                      destHeight,
                      destPageX,
                      destPageY
                    }
                  });
                },
                console.error
              );
          },
          console.error
        );
    });
  }
  render() {
    const { photo, onClose } = this.props;
    const { openProgress, openMeasurements } = this.state;

    let openingEndScale = 0;
    let maxDim = 0;

    const aspectRatio = photo.width / photo.height;
    const screenAspectRatio = maxWidth / 300;

    if (openMeasurements) {
      let translateInitY =
        openMeasurements.sourcePageY + openMeasurements.sourceHeight / 2;
      let translateDestY =
        openMeasurements.destPageY + openMeasurements.destHeight / 2;
      let translateInitX =
        openMeasurements.sourcePageX + openMeasurements.sourceWidth / 2;
      let translateDestX =
        openMeasurements.destPageX + openMeasurements.destWidth / 2;

      if (aspectRatio - screenAspectRatio > 0) {
        console.log('hello');
        dh = openMeasurements.destHeight;
        dw = aspectRatio * dh;
        openingInitScale = openMeasurements.sourceWidth / dw;

        maxW = (dw - openMeasurements.destWidth) / 2;

        translateDestX = openMeasurements.destPageX + dw / 2;

        endX =
          openMeasurements.destPageX - (dw - openMeasurements.destWidth) / 2;
        endY = openMeasurements.destPageY;
        translateDestX = endX + dw / 2;
      } else {
        dw = openMeasurements.destWidth;
        dh = dw / aspectRatio;
        openingInitScale = openMeasurements.sourceWidth / dw;

        translateDestY = openMeasurements.destPageY + dh / 2;

        endX = openMeasurements.destPageX;
        endY =
          openMeasurements.destPageY - (dh - openMeasurements.destHeight) / 2;
        translateDestY = endY + dh / 2;
      }
      openingInitTranslateX = translateInitX - translateDestX;
      openingInitTranslateY = translateInitY - translateDestY;
    }

    return (
      <Animated.View style={[StyleSheet.absoluteFill, {}]}>
        <Animated.Image
          ref={r => (this._openingImageRef = r)}
          source={photo.source}
          style={{
            width: maxWidth,
            height: 300,
            opacity: openProgress.interpolate({
              inputRange: [0, 0.99, 0.995],
              outputRange: [0, 0, 1]
            })
          }}
        />
        <Animated.View
          style={[
            styles.body,
            {
              zIndex: 10,
              opacity: openProgress,
              backgroundColor: '#fff',
              transform: [
                {
                  translateY: openProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.title}>
            - {photo.postedBy}
          </Text>
          <Text style={styles.description}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
        </Animated.View>

        {openMeasurements &&
          <Animated.Image
            source={photo.source}
            style={{
              backgroundColor: 'green',
              position: 'absolute',
              width: dw,
              height: dh,
              left: endX,
              top: endY,
              opacity: openProgress.interpolate({
                inputRange: [0, 0.005, 0.995, 1],
                outputRange: [0, 1, 1, 0]
              }),
              transform: [
                {
                  translateX: openProgress.interpolate({
                    inputRange: [0.01, 0.99],
                    outputRange: [openingInitTranslateX, 0]
                  })
                },
                {
                  translateY: openProgress.interpolate({
                    inputRange: [0.01, 0.99],
                    outputRange: [openingInitTranslateY, 0]
                  })
                },
                {
                  scale: openProgress.interpolate({
                    inputRange: [0.01, 0.99],
                    outputRange: [openingInitScale, 1]
                  })
                }
              ]
            }}
          />}

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

class PhotoViewerPhoto extends React.Component {
  state = {
    opacity: 1
  };

  static contextTypes = {
    onImageRef: PropTypes.func
  };

  setOpacity = opacity => {
    this.setState({ opacity });
  };

  render() {
    const { style, photo } = this.props;
    const { opacity } = this.state;
    return (
      <Animated.Image
        ref={i => {
          this.context.onImageRef(photo, i, this.setOpacity);
        }}
        style={[
          style,
          {
            opacity
          }
        ]}
        source={photo.source}
      />
    );
  }
}

export default class PhotoViewer extends React.Component {
  static Photo = PhotoViewerPhoto;

  state = {
    photo: null
  };

  _images = {};

  _imageOpacitySetters = {};

  static childContextTypes = {
    onImageRef: PropTypes.func
  };

  getChildContext() {
    return { onImageRef: this._onImageRef };
  }

  _onImageRef = (photo, imageRef, setOpacity) => {
    this._images[photo.id] = imageRef;
    this._imageOpacitySetters[photo.id] = setOpacity;
  };

  open = photo => {
    this.setState({ photo });
  };

  close = () => {
    this.setState({
      photo: null
    });
  };

  render() {
    const { photo } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.props.renderContent({ onPhotoOpen: this.open })}
        {photo &&
          <DetailView
            sourceImageRef={this._images[photo.id]}
            sourceImageOpacity={this._imageOpacitySetters[photo.id]}
            photo={photo}
            onClose={this.close}
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    // fontFamily: 'Avenir Next',
    lineHeight: 50
  },
  description: {
    color: '#333',
    fontSize: 14
    // fontFamily: 'Avenir Next'
  },
  body: { flex: 1, padding: 15 },
  closeText: { color: 'white', backgroundColor: 'transparent' },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 20,
    left: 20,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'white',
    borderRadius: 5
  }
});
