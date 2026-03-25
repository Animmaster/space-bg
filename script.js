const defaultColors = ['#ffffff', '#ffffff', '#ffffff']
const hexToRgb = hex => {
	hex = String(hex).replace(/^#/, '')
	if (hex.length === 3)
		hex = hex
			.split('')
			.map(c => c + c)
			.join('')
	const int = parseInt(hex, 16)
	return [
		((int >> 16) & 255) / 255,
		((int >> 8) & 255) / 255,
		(int & 255) / 255,
	]
}
const num = (v, fallback) => {
	const n = Number(v)
	return Number.isFinite(n) ? n : fallback
}
const bool = (v, fallback) => {
	if (v == null) return fallback
	const s = String(v).toLowerCase()
	if (s === 'true') return true
	if (s === 'false') return false
	return fallback
}
const mat4Identity = out => {
	out[0] = 1
	out[1] = 0
	out[2] = 0
	out[3] = 0
	out[4] = 0
	out[5] = 1
	out[6] = 0
	out[7] = 0
	out[8] = 0
	out[9] = 0
	out[10] = 1
	out[11] = 0
	out[12] = 0
	out[13] = 0
	out[14] = 0
	out[15] = 1
	return out
}
const mat4Perspective = (out, fovy, aspect, near, far) => {
	const f = 1 / Math.tan(fovy / 2)
	out[0] = f / aspect
	out[1] = 0
	out[2] = 0
	out[3] = 0
	out[4] = 0
	out[5] = f
	out[6] = 0
	out[7] = 0
	out[8] = 0
	out[9] = 0
	out[11] = -1
	out[12] = 0
	out[13] = 0
	out[15] = 0
	if (far !== Infinity) {
		const nf = 1 / (near - far)
		out[10] = (far + near) * nf
		out[14] = 2 * far * near * nf
	} else {
		out[10] = -1
		out[14] = -2 * near
	}
	return out
}
const mat4Translate = (out, a, v) => {
	const x = v[0],
		y = v[1],
		z = v[2]
	if (out !== a) {
		out[0] = a[0]
		out[1] = a[1]
		out[2] = a[2]
		out[3] = a[3]
		out[4] = a[4]
		out[5] = a[5]
		out[6] = a[6]
		out[7] = a[7]
		out[8] = a[8]
		out[9] = a[9]
		out[10] = a[10]
		out[11] = a[11]
	}
	out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
	out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
	out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
	out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
	return out
}
const mat4RotateX = (out, a, rad) => {
	const s = Math.sin(rad),
		c = Math.cos(rad)
	const a10 = a[4],
		a11 = a[5],
		a12 = a[6],
		a13 = a[7]
	const a20 = a[8],
		a21 = a[9],
		a22 = a[10],
		a23 = a[11]
	if (out !== a) {
		out[0] = a[0]
		out[1] = a[1]
		out[2] = a[2]
		out[3] = a[3]
		out[12] = a[12]
		out[13] = a[13]
		out[14] = a[14]
		out[15] = a[15]
	}
	out[4] = a10 * c + a20 * s
	out[5] = a11 * c + a21 * s
	out[6] = a12 * c + a22 * s
	out[7] = a13 * c + a23 * s
	out[8] = a20 * c - a10 * s
	out[9] = a21 * c - a11 * s
	out[10] = a22 * c - a12 * s
	out[11] = a23 * c - a13 * s
	return out
}
const mat4RotateY = (out, a, rad) => {
	const s = Math.sin(rad),
		c = Math.cos(rad)
	const a00 = a[0],
		a01 = a[1],
		a02 = a[2],
		a03 = a[3]
	const a20 = a[8],
		a21 = a[9],
		a22 = a[10],
		a23 = a[11]
	if (out !== a) {
		out[4] = a[4]
		out[5] = a[5]
		out[6] = a[6]
		out[7] = a[7]
		out[12] = a[12]
		out[13] = a[13]
		out[14] = a[14]
		out[15] = a[15]
	}
	out[0] = a00 * c - a20 * s
	out[1] = a01 * c - a21 * s
	out[2] = a02 * c - a22 * s
	out[3] = a03 * c - a23 * s
	out[8] = a00 * s + a20 * c
	out[9] = a01 * s + a21 * c
	out[10] = a02 * s + a22 * c
	out[11] = a03 * s + a23 * c
	return out
}
const mat4RotateZ = (out, a, rad) => {
	const s = Math.sin(rad),
		c = Math.cos(rad)
	const a00 = a[0],
		a01 = a[1],
		a02 = a[2],
		a03 = a[3]
	const a10 = a[4],
		a11 = a[5],
		a12 = a[6],
		a13 = a[7]
	if (out !== a) {
		out[8] = a[8]
		out[9] = a[9]
		out[10] = a[10]
		out[11] = a[11]
		out[12] = a[12]
		out[13] = a[13]
		out[14] = a[14]
		out[15] = a[15]
	}
	out[0] = a00 * c + a10 * s
	out[1] = a01 * c + a11 * s
	out[2] = a02 * c + a12 * s
	out[3] = a03 * c + a13 * s
	out[4] = a10 * c - a00 * s
	out[5] = a11 * c - a01 * s
	out[6] = a12 * c - a02 * s
	out[7] = a13 * c - a03 * s
	return out
}
const vertexShader = `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vRandom = random;
  vColor = color;

  vec3 pos = position * uSpread;
  pos.z *= 10.0;

  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;

  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

  vec4 mvPos = viewMatrix * mPos;

  if (uSizeRandomness == 0.0) {
    gl_PointSize = uBaseSize;
  } else {
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  }

  gl_Position = projectionMatrix * mvPos;
}
`
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform float uAlphaParticles;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));

  if (uAlphaParticles < 0.5) {
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
  } else {
    float circle = smoothstep(0.5, 0.4, d) * 0.8;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
  }
}
`
function initParticles(container) {
	const particleCount = Math.max(
		1,
		Math.floor(num(container.dataset.count, 200)),
	)
	const particleSpread = num(container.dataset.spread, 10)
	const speed = num(container.dataset.speed, 0.1)
	const particleColors = (container.dataset.colors || '')
		.split(',')
		.map(s => s.trim())
		.filter(Boolean)
	const moveParticlesOnHover = bool(container.dataset.hover, false)
	const particleHoverFactor = num(container.dataset.hoverFactor, 1)
	const alphaParticles = bool(container.dataset.alpha, false)
	const particleBaseSize = num(container.dataset.baseSize, 100)
	const sizeRandomness = num(container.dataset.sizeRandomness, 1)
	const cameraDistance = num(container.dataset.cameraDistance, 20)
	const disableRotation = !bool(container.dataset.rotation, true)
	const pixelRatio = num(container.dataset.dpr, 1)
	const canvas = document.createElement('canvas')
	canvas.style.width = '100%'
	canvas.style.height = '100%'
	canvas.style.display = 'block'
	container.appendChild(canvas)
	const gl =
		canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
		}) ||
		canvas.getContext('experimental-webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
		})
	if (!gl) return () => {}
	gl.clearColor(0, 0, 0, 0)
	gl.disable(gl.DEPTH_TEST)
	gl.disable(gl.CULL_FACE)
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	const compile = (type, src) => {
		const sh = gl.createShader(type)
		gl.shaderSource(sh, src)
		gl.compileShader(sh)
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
		return sh
	}
	const link = (vs2, fs2) => {
		const p = gl.createProgram()
		gl.attachShader(p, vs2)
		gl.attachShader(p, fs2)
		gl.linkProgram(p)
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
		return p
	}
	const vs = compile(gl.VERTEX_SHADER, vertexShader)
	const fs = compile(gl.FRAGMENT_SHADER, fragmentShader)
	if (!vs || !fs) return () => {}
	const program = link(vs, fs)
	if (!program) return () => {}
	gl.useProgram(program)
	const posLoc = gl.getAttribLocation(program, 'position')
	const randomLoc = gl.getAttribLocation(program, 'random')
	const colorLoc = gl.getAttribLocation(program, 'color')
	const uTimeLoc = gl.getUniformLocation(program, 'uTime')
	const uSpreadLoc = gl.getUniformLocation(program, 'uSpread')
	const uBaseSizeLoc = gl.getUniformLocation(program, 'uBaseSize')
	const uSizeRandomnessLoc = gl.getUniformLocation(program, 'uSizeRandomness')
	const uAlphaParticlesLoc = gl.getUniformLocation(program, 'uAlphaParticles')
	const uModelLoc = gl.getUniformLocation(program, 'modelMatrix')
	const uViewLoc = gl.getUniformLocation(program, 'viewMatrix')
	const uProjLoc = gl.getUniformLocation(program, 'projectionMatrix')
	const palette = particleColors.length > 0 ? particleColors : defaultColors
	const count = particleCount
	const positions = new Float32Array(count * 3)
	const randoms = new Float32Array(count * 4)
	const colors = new Float32Array(count * 3)
	for (let i = 0; i < count; i++) {
		let x, y, z, len
		do {
			x = Math.random() * 2 - 1
			y = Math.random() * 2 - 1
			z = Math.random() * 2 - 1
			len = x * x + y * y + z * z
		} while (len > 1 || len === 0)
		const r = Math.cbrt(Math.random())
		positions.set([x * r, y * r, z * r], i * 3)
		randoms.set(
			[Math.random(), Math.random(), Math.random(), Math.random()],
			i * 4,
		)
		const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)])
		colors.set(col, i * 3)
	}
	const posBuf = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
	gl.enableVertexAttribArray(posLoc)
	gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
	const rndBuf = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, rndBuf)
	gl.bufferData(gl.ARRAY_BUFFER, randoms, gl.STATIC_DRAW)
	gl.enableVertexAttribArray(randomLoc)
	gl.vertexAttribPointer(randomLoc, 4, gl.FLOAT, false, 0, 0)
	const colBuf = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, colBuf)
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
	gl.enableVertexAttribArray(colorLoc)
	gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0)
	gl.uniform1f(uSpreadLoc, particleSpread)
	gl.uniform1f(uBaseSizeLoc, particleBaseSize * pixelRatio)
	gl.uniform1f(uSizeRandomnessLoc, sizeRandomness)
	gl.uniform1f(uAlphaParticlesLoc, alphaParticles ? 1 : 0)
	const mouseRef = { x: 0, y: 0 }
	const handleMouseMove = e => {
		const rect = container.getBoundingClientRect()
		mouseRef.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
		mouseRef.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
	}
	if (moveParticlesOnHover)
		container.addEventListener('mousemove', handleMouseMove)
	const model = new Float32Array(16)
	const view = new Float32Array(16)
	const proj = new Float32Array(16)
	const resize = () => {
		const wCSS = container.clientWidth
		const hCSS = container.clientHeight
		const dpr = pixelRatio
		const w = Math.max(1, Math.floor(wCSS * dpr))
		const h = Math.max(1, Math.floor(hCSS * dpr))
		canvas.width = w
		canvas.height = h
		gl.viewport(0, 0, w, h)
		mat4Perspective(proj, (15 * Math.PI) / 180, w / h, 0.1, 1e3)
		gl.uniformMatrix4fv(uProjLoc, false, proj)
	}
	window.addEventListener('resize', resize, false)
	resize()
	let posX = 0
	let posY = 0
	let rotX = 0
	let rotY = 0
	let rotZ = 0
	let animationFrameId
	let lastTime = performance.now()
	let elapsed = 0
	const update = t => {
		animationFrameId = requestAnimationFrame(update)
		const delta = t - lastTime
		lastTime = t
		elapsed += delta * speed
		gl.uniform1f(uTimeLoc, elapsed * 1e-3)
		if (moveParticlesOnHover) {
			posX = -mouseRef.x * particleHoverFactor
			posY = -mouseRef.y * particleHoverFactor
		} else {
			posX = 0
			posY = 0
		}
		if (!disableRotation) {
			rotX = Math.sin(elapsed * 2e-4) * 0.1
			rotY = Math.cos(elapsed * 5e-4) * 0.15
			rotZ += 0.01 * speed
		} else {
			rotX = 0
			rotY = 0
			rotZ = 0
		}
		mat4Identity(model)
		mat4Translate(model, model, [posX, posY, 0])
		mat4RotateX(model, model, rotX)
		mat4RotateY(model, model, rotY)
		mat4RotateZ(model, model, rotZ)
		gl.uniformMatrix4fv(uModelLoc, false, model)
		mat4Identity(view)
		mat4Translate(view, view, [0, 0, -cameraDistance])
		gl.uniformMatrix4fv(uViewLoc, false, view)
		gl.drawArrays(gl.POINTS, 0, count)
	}
	animationFrameId = requestAnimationFrame(update)
	return () => {
		window.removeEventListener('resize', resize)
		if (moveParticlesOnHover)
			container.removeEventListener('mousemove', handleMouseMove)
		cancelAnimationFrame(animationFrameId)
		if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
		try {
			const ext = gl.getExtension('WEBGL_lose_context')
			if (ext) ext.loseContext()
		} catch {}
	}
}
document.querySelectorAll('[data-particles]').forEach(el => {
	const cleanup = initParticles(el)
	const obs = new MutationObserver(muts => {
		const hasDataChange = muts.some(
			m =>
				m.type === 'attributes' &&
				m.attributeName &&
				m.attributeName.startsWith('data-'),
		)
		if (!hasDataChange) return
		cleanup()
		initParticles(el)
	})
	obs.observe(el, { attributes: true })
	window.addEventListener('beforeunload', () => {
		obs.disconnect()
		cleanup()
	})
})
