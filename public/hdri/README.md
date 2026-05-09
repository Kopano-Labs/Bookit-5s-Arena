# HDRI / environment maps

The home hero **no longer** loads `@react-three/drei` `<Environment preset="…" />`, because those presets **fetch** HDRIs from **raw.githack.com**, which is blocked by strict **CSP `connect-src`** on production and was causing **WebGL context loss**.

Lighting is handled with **ambient + hemisphere + directional + point** lights instead.

Optional: to bring back image-based lighting without third-party `fetch`, add `public/hdri/potsdamer_platz_1k.hdr` and use:

```jsx
import { Environment } from "@react-three/drei";
<Environment files="/hdri/potsdamer_platz_1k.hdr" environmentIntensity={0.3} />
```

Fetch once:

```bash
curl -fsSL -o public/hdri/potsdamer_platz_1k.hdr \
  "https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr"
```

`next.config.ts` still allows `https://raw.githack.com` for any other libraries that need it.
