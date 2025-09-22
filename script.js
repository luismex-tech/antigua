document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const directoryGrid = document.getElementById('directory-grid');
    const filtersContainer = document.getElementById('filters-container');
    const searchBox = document.getElementById('search-box');
    const noResults = document.getElementById('no-results');

    // Modal
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    // Lightbox
    const lightboxContainer = document.getElementById('lightbox-container');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    // --- Estado de la aplicación ---
    let allBusinesses = [];
    let activeFilter = 'Todos';

    // --- Iconos SVG ---
    const icons = {
        whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
        instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
        whatsappModal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`
    };

    // --- Funciones principales ---

    // Cargar datos desde el JSON
    async function fetchBusinesses() {
        try {
            const response = await fetch('negocios.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allBusinesses = await response.json();
            setupFilters();
            renderBusinesses(allBusinesses);
        } catch (error) {
            console.error("No se pudieron cargar los datos de los negocios:", error);
            directoryGrid.innerHTML = `<p class="no-results" style="grid-column: 1 / -1;">Error al cargar la información. Por favor, intente más tarde.</p>`;
        }
    }

    // Renderizar las tarjetas de negocio
    function renderBusinesses(businesses) {
        directoryGrid.innerHTML = '';
        noResults.classList.toggle('hidden', businesses.length > 0);

        businesses.forEach(business => {
            const card = document.createElement('article');
            card.className = 'business-card';
            card.innerHTML = `
                <img src="${business.imagen_url}" alt="Imagen de ${business.nombre}" class="card-image">
                <div class="card-content">
                    <div class="card-tags">
                        <span class="tag tag-category">${business.categoria}</span>
                        <span class="tag tag-colonia">${business.colonia}</span>
                    </div>
                    <h3>${business.nombre}</h3>
                    <p class="description">${business.descripcion_corta}</p>
                    <div class="card-actions">
                        <div class="social-icons">
                            <a href="https://wa.me/${business.redes.whatsapp}" target="_blank" title="WhatsApp">${icons.whatsapp}</a>
                            <a href="${business.redes.instagram}" target="_blank" title="Instagram">${icons.instagram}</a>
                        </div>
                        <button class="details-btn" data-id="${business.id}">Ver Más</button>
                    </div>
                </div>`;
            directoryGrid.appendChild(card);
        });
    }

    // Crear botones de filtro
    function setupFilters() {
        const categories = ['Todos', ...new Set(allBusinesses.map(b => b.categoria))];
        filtersContainer.innerHTML = categories.map(cat =>
            `<button class="filter-btn ${cat === 'Todos' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`
        ).join('');
    }

    // Lógica combinada de filtro y búsqueda
    function filterAndSearch() {
        const searchTerm = searchBox.value.toLowerCase();
        let filteredBusinesses = allBusinesses
            .filter(b => activeFilter === 'Todos' || b.categoria === activeFilter)
            .filter(b =>
                b.nombre.toLowerCase().includes(searchTerm) ||
                b.descripcion_corta.toLowerCase().includes(searchTerm) ||
                b.categoria.toLowerCase().includes(searchTerm)
            );
        renderBusinesses(filteredBusinesses);
    }

    // --- Lógica del Modal y Lightbox ---

    // Abrir y poblar el modal
    function openModal(businessId) {
        const business = allBusinesses.find(b => b.id === businessId);
        if (!business) return;

        const galleryHTML = business.galeria_urls && business.galeria_urls.length > 0
            ? `<div class="modal-gallery">
                   <h3>Galería</h3>
                   <div class="gallery-images">
                       ${business.galeria_urls.map(url => `<img src="${url}" alt="Foto de la galería de ${business.nombre}" class="gallery-thumbnail">`).join('')}
                   </div>
               </div>`
            : '';

        modalBody.innerHTML = `
            <div class="modal-body-content">
                <h2>${business.nombre}</h2>
                <p class="description-long">${business.descripcion_larga}</p>
                ${galleryHTML}
                <div class="modal-actions">
                    <a href="https://wa.me/${business.redes.whatsapp}" target="_blank" class="modal-btn whatsapp">
                        ${icons.whatsappModal}
                        Enviar WhatsApp
                    </a>
                </div>
            </div>`;
        modalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Cerrar el modal
    function closeModal() {
        modalContainer.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Abrir el lightbox
    function openLightbox(imageUrl) {
        lightboxImage.src = imageUrl;
        lightboxContainer.classList.remove('hidden');
    }

    // Cerrar el lightbox
    function closeLightbox() {
        lightboxContainer.classList.add('hidden');
    }

    // --- Event Listeners ---

    searchBox.addEventListener('input', filterAndSearch);

    filtersContainer.addEventListener('click', e => {
        if (e.target.matches('.filter-btn')) {
            filtersContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            activeFilter = e.target.dataset.filter;
            filterAndSearch();
        }
    });

    directoryGrid.addEventListener('click', e => {
        if (e.target.matches('.details-btn')) {
            openModal(parseInt(e.target.dataset.id));
        }
    });

    modalClose.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', e => {
        if (e.target === modalContainer) closeModal();
    });

    modalBody.addEventListener('click', e => {
        if (e.target.matches('.gallery-thumbnail')) {
            openLightbox(e.target.src);
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxContainer.addEventListener('click', e => {
        if (e.target === lightboxContainer) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (!lightboxContainer.classList.contains('hidden')) {
                closeLightbox();
            } else if (!modalContainer.classList.contains('hidden')) {
                closeModal();
            }
        }
    });

    // --- Iniciar la aplicación ---
    fetchBusinesses();
});
