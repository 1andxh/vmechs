<!--
	Renders the scene as an ink drawing, like a technical illustration.

	Pass 1 draws every mesh into an off-screen target, storing per pixel the
	surface's direction (its normal) and its depth, instead of a colour.
	Pass 2 runs over the screen and compares each pixel with its neighbours:
	  - a jump in depth means one part is in front of another: a silhouette,
	    drawn with the heavy line;
	  - a sharp turn in surface direction is a crease on a part, drawn with
	    the fine line.
	Lines come from the surfaces themselves, so they are continuous and keep
	one weight per kind, at any model detail. A mesh with `userData.ink` set,
	or inside a group with it set, is drawn in the accent colour.

	Section cut: meshes with `userData.section` set are cut open by the plane
	z = sectionZ (everything in front of it is removed). Looking into a cut
	solid you see its inside, which faces away from the camera; those pixels
	are drawn as the cut face instead (facing the camera, at their own depth,
	so uncut near faces still hide them), and hatched at 45°, the drawing
	convention for a cut surface. The solids must be closed for this to work.

	Shade hatching: surfaces turned away from a light at the upper left get fine
	lines on the other diagonal (−45°), and the darkest are cross-hatched, so the
	form reads without any fill colour.

	Pass 3 draws the gas flow (objects on FLOW_LAYER) on top, with its own
	colours; it reads pass 1's depth to hide behind parts (see v8/flow.ts).

	Drop it inside a <Canvas>; it takes over rendering while mounted.
-->
<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import { FLOW_LAYER, getFlow } from './v8/flow.ts';
	import {
		Color,
		DepthTexture,
		DoubleSide,
		Mesh,
		Object3D,
		OrthographicCamera,
		PlaneGeometry,
		Scene,
		ShaderMaterial,
		WebGLRenderTarget,
		type PerspectiveCamera,
		type WebGLRenderer
	} from 'three';

	let {
		ink = '#f4efe6',
		accent = '#ffb46e',
		paper = '#0a0a0b',
		sectionZ = -1000
	}: {
		ink?: string;
		accent?: string;
		paper?: string;
		/** The section plane's z; parts flagged `section` are removed in front of it. */
		sectionZ?: number;
	} = $props();

	const threlte = useThrelte();
	const renderer = threlte.renderer as WebGLRenderer;
	const { scene, camera, size, dpr, autoRender, renderStage, invalidate } = threlte;

	// ---- pass 1: normals (rgb) + flags (a), with a depth texture ----
	// a = (2 × accent + cut face) / 3: 0 plain, ⅓ cut face, ⅔ accent, 1 both
	const target = new WebGLRenderTarget(1, 1, { samples: 4, depthTexture: new DepthTexture(1, 1) });
	const flow = getFlow();
	flow.tDepth.value = target.depthTexture;
	const normals = new ShaderMaterial({
		side: DoubleSide,
		uniforms: {
			uInk: { value: 0 },
			uSection: { value: 0 },
			uSectionZ: { value: -1000 }
		},
		vertexShader: /* glsl */ `
			varying vec3 vNormal;
			varying vec3 vWorld;
			void main() {
				vec4 world = modelMatrix * vec4(position, 1.0);
				vWorld = world.xyz;
				vNormal = normalize(normalMatrix * normal);
				gl_Position = projectionMatrix * viewMatrix * world;
			}`,
		fragmentShader: /* glsl */ `
			uniform float uInk;
			uniform float uSection;
			uniform float uSectionZ;
			varying vec3 vNormal;
			varying vec3 vWorld;
			void main() {
				bool sectioned = uSection > 0.5;
				if (sectioned && vWorld.z < uSectionZ) discard;
				vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
				float cut = 0.0;
				if (sectioned && !gl_FrontFacing) {
					// The inside of a cut solid: draw it as the cut face, facing the
					// camera. It keeps its own depth, so where the solid isn't cut open
					// its near faces still hide it.
					n = -normalize(mat3(viewMatrix) * vec3(0.0, 0.0, 1.0));
					cut = 1.0;
				}
				gl_FragColor = vec4(n * 0.5 + 0.5, (2.0 * uInk + cut) / 3.0);
			}`
	});
	// Per mesh, before it's drawn: pass its flags to the shared material. A flag
	// set on a group applies to everything inside it.
	const flagged = (o: Object3D | null, key: string): boolean =>
		!!o && (!!o.userData[key] || flagged(o.parent, key));
	normals.onBeforeRender = (_r, _s, _c, _g, object) => {
		normals.uniforms.uInk.value = flagged(object, 'ink') ? 1 : 0;
		normals.uniforms.uSection.value = flagged(object, 'section') ? 1 : 0;
		normals.uniformsNeedUpdate = true;
	};

	// ---- pass 2: find the lines ----
	const lines = new ShaderMaterial({
		transparent: true,
		depthTest: false,
		depthWrite: false,
		uniforms: {
			tNormal: { value: target.texture },
			tDepth: { value: target.depthTexture },
			uTexel: { value: [1, 1] },
			uPx: { value: 1 },
			uWeight: { value: 1 },
			uNear: { value: 0.1 },
			uFar: { value: 1000 },
			uInk: { value: new Color() },
			uAccent: { value: new Color() },
			uPaper: { value: new Color() }
		},
		vertexShader: /* glsl */ `
			varying vec2 vUv;
			void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
		fragmentShader: /* glsl */ `
			uniform sampler2D tNormal;
			uniform sampler2D tDepth;
			uniform vec2 uTexel;  // one device pixel in uv
			uniform float uPx;    // device pixels per CSS pixel
			uniform float uWeight; // thinner lines when the drawing is small
			uniform float uNear;
			uniform float uFar;
			uniform vec3 uInk;
			uniform vec3 uAccent;
			uniform vec3 uPaper;
			varying vec2 vUv;

			float viewZ(vec2 uv) {
				float d = texture2D(tDepth, uv).x;
				return (uNear * uFar) / ((uFar - uNear) * d - uFar);
			}
			vec3 nrm(vec2 uv) { return texture2D(tNormal, uv).xyz * 2.0 - 1.0; }

			// Silhouettes: a bend in depth, not just a change. Across a flat
			// surface depth changes steadily, even one seen at a slant, so
			// (ahead + behind - 2 × here) is ~0; at a step between parts it isn't.
			float bend(vec2 uv, vec2 o, float z) {
				return abs(-viewZ(uv + o) - viewZ(uv - o) - 2.0 * z);
			}
			float silhouette(vec2 uv, float r) {
				float z = -viewZ(uv);
				vec2 o = uTexel * r;
				float m = max(
					max(bend(uv, vec2(o.x, 0.0), z), bend(uv, vec2(0.0, o.y), z)),
					max(bend(uv, o, z), bend(uv, vec2(o.x, -o.y), z))
				);
				return smoothstep(0.006, 0.016, m / max(z, 0.001));
			}
			// Creases: how sharply the surface turns between neighbours.
			float crease(vec2 uv, float r) {
				vec3 n = nrm(uv);
				vec2 o = uTexel * r;
				float m = 0.0;
				m = max(m, 1.0 - dot(n, nrm(uv + vec2(o.x, 0.0))));
				m = max(m, 1.0 - dot(n, nrm(uv - vec2(o.x, 0.0))));
				m = max(m, 1.0 - dot(n, nrm(uv + vec2(0.0, o.y))));
				m = max(m, 1.0 - dot(n, nrm(uv - vec2(0.0, o.y))));
				return smoothstep(0.18, 0.4, m);
			}
			// flags in alpha: (2 × accent + cut face) / 3
			float accentAt(vec2 uv) { return step(0.5, texture2D(tNormal, uv).a); }
			float cutAt(vec2 uv) { return mod(floor(texture2D(tNormal, uv).a * 3.0 + 0.5), 2.0); }
			float accentNear(vec2 uv, float r) {
				vec2 o = uTexel * r;
				return max(max(accentAt(uv), accentAt(uv + o)),
					max(accentAt(uv - o), max(accentAt(uv + vec2(o.x, -o.y)), accentAt(uv + vec2(-o.x, o.y)))));
			}
			// 45° hatching on cut faces, in screen space like a drawn section
			float hatch(vec2 uv) {
				float spacing = 7.0 * uPx * uWeight;
				float along = fract((gl_FragCoord.x + gl_FragCoord.y) / spacing);
				float gap = min(along, 1.0 - along) * spacing; // device px to the nearest line
				return cutAt(uv) * (1.0 - smoothstep(0.4 * uPx, 1.1 * uPx, gap));
			}

			// Lines of one direction (+1: 45°, −1: −45°), spacing device px apart.
			float lines(float dir, float spacing) {
				float along = fract((gl_FragCoord.x + dir * gl_FragCoord.y) / spacing);
				float gap = min(along, 1.0 - along) * spacing;
				return 1.0 - smoothstep(0.3 * uPx, 0.8 * uPx, gap);
			}
			// Shade hatching, as in a technical illustration: surfaces turned away
			// from a light at the upper left get fine lines on the other diagonal
			// from the cut faces; the darkest ones are cross-hatched.
			float shade(vec2 uv) {
				if (texture2D(tDepth, uv).x >= 1.0 || cutAt(uv) > 0.5) return 0.0;
				float lit = dot(normalize(nrm(uv)), normalize(vec3(-0.45, 0.75, 0.5)));
				float spacing = 5.0 * uPx * uWeight;
				float away = 1.0 - smoothstep(-0.05, 0.12, lit);
				float darkest = 1.0 - smoothstep(-0.5, -0.32, lit);
				return max(lines(-1.0, spacing) * away, lines(1.0, spacing) * darkest);
			}

			bool empty(vec2 uv) { return texture2D(tDepth, uv).x >= 1.0; }

			void main() {
				// weights in CSS pixels, so lines look the same on any screen density
				float r = 0.9 * uPx * uWeight;

				// Most of the screen is empty background. If this pixel and every
				// sample the line search reads (creases at r/2, silhouettes at r)
				// are background, there's nothing to draw: leave the pixel as it is.
				vec2 h = uTexel * r * 0.5;
				vec2 f = uTexel * r;
				if (empty(vUv)
					&& empty(vUv + vec2(h.x, 0.0)) && empty(vUv - vec2(h.x, 0.0))
					&& empty(vUv + vec2(0.0, h.y)) && empty(vUv - vec2(0.0, h.y))
					&& empty(vUv + vec2(f.x, 0.0)) && empty(vUv - vec2(f.x, 0.0))
					&& empty(vUv + vec2(0.0, f.y)) && empty(vUv - vec2(0.0, f.y))
					&& empty(vUv + f) && empty(vUv - f)
					&& empty(vUv + vec2(f.x, -f.y)) && empty(vUv + vec2(-f.x, f.y))) discard;

				float heavy = silhouette(vUv, r);
				// Behind a cut face lie walls at different depths; no lines between
				// them, only where the cut face meets something else.
				vec2 o = uTexel * r;
				float allCut = cutAt(vUv) * cutAt(vUv + vec2(o.x, 0.0)) * cutAt(vUv - vec2(o.x, 0.0))
					* cutAt(vUv + vec2(0.0, o.y)) * cutAt(vUv - vec2(0.0, o.y))
					* cutAt(vUv + o) * cutAt(vUv - o) * cutAt(vUv + vec2(o.x, -o.y)) * cutAt(vUv + vec2(-o.x, o.y));
				heavy *= 1.0 - allCut;
				float fine = crease(vUv, 0.5 * uPx * uWeight) * 0.7;
				float line = max(max(heavy, fine), max(hatch(vUv) * 0.5, shade(vUv) * 0.32));
				bool solid = texture2D(tDepth, vUv).x < 1.0;
				vec3 color = mix(uInk, uAccent, accentNear(vUv, 1.3 * uPx));
				// paper inside the engine (so parts hide the ones behind), clear outside
				float alpha = max(line, solid ? 1.0 : 0.0);
				gl_FragColor = vec4(mix(uPaper, color, line), alpha);
				#include <colorspace_fragment>
			}`
	});
	const quad = new Mesh(new PlaneGeometry(2, 2), lines);
	const screen = new Scene().add(quad);
	const screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

	$effect(() => {
		normals.uniforms.uSectionZ.value = sectionZ;
		invalidate();
	});

	$effect(() => {
		lines.uniforms.uInk.value.set(ink);
		lines.uniforms.uAccent.value.set(accent);
		lines.uniforms.uPaper.value.set(paper);
		invalidate();
	});

	$effect(() => {
		const { width, height } = $size;
		const ratio = $dpr;
		const w = Math.max(1, Math.floor(width * ratio));
		const h = Math.max(1, Math.floor(height * ratio));
		// Anti-aliasing for the first pass: 4 samples per pixel, or 2 on
		// high-density screens, where edges are already fine and fill rate counts.
		const samples = ratio >= 2 ? 2 : 4;
		if (target.samples !== samples) {
			target.samples = samples;
			target.dispose(); // reallocated at the new sample count on next use
		}
		target.setSize(w, h);
		lines.uniforms.uTexel.value = [1 / w, 1 / h];
		flow.uTexel.value = [1 / w, 1 / h];
		lines.uniforms.uPx.value = ratio;
		// Full weight from 1000 CSS px wide; down to 65% on a phone, where the
		// engine is drawn much smaller and a full-weight line would swamp it.
		lines.uniforms.uWeight.value = 0.65 + 0.35 * Math.min(1, Math.max(0, (width - 400) / 600));
		invalidate();
	});

	autoRender.set(false);
	onDestroy(() => {
		autoRender.set(true);
		target.dispose();
		normals.dispose();
		lines.dispose();
		quad.geometry.dispose();
	});

	useTask(
		() => {
			const cam = camera.current as PerspectiveCamera;
			lines.uniforms.uNear.value = cam.near;
			lines.uniforms.uFar.value = cam.far;
			flow.uNear.value = cam.near;
			flow.uFar.value = cam.far;

			const previous = scene.overrideMaterial;
			scene.overrideMaterial = normals;
			renderer.setRenderTarget(target);
			renderer.setClearColor(0x000000, 0);
			renderer.clear();
			renderer.render(scene, cam);
			scene.overrideMaterial = previous;

			renderer.setRenderTarget(null);
			renderer.clear();
			renderer.render(screen, screenCamera);

			// pass 3: the gas flow, over the drawing (no clear in between)
			const autoClear = renderer.autoClear;
			renderer.autoClear = false;
			cam.layers.set(FLOW_LAYER);
			renderer.render(scene, cam);
			cam.layers.set(0);
			renderer.autoClear = autoClear;
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
