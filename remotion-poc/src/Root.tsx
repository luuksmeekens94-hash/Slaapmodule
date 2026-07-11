import React from 'react';
import {Composition} from 'remotion';
import {CyclesScene} from './scenes/CyclesScene';
import {ForceScene} from './scenes/ForceScene';
import {BreatheScene} from './scenes/BreatheScene';
import {NightScene} from './scenes/NightScene';
import {ClockScene} from './scenes/ClockScene';
import {SunScene} from './scenes/SunScene';
import {RhythmScene} from './scenes/RhythmScene';
import {PressureScene} from './scenes/PressureScene';
import {ForceAnimaticScene} from './scenes/ForceAnimaticScene';
import {ForceFinalScene} from './scenes/ForceFinalScene';
import {SleepSeriesScene, SeriesKind} from './series/SleepSeriesScene';
import seriesContent from '../series-content.json';

const LEGACY = {
  durationInFrames: 900,
  fps: 30,
  width: 1440,
  height: 1080,
} as const;

const SERIES = {
  durationInFrames: 720,
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

const SERIES_FRAMES = Object.fromEntries(
  Object.entries(seriesContent.videos).map(([kind, spec]) => [kind, Math.round(spec.durationSeconds * 30)]),
) as Record<SeriesKind, number>;

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="force" component={ForceFinalScene} {...SERIES} />
      {(Object.keys(SERIES_FRAMES) as SeriesKind[]).map((kind) => (
        <Composition
          key={kind}
          id={kind}
          component={SleepSeriesScene}
          defaultProps={{kind}}
          {...SERIES}
          durationInFrames={SERIES_FRAMES[kind]}
        />
      ))}

      <Composition id="force-legacy" component={ForceScene} {...LEGACY} />
      <Composition id="cycles-legacy" component={CyclesScene} {...LEGACY} />
      <Composition id="breathe-legacy" component={BreatheScene} {...LEGACY} />
      <Composition id="night-legacy" component={NightScene} {...LEGACY} />
      <Composition id="clock-legacy" component={ClockScene} {...LEGACY} />
      <Composition id="sun-legacy" component={SunScene} {...LEGACY} />
      <Composition id="rhythm-legacy" component={RhythmScene} {...LEGACY} />
      <Composition id="pressure-legacy" component={PressureScene} {...LEGACY} />
      <Composition id="force-animatic" component={ForceAnimaticScene} {...SERIES} />
      <Composition id="force-final" component={ForceFinalScene} {...SERIES} />
    </>
  );
};
