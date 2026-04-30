import React from 'react';
import { Composition } from 'remotion';
import { CyclesScene } from './scenes/CyclesScene';
import { BreatheScene } from './scenes/BreatheScene';
import { NightScene } from './scenes/NightScene';
import { ClockScene } from './scenes/ClockScene';
import { SunScene } from './scenes/SunScene';
import { RhythmScene } from './scenes/RhythmScene';
import { PressureScene } from './scenes/PressureScene';

const SHARED = {
  durationInFrames: 900, // 30s @ 30fps
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="cycles"   component={CyclesScene}   {...SHARED} />
      <Composition id="breathe"  component={BreatheScene}  {...SHARED} />
      <Composition id="night"    component={NightScene}    {...SHARED} />
      <Composition id="clock"    component={ClockScene}    {...SHARED} />
      <Composition id="sun"      component={SunScene}      {...SHARED} />
      <Composition id="rhythm"   component={RhythmScene}   {...SHARED} />
      <Composition id="pressure" component={PressureScene} {...SHARED} />
    </>
  );
};
