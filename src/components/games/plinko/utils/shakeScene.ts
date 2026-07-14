import type { Engine } from 'matter-js';
import { Body, Common, Composite } from 'matter-js';

export const shakeScene = function (engine: Engine) {
  const timeScale = 1000 / 60 / engine.timing.lastDelta;
  const bodies = Composite.allBodies(engine.world);

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];

    if (!body.isStatic) {
      const forceMagnitude = 0.03 * body.mass * timeScale;

      const x =
        (forceMagnitude + Common.random() * forceMagnitude) *
        Common.choose([1, -1]);

      const y = -forceMagnitude + Common.random() * -forceMagnitude;

      Body.applyForce(body, body.position, {
        x: x * 0.005,
        y: y * 0.005,
      });
    }
  }
};
