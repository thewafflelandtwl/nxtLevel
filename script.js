// Hide loader after page loads
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000); // Show loader for 2 seconds
});

// Smooth scroll handling
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

// Navbar background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 10, 15, 0.95)';
        nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(10, 10, 15, 0.8)';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations (fallback for browsers without animation-timeline)
if (!CSS.supports('animation-timeline: view()')) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease forwards';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.service-card, .section-header, .portfolio-content, .stat').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Counter animation for stats
const animateCounter = (element, target) => {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const isPercentage = target.toString().includes('%');
    const isMultiplier = target.toString().includes('X');

    const updateCounter = () => {
        if (current < parseFloat(target)) {
            current += increment;
            if (isPercentage) {
                element.textContent = Math.ceil(current) + '%';
            } else if (isMultiplier) {
                element.textContent = Math.ceil(current) + 'X';
            } else {
                element.textContent = Math.ceil(current) + '+';
            }
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (isPercentage || isMultiplier ? '' : '+');
        }
    };

    updateCounter();
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const originalText = stat.textContent;
                const value = originalText.replace(/[^0-9.]/g, '');
                setTimeout(() => {
                    animateCounter(stat, originalText);
                }, index * 100);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Parallax effect for hero decoration
window.addEventListener('scroll', () => {
    const decoration = document.querySelector('.hero-decoration');
    if (decoration) {
        const scrolled = window.pageYOffset;
        decoration.style.transform = `translate(${scrolled * 0.3}px, ${scrolled * 0.2}px)`;
    }
});

// Magnetic effect for buttons
const buttons = document.querySelectorAll('.btn-primary');
buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// Service card tilt effect
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Add cursor trail effect
let cursorTrail = [];
const trailLength = 20;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

// Preload images
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add random floating animation to hero decoration
const decoration = document.querySelector('.hero-decoration');
if (decoration) {
    let x = 0;
    let y = 0;

    setInterval(() => {
        x += (Math.random() - 0.5) * 2;
        y += (Math.random() - 0.5) * 2;

        x = Math.max(-50, Math.min(50, x));
        y = Math.max(-50, Math.min(50, y));

        decoration.style.transform = `translate(${x}px, ${y}px)`;
    }, 50);
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const highlightNavigation = debounce(() => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, 10);

window.addEventListener('scroll', highlightNavigation);

console.log('🚀 NXT Level - Branding & Digital Growth');
console.log('Website loaded successfully!');
