import { createLetter } from './letter';
// import { type Config, type Scenario } from 'artillery';

export const config: Config = {
  target: process.env.BASE_URL,
  phases: [
    {
      duration: '5m',
      arrivalCount: 100,
      maxVusers: 10,
    },
  ],
  engines: {
    playwright: {},
  },
};
 
export const scenarios: Scenario[]  = [{
  engine: 'playwright',
  testFunction: createLetter,
}];