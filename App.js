import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { AutoFocus, Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import TitleBar from './components/TitleBar';

import * as MediaLibrary from 'expo-media-library';

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requestion permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 36000,
      mute: false
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };
// define the function to save the video to the media library
    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
       
        <Video // display the video on loop with sound on
          style={styles.video}
          source={{uri: video.uri}}
          useNativeControls
          resizeMode="contain"
          isLooping         
        />        
        <TouchableOpacity style={styles.btn} onPress={shareVideo}><Text>Share</Text></TouchableOpacity> 
        {hasMediaLibraryPermission ? <TouchableOpacity style={styles.btn} onPress={saveVideo} ><Text>Save</Text></TouchableOpacity> : undefined}
        <TouchableOpacity style={styles.btn} onPress={() => setVideo(undefined)} ><Text>Delete</Text></TouchableOpacity>
        <Text> </Text>
      </SafeAreaView>
    );
  }

  return (   
    
    <Camera style={styles.container} ref={cameraRef}>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={isRecording ? stopRecording : recordVideo} >
      <TitleBar title="DashCam Extra" />
        <Text style={styles.emoji}>{isRecording ? "🟥" : "🔴"}</Text>
      </TouchableOpacity>         
    </View>
  </Camera>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",    
  },
  btn: {
    backgroundColor: "#999999",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: "90%",
    alignItems: "center",     
  },
  buttonContainer: {
    backgroundColor: "#FFFFFF99",
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    justifyContent: "space-around",
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  },
  emoji: {
    textAlign: "center",
    fontSize: 48,
    marginBottom: 20,    
  }
});