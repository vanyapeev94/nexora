/**
 * Nexora - Contact Form
 * Validation, phone mask, submission handling.
 */

(function () {
  'use strict';

  // Phone mask implementation
  function initPhoneMask(input) {
    input.addEventListener('input', function (e) {
      let value = this.value.replace(/\D/g, '');
      let formatted = '';
      
      if (value.length === 0) {
        formatted = '';
      } else if (value.startsWith('373') || value.startsWith('7') || value.startsWith('380')) {
        // Format international numbers
        if (value.length <= 3) {
          formatted = '+' + value;
        } else {
          formatted = '+' + value.substring(0,3) + ' ' + value.substring(3,5) + ' ' + value.substring(5,8) + ' ' + value.substring(8,11);
        }
      } else {
        // Default format
        if (value.length <= 1) formatted = '+' + value;
        else if (value.length <= 4) formatted = '+' + value.substring(0,1) + ' ' + value.substring(1);
        else if (value.length <= 7) formatted = '+' + value.substring(0,1) + ' (' + value.substring(1,4) + ') ' + value.substring(4);
        else formatted = '+' + value.substring(0,1) + ' (' + value.substring(1,4) + ') ' + value.substring(4,7) + '-' + value.substring(7,9) + '-' + value.substring(9,11);
      }
      
      this.value = formatted.trim();
    });
    
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && this.value.length <= 2) {
        this.value = '';
        e.preventDefault();
      }
    });
  }

  // Validate email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Show field error
  function showError(field, message) {
    field.classList.add('error');
    let errEl = field.parentNode.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      field.parentNode.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  // Clear field error
  function clearError(field) {
    field.classList.remove('error');
    const errEl = field.parentNode.querySelector('.field-error');
    if (errEl) errEl.remove();
  }

  // Main submit function - replace with real API call
  async function submitContactForm(data) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    // TODO: Replace with real fetch:
    // const response = await fetch('/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    // if (!response.ok) throw new Error('Server error');
    return { success: true };
  }

  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const emailInput = form.querySelector('[name="email"]');
    const projectSelect = form.querySelector('[name="project_type"]');
    const messageInput = form.querySelector('[name="message"]');
    const submitBtn = form.querySelector('[type="submit"]');
    const successEl = form.querySelector('.form-success') || form.nextElementSibling;

    if (phoneInput) initPhoneMask(phoneInput);

    // Clear errors on input
    [nameInput, phoneInput, emailInput].forEach(input => {
      if (input) input.addEventListener('input', () => clearError(input));
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      let valid = true;

      // Validate name
      if (!nameInput || nameInput.value.trim().length < 2) {
        showError(nameInput, 'Введите ваше имя');
        valid = false;
      } else clearError(nameInput);

      // Validate phone
      const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      if (!phoneInput || phoneDigits.length < 7) {
        showError(phoneInput, 'Введите номер телефона');
        valid = false;
      } else clearError(phoneInput);

      // Validate email (optional but must be valid if filled)
      if (emailInput && emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Некорректный email');
        valid = false;
      } else if (emailInput) clearError(emailInput);

      if (!valid) return;

      // Submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      try {
        const formData = {
          name: nameInput ? nameInput.value.trim() : '',
          phone: phoneInput ? phoneInput.value.trim() : '',
          email: emailInput ? emailInput.value.trim() : '',
          project_type: projectSelect ? projectSelect.value : '',
          message: messageInput ? messageInput.value.trim() : ''
        };

        await submitContactForm(formData);

        // Show success
        form.style.display = 'none';
        if (successEl) {
          successEl.style.display = 'block';
          successEl.classList.add('visible');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку →';
        // Show generic error
        const errDiv = document.createElement('div');
        errDiv.className = 'form-error';
        errDiv.textContent = 'Произошла ошибка. Попробуйте ещё раз.';
        form.insertBefore(errDiv, submitBtn);
        setTimeout(() => errDiv.remove(), 4000);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

  window.submitContactForm = submitContactForm;

})();
