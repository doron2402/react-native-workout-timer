import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
}

const BackButton = ({ onPress, color = 'white' }: BackButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.replace('/');
    }
  };

  return (
    <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
      <AntDesign name="arrowleft" size={24} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default BackButton;