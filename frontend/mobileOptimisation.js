document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navAndUserContainer = document.getElementById('nav-and-user-container');
    
    if (mobileMenuButton && navAndUserContainer) {
        mobileMenuButton.addEventListener('click', () => {
            navAndUserContainer.classList.toggle('show');
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navAndUserContainer.classList.remove('show');
        }
    });
});