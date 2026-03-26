/**
 * SmartKids Learning App - Animated Progress Bar
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

const ProgressBar = ({
  progress = 0,
  total = 100,
  height = 12,
  color = Colors.primary,
  backgroundColor = Colors.border,
  showLabel = false,
  labelStyle,
  style,
  animated = true,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const percent = Math.min(Math.max((progress / total) * 100, 0), 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: percent,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(percent);
    }
  }, [percent]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      {showLabel && (
        <Text style={[styles.label, labelStyle]}>{Math.round(percent)}%</Text>
      )}
      <View style={[styles.track, { height, backgroundColor, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              height,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'right',
  },
});

export default ProgressBar;
