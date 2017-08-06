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

const maxWidth = Dimensions.get('window').width;

class DetailView extends React.Component {
  state = {
    openProgress: new Animated.Value(0)
  };
  componentDidMount() {
    Animated.timing(this.state.openProgress, {
      toValue: 1,
      duration: 300
    }).start();

    setTimeout(() => {
      this._openingImageRef.measure(
        (destX, destY, destWidth, destHeight, destPageX, destPageY) => {
          console.log({
            destX,
            destY,
            destWidth,
            destHeight,
            destPageX,
            destPageY
          });
        },
        console.error
      );
    });
  }
  render() {
    const { photo, onClose } = this.props;
    const { openProgress } = this.state;
    return (
      <View style={[StyleSheet.absoluteFill, styles.detailView]}>
        <Image
          ref={r => (this._openingImageRef = r)}
          source={photo.source}
          style={{
            width: maxWidth,
            height: 300
          }}
        />
        <Animated.View
          style={[
            styles.body,
            {
              opacity: openProgress,
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

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class PhotoViewer extends React.Component {
  state = {
    photo: null
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
        {photo && <DetailView photo={photo} onClose={this.close} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    lineHeight: 50
  },
  description: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Avenir Next'
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
  },
  detailView: {
    backgroundColor: '#fff'
  }
});
