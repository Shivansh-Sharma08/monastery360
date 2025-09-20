import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Colors } from '@/constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = Colors.primary[500] 
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const sizeStyles = styles[size];

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <Animated.View style={[animatedStyle]}>
        <View style={[styles.spinner, sizeStyles.spinner, { borderTopColor: color }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.neutral[200],
  },
  
  small: {
    container: {
      width: 24,
      height: 24,
    },
    spinner: {
      width: 24,
      height: 24,
      borderWidth: 2,
    },
  },
  
  medium: {
    container: {
      width: 40,
      height: 40,
    },
    spinner: {
      width: 40,
      height: 40,
      borderWidth: 3,
    },
  },
  
  large: {
    container: {
      width: 56,
      height: 56,
    },
    spinner: {
      width: 56,
      height: 56,
      borderWidth: 4,
    },
  },
});