import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { labelImage } from 'vision-camera-image-labeler';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(TextInput);

export default function App() {
  const [cameraPermission, setCameraPermission] = useState();
  const detectorResult = useSharedValue('');

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  console.log(`Camera permission status: ${cameraPermission}`);

  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const imageLabels = labelImage(frame);

    console.log('Image labels:', imageLabels);
    detectorResult.value = imageLabels[0]?.label;
  }, []);

  const animatedTextProps = useAnimatedProps(
    () => ({ text: detectorResult.value }),
    [detectorResult.value],
  );

  const renderDetectorContent = () => {
    if (cameraDevice && cameraPermission === 'authorized') {
      return (
        <Camera
          style={styles.camera}
          device={cameraDevice}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={3}
        />
      );
    }
    return <ActivityIndicator size="large" color="#1C6758" />;
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.saveArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>React Native Image Detector</Text>
        </View>
      </SafeAreaView>

      <View style={styles.caption}>
        <Text style={styles.captionText}>
          Welcome To React-Native-Vision-Camera Tutorial
        </Text>
      </View>

      {renderDetectorContent()}

      <AnimatedText
        style={styles.detectorValueText}
        animatedProps={animatedTextProps}
        editable={false}
        multiline={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
  },
  saveArea: {
    backgroundColor: '#3D8361',
  },
  header: {
    height: 50,
    backgroundColor: '#3D8361',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  caption: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionText: {
    color: '#100F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    height: 540,
    width: '92%',
    alignSelf: 'center',
  },
  detectorValueText: {
    paddingVertical: 20,
    textAlign: 'center',
    color: '#100F0F',
    fontSize: 24,
  },
});
