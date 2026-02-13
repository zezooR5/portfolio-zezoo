// ===================================
// Smooth Scrolling Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// ===================================
// Active Navigation Link
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ===================================
// Form Handling
// ===================================
const contactForm = document.querySelector('.contact-form');

// Create toast notification element
function createToast(type, title, message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;

    const icon = type === 'success'
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <h4 class="toast-title">${title}</h4>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Auto remove after 6 seconds
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            createToast('error', 'Missing Fields', 'Please fill in all fields before submitting.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            createToast('error', 'Invalid Email', 'Please enter a valid email address.');
            return;
        }

        // Disable button and show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="btn-spinner"></span>
            Sending...
        `;

        // Actually send the form data to FormSubmit
        fetch('https://formsubmit.co/ajax/alrfayzyad53@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: `🔔 New Client Inquiry from ${name} — Portfolio`,
                _template: 'table'
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    createToast('success', 'Message Sent! ✨', `Thank you, ${name}! Your message has been delivered successfully. I'll get back to you soon.`);
                    contactForm.reset();
                } else {
                    createToast('error', 'Send Failed', 'Something went wrong. Please try again or contact me directly via email.');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                createToast('error', 'Connection Error', 'Could not send your message. Please check your internet connection and try again.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });
}

// ===================================
// Parallax Effect for Hero Image
// ===================================
const profileImage = document.querySelector('.profile-image');

if (profileImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (scrolled < window.innerHeight) {
            profileImage.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===================================
// Dynamic Year in Footer
// ===================================
const footerText = document.querySelector('.footer-text');
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.textContent = footerText.textContent.replace('2026', currentYear);
}

// Old 3D Tilt and Magnetic effect removed as they are now handled by initTechCardInteractions()

// ===================================
// Particle Effect on Hover
// ===================================
function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = `0 0 10px ${color}`;

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    let opacity = 1;
    let posX = x;
    let posY = y;

    function animate() {
        opacity -= 0.02;
        posX += vx;
        posY += vy;

        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }

    animate();
}

// Particle logic moved to attachParticleEffect() and initTechCardInteractions()

// ===================================
// Skill Progress Animation on Scroll
// ===================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

// ===================================
// Premium Name Decoding Effect (Sequential Cracking)
// ===================================
function initTypewriter() {
    const prefixElement = document.getElementById('type-prefix');
    const nameElement = document.getElementById('type-name');
    const cursorElement = document.querySelector('.type-cursor');

    if (!prefixElement || !nameElement) return;

    const prefixText = "Hi, I'm ";
    const nameText = "Ziad Elrefaye";
    const chars = "!<>-_\\/[]{}—=+*^?#________"; // Keeping if needed for future, or removing if strictly unnecessary

    let prefixIndex = 0;
    const prefixSpeed = 40;

    function typePrefix() {
        if (prefixIndex < prefixText.length) {
            prefixElement.textContent += prefixText.charAt(prefixIndex);
            prefixIndex++;
            setTimeout(typePrefix, prefixSpeed);
        } else {
            typeName();
        }
    }

    async function typeName() {
        let currentName = "";

        for (let i = 0; i < nameText.length; i++) {
            currentName += nameText[i];
            nameElement.textContent = currentName;
            await new Promise(resolve => setTimeout(resolve, 80)); // Simple typing speed
        }

        setTimeout(() => {
            if (cursorElement) cursorElement.style.transition = 'opacity 1s';
            if (cursorElement) cursorElement.style.opacity = '0';
        }, 1500);
    }

    setTimeout(typePrefix, 1000);
}

// ===================================
// Seamless Infinite Marquee for Tech Stack
// ===================================
function initInfiniteMarquee() {
    const techGrid = document.querySelector('.tech-grid');
    const techGridInner = document.querySelector('.tech-grid-inner');

    if (!techGrid || !techGridInner) return;

    // Clone items for seamless loop
    const cards = Array.from(techGridInner.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        techGridInner.appendChild(clone);
    });

    let x = 0;
    let speed = 0.8; // Pixels per frame
    let isPaused = false;

    // Pause on hover
    techGrid.addEventListener('mouseenter', () => isPaused = true);
    techGrid.addEventListener('mouseleave', () => isPaused = false);

    function animate() {
        if (!isPaused) {
            x -= speed;

            // If the first set of items has scrolled completely past
            const halfWidth = techGridInner.scrollWidth / 2;
            if (Math.abs(x) >= halfWidth) {
                x = 0;
            }

            techGridInner.style.transform = `translateX(${x}px)`;
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// ===================================
// Enhanced Tech Card 3D Tilt & Magnetic Effect
// ===================================
function initTechCardInteractions() {
    // Select all cards including clones
    const techCards = document.querySelectorAll('.tech-card');

    techCards.forEach(card => {
        // 3D Tilt on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Refined sensitivity
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

            // Dynamic glow follow
            const glow = card.querySelector('.tech-icon-wrapper');
            if (glow) {
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(45, 212, 191, 0.25) 0%, transparent 70%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const glow = card.querySelector('.tech-icon-wrapper');
            if (glow) {
                glow.style.background = '';
            }
        });

        // Magnetic cursor effect for icon
        card.addEventListener('mouseenter', (e) => {
            const icon = card.querySelector('.tech-icon');
            if (icon) {
                icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }

            // Initialize particles for clones too
            attachParticleEffect(card);
        });
    });
}

function attachParticleEffect(card) {
    if (card.dataset.particlesAttached) return;
    card.dataset.particlesAttached = "true";

    let particleInterval;
    const colors = ['#c9b896', '#a89775', '#8b9a6d'];

    card.addEventListener('mouseenter', () => {
        particleInterval = setInterval(() => {
            const rect = card.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            createParticle(x, y, color);
        }, 150); // Slightly slower for performance
    });

    card.addEventListener('mouseleave', () => {
        clearInterval(particleInterval);
    });
}

// ===================================
// Dom Content Loaded Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Marquee FIRST to clone cards
    initInfiniteMarquee();

    // Initialize interactions AFTER cloning so clones get events too
    initTechCardInteractions();

    // Observe all cards and sections for entry animation
    const animatedElements = document.querySelectorAll(
        '.tech-card, .credential-card, .project-card, .credential-category'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        skillObserver.observe(el);
    });

    // Initialize Typewriter Effect
    initTypewriter();
});

// ===================================
// Interactive Mouse Glow (Optimized)
// ===================================
const mouseGlow = document.querySelector('.mouse-glow');
if (mouseGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        const distX = mouseX - currentX;
        const distY = mouseY - currentY;

        // Smooth follow logic (0.1 = lag factor)
        currentX += distX * 0.15;
        currentY += distY * 0.15;

        // Dynamically center based on actual width/height
        const offset = mouseGlow.offsetWidth / 2;
        mouseGlow.style.transform = `translate(${currentX - offset}px, ${currentY - offset}px)`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}


console.log('Portfolio loaded successfully! 🚀');
