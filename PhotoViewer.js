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
    localPhoto: null
  };

  componentWillReceiveProps(nextProps) {
    const { photo } = nextProps;
    if (photo) {
      this.setState({ localPhoto: photo });
    }
  }

  render() {
    const { onClose, openProgress, isAnimating } = this.props;
    const { localPhoto } = this.state;
    if (localPhoto) {
      return (
        <Animated.View
          style={[StyleSheet.absoluteFill]}
          pointerEvents={isAnimating || this.props.photo ? 'auto' : 'none'}
        >
          <Animated.Image
            ref={r => (this._openingImageRef = r)}
            source={localPhoto.source}
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
              - {localPhoto.postedBy}
            </Text>
            <Text style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              opacity: openProgress
            }}
            pointerEvents={isAnimating ? 'none' : 'auto'}
          >
            <TouchableOpacity
              onPress={() => onClose(localPhoto.id)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      );
    }
    return <View />;
  }
}

class Transition extends React.Component {
  state = {
    destinationDimension: {
      width: maxWidth,
      height: 300,
      pageX: 0,
      pageY: 0
    },
    sourceDimension: {
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0
    }
  };

  componentWillReceiveProps(nextProps) {
    const { photo, sourceImageRefs } = nextProps;

    if (photo) {
      const sourceImageRef = sourceImageRefs[photo.id];
      sourceImageRef
        .getNode()
        .measure((soruceX, soruceY, width, height, pageX, pageY) => {
          this.setState({
            sourceDimension: {
              width,
              height,
              pageX,
              pageY
            },
            photo
          });
        });
    }
  }

  render() {
    const { openProgress } = this.props;
    const { destinationDimension, sourceDimension, photo } = this.state;
    if (photo) {
      let destRightDimension = {
        width: 0,
        height: 0,
        pageX: 0,
        pageY: 0
      };
      let openingInitScale = 1;

      const aspectRatio = photo.width / photo.height;
      const screenAspectRatio =
        destinationDimension.width / destinationDimension.height;

      destRightDimension = {
        width: destinationDimension.width,
        height: destinationDimension.height,
        pageX: destinationDimension.pageX,
        pageY: destinationDimension.pageY
      };

      if (aspectRatio - screenAspectRatio > 0) {
        destRightDimension.width = aspectRatio * destRightDimension.height;
        destRightDimension.pageX -=
          (destRightDimension.width - destinationDimension.width) / 2;
      } else {
        destRightDimension.height = destRightDimension.width / aspectRatio;
        destRightDimension.pageY -=
          (destRightDimension.height - destinationDimension.height) / 2;
      }

      const translateInitX = sourceDimension.pageX + sourceDimension.width / 2;
      const translateInitY = sourceDimension.pageY + sourceDimension.height / 2;
      const translateDestX =
        destRightDimension.pageX + destRightDimension.width / 2;
      const translateDestY =
        destRightDimension.pageY + destRightDimension.height / 2;

      openingInitTranslateX = translateInitX - translateDestX;
      openingInitTranslateY = translateInitY - translateDestY;

      openingInitScale = sourceDimension.width / destRightDimension.width;

      return (
        <Animated.Image
          source={photo.source}
          style={{
            backgroundColor: 'green',
            position: 'absolute',
            width: destRightDimension.width,
            height: destRightDimension.height,
            left: destRightDimension.pageX,
            top: destRightDimension.pageY,
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
        />
      );
    }
    return <View />;
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
    photo: null,
    openProgress: new Animated.Value(0),
    isAnimating: false
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
    this._imageOpacitySetters[photo.id](
      this.state.openProgress.interpolate({
        inputRange: [0.005, 0.01],
        outputRange: [1, 0]
      })
    );
    this.setState({ photo, isAnimating: true }, () => {
      Animated.timing(this.state.openProgress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        this.setState({ isAnimating: false });
      });
    });
  };

  close = photoId => {
    this.setState({ photo: null, isAnimating: true }, () => {
      Animated.timing(this.state.openProgress, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        this._imageOpacitySetters[photoId](1);
        this.setState({ isAnimating: false });
      });
    });
  };

  render() {
    const { photo, openProgress, isAnimating } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.props.renderContent({ onPhotoOpen: this.open })}
        <Transition
          openProgress={openProgress}
          photo={photo}
          sourceImageRefs={this._images}
          isAnimating={isAnimating}
        />
        <DetailView
          photo={photo}
          onClose={this.close}
          openProgress={openProgress}
          isAnimating={isAnimating}
        />
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
