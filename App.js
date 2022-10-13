import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const App = () => {
  const [cameraPermission, setCameraPermission] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  console.log(`Re-rendering Navigator. Camera: ${cameraPermission}`);

  const devices = useCameraDevices();
  const device = devices.back;

  return (
    <View style={styles.container}>
      {device && cameraPermission === 'authorized' ? (
        <Camera style={styles.camera} device={device} isActive={true} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});

export default App;
