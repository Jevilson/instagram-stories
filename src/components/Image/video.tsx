import React, { FC, memo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { StoryVideoProps } from '../../core/dto/componentsDTO';
import { HEIGHT, WIDTH } from '../../core/constants';

const StoryVideo: FC<StoryVideoProps> = ({
  uri, paused, isActive, onLoad, onLayout, ...props
}) => {

  const ref = useRef<Video>(null);

  const [pausedValue, setPausedValue] = useState(true);

  const start = () => ref.current?.setPositionAsync(0);

  useAnimatedReaction(
    () => paused.value,
    (res, prev) => res !== prev && runOnJS(setPausedValue)(!res),
    [paused.value],
  );

  useAnimatedReaction(
    () => isActive.value,
    (res) => res && runOnJS(start)(),
    [isActive.value],
  );

  return (
    <Video
      ref={ref}
      style={{ width: WIDTH, height: HEIGHT, aspectRatio: 0.5626 }}
      {...props}
      source={{ uri }}
      shouldPlay={true}
      useNativeControls={false}
      isLooping={false}
      onLoad={(status: any) => { onLoad(status.durationMillis)}}
      onLayout={(e: LayoutChangeEvent) => onLayout(e.nativeEvent.layout.height)}
      resizeMode="cover"
    />
  );
};

export default memo(StoryVideo);
