/**
 * Shubham Sinha - Interactive Profile Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Theme Toggle Management (Dark / Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check stored theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            showToast(`Switched to ${newTheme} mode`, 'info');
        });
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    /* ==========================================================================
       2. Sticky Header & Active Navigation Highlighting
       ========================================================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       3. Mobile Navigation Menu Toggle
       ========================================================================== */
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
            });
        });
    }

    /* ==========================================================================
       4. Hero Typewriter Effect
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "1st-Year B.Tech CSE (Core) Student",
        "Aspiring Software Developer",
        "Python & C Programming Enthusiast",
        "LeetCode Problem Solver"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if (typewriterElement) {
        typeEffect();
    }

    /* ==========================================================================
       5. Animated Counter Stats on Scroll
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animatedStats = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    let count = 0;
                    const duration = 1500;
                    const increment = target / (duration / 16);

                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            stat.textContent = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    updateCount();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       6. Interactive Skills Category Filtering & Bar Animations
       ========================================================================== */
    const skillFilterBtns = document.querySelectorAll('[data-skill-filter]');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-skill-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const skillBarFills = document.querySelectorAll('.skill-bar-fill');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBarFills.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                });
            }
        });
    }, { threshold: 0.2 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       7. Modal Control for Projects & Resume Download
       ========================================================================== */
    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    const viewDetailBtns = document.querySelectorAll('.view-details-btn');
    const downloadCvBtn = document.getElementById('btn-download-cv');

    const projectDetailsData = {
        'project-1': {
            title: 'Python Interactive CLI Calculator',
            category: 'Python 3 Project',
            graphic: '🐍',
            desc: 'A robust command-line utility application built in Python 3. Supports arithmetic calculations, trigonometric operations, unit conversions, and factorial calculations.',
            highlights: [
                'Modular function structure with clean error handling.',
                'Interactive user prompt loop with exit options.',
                'Tested with edge cases (division by zero, invalid input types).'
            ],
            tech: ['Python 3', 'CLI Architecture', 'Functions & Loops']
        },
        'project-2': {
            title: 'C Array & Matrix Operations Toolkit',
            category: 'C Language Project',
            graphic: '⚙️',
            desc: 'A foundational C program demonstrating algorithmic thinking and memory efficiency. Performs 2D matrix addition, transpose, multiplication, and array sorting algorithms.',
            highlights: [
                'Demonstrates efficient pointer arithmetic and dynamic array indexing.',
                'Structured procedural programming approach in standard C.',
                'Includes interactive menu for selecting operations.'
            ],
            tech: ['C Language', 'Pointers', '2D Arrays', 'Memory Management']
        },
        'project-3': {
            title: 'LeetCode Python Solution Vault',
            category: 'Algorithms & LeetCode',
            graphic: '💡',
            desc: 'A collection of solved LeetCode easy-level problems implemented in Python. Each solution includes time and space complexity analysis comments.',
            highlights: [
                'Focuses on Arrays, Two Pointers, Hash Maps, and Strings.',
                'Annotated code explanations and test cases.',
                'Continuous repository updates as problem solving progresses.'
            ],
            tech: ['Python', 'LeetCode', 'Data Structures', 'Git']
        }
    };

    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = btn.closest('.project-card');
            const projectId = projectCard ? projectCard.getAttribute('data-project-id') : 'project-1';
            openProjectModal(projectId);
        });
    });

    function openProjectModal(projectId) {
        const data = projectDetailsData[projectId] || projectDetailsData['project-1'];
        
        modalBody.innerHTML = `
            <div style="font-size: 3.5rem; text-align: center; margin-bottom: 1rem;">${data.graphic}</div>
            <span class="project-category-badge" style="position: relative; top: 0; left: 0; display: inline-block; margin-bottom: 0.5rem;">${data.category}</span>
            <h3 style="font-size: 1.6rem; margin-bottom: 0.75rem;">${data.title}</h3>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem;">${data.desc}</p>
            
            <h4 style="margin-bottom: 0.5rem;">Key Highlights</h4>
            <ul style="padding-left: 1.2rem; margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.95rem;">
                ${data.highlights.map(h => `<li style="margin-bottom: 0.4rem;">${h}</li>`).join('')}
            </ul>

            <h4 style="margin-bottom: 0.5rem;">Tools & Technologies</h4>
            <div class="project-tech" style="margin-bottom: 2rem;">
                ${data.tech.map(t => `<span style="background: var(--bg-tertiary); padding: 0.25rem 0.75rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem;">${t}</span>`).join('')}
            </div>

            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary btn-sm" id="btn-modal-close-inner">Close Overview</button>
            </div>
        `;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('btn-modal-close-inner').addEventListener('click', closeModal);
    }

    // Download / View Resume Action
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            modalBody.innerHTML = `
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">📄</div>
                    <h3 style="font-size: 1.6rem;">Shubham Sinha - Academic Resume Summary</h3>
                    <p style="color: var(--accent-secondary); font-weight: 600;">1st-Year B.Tech CSE (Core) | Adamas University</p>
                </div>

                <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.7;">
                    <p><strong>Education:</strong> Adamas University (B.Tech CSE 1st Year) | 10th: 82% | 12th: 72%</p>
                    <p><strong>Skills:</strong> Python, C Language, LeetCode, VS Code, Problem Solving</p>
                    <p><strong>Location:</strong> Howrah, West Bengal | <strong>Email:</strong> shubhamsinhaofficial77@gmail.com</p>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary btn-sm" onclick="window.print()">Print / Download PDF</button>
                    <button class="btn btn-secondary btn-sm" id="btn-modal-close-cv">Close</button>
                </div>
            `;

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            document.getElementById('btn-modal-close-cv').addEventListener('click', closeModal);
        });
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    /* ==========================================================================
       8. Contact Form Validation & Submission
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const messageInput = document.getElementById('contact-message');
    const currentChars = document.getElementById('current-chars');

    if (messageInput && currentChars) {
        messageInput.addEventListener('input', () => {
            currentChars.textContent = messageInput.value.length;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');

            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (input) input.parentElement.classList.remove('error');
            });

            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            }

            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('error');
                isValid = false;
            }

            if (messageInput.value.trim().length < 10) {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = document.getElementById('submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');

                btnText.textContent = 'Sending...';
                btnSpinner.classList.remove('hidden');
                submitBtn.disabled = true;

                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    btnSpinner.classList.add('hidden');
                    submitBtn.disabled = false;
                    
                    contactForm.reset();
                    if (currentChars) currentChars.textContent = '0';
                    
                    showToast('Thank you, ' + nameInput.value + '! Your message has been sent to Shubham.', 'success');
                }, 1200);
            }
        });
    }

    /* ==========================================================================
       9. Toast Notification System
       ========================================================================== */
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : 'ℹ️';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
