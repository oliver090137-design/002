/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { GameCanvas } from './components/GameCanvas';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {isPlaying ? (
        <GameCanvas />
      ) : (
        <LandingPage onPlay={() => setIsPlaying(true)} />
      )}
    </>
  );
}
