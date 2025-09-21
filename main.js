document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        // Cambiar icono de hamburguesa a cerrar y viceversa
        const icon = menuToggle.querySelector('i');
        if (navList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer clic en un enlace (solo en móvil)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Animación al hacer scroll
    const animateElements = document.querySelectorAll('.hero-content, .hero-image, .business-card, .about-content, .main-footer .footer-col');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Porcentaje del elemento visible para activar la animación
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                entry.target.classList.add('is-visible'); // Clase para iniciar la animación
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Añadir clase 'active' a los enlaces de navegación según la sección visible (simple)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Inicializar 'active' para la primera sección al cargar
    if (sections.length > 0 && navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
});
