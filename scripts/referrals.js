// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    
    const referralForm = document.getElementById('referralForm');
    
    if (referralForm) {
        referralForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Collect form data
            const formData = collectFormData();
            
            // Disable submit button to prevent double submission
            const submitBtn = referralForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            // Send email
            sendReferralEmail(formData)
                .then(() => {
                    showNotification('Referral submitted successfully! We will contact the patient soon.', 'success');
                    referralForm.reset();
                })
                .catch(() => {
                    showNotification('Failed to submit referral. Please try again or call us directly.', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Referral';
                });
        });
        
        // Add input validation feedback
        const inputs = referralForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = '#009FE3';
                this.style.boxShadow = '0 0 0 4px rgba(0, 159, 227, 0.1)';
            });
            
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#e0e0e0';
                }
            });
        });

        // Add treatment checkbox validation
        const treatmentCheckboxes = referralForm.querySelectorAll('input[name="treatment"]');
        treatmentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateTreatmentSelection);
        });
    }
});

// Collect form data
function collectFormData() {
    const formData = {};
    
    // Referring Dentist
    formData.dentistName = document.getElementById('dentistName').value.trim();
    formData.gdcNumber = document.getElementById('gdcNumber').value.trim();
    formData.dentistPhone = document.getElementById('dentistPhone').value.trim();
    formData.dentistEmail = document.getElementById('dentistEmail').value.trim();
    formData.practiceAddress = document.getElementById('practiceAddress').value.trim();
    formData.referralType = document.getElementById('referralType').value;
    
    // Patient Information
    formData.patientName = document.getElementById('patientName').value.trim();
    formData.patientPhone = document.getElementById('patientPhone').value.trim();
    formData.patientAddress = document.getElementById('patientAddress').value.trim();
    
    // Date of Birth
    formData.dobDay = document.getElementById('dobDay').value;
    formData.dobMonth = document.getElementById('dobMonth').value;
    formData.dobYear = document.getElementById('dobYear').value;
    
    // Get month name for display
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[parseInt(formData.dobMonth)] || formData.dobMonth;
    
    formData.dateOfBirth = `${formData.dobDay} ${monthName} ${formData.dobYear}`;
    
    // Medical Information
    formData.currentMedication = document.getElementById('currentMedication').value.trim();
    formData.allergies = document.getElementById('allergies').value.trim();
    formData.medicalHistory = document.getElementById('medicalHistory').value.trim();
    
    // Treatment(s) Required
    const treatments = [];
    document.querySelectorAll('input[name="treatment"]:checked').forEach(checkbox => {
        treatments.push(checkbox.value);
    });
    formData.treatments = treatments.join(', ');
    
    // Additional Questions
    formData.prosthesisPlanned = document.querySelector('input[name="prosthesisPlanned"]:checked')?.value || 'Not specified';
    formData.sedationNeeded = document.querySelector('input[name="sedationNeeded"]:checked')?.value || 'Not specified';
    
    // Terms
    formData.termsAccepted = document.getElementById('termsAccept').checked;
    
    return formData;
}

// Validate entire form
function validateForm() {
    let isValid = true;
    
    // Validate required text inputs
    const requiredFields = [
        'dentistName', 'gdcNumber', 'dentistPhone', 'dentistEmail', 'practiceAddress', 'referralType',
        'patientName', 'patientPhone', 'patientAddress', 'medicalHistory'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate date of birth
    const dobDay = document.getElementById('dobDay');
    const dobMonth = document.getElementById('dobMonth');
    const dobYear = document.getElementById('dobYear');
    
    if (!dobDay.value || !dobMonth.value || !dobYear.value) {
        [dobDay, dobMonth, dobYear].forEach(field => {
            field.style.borderColor = '#e74c3c';
        });
        isValid = false;
    } else {
        const day = parseInt(dobDay.value);
        const month = parseInt(dobMonth.value);
        const year = parseInt(dobYear.value);
        
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1925 || year > 2024) {
            [dobDay, dobMonth, dobYear].forEach(field => {
                field.style.borderColor = '#e74c3c';
            });
            isValid = false;
        } else {
            // Additional validation: check if day is valid for the selected month
            const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (day > daysInMonth[month - 1]) {
                dobDay.style.borderColor = '#e74c3c';
                isValid = false;
            }
        }
    }
    
    // Validate at least one treatment is selected
    const treatmentChecked = document.querySelector('input[name="treatment"]:checked');
    if (!treatmentChecked) {
        showNotification('Please select at least one treatment required.', 'error');
        isValid = false;
    }
    
    // Validate prosthesis and sedation radio buttons
    const prosthesisChecked = document.querySelector('input[name="prosthesisPlanned"]:checked');
    const sedationChecked = document.querySelector('input[name="sedationNeeded"]:checked');
    
    if (!prosthesisChecked || !sedationChecked) {
        showNotification('Please answer all required questions.', 'error');
        isValid = false;
    }
    
    // Validate terms acceptance
    const termsAccept = document.getElementById('termsAccept');
    if (!termsAccept.checked) {
        showNotification('You must accept the terms and conditions.', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    field.style.boxShadow = 'none';
    
    // Required field validation
    if (isRequired && !value) {
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        if (!/^[\d\s\+\-\(\)]+$/.test(value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    // Valid field
    field.style.borderColor = '#27ae60';
    return true;
}

// Validate treatment selection
function validateTreatmentSelection() {
    const treatmentChecked = document.querySelector('input[name="treatment"]:checked');
    const checkboxGroup = document.querySelector('.checkbox-group');
    
    if (treatmentChecked) {
        checkboxGroup.style.borderColor = '#27ae60';
    } else {
        checkboxGroup.style.borderColor = '#e74c3c';
    }
}

// Send referral email
async function sendReferralEmail(formData) {
    // Create email body
    const emailBody = `
DENTAL REFERRAL FORM SUBMISSION
================================

REFERRING DENTIST INFORMATION
-----------------------------
Dentist Name: ${formData.dentistName}
GDC Number: ${formData.gdcNumber}
Phone: ${formData.dentistPhone}
Email: ${formData.dentistEmail}
Practice Address: ${formData.practiceAddress}
Referral Type: ${formData.referralType}

PATIENT INFORMATION
-------------------
Patient Name: ${formData.patientName}
Phone: ${formData.patientPhone}
Address: ${formData.patientAddress}
Date of Birth: ${formData.dateOfBirth}

MEDICAL INFORMATION
-------------------
Current Medication: ${formData.currentMedication || 'None specified'}
Allergies: ${formData.allergies || 'None specified'}
Medical History: ${formData.medicalHistory}

TREATMENT INFORMATION
---------------------
Treatment(s) Required: ${formData.treatments}
Prosthesis Planned: ${formData.prosthesisPlanned}
IV Sedation Needed: ${formData.sedationNeeded}

---
This referral was submitted via The Dental Studios website referral form.
    `.trim();
    
    // In a production environment, you would send this to a backend API
    // For now, we'll create a mailto link as a fallback
    // You can replace this with an actual API call to your email service
    
    // Option 1: Using mailto (opens email client)
    const mailtoLink = `mailto:reception@thedentalstudios.org?subject=New Dental Referral - ${formData.patientName}&body=${encodeURIComponent(emailBody)}`;
    
    // Option 2: You would typically POST to your backend API
    // Example:
    /*
    const response = await fetch('/api/send-referral', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to send email');
    }
    
    return response.json();
    */
    
    // For demonstration, we'll simulate an API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log the data (in production, this would be sent to backend)
            console.log('Referral Form Data:', formData);
            console.log('Email Body:', emailBody);
            
            // Open mailto link
            window.location.href = mailtoLink;
            
            resolve({ success: true });
        }, 1000);
    });
}

// Notification function
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 120px;
            right: 30px;
            background: #ffffff;
            padding: 20px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
            max-width: 400px;
        }
        
        .notification-success {
            border-left-color: #27ae60;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content i {
            font-size: 20px;
        }
        
        .notification-success i {
            color: #27ae60;
        }
        
        .notification-error i {
            color: #e74c3c;
        }
        
        .notification-content span {
            color: #2c3e50;
            font-size: 14px;
            line-height: 1.4;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 90px;
                right: 20px;
                left: 20px;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', '');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Mobile menu initialization function
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navSocialContainer = document.querySelector('.nav-social-container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navSocialContainer) {
        mobileMenuToggle.addEventListener('click', function() {
            navSocialContainer.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    if (hamburgerMenu && navSocialContainer) {
        hamburgerMenu.addEventListener('click', function() {
            navSocialContainer.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }
    
    if (navMenu) {
        const submenuItems = navMenu.querySelectorAll('.has-submenu > a');
        
        submenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    
                    const parentLi = this.parentElement;
                    const isOpen = parentLi.classList.contains('submenu-open');
                    
                    const siblings = Array.from(parentLi.parentElement.children);
                    siblings.forEach(sibling => {
                        if (sibling !== parentLi) {
                            sibling.classList.remove('submenu-open');
                        }
                    });
                    
                    parentLi.classList.toggle('submenu-open');
                }
            });
        });
    }
    
    document.addEventListener('click', function(e) {
        if (navSocialContainer && !e.target.closest('.navbar')) {
            navSocialContainer.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        }
    });
    
    if (navMenu) {
        const navLinks = navMenu.querySelectorAll('a:not(.has-submenu > a)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    navSocialContainer.classList.remove('active');
                    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
                }
            });
        });
    }
}

// Download Referral Form functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle both download buttons (hero and sidebar)
    const downloadBtnHero = document.getElementById('downloadReferralBtn');
    const downloadBtnSidebar = document.getElementById('downloadReferralSidebarBtn');
    
    if (downloadBtnHero) {
        downloadBtnHero.addEventListener('click', function(e) {
            e.preventDefault();
            downloadReferralForm();
        });
    }
    
    if (downloadBtnSidebar) {
        downloadBtnSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            downloadReferralForm();
        });
    }
});

function downloadReferralForm() {
    // Open the PDF in a new tab
    // The PDF has metadata set, so the browser will show "Dental Studio Referral Form" as the title
    // Update this path to match where you upload the PDF on your server
    const pdfUrl = './documents/Dental_Referral_Form.pdf';
    
    // Open in new tab
    window.open(pdfUrl, '_blank');
    
    showNotification('Opening referral form in new tab...', 'success');
}

function generatePrintableForm() {
    // Create a printable HTML version
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dental Referral Form - The Dental Studios</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #009FE3;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #009FE3;
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        
        .header p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            background: #009FE3;
            color: white;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .form-field {
            margin-bottom: 20px;
        }
        
        .form-field label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 13px;
        }
        
        .form-field .input-line {
            border-bottom: 1px solid #333;
            min-height: 30px;
            padding: 5px 0;
        }
        
        .form-field textarea {
            width: 100%;
            min-height: 80px;
            border: 1px solid #333;
            padding: 8px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .checkbox-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .checkbox-box {
            width: 16px;
            height: 16px;
            border: 2px solid #333;
            display: inline-block;
        }
        
        .radio-group {
            display: flex;
            gap: 30px;
            margin-top: 10px;
        }
        
        .radio-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .radio-circle {
            width: 16px;
            height: 16px;
            border: 2px solid #333;
            border-radius: 50%;
            display: inline-block;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>DENTAL REFERRAL FORM</h1>
        <p><strong>The Dental Studios</strong></p>
        <p>398 Victoria Road, G42 8YP Glasgow, United Kingdom</p>
        <p>Phone: 0141 423 6106 | Email: reception@thedentalstudios.org</p>
    </div>
    
    <div class="section">
        <div class="section-title">REFERRING DENTIST INFORMATION</div>
        
        <div class="form-row">
            <div class="form-field">
                <label>Dentist's Full Name *</label>
                <div class="input-line"></div>
            </div>
            <div class="form-field">
                <label>GDC Number *</label>
                <div class="input-line"></div>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-field">
                <label>Contact Phone *</label>
                <div class="input-line"></div>
            </div>
            <div class="form-field">
                <label>Contact Email *</label>
                <div class="input-line"></div>
            </div>
        </div>
        
        <div class="form-field">
            <label>Dental Practice Address *</label>
            <div class="input-line"></div>
            <div class="input-line"></div>
        </div>
        
        <div class="form-field">
            <label>Referral Type *</label>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Oral Surgery</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Orthodontics</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Endodontics</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Periodontics</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Restorative/Prosthodontics</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Special Care Dentistry</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Sedation Referrals</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Diagnostic Imaging</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">PATIENT INFORMATION</div>
        
        <div class="form-row">
            <div class="form-field">
                <label>Patient's Full Name *</label>
                <div class="input-line"></div>
            </div>
            <div class="form-field">
                <label>Patient's Phone *</label>
                <div class="input-line"></div>
            </div>
        </div>
        
        <div class="form-field">
            <label>Patient's Address *</label>
            <div class="input-line"></div>
            <div class="input-line"></div>
        </div>
        
        <div class="form-row">
            <div class="form-field">
                <label>Date of Birth (DD/MM/YYYY) *</label>
                <div class="input-line"></div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">MEDICAL & TREATMENT INFORMATION</div>
        
        <div class="form-field">
            <label>Current Medication</label>
            <div class="input-line"></div>
            <div class="input-line"></div>
        </div>
        
        <div class="form-field">
            <label>Allergies</label>
            <div class="input-line"></div>
            <div class="input-line"></div>
        </div>
        
        <div class="form-field">
            <label>Treatment(s) Required *</label>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Oral Surgery</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Fixed Braces</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Tooth Alignment</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Implants & Missing Teeth</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox-box"></span>
                    <span>Veneers & Crowns</span>
                </div>
            </div>
        </div>
        
        <div class="form-field">
            <label>Patient's Medical History *</label>
            <div class="input-line"></div>
            <div class="input-line"></div>
            <div class="input-line"></div>
        </div>
        
        <div class="form-row">
            <div class="form-field">
                <label>If extraction: is prosthesis planned? *</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <span class="radio-circle"></span>
                        <span>Yes</span>
                    </div>
                    <div class="radio-item">
                        <span class="radio-circle"></span>
                        <span>No</span>
                    </div>
                </div>
            </div>
            
            <div class="form-field">
                <label>Is IV sedation needed? *</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <span class="radio-circle"></span>
                        <span>Yes</span>
                    </div>
                    <div class="radio-item">
                        <span class="radio-circle"></span>
                        <span>No</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>Please return this completed form to: reception@thedentalstudios.org or fax to [FAX NUMBER]</p>
        <p>For urgent referrals, please call: 0141 423 6106</p>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 12px 30px; background: #009FE3; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            Print Form
        </button>
        <button onclick="window.close()" style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-left: 10px;">
            Close
        </button>
    </div>
</body>
</html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}