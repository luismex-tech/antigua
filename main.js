let negociosData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('negocios.json')
    .then(res => res.json())
    .then(data => {
      negociosData = data.negocios;
      mostrarNegocios(negociosData);
      mostrarCategorias(negociosData);
    })
    .catch(err => console.error('Error al cargar datos:', err));

  document.getElementById('buscador').addEventListener('input', filtrarNegocios);

  document.getElementById('anunciateBtn').onclick = () => {
    window.open(
      'https://wa.me/4776772422?text=Hola%20Quiero%20anunciar%20mi%20negocio%20en%20Tu%20Negocio%20en%20Línea',
      '_blank'
    );
  };

  // Menú hamburguesa
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
});

function mostrarNegocios(negocios) {
  const lista = document.getElementById('business-list');
  lista.innerHTML = '';
  negocios.forEach((negocio, i) => {
    const card = document.createElement('div');
    card.className = 'negocio-card';

    // Crear mini galería
    const galeriaMini = negocio.galeria
      .map(
        (img, j) =>
          `<img src="${img}" alt="Galería ${j + 1}" onclick="abrirLightbox('${img}')" loading="lazy" />`
      )
      .join('');

    card.innerHTML = `
      <img src="${negocio.imagen_principal}" alt="Foto ${negocio.nombre}" class="cover-img" loading="lazy" />
      <h3>${negocio.nombre}</h3>
      <div class="categoria-chip">${negocio.categoria}</div>
      <div class="descripcion">${negocio.descripcion}</div>
      <div class="galeria-mini">${galeriaMini}</div>
      <button class="ver-mas" onclick="abrirModal(${i})">Ver más</button>
    `;
    lista.appendChild(card);
  });
}

function mostrarCategorias(negocios) {
  const catsDiv = document.getElementById('categorias');
  const categorias = [...new Set(negocios.map((n) => n.categoria))].sort();
  catsDiv.innerHTML = '';
  categorias.forEach((cat) => {
    const chip = document.createElement('span');
    chip.className = 'categoria-chip';
    chip.textContent = cat;
    chip.onclick = () => filtrarPorCategoria(cat, chip);
    catsDiv.appendChild(chip);
  });
}

let categoriaActiva = null;

function filtrarNegocios() {
  const filtro = document.getElementById('buscador').value.trim().toLowerCase();
  let filtrados = negociosData.filter(
    (n) =>
      n.nombre.toLowerCase().includes(filtro) ||
      n.descripcion.toLowerCase().includes(filtro) ||
      n.categoria.toLowerCase().includes(filtro)
  );

  // Si hay categoría activa, filtrar también por ella
  if (categoriaActiva) {
    filtrados = filtrados.filter((n) => n.categoria === categoriaActiva);
  }

  mostrarNegocios(filtrados);
}

function filtrarPorCategoria(cat, chipElem) {
  if (categoriaActiva === cat) {
    // Desactivar filtro
    categoriaActiva = null;
    chipElem.classList.remove('activo');
    filtrarNegocios();
  } else {
    categoriaActiva = cat;
    // Quitar clase activo de todos chips
    const chips = document.querySelectorAll('#categorias .categoria-chip');
    chips.forEach((c) => c.classList.remove('activo'));
    chipElem.classList.add('activo');
    filtrarNegocios();
  }
}

function abrirModal(i) {
  const negocio = negociosData[i];
  const modal = document.getElementById('modalNegocio');
  modal.classList.remove('oculto');

  // Galería mini dentro modal
  const galeriaModal = negocio.galeria
    .map(
      (img) =>
        `<img src="${img}" alt="Galería" loading="lazy" onclick="abrirLightbox('${img}')" />`
    )
    .join('');

  modal.innerHTML = `
    <div class="modal-contenido">
      <button class="modal-cerrar" onclick="cerrarModal()">×</button>
      <h2>${negocio.nombre}</h2>
      <div class="categoria-chip">${negocio.categoria}</div>
      <div class="descripcion">${negocio.descripcion}</div>
      <div class="datos">
        Tel: <a href="tel:${negocio.telefono}">${negocio.telefono}</a><br>
        <button class="boton-wsp" onclick="window.open('https://wa.me/${negocio.whatsapp}?text=Hola%20quisiera%20info%20de%20${encodeURIComponent(
    negocio.nombre
  )}','_blank')">WhatsApp</button>
        <button class="boton-maps" onclick="window.open('${
          negocio.maps
        }','_blank')">Ver ubicación</button>
      </div>
      <div class="redes">
        ${
          negocio.redes.facebook
            ? `<a href="${negocio.redes.facebook}" target="_blank" rel="noopener"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook"></a>`
            : ''
        }
        ${
          negocio.redes.instagram
            ? `<a href="${negocio.redes.instagram}" target="_blank" rel="noopener"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram"></a>`
            : ''
        }
      </div>
      <div class="modal-galeria">
        ${galeriaModal}
      </div>
    </div>
  `;
}

function cerrarModal() {
  const modal = document.getElementById('modalNegocio');
  modal.classList.add('oculto');
  modal.innerHTML = '';
}

function abrirLightbox(imgUrl) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = imgUrl;
  lightbox.classList.remove('oculto');
}
document.querySelector('.lightbox-close').onclick = () => {
  document.getElementById('lightbox').classList.add('oculto');
};

function mostrarCategorias(negocios) {
  const catsDiv = document.getElementById('categorias');
  const categorias = [...new Set(negocios.map(n=>n.categoria))];
  catsDiv.innerHTML = '';
  categorias.forEach(cat => {
    const chip = document.createElement('span');
    chip.className = 'categoria-chip';
    chip.textContent = cat;
    chip.onclick = () => filtrarPorCategoria(cat);
    catsDiv.appendChild(chip);
  });
}

function filtrarNegocios() {
  const filtro = document.getElementById('buscador').value.trim().toLowerCase();
  const filtrados = negociosData.filter(n =>
    n.nombre.toLowerCase().includes(filtro) ||
    n.descripcion.toLowerCase().includes(filtro)
  );
  mostrarNegocios(filtrados);
}

function filtrarPorCategoria(cat) {
  const filtrados = negociosData.filter(n => n.categoria === cat);
  mostrarNegocios(filtrados);
}

function abrirModal(i) {
  const negocio = negociosData[i];
  const modal = document.getElementById('modalNegocio');
  modal.classList.remove('oculto');
  modal.innerHTML = `
    <div class="modal-contenido">
      <button class="modal-cerrar" onclick="cerrarModal()">×</button>
      <h2>${negocio.nombre}</h2>
      <div class="categoria-chip">${negocio.categoria}</div>
      <div class="descripcion">${negocio.descripcion}</div>
      <div class="datos">
        Tel: <a href="tel:${negocio.telefono}">${negocio.telefono}</a><br>
        <button class="boton-wsp" onclick="window.open('https://wa.me/${negocio.whatsapp}?text=Hola%20quisiera%20info%20de%20${negocio.nombre}','_blank')">WhatsApp</button>
        <button class="boton-maps" onclick="window.open('${negocio.maps}','_blank')">Ver ubicación</button>
      </div>
      <div class="redes">
        ${negocio.redes.facebook ? `<a href="${negocio.redes.facebook}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook"></a>` : ""}
        ${negocio.redes.instagram ? `<a href="${negocio.redes.instagram}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram"></a>` : ""}
      </div>
      <div class="modal-galeria">
        ${negocio.galeria.map(img => `<img src="${img}" onclick="abrirLightbox('${img}')">`).join('')}
      </div>
    </div>
  `;
}
function cerrarModal() { document.getElementById('modalNegocio').classList.add('oculto'); }

function abrirLightbox(img) {
  document.getElementById('lightbox-img').src = img;
  document.getElementById('lightbox').classList.remove('oculto');
}
document.querySelector('.lightbox-close').onclick = ()=>{
  document.getElementById('lightbox').classList.add('oculto');
};
