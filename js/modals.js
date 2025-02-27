const modalContent = {
    'privacy-policy': {
        title: 'Privacy Policy',
        content: `
            <p>At Armour Technologies Limited, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
            <h3>Information We Collect</h3>
            <p>We may collect the following types of information:</p>
            <ul>
                <li>Contact details (e.g., name, email address, phone number)</li>
                <li>Business information (e.g., company name, job title)</li>
                <li>Technical data (e.g., IP address, browser type, operating system)</li>
                <li>Usage data (e.g., pages visited, time spent on the website)</li>
            </ul>
            <br>
            <h3>How We Use Your Information</h3>
            <p>We use your information for the following purposes:</p>
            <ul>
                <li>To provide and improve our services</li>
                <li>To communicate with you</li>
                <li>To personalise your experience</li>
                <li>To analyse website usage</li>
                <li>To comply with legal obligations</li>
            </ul>
            <br>
            <h3>Sharing Your Information</h3>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this Privacy Policy.</p>
            <br>
            <h3>Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. You can also object to the processing of your data and request data portability.</p>
            <br>
            <h3>Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@armourtechnologies.co.uk">info@armourtechnologies.co.uk</a>.</p>`
    },
    'terms-of-service': {
        title: 'Terms of Service',
        content: `
            <p>Welcome to Armour Technologies Limited. By using our website, you agree to comply with and be bound by the following terms and conditions of use.</p>
            <h3>Use of the Website</h3>
            <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.</p>
            <br>
            <h3>Intellectual Property</h3>
            <p>All content on this website, including text, graphics, logos, and images, is the property of Armour Technologies Limited and is protected by copyright and other intellectual property laws.</p>
            <br>
            <h3>Limitation of Liability</h3>
            <p>Armour Technologies Limited will not be liable for any damages arising from the use of this website or the information provided on it.</p>
            <br>
            <h3>Changes to the Terms</h3>
            <p>We may update these terms of service from time to time. Any changes will be posted on this page, and your continued use of the website constitutes acceptance of the updated terms.</p>
            <br>
            <h3>Contact Us</h3>
            <p>If you have any questions about these terms of service, please contact us at <a href="mailto:info@armourtechnologies.co.uk">info@armourtechnologies.co.uk</a>.</p>`
    },
    'cookie-policy': {
        title: 'Cookie Policy',
        content: `
            <p>This website uses cookies to enhance your browsing experience. By using our website, you agree to our use of cookies.</p>
            <h3>What are cookies?</h3>
            <p>Cookies are small text files that are stored on your device when you visit a website. They help make websites work more efficiently and provide information to website owners.</p>
            <h3>How we use cookies</h3>
            <ul>
                <li>Essential cookies: Required for basic website functionality</li>
                <li>Analytics cookies: Help us understand how visitors use our website</li>
                <li>Preference cookies: Remember your settings and preferences</li>
                <li>Marketing cookies: Used to deliver relevant advertisements</li>
            </ul>
            <h3>Managing cookies</h3>
            <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>`
    }
};

function initModals() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('modal-container')) {
        const container = document.createElement('div');
        container.id = 'modal-container';
        document.body.appendChild(container);
    }

    // Add click handlers to modal links
    document.querySelectorAll('[id$="-link"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalType = link.id.replace('-link', '');
            showModal(modalType);
        });
    });
}

function showModal(modalType) {
    const modalData = modalContent[modalType];
    if (!modalData) return;

    const modalHtml = `
        <div id="${modalType}-modal" class="modal">
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>${modalData.title}</h2>
                ${modalData.content}
            </div>
        </div>`;

    const container = document.getElementById('modal-container');
    container.innerHTML = modalHtml;

    const modal = container.querySelector('.modal');
    const closeBtn = modal.querySelector('.close-btn');

    modal.style.display = 'block';
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', initModals);
