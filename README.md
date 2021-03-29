# ThreeJS Googly Eyes

Instant Googly Eyes for ThreeJS! Enjoy!

# Examples:

- [Googly Eyes on Suzanne](https://derschmale.github.io/threejs-googly-eyes/example/index.html)

# Usage

GooglyEyes are made to simply create and add to an existing model. Moving/rotating the model will cause the googly eyes
to update correctly when calling the `update` method.

```

// ... (whatever ThreeJS code)

import GooglyEyes from "@derschmale/threejs-googly-eyes";

// metric units are generally assumed
const eyes = new GooglyEyes(0.03, 0.05);
eyes.position.z = 0.1;

someModelThatNeedsGooglyEyes.add(eyes);

// ...

// your game-loop:

eyes.update(1 / 60); // can also pass in a custom timestep using THREE's Clock.


```

# Building

```
npm install
npm run build
```