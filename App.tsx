/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import TrackPlayer, {PlaybackState, State} from 'react-native-track-player';
import {setupPlayer, addTracks} from './trackPlayerServices';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const [playbackState, setPlaybackState] = useState<State>(State.Paused);

  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }

      setIsPlayerReady(isSetup);
      TrackPlayer.play();
      setPlaybackState(State.Playing);
    }

    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  async function handlePlayPress() {
    if ((await TrackPlayer.getState()) == State.Playing) {
      TrackPlayer.pause();
      setPlaybackState(State.Paused);
    } else {
      TrackPlayer.play();
      setPlaybackState(State.Playing);
    }
  }

  console.log('playbackState:', playbackState);
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('./images/denge-logo.png')} />

      <Icon.Button
        name={playbackState == State.Playing ? 'pause' : 'play'}
        size={64}
        backgroundColor="transparent"
        onPress={handlePlayPress}
      />

      {playbackState === State.Playing && (
        <Button
          title="Durdur"
          color="#777"
          onPress={() => {
            TrackPlayer.pause();
            setPlaybackState(State.Paused);
          }}
        />
      )}
      {playbackState === State.Paused && (
        <Button
          title="Oynat"
          color="#777"
          onPress={() => {
            TrackPlayer.play();
            setPlaybackState(State.Playing);
          }}
        />
      )}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: 32,
    // paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    backgroundColor: '#112',
  },
});

export default App;
