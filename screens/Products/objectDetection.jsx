import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import axios from 'axios';

const ProductDetectionCamera = () => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(true);
  const [detectedProduct, setDetectedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const imageQueue = useRef([]);

  // Replace with your local Flask server IP
  const FLASK_API_URL = 'http://10.0.2.2:5000/predict'; // Change this

  useEffect(() => {
    const checkPermissions = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
      setIsActive(true);
    };

    checkPermissions();
  }, [hasPermission]);

  const captureFrame = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
        skipMetadata: true
      });

      const imageUri = `file://${photo.path}`;

      if (imageQueue.current.length >= 4) {
        imageQueue.current.shift();
      }
      imageQueue.current.push(imageUri);
    } catch (error) {
      console.error('Frame capture failed:', error);
    }
  };

  const processImages = async () => {
    if (imageQueue.current.length < 4 || isProcessing) return;
  
    setIsProcessing(true);
  
    try {
      const imageUri = imageQueue.current[imageQueue.current.length - 1];
  
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpeg",
      });
  
      const response = await fetch(FLASK_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const result = await response.json();
      console.log("Flask API Response:", result);
  
      if (result.data) {
        setDetectedProduct(result.data.filename || "Unknown Object");
      } else {
        setDetectedProduct("No object detected");
      }
    } catch (error) {
      console.error("Detection failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  useEffect(() => {
    const frameCaptureInterval = setInterval(() => {
      captureFrame();
    }, 1000);

    const detectionInterval = setInterval(() => {
      processImages();
    }, 4000);

    return () => {
      clearInterval(frameCaptureInterval);
      clearInterval(detectionInterval);
    };
  }, []);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />

      {detectedProduct && (
        <View style={styles.detectionBox}>
          <Text style={styles.detectionText}>Detected: {detectedProduct}</Text>
        </View>
      )}

      {isProcessing && (
        <View style={styles.processingIndicator}>
          <ActivityIndicator color="white" size="large" />
          <Text style={styles.processingText}>Analyzing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  detectionBox: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  detectionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingIndicator: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  processingText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProductDetectionCamera;
