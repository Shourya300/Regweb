const form = document.getElementById('volunteer-form');

// === Helper Functions ===
function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function validate() {
  clearErrors();
  let valid = true;

  // Name: Required, only letters+spaces
  const name = form.name.value.trim();
  if (!name) {
    showError('nameError', 'Name is required.');
    valid = false;
  } else if (/[^a-zA-Z\s]/.test(name)) {
    showError('nameError', 'Name can only contain letters and spaces.');
    valid = false;
  }

  // Enrollment: Required, alphanumeric only
  const enrollment = form.enrollment.value.trim();
  if (!enrollment) {
    showError('enrollmentError', 'Enrollment is required.');
    valid = false;
  } else if (!/^[a-zA-Z0-9]+$/.test(enrollment)) {
    showError('enrollmentError', 'Enrollment must be alphanumeric.');
    valid = false;
  }

  // Email: Required, must end with @st.niituniversity.in
  const email = form.email.value.trim();
  if (!email) {
    showError('emailError', 'Email is required.');
    valid = false;
  } else if (!/^[\w\.-]+@st\.niituniversity\.in$/.test(email)) {
    showError('emailError', 'Please use your college email ending with @st.niituniversity.in');
    valid = false;
  }

  // Mobile: Required, exactly 10 digits
  const mobile = form.mobile.value.trim();
  if (!mobile) {
    showError('mobileError', 'Mobile number is required.');
    valid = false;
  } else if (!/^\d{10}$/.test(mobile)) {
    showError('mobileError', 'Enter a valid 10-digit mobile number.');
    valid = false;
  }

  // Preferred team required
  if (!form.preferredTeam.value) {
    showError('teamError', 'Please select a team.');
    valid = false;
  }

  // Reason: required, min length 10
  const reason = form.reason.value.trim();
  if (!reason) {
    showError('reasonError', 'Please share your reason.');
    valid = false;
  } else if (reason.length < 10) {
    showError('reasonError', 'Reason should be at least 10 characters.');
    valid = false;
  }

  return valid;
}

// === Google Apps Script Web App URL ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbw7AVy8vmW6Z90sjR3VggVY9uIsAnxUJu1DnIgVkIV279JtDv89_QYjLXy_55OTjcjK/exec'; // <-- PUT YOUR APPS SCRIPT WEB APP URL HERE

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!validate()) return;

  // Prepare data to send to Google Apps Script
  const formData = new FormData(form);

  // All your old UI actions are kept:
  const thankYou = document.getElementById('thank-you');

  try {
    // Send data to Google Sheet via Apps Script web app
    await fetch(scriptURL, { method: 'POST', body: formData });

    // Show thank you message and reset as before
    thankYou.classList.remove('hidden');
    form.reset();
    setTimeout(() => {
      thankYou.classList.add('hidden');
    }, 3500);
  } catch (error) {
    alert('There was an error submitting your form. Please try again.');
  }
});
