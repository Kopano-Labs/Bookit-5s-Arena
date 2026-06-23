"use client";

import { Component } from "react";

/**
 * Isolates Three.js / drei failures (e.g. HDR fetch blocked by CSP, WebGL context loss)
 * so the rest of the homepage still renders.
 */
export default class Hero3DErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("[Hero3D] Scene disabled:", error?.message || error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

