let negociosData = [];
document.addEventListener('DOMContentLoaded', () => {
  fetch('negocios.json')
    .then(res => res.json())
    .then(data => {
      negociosData = data.negocios;
      mostrarNegocios(negociosData);
      mostrarCategorias(negociosData);
    });

  document.getElementById('buscador').addEventListener('input', filtrarNegocios);
  document.getElementById('anunciateBtn').onclick = () => {
    window.open('https://wa.me/4776772422?text=Hola%20Quiero%20anunciar%20mi%20negocio%20en%20Tu%20Negocio%20en%20Línea', '_blank');
  }
});

function mostrarNegocios(negocios) {
  const lista = document.getElementById('business-list');
  lista.innerHTML = '';
  negocios.forEach((negocio, i) => {
    const card = document.createElement('div');
    card.className = 'negocio-card';
    card.innerHTML = `
      <img src="${negocio.imagen_principal}" alt="Foto ${negocio.nombre}" class="cover-img">
      <h3>${negocio.nombre}</h3>
      <div class="categoria-chip">${negocio.categoria}</div>
      <div class="descripcion">${negocio.descripcion}</div>
      <div class="galeria-mini">
        ${negocio.galeria.map((img,j)=>
          `<img src="${img}" alt="galería ${j+1}" onclick="abrirLightbox('${img}')">`).join('')}
      </div>
      <button class="ver-mas" onclick="abrirModal(${i})">Ver más</button>
    `;
    lista.appendChild(card);
  });
}

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
