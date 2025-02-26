/**
 * @fileoverview Main JavaScript file for Armour Technologies website
 * @author Curtis Goddard
 * @version 1.0.0
 * @lastModified 02/01/2025
 * 
 * This file contains all the interactive functionality
 * for the Armour Technologies website, including:
 * - Navigation effects
 * - Form validation
 * - Dark mode
 * - Animations
 */

/**
 * Navigation Scroll Effect
 * Handles header appearance changes on scroll
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
        header.style.backgroundColor = 'var(--header-background)';
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = 'var(--header-background)';
        header.style.boxShadow = 'none';
    }
});

/**
 * Smooth Scrolling
 * Implements smooth scroll behavior for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/**
 * Back to Top Button
 * Creates and manages the back-to-top button functionality
 */
const backToTopButton = document.createElement('button');
backToTopButton.innerText = '↑';
backToTopButton.id = 'back-to-top';
backToTopButton.style.position = 'fixed';
backToTopButton.style.bottom = '20px';
backToTopButton.style.right = '20px';
backToTopButton.style.padding = '10px 15px';
backToTopButton.style.backgroundColor = '#007BFF';
backToTopButton.style.color = '#fff';
backToTopButton.style.border = 'none';
backToTopButton.style.borderRadius = '5px';
backToTopButton.style.cursor = 'pointer';
backToTopButton.style.display = 'none';
backToTopButton.style.zIndex = '1000';
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    // Update header background using CSS variable
    const header = document.querySelector('header');
    header.style.backgroundColor = 'var(--header-background)';
    header.style.boxShadow = 'none';
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

/**
 * Form Validation
 * Handles contact form validation and submission
 * @param {Event} event - Form submission event
 * @returns {boolean} False to prevent default form submission
 */
function validateForm() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }

        if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });

    return isValid;
}

function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('error');
}

/**
 * CAPTCHA Generation
 * Creates a simple math-based CAPTCHA challenge
 */
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const captchaQuestion = `What is ${num1} + ${num2}?`;
    document.getElementById('captcha-question').innerText = captchaQuestion;
    document.getElementById('captcha').setAttribute('data-answer', num1 + num2);
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('captcha-question')) {
        generateCaptcha();
    }
});

/**
 * Animation Observer
 * Manages scroll-based animations using Intersection Observer
 */
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
});

animatedElements.forEach(element => {
    animationObserver.observe(element);
});

/**
 * Dark Mode Implementation
 * Handles theme switching and persistence
 */
function initDarkMode() {
    const nav = document.querySelector('nav ul');
    const toggleHTML = `
        <label class="dark-mode-toggle" aria-label="Toggle dark mode">
            <input type="checkbox" id="darkModeToggle" aria-label="Toggle dark mode">
            <span class="toggle-slider" role="switch" aria-checked="false"></span>
        </label>
    `;
    nav.insertAdjacentHTML('afterend', toggleHTML);

    const toggle = document.getElementById('darkModeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.checked = true;
    }

    // Theme toggle event listener
    toggle.addEventListener('change', () => {
        const newTheme = toggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            toggle.checked = e.matches;
        }
    });
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', initDarkMode);

/**
 * Image Lazy Loading
 * Implements lazy loading for images using Intersection Observer
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        return;
    }

    // Fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

/**
 * Testimonials Carousel
 * Manages the testimonial carousel functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const testimonialSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 700,
        a11y: {
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
            firstSlideMessage: 'This is the first testimonial',
            lastSlideMessage: 'This is the last testimonial',
            paginationBulletMessage: 'Go to testimonial {{index}}',
        },
    });

    // ...rest of your DOMContentLoaded code...
});

// Mobile Menu Toggle
function initMobileMenu() {
    const nav = document.querySelector('header nav');
    const menuButton = document.querySelector('.mobile-menu-toggle');
    
    menuButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav?.classList.contains('active') && !nav.contains(e.target) && !menuButton.contains(e.target)) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav?.classList.contains('active')) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Section Underline Animation
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            entry.target.classList.remove('in-view');
        }
    });
}, {
    threshold: 0.2 // Trigger when 20% of the section is visible
});

// Observe all sections except hero
document.querySelectorAll('section:not(.hero)').forEach(section => {
    sectionObserver.observe(section);
});

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});

/**
 * Service Info Panel functionality
 */
const serviceDetails = {
    'Managed IT Support': {
        description: `Our comprehensive IT support service includes:<br><br>
            • 24/7 System Monitoring<br>
            • Help Desk Support<br>
            • Regular Maintenance<br>
            • Managed Windows Updates<br>
            • Performance Optimisation<br>
            • IT Asset Management<br><br>
            Our comprehensive support service is designed to ensure that your employees are able to operate at peak efficiency. By leveraging advanced monitoring tools and providing proactive support, we can promptly address issues before they escalate. <br><br>
            Regular maintenance and managed updates keep your systems current and secure, while performance optimization maximizes productivity. Our IT asset management service ensures that all hardware and software resources are effectively utilized, reducing waste and improving overall performance. With our dedicated team overseeing your devices, you can rest assured that your systems will remain reliable, secure, and optimized for your business needs.`

    },
    'Cybersecurity Services': {
        description: `Our comprehensive cybersecurity solutions protect your business:<br><br>
            • Threat Detection & Prevention<br>
            • Firewall Management<br>
            • Security Audits and Assessments<br>
            • Employee Training<br>
            • Incident Response<br>
            • Cyber Essentials Guidance<br><br>
            We employ advanced security measures to protect your business from evolving cyber threats. Our multi-layered approach combines cutting-edge technology with expert monitoring to ensure comprehensive protection.<br><br>
            Regular security audits and employee training programs help create a security-conscious environment, while our incident response team is ready 24/7 to address any potential breaches. We also ensure your systems meet industry compliance standards, providing peace of mind and regulatory conformity.`
    },
    'Cloud Computing': {
        description: `Transform your business with our cloud solutions:<br><br>
            • Cloud Migration Services<br>
            • Cloud Infrastructure Management<br>
            • Microsoft 365 Solutions<br>
            • Cloud Security<br>
            • Cloud Backup Services<br>
            • Cloud Consulting<br><br>
            Our cloud computing services help businesses leverage the power of modern cloud technology. We guide you through every step of cloud adoption, from initial assessment to full implementation.<br><br>
            Whether you're looking to migrate existing systems, implement new cloud solutions, or optimize your current cloud infrastructure, our team ensures a smooth and efficient transition. We focus on scalability, security, and cost-effectiveness to deliver cloud solutions that drive business growth.`
    },
    'Data Backup & Recovery': {
        description: `Protect your critical data with our comprehensive backup solutions:<br><br>
            • Automated Backup Systems<br>
            • Real-time Data Protection<br>
            • Disaster Recovery Planning<br>
            • Regular Backup Testing<br>
            • Quick Recovery Solutions<br>
            • Secure Off-site Storage<br><br>
            Our data backup and recovery services ensure your business data is always protected and recoverable. We implement robust backup strategies that combine local and cloud storage for maximum security.<br><br>
            Regular testing and verification processes ensure your backups are always reliable and ready when needed. Our quick recovery solutions minimize downtime in case of data loss, keeping your business running smoothly.`
    },
    'Network Management': {
        description: `Optimize your network infrastructure with our expert management:<br><br>
            • Network Design & Implementation<br>
            • 24/7 Network Monitoring<br>
            • Performance Optimization<br>
            • Security Management<br>
            • Bandwidth Management<br>
            • Network Troubleshooting<br><br>
            We provide comprehensive network management services to ensure your business network operates at peak efficiency. Our team monitors and maintains your network infrastructure around the clock.<br><br>
            From optimizing performance to implementing security measures, we handle all aspects of network management to provide a reliable and secure networking environment for your business.`
    },
    'IT Consulting': {
        description: `Strategic technology guidance for your business growth:<br><br>
            • Technology Assessment<br>
            • Digital Transformation Strategy<br>
            • IT Roadmap Development<br>
            • Cost Optimization<br>
            • Technology Selection<br>
            • Implementation Planning<br><br>
            Our IT consulting services help you make informed decisions about your technology investments. We work closely with you to understand your business goals and develop strategies that align with your objectives.<br><br>
            Whether you're planning a major upgrade or looking to optimize current systems, our consultants provide expert guidance every step of the way.`
    },
    'Telephony/VOIP': {
        description: `Modern communication solutions for your business:<br><br>
            • Cloud-based Phone Systems<br>
            • Mobile Integration<br>
            • Video Conferencing<br>
            • Call Management<br>
            • Advanced Features<br>
            • Unified Communications<br><br>
            Transform your business communications with our modern telephony solutions. We implement reliable, feature-rich phone systems that enhance collaboration and productivity.<br><br>
            Our VOIP solutions offer cost-effective, scalable communication platforms that grow with your business, including advanced features like video conferencing, mobile integration, and unified communications.`
    },
    'Infrastructure Management': {
        description: `Comprehensive infrastructure management solutions for your business:<br><br>
            • Infrastructure Assessment & Planning<br>
            • Server Management & Monitoring<br>
            • Hardware Lifecycle Management<br>
            • Performance Optimization<br>
            • Capacity Planning<br>
            • Infrastructure Security<br><br>
            Our infrastructure management services ensure your IT environment operates at peak efficiency. We provide end-to-end management of your critical infrastructure components.<br><br>
            Through proactive monitoring and maintenance, we optimize performance, enhance security, and ensure reliability of your entire IT infrastructure. Our team works to prevent issues before they impact your business operations.`
    },
    'Internet Connectivity': {
        description: `Enterprise-grade connectivity solutions for your business:<br><br>
            • High-Speed Broadband Solutions<br>
            • Dedicated Leased Lines<br>
            • SD-WAN Implementation<br>
            • Redundant Connections<br>
            • Network Monitoring<br>
            • Performance Optimization<br><br>
            We provide reliable, high-performance internet connectivity solutions tailored to your business needs. Our services include comprehensive network design and implementation.<br><br>
            With redundant connections and continuous monitoring, we ensure your business stays connected with minimal downtime. Our solutions scale with your business, providing the bandwidth and reliability you need to operate efficiently.`
    },
    'Hardware & Software': {
        description: `Complete hardware and software management services:<br><br>
            • IT Equipment Procurement<br>
            • Software Licensing Management<br>
            • Hardware Lifecycle Management<br>
            • Asset Tracking & Inventory<br>
            • Vendor Relationship Management<br>
            • Technology Refresh Planning<br><br>
            We handle all aspects of your hardware and software needs, from initial procurement to ongoing management. Our team ensures you have the right tools and technology to support your business goals.<br><br>
            We maintain relationships with leading vendors to provide competitive pricing and reliable support. Our asset management system tracks all your IT resources, ensuring optimal utilization and timely upgrades.`
    },
    'Disaster Recovery': {
        description: `Comprehensive business continuity and disaster recovery solutions:<br><br>
            • Business Impact Analysis<br>
            • Recovery Strategy Development<br>
            • Backup Solution Implementation<br>
            • Regular Recovery Testing<br>
            • 24/7 Emergency Response<br>
            • Business Continuity Planning<br><br>
            Our disaster recovery services protect your business from unexpected disruptions. We develop and implement comprehensive recovery strategies tailored to your specific needs.<br><br>
            Through regular testing and updates, we ensure your business can quickly recover from any disaster. Our solutions minimize downtime and data loss, keeping your business operational even in challenging circumstances.`
    },
    'Process Automation Services': {
        description: `Streamline your business operations with intelligent automation:<br><br>
            • Workflow Analysis & Optimization<br>
            • Custom Automation Solutions<br>
            • Microsoft Power Platform Integration<br>
            • Business Process Automation<br>
            • Document Automation<br>
            • Automation Strategy & Planning<br><br>
            Transform your business operations with our process automation services. We identify and implement automation opportunities that increase efficiency and reduce manual tasks.<br><br>
            From simple workflow automation to complex business process automation, we help you leverage technology to save time and reduce errors. Our solutions integrate with your existing systems to create seamless, automated workflows.`
    }
    // Add similar detailed descriptions for other services...
};

function initializeServicePanel() {
    const panel = document.querySelector('.service-info-panel');
    const closeBtn = panel.querySelector('.close-btn');
    const serviceItems = document.querySelectorAll('.service-item');

    function showPanel(title, content) {
        panel.querySelector('h3').textContent = title;
        panel.querySelector('.service-details').innerHTML = content;
        panel.classList.add('active');
    }

    function hidePanel() {
        panel.classList.remove('active');
    }

    // Add click event listener to the document
    document.addEventListener('click', (e) => {
        // Check if panel is active and click is outside panel and service items
        if (panel.classList.contains('active') && 
            !panel.contains(e.target) && 
            !Array.from(serviceItems).some(item => item.contains(e.target))) {
            hidePanel();
        }
    });

    // Prevent panel from closing when clicking inside it
    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    serviceItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from immediately closing
            const title = item.querySelector('h3').textContent;
            const details = serviceDetails[title] || {
                description: 'Contact us for more information about this service.'
            };
            showPanel(title, details.description);
        });
    });

    closeBtn.addEventListener('click', hidePanel);
}

// Initialize panel when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeServicePanel);

/**
 * Handle form submission
 * Opens default email client with form data
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const captchaAnswer = document.getElementById('captcha-answer').value;
            const expectedAnswer = document.getElementById('captcha-question').getAttribute('data-answer');
            
            // Basic validation
            if (captchaAnswer !== expectedAnswer) {
                alert('Please answer the captcha correctly');
                generateCaptcha();
                return false;
            }
            
            // Create email body
            const emailBody = `Name: ${name}%0D%0A%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            
            // Create mailto link
            const mailtoLink = `mailto:info@armourtechnologies.co.uk?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Reset form and generate new captcha
            form.reset();
            generateCaptcha();
        });
    }
});

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        generateCaptcha();
    }
});

function showError(inputId, message) {
    const errorDiv = document.getElementById(`${inputId}Error`);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    const input = document.getElementById(inputId);
    if (input) {
        input.classList.add('error');
    }
}

function clearAllErrors() {
    const errorDivs = document.querySelectorAll('.error-message');
    errorDivs.forEach(div => {
        div.textContent = '';
        div.style.display = 'none';
    });
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => input.classList.remove('error'));
}

function showFormStatus(message, type) {
    const statusDiv = document.getElementById('formStatus');
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';
    
    // Hide status message after 5 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'form-status';
        statusDiv.style.display = 'none';
    }, 5000);
}

/**
 * Generate CAPTCHA
 */
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const captchaQuestion = document.getElementById('captcha-question');
    captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
    captchaQuestion.setAttribute('data-answer', (num1 + num2).toString());
    
    // Clear previous answer
    const answerInput = document.getElementById('captcha-answer');
    if (answerInput) {
        answerInput.value = '';
    }
}

// Initialize captcha when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateCaptcha();
});

// Chat Widget Functionality
function initChatWidget() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatPopup = document.querySelector('.chat-popup');
    const closeChat = document.querySelector('.close-chat');

    if (!chatToggle || !chatPopup || !closeChat) return;

    chatToggle.addEventListener('click', () => {
        chatPopup.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
        chatPopup.classList.remove('active');
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatPopup.contains(e.target) && 
            !chatToggle.contains(e.target) && 
            chatPopup.classList.contains('active')) {
            chatPopup.classList.remove('active');
        }
    });
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', initChatWidget);

// Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all modal elements and their triggers
    const modalConfig = {
        'privacy-policy-link': 'privacy-policy-modal',
        'terms-of-service-link': 'terms-of-service-modal',
        'cookie-policy-link': 'cookie-policy-modal'
    };

    // Set up click handlers for each modal
    Object.entries(modalConfig).forEach(([triggerId, modalId]) => {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);
        const closeBtn = modal?.querySelector('.close-btn');

        if (trigger && modal) {
            // Open modal
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'block';
            });

            // Close button
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            // Close when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });

    // Global escape key handler for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
});

// Header transparency on scroll
function updateHeaderBackground() {
    const header = document.querySelector('header');
    if (window.scrollY === 0) {
        header.classList.add('at-top');
        header.style.backgroundColor = 'transparent';
        header.style.boxShadow = 'none';
    } else {
        header.classList.remove('at-top');
        header.style.backgroundColor = 'var(--header-background)';
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
}

// Force scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    updateHeaderBackground();
});

// Add scroll event listener
window.addEventListener('scroll', updateHeaderBackground);

// Initialize header state
updateHeaderBackground();
