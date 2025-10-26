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

/*-------------------- Vars --------------------*/
let progress = 50;
let startX = 0;
let active = 0;
let isDown = false;
let hasViewedAll = false;
let viewedCards = new Set([0]);

/*-------------------- Constants --------------------*/
const speedWheel = 0.02;
const speedDrag = -0.1;

/*-------------------- Modal Elements --------------------*/
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

/*-------------------- Get Z --------------------*/
const getZindex = (array, index) => 
    array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i));

/*-------------------- Items --------------------*/
const $items = document.querySelectorAll('.carousel-item');
const $cursors = document.querySelectorAll('.cursor');

const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty('--zIndex', zIndex);
    item.style.setProperty('--active', (index - active) / $items.length);
};

/*-------------------- Animate --------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor(progress / 100 * ($items.length - 1));
    
    // Track viewed cards
    viewedCards.add(active);
    
    $items.forEach((item, index) => displayItems(item, index, active));
};

animate();

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

/*-------------------- Auto-scroll to next section --------------------*/
function scrollToNextSection() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/*-------------------- Click on Items --------------------*/
$items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
        // Prevent opening modal if dragging
        if (Math.abs(e.clientX - startX) > 10) return;
        
        // Open modal with the experience data
        if (i < experiences.length) {
            openModal(i);
        }
        
        // Also update the carousel position
        progress = (i / $items.length) * 100 + 10;
        animate();
    });
});

/*-------------------- Handlers --------------------*/
const handleWheel = e => {
    const wheelProgress = e.deltaY * speedWheel;
    const newProgress = progress + wheelProgress;
    
    // Check if we're at the end and have viewed all cards
    if (newProgress >= 100 && viewedCards.size === experiences.length && !hasViewedAll) {
        hasViewedAll = true;
        scrollToNextSection();
        return;
    }
    
    progress = newProgress;
    animate();
};

const handleMouseMove = (e) => {
    if (e.type === 'mousemove') {
        $cursors.forEach(($cursor) => {
            $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    }
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
};

const handleMouseDown = e => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
    isDown = false;
};

/*-------------------- Listeners --------------------*/
document.addEventListener('mousewheel', handleWheel);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchstart', handleMouseDown);
document.addEventListener('touchmove', handleMouseMove);
document.addEventListener('touchend', handleMouseUp);

/*-------------------- Smooth scroll for nav links --------------------*/
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});