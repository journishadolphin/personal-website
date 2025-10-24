// Experience data
const experiences = [
    {
        company: "Mastercard",
        title: "Business Operations Engineer (DevOps + Site Reliability)",
        date: "June 2023 - Present",
        location: "New York, NY",
        responsibilities: [
            "Ensures platform stability and health by developing dashboards and leveraging observability tools such as Splunk, Dynatrace, and Pivotal Cloud Foundry (PCF)",
            "Utilizes in-depth analysis across data sets to troubleshoot and prevent customer-facing disruptions by participating on on-call duties",
            "Writes and executes advanced SQL queries to validate and troubleshoot database changes, ensuring code quality and efficiency in production environments",
            "Automated processes with Digital.ai Release, cutting manual effort by 40% and reducing deployment time by 20%",
            "Supports Agile workflows by integrating CI/CD pipelines, enabling fast, high-quality deployments with minimal downtime"
        ]
    },
    {
        company: "Hospital for Special Surgery",
        title: "Data Analyst / Cyber Security Intern",
        date: "January 2021 - January 2023",
        location: "New York, NY",
        responsibilities: [
            "Completed a data analysis of 1000+ employees across 75 departments who have active user accounts in the electronic medical record system named EPIC",
            "Spotted possible threats to security by identifying mismatched system privileges while also automating the onboarding process for future employees",
            "Combatted over 45+ software security vulnerabilities using software such as FastSOAR, Prometheus, and Symantec"
        ]
    },
    {
        company: "America On Tech, Inc.",
        title: "Assistant STEM Teacher / Peer Mentor",
        date: "September 2019 - April 2020",
        location: "New York, NY",
        responsibilities: [
            "Instructed 20+ students in the Tech Flex Leaders Program on HTML, CSS, and JavaScript topics",
            "Aided, mentored and coached students in being proficient in web development and starting their careers in tech",
            "Troubleshooted network and hardware problems for classroom devices and debugged students' code"
        ]
    },
    {
        company: "PureWow",
        title: "Mobile App Developer Intern",
        date: "July 2019 - August 2019",
        location: "New York, NY",
        responsibilities: [
            "Developed wireframe mobile app, expanding user reach for One37pm",
            "Proficient in React Native Framework and Android Studio for UI design and integration",
            "Collaborated through Git and JIRA, meeting Agile project deadlines"
        ]
    }
];



/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*-------------------- Modal Elements --------------------*/
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');



/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*-------------------- Modal Functions --------------------*/
function openModal(index) {
    // Make sure we have experience data for this index
    if (index >= experiences.length) {
        console.warn('No experience data for index:', index);
        return;
    }
    
    const exp = experiences[index];
    modalBody.innerHTML = `
        <h3>${exp.company}</h3>
        <div class="modal-role">${exp.title}</div>
        <div class="modal-date">${exp.date} | ${exp.location}</div>
        <h4 style="color: #667eea; margin-bottom: 1rem;">Key Responsibilities:</h4>
        <ul>
            ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
        </ul>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});


/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    // Move carousel focus
    progress = (i / $items.length) * 100 + 10;
    animate();

    // Open modal with corresponding experience
    openModal(i);
  });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
  const wheelProgress = e.deltaY * speedWheel
  progress = progress + wheelProgress
  animate()
}

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

const handleMouseDown = e => {
  isDown = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
  isDown = false
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)
 // Light Rays Effect using WebGL (based on OGL library shader)
        const canvas = document.getElementById('lightRaysCanvas');
        const gl = canvas.getContext('webgl');
        
        if (!gl) {
            console.error('WebGL not supported');
        }

        const mousePos = { x: 0.5, y: 0.5 };
        const smoothMousePos = { x: 0.5, y: 0.5 };

        // Vertex shader
        const vertexShaderSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment shader - Light Rays
        const fragmentShaderSource = `
            precision highp float;

            uniform float iTime;
            uniform vec2 iResolution;
            uniform vec2 rayPos;
            uniform vec2 rayDir;
            uniform vec3 raysColor;
            uniform float raysSpeed;
            uniform float lightSpread;
            uniform float rayLength;
            uniform float pulsating;
            uniform float fadeDistance;
            uniform float saturation;
            uniform vec2 mousePos;
            uniform float mouseInfluence;
            uniform float noiseAmount;
            uniform float distortion;

            varying vec2 vUv;

            float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                              float seedA, float seedB, float speed) {
                vec2 sourceToCoord = coord - raySource;
                vec2 dirNorm = normalize(sourceToCoord);
                float cosAngle = dot(dirNorm, rayRefDirection);

                float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
                
                float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

                float distance = length(sourceToCoord);
                float maxDistance = iResolution.x * rayLength;
                float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
                
                float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
                float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

                float baseStrength = clamp(
                    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
                    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
                    0.0, 1.0
                );

                return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
            }

            void main() {
                vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
                
                vec2 finalRayDir = rayDir;
                if (mouseInfluence > 0.0) {
                    vec2 mouseScreenPos = mousePos * iResolution.xy;
                    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
                }

                vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
                vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);

                vec4 fragColor = rays1 * 0.5 + rays2 * 0.4;

                if (noiseAmount > 0.0) {
                    float n = noise(coord * 0.01 + iTime * 0.1);
                    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
                }

                float brightness = 1.0 - (coord.y / iResolution.y);
                fragColor.x *= 0.1 + brightness * 0.8;
                fragColor.y *= 0.3 + brightness * 0.6;
                fragColor.z *= 0.5 + brightness * 0.5;

                if (saturation != 1.0) {
                    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
                    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
                }

                fragColor.rgb *= raysColor;
                
                gl_FragColor = fragColor;
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        const uniforms = {
            iTime: gl.getUniformLocation(program, 'iTime'),
            iResolution: gl.getUniformLocation(program, 'iResolution'),
            rayPos: gl.getUniformLocation(program, 'rayPos'),
            rayDir: gl.getUniformLocation(program, 'rayDir'),
            raysColor: gl.getUniformLocation(program, 'raysColor'),
            raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
            lightSpread: gl.getUniformLocation(program, 'lightSpread'),
            rayLength: gl.getUniformLocation(program, 'rayLength'),
            pulsating: gl.getUniformLocation(program, 'pulsating'),
            fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
            saturation: gl.getUniformLocation(program, 'saturation'),
            mousePos: gl.getUniformLocation(program, 'mousePos'),
            mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
            noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
            distortion: gl.getUniformLocation(program, 'distortion')
        };

        function hexToRgb(hex) {
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        window.addEventListener('resize', resize);
        resize();

        const heroElement = document.querySelector('.hero');
        heroElement.addEventListener('mousemove', (e) => {
            const rect = heroElement.getBoundingClientRect();
            mousePos.x = (e.clientX - rect.left) / rect.width;
            mousePos.y = (e.clientY - rect.top) / rect.height;
        });

        function render(time) {
            time *= 0.001;

            // Smooth mouse interpolation
            const smoothing = 0.92;
            smoothMousePos.x = smoothMousePos.x * smoothing + mousePos.x * (1 - smoothing);
            smoothMousePos.y = smoothMousePos.y * smoothing + mousePos.y * (1 - smoothing);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);
            
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // Set uniforms
            gl.uniform1f(uniforms.iTime, time);
            gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
            
            // Ray origin at top-center (outside viewport)
            const outside = 0.2;
            gl.uniform2f(uniforms.rayPos, canvas.width * 0.5, -outside * canvas.height);
            gl.uniform2f(uniforms.rayDir, 0.0, 1.0);
            
            // Cyan color (#00ffff)
            const color = hexToRgb('#00ffff');
            gl.uniform3f(uniforms.raysColor, color[0], color[1], color[2]);
            
            // Effect parameters
            gl.uniform1f(uniforms.raysSpeed, 1.5);
            gl.uniform1f(uniforms.lightSpread, 0.8);
            gl.uniform1f(uniforms.rayLength, 1.2);
            gl.uniform1f(uniforms.pulsating, 0.0);
            gl.uniform1f(uniforms.fadeDistance, 1.0);
            gl.uniform1f(uniforms.saturation, 1.0);
            gl.uniform2f(uniforms.mousePos, smoothMousePos.x, smoothMousePos.y);
            gl.uniform1f(uniforms.mouseInfluence, 0.1);
            gl.uniform1f(uniforms.noiseAmount, 0.1);
            gl.uniform1f(uniforms.distortion, 0.05);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });