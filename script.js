// State management
let donationData = {
    selectedAmount: 0,
    totalRaised: 0,
    goalAmount: 10000,
    donorCount: 0,
    isRecurring: false
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSavedData();
    updateProgress();
});

// Initialize app with default values
function initializeApp() {
    console.log('Donation App Initialized');
}

// Setup all event listeners
function setupEventListeners() {
    // Amount card selection
    const amountCards = document.querySelectorAll('.amount-card');
    amountCards.forEach(card => {
        card.addEventListener('click', function() {
            selectAmount(this);
        });
    });

    // Custom amount input
    const customAmountInput = document.getElementById('customAmount');
    customAmountInput.addEventListener('input', function() {
        clearAmountSelection();
        donationData.selectedAmount = parseFloat(this.value) || 0;
    });

    // Recurring checkbox
    const recurringCheckbox = document.getElementById('recurring');
    recurringCheckbox.addEventListener('change', function() {
        donationData.isRecurring = this.checked;
    });

    // Donate button
    const donateBtn = document.getElementById('donateBtn');
    donateBtn.addEventListener('click', processDonation);

    // Close modal button
    const closeModalBtn = document.getElementById('closeModal');
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal on background click
    const modal = document.getElementById('successModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Select predefined amount
function selectAmount(card) {
    clearAmountSelection();
    card.classList.add('active');
    donationData.selectedAmount = parseFloat(card.dataset.amount);
    document.getElementById('customAmount').value = '';
}

// Clear all amount selections
function clearAmountSelection() {
    const amountCards = document.querySelectorAll('.amount-card');
    amountCards.forEach(card => card.classList.remove('active'));
}

// Validate donation form
function validateDonation() {
    const name = document.getElementById('donorName').value.trim();
    const email = document.getElementById('donorEmail').value.trim();
    const amount = donationData.selectedAmount;

    if (amount <= 0) {
        alert('Please select or enter a donation amount');
        return false;
    }

    if (!name) {
        alert('Please enter your name');
        document.getElementById('donorName').focus();
        return false;
    }

    if (!email) {
        alert('Please enter your email address');
        document.getElementById('donorEmail').focus();
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        document.getElementById('donorEmail').focus();
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Process donation
function processDonation() {
    if (!validateDonation()) {
        return;
    }

    const name = document.getElementById('donorName').value.trim();
    const email = document.getElementById('donorEmail').value.trim();
    const amount = donationData.selectedAmount;

    // Simulate payment processing
    showLoadingState();

    setTimeout(() => {
        // Update totals
        donationData.totalRaised += amount;
        donationData.donorCount += 1;

        // Save data
        saveData();

        // Update UI
        updateProgress();
        showSuccessModal(amount, email);
        resetForm();
        hideLoadingState();
    }, 1500);
}

// Show loading state
function showLoadingState() {
    const donateBtn = document.getElementById('donateBtn');
    donateBtn.disabled = true;
    donateBtn.innerHTML = '<span class="btn-text">Processing...</span>';
}

// Hide loading state
function hideLoadingState() {
    const donateBtn = document.getElementById('donateBtn');
    donateBtn.disabled = false;
    donateBtn.innerHTML = '<span class="btn-text">Donate Now</span><span class="btn-icon">❤️</span>';
}

// Show success modal
function showSuccessModal(amount, email) {
    const modal = document.getElementById('successModal');
    const modalAmount = document.getElementById('modalAmount');
    const modalEmail = document.getElementById('modalEmail');

    modalAmount.textContent = '$' + amount.toFixed(2);
    modalEmail.textContent = email;

    modal.classList.add('show');

    // Send confirmation email (simulated)
    sendConfirmationEmail(email, amount);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Reset form
function resetForm() {
    document.getElementById('donorName').value = '';
    document.getElementById('donorEmail').value = '';
    document.getElementById('customAmount').value = '';
    document.getElementById('recurring').checked = false;
    clearAmountSelection();
    donationData.selectedAmount = 0;
    donationData.isRecurring = false;
}

// Update progress bar
function updateProgress() {
    const raised = donationData.totalRaised;
    const goal = donationData.goalAmount;
    const percentage = Math.min((raised / goal) * 100, 100);

    const progressFill = document.getElementById('progressFill');
    const raisedElement = document.getElementById('raised');
    const donorsCountElement = document.getElementById('donorsCount');

    // Animate progress bar
    setTimeout(() => {
        progressFill.style.width = percentage + '%';
    }, 100);

    // Update text with animation
    animateValue(raisedElement, 0, raised, 1000);
    
    donorsCountElement.textContent = donationData.donorCount;
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = '$' + Math.floor(current).toLocaleString();
    }, 16);
}

// Save data (simulated - in production would use backend)
function saveData() {
    const data = {
        totalRaised: donationData.totalRaised,
        donorCount: donationData.donorCount,
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage for persistence
    try {
        console.log('Saving donation data:', data);
        // In production, this would be an API call
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Load saved data (simulated)
function loadSavedData() {
    try {
        // In production, this would fetch from backend
        // For demo, start with some initial values
        donationData.totalRaised = 2450;
        donationData.donorCount = 37;
        
        console.log('Loaded donation data:', donationData);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Send confirmation email (simulated)
function sendConfirmationEmail(email, amount) {
    console.log(`Sending confirmation email to ${email} for $${amount}`);
    
    // In production, this would make an API call to send actual email
    const emailData = {
        to: email,
        subject: 'Thank you for your donation!',
        amount: amount,
        recurring: donationData.isRecurring,
        timestamp: new Date().toISOString()
    };
    
    console.log('Email data:', emailData);
}

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Calculate impact based on donation amount
function calculateImpact(amount) {
    const impacts = [];
    
    if (amount >= 25) {
        const schoolSupplies = Math.floor(amount / 25);
        impacts.push(`${schoolSupplies} child(ren) will receive school supplies`);
    }
    
    if (amount >= 50) {
        const familyMeals = Math.floor(amount / 50);
        impacts.push(`${familyMeals} family(ies) will be fed for a week`);
    }
    
    if (amount >= 100) {
        const medicalCare = Math.floor(amount / 100);
        impacts.push(`${medicalCare} person(s) will receive medical care`);
    }
    
    return impacts;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateDonation,
        isValidEmail,
        formatCurrency,
        calculateImpact
    };
}