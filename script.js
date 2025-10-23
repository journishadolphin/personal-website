
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

// Initialize carousel
const carousel = document.getElementById('carousel');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

let activeIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let hasViewedAll = false;
let viewedCards = new Set([0]); // Track which cards have been viewed

// Create carousel items
experiences.forEach((exp, index) => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.index = index;
    item.innerHTML = `
        <div class="carousel-box">
            <div>
                <div class="company-name">${exp.company}</div>
                <div class="job-title">${exp.title}</div>
                <div class="job-date">${exp.date}</div>
            </div>
            <div class="carousel-number">${String(index + 1).padStart(2, '0')}</div>
        </div>
    `;
    item.addEventListener('click', () => openModal(index));
    carousel.appendChild(item);
});

function setActiveIndex(index) {
    // Keep index within bounds
    if (index < 0) {
        activeIndex = 0;
        return;
    }
    if (index >= experiences.length) {
        activeIndex = experiences.length - 1;
        // If trying to go past last card, scroll to next section
        if (!hasViewedAll && viewedCards.size === experiences.length) {
            hasViewedAll = true;
            scrollToNextSection();
        }
        return;
    }
    
    activeIndex = index;
    viewedCards.add(activeIndex);
    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, i) => {
        const offset = i - activeIndex;
        item.style.setProperty('--active', Math.abs(offset));
        
        // Only show cards that are close to active
        if (Math.abs(offset) > 2) {
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
        } else {
            item.style.opacity = '1';
            item.style.pointerEvents = 'all';
        }
    });
}

function scrollToNextSection() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openModal(index) {
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

// Mouse/Touch drag functionality
carousel.addEventListener('mousedown', startDrag);
carousel.addEventListener('touchstart', startDrag, { passive: true });
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, { passive: true });
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

// Wheel navigation
carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0) {
            setActiveIndex(activeIndex + 1);
        } else {
            setActiveIndex(activeIndex - 1);
        }
    }
}, { passive: false });

function startDrag(e) {
    if (modal.classList.contains('active')) return;
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    carousel.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'pointer';
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Dragged right - go to previous card
            setActiveIndex(activeIndex - 1);
        } else {
            // Dragged left - go to next card
            setActiveIndex(activeIndex + 1);
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        setActiveIndex(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
        setActiveIndex(activeIndex + 1);
    }
});

// Initialize
updateCarousel();

// Add smooth scroll behavior for navigation links
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