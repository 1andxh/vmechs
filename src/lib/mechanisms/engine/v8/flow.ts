/**
 * Gas flow drawn over the ink drawing: moving streaks down the middle of the
 * pipes, in the lesson's gas colours. Shared state lives in a context that
 * V8Canvas creates: InkRenderer fills in the scene's depth (so a streak can
 * hide behind parts in front of its pipe), the scene sets how far the gas
 * has moved, and each FlowLine's material reads both.
 */
import { createContext } from 'svelte';
import { Color, ShaderMaterial, type DepthTexture } from 'three';

/** The lesson's gas colours (src/app.css: --intake, --exhaust). */
export const GAS = { intake: '#6fa8dc', exhaust: '#a495d6' };

/** Flow is drawn in its own pass: only objects on this layer. */
export const FLOW_LAYER = 1;

export interface FlowShared {
	tDepth: { value: DepthTexture | null };
	uTexel: { value: [number, number] };
	uNear: { value: number };
	uFar: { value: number };
	/** How far the gas has moved, in scene units (flowShift). */
	uShift: { value: number };
}

export const createFlowShared = (): FlowShared => ({
	tDepth: { value: null },
	uTexel: { value: [1, 1] },
	uNear: { value: 0.1 },
	uFar: { value: 1000 },
	uShift: { value: 0 }
});

export const [getFlow, setFlow] = createContext<FlowShared>();

/**
 * Streaks along a tube whose `aDist` attribute is the distance along its path.
 * Each streak is brightest at its head, so the direction reads. A streak is
 * hidden only behind something clearly in front of it, more than a pipe's
 * thickness, so it shows through its own pipe but not through the block.
 */
export function flowMaterial(shared: FlowShared, color: string): ShaderMaterial {
	return new ShaderMaterial({
		transparent: true,
		depthTest: false,
		depthWrite: false,
		uniforms: { ...shared, uColor: { value: new Color(color) }, uSpacing: { value: 1.3 } },
		vertexShader: /* glsl */ `
			attribute float aDist;
			varying float vDist;
			varying float vViewZ;
			void main() {
				vec4 view = modelViewMatrix * vec4(position, 1.0);
				vDist = aDist;
				vViewZ = -view.z;
				gl_Position = projectionMatrix * view;
			}`,
		fragmentShader: /* glsl */ `
			uniform sampler2D tDepth;
			uniform vec2 uTexel;
			uniform float uNear;
			uniform float uFar;
			uniform float uShift;
			uniform float uSpacing;
			uniform vec3 uColor;
			varying float vDist;
			varying float vViewZ;
			void main() {
				float phase = fract((vDist - uShift) / uSpacing);
				float streak = smoothstep(0.0, 0.55, phase) * (1.0 - smoothstep(0.55, 0.62, phase));
				float d = texture2D(tDepth, gl_FragCoord.xy * uTexel).x;
				float sceneZ = -(uNear * uFar) / ((uFar - uNear) * d - uFar);
				float shown = 1.0 - smoothstep(0.5, 0.9, vViewZ - sceneZ);
				float a = streak * shown;
				if (a < 0.01) discard;
				gl_FragColor = vec4(uColor, a);
				#include <colorspace_fragment>
			}`
	});
}
