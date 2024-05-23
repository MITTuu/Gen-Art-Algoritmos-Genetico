/**
 * Este documento contiene funciones para realizar el gen art
 * 
 * @file Archivo principal que contiene todas las funciones 
 * 
 * @author Dylan Montiel Zúñiga
 *         Mary Paz Álvarez Navarrete
 *         Jefferson Pozo Vallejo
 *         Jozafath Perez Fernandez
 * 
 * @version 05/05/2024
 * 
 */



/**
 * Variables globales para la implementación
 */
const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector("h2");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("#input-file");
const preview = document.querySelector("#preview");
const imageContainer = document.querySelector("#image-container");
let file;



/**
 * Escucha el evento click del botón para abrir el cuadro de diálogo de selección de archivo.
 * @param {Event} e - Evento click
 */
button.addEventListener("click", (e) => {
    input.click();
});


/**
 * Escucha el evento change del input de tipo archivo para manejar la selección de archivos.
 * @param {Event} e - Evento change
 */
input.addEventListener("change", (e) => {
    file = e.target.files[0]; 
    dropArea.classList.add("active");
    showFile(file);
    dropArea.classList.remove("active");
});


/**
 * Escucha el evento dragover del área de soltar para mostrar la indicación de soltar.
 * @param {Event} e - Evento dragover
 */
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Suelta para subir la imagen";
});


/**
 * Escucha el evento dragleave del área de soltar para restablecer el estado original.
 * @param {Event} e - Evento dragleave
 */
dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta la imagen";
});


/**
 * Escucha el evento drop del área de soltar para manejar la carga del archivo.
 * @param {Event} e - Evento drop
 */
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    file = e.dataTransfer.files[0];
    showFile(file);
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta la imagen";
});


/**
 * Muestra el archivo seleccionado para previsualización si es válido.
 * @param {File} file - Archivo seleccionado
 */
function showFile(file) {
    if (file !== undefined) { 
        processFile(file);
    } else {
        console.log("Seleccione una sola imagen");
    }
}


/**
 * Procesa el archivo seleccionado, mostrando una previsualización si es una imagen válida.
 * @param {File} file - Archivo a procesar
 */
function processFile(file) {
    const docType = file.type;
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    if (validExtensions.includes(docType)) {
        const fileReader = new FileReader();
        const id = `file-${Math.random().toString(32).substring(7)}`;

        fileReader.addEventListener('load', (e) => {
            const fileUrl = fileReader.result;
            const image = `
                <div id="${id}" class="file-container">
                    <img src="${fileUrl}" alt="${file.name}" width="30px">
                    <div class="status">
                        <span>${file.name}</span>
                        <span class="status-text">
                            Archivo subido
                        </span>
                    </div>
                </div>
            `;
            preview.innerHTML = image;
        });
    
        fileReader.addEventListener('load', (e) => {
            const fileUrl = fileReader.result;
            const image = `
                <img src="${fileUrl}" alt="${file.name}">
            `;
            imageContainer.innerHTML = image;
            imageContainer.style.visibility = 'visible';
        });

        fileReader.readAsDataURL(file);

        //uploadFile(file, id);
    } else {
        alert('El archivo seleccionado no es uno válido.');
    }
}

// No utilizar de momento, no creo que sea necesario subir las imagenes a un
// servidor.
/**
 * Sube el archivo al servidor usando una solicitud fetch asíncrona.
 * @param {File} file - Archivo a subir
 * @param {string} id - ID del contenedor de archivo en la interfaz
 */
async function uploadFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: "POST",
            body: formData,
        });

        const responseText = await response.text();
        console.log(responseText);

        document.querySelector(
            `#${id} .status-text`
        ).innerHTML = `<span class="success">Archivo subido correctamente.</span>`;
    } catch (e) {
        document.querySelector(
            `#${id} .status-text`
        ).innerHTML = `<span class="failure">Archivo no pudo subirse.</span>`;
    }

    console.log(file);
}
 