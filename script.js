const form = document.getElementById('volunteer-form');

// === Place your Google Apps Script Web App URL here ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbwO7JQheoZybsVPi2hc1AjrqaAJZ7W2Jq7ncYgywT_qaMgTj-i1ceHbmuLuEJPhmebu/exec';

// Helper array for team options; used to manage dropdown disabling
const TEAMS = [
  "capture",
  "creative",
  "design",
  "curation",
  "marketing",
  "production",
  "sponsorship",
  "technical"
];

// Display error message for a field by ID
function showError(id, message) {
  document.getElementById(id).textContent = message;
}

// Clear all error messages
function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

// Update the options of team preference dropdowns to avoid duplicates
function updateTeamPreferences() {
  const pref1 = document.getElementById('teamPref1').value;
  const pref2 = document.getElementById('teamPref2').value;

  setTeamOptions('teamPref2', pref1 ? [pref1] : []);
  setTeamOptions('teamPref3', [pref1, pref2].filter(Boolean));
}

// Enable/disable options in a select element based on exclusions
function setTeamOptions(selectId, excludeArr) {
  const select = document.getElementById(selectId);
  const currentValue = select.value;

  Array.from(select.options).forEach(opt => {
    if (!opt.value) return; // Skip placeholder options
    opt.disabled = excludeArr.includes(opt.value);
  });

  // Reset if currently selected value is disabled
  if (excludeArr.includes(currentValue)) {
    select.value = '';
  }
}

// Validate the form fields including team preferences
function validate() {
  clearErrors();
  let valid = true;

  const name = form.name.value.trim();
  if (!name) {
    showError('nameError', 'Name is required.');
    valid = false;
  } else if (/[^a-zA-Z\s]/.test(name)) {
    showError('nameError', 'Name can only contain letters and spaces.');
    valid = false;
  }

  const enrollment = form.enrollment.value.trim();
  if (!enrollment) {
    showError('enrollmentError', 'Enrollment is required.');
    valid = false;
  } else if (!/^[a-zA-Z0-9]+$/.test(enrollment)) {
    showError('enrollmentError', 'Enrollment must be alphanumeric.');
    valid = false;
  }

  const email = form.email.value.trim();
  if (!email) {
    showError('emailError', 'Email is required.');
    valid = false;
  } else if (!/^[\w\.-]+@st\.niituniversity\.in$/.test(email)) {
    showError('emailError', 'Please use your college email ending with @st.niituniversity.in');
    valid = false;
  }

  const mobile = form.mobile.value.trim();
  if (!mobile) {
    showError('mobileError', 'Mobile number is required.');
    valid = false;
  } else if (!/^\d{10}$/.test(mobile)) {
    showError('mobileError', 'Enter a valid 10-digit mobile number.');
    valid = false;
  }

  const team1 = form.teamPref1.value;
  const team2 = form.teamPref2.value;
  const team3 = form.teamPref3.value;

  if (!team1) {
    showError('teamPref1Error', 'Please select your first preference.');
    valid = false;
  }

  if (team2 && team2 === team1) {
    showError('teamPref2Error', 'Second preference must differ from first.');
    valid = false;
  }

  if (team3 && (team3 === team1 || team3 === team2)) {
    showError('teamPref3Error', 'Third preference must differ from above.');
    valid = false;
  }

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

// Attach change event listeners on team preferences for disabling duplicate options
['teamPref1', 'teamPref2'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateTeamPreferences);
});

// On page load, initialize dropdown option states
window.addEventListener('DOMContentLoaded', updateTeamPreferences);

// Handle the form submission
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!validate()) return;

  const formData = new FormData(form);

  try {
    // Send POST request to Google Apps Script to log data into Google Sheets
    await fetch(scriptURL, {
      method: 'POST',
      body: formData
    });

    // Show thank you message and reset form
    const thankYou = document.getElementById('thank-you');
    thankYou.classList.remove('hidden');
    form.reset();

    // Reset team preferences disables after reset
    updateTeamPreferences();

    setTimeout(() => {
      thankYou.classList.add('hidden');
    }, 3500);

  } catch (error) {
    alert('There was an error submitting your form. Please try again.');
    console.error('Form submission error:', error);
  }
});
