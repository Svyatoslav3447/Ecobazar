function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.login-container, .register-container');
    const formGroups = document.querySelectorAll('.form-group');
    const formOptions = document.querySelector('.form-options');
    const button = document.querySelector('.login-button, .register-button');
    const registerLink = document.querySelector('.register-link');
    
    if (container) {
        container.classList.add('fade-in');
        
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.classList.add('slide-in');
            }, 300 + (index * 150));
        });
        
        if (formOptions) {
            setTimeout(() => {
                formOptions.classList.add('slide-in');
            }, 300 + (formGroups.length * 150));
        }
        
        if (button) {
            setTimeout(() => {
                button.classList.add('scale-in');
            }, 450 + (formGroups.length * 150));
        }
        
        if (registerLink) {
            setTimeout(() => {
                registerLink.classList.add('slide-in');
            }, 600 + (formGroups.length * 150));
        }
    }
});