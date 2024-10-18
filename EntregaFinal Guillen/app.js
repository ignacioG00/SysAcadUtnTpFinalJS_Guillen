// Base de datos simulada en LocalStorage
const usuariosKey = 'usuarios';

// Función para mostrar y ocultar formularios
function showForm(formId) {
    document.getElementById('mainButtons').classList.add('hidden');
    document.getElementById('registroForm').classList.add('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('bajaUserForm').classList.add('hidden');
    document.getElementById(formId).classList.remove('hidden');
}

// Eventos de botones principales
document.getElementById('btnRegistro').onclick = () => showForm('registroForm');
document.getElementById('btnLogin').onclick = () => showForm('loginForm');
document.getElementById('btnBajaAlumno').onclick = () => showForm('bajaUserForm');

// Función para ir hacia atrás en formularios
function goBack() {
    document.getElementById('mainButtons').classList.remove('hidden');
    document.getElementById('registroForm').classList.add('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('bajaUserForm').classList.add('hidden');
    document.getElementById('alumnoInfo').classList.add('hidden');
    document.getElementById('materiasInscritasContainer').classList.add('hidden');
    document.getElementById('materiasContainer').classList.add('hidden');
    document.getElementById('loginMessage').innerText = '';
    document.getElementById('unsubMessage').innerText = '';
}

// Botones de volver
document.getElementById('btnBackFromRegistro').onclick = goBack;
document.getElementById('btnBackFromLogin').onclick = goBack;
document.getElementById('btnBackFromBajaAlumno').onclick = goBack;

// Función para registrar usuario
document.getElementById('btnSubmitRegister').onclick = () => {
    const nombre = document.getElementById('regNombre').value;
    const apellido = document.getElementById('regApellido').value;
    const dni = document.getElementById('regDNI').value;
    const email = document.getElementById('regEmail').value;

    // Validar formato del email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailPattern.test(email)) {
        document.getElementById('regMessage').innerText = 'Email no válido.';
        return;
    }

    // Validar que el DNI contenga solo números
    const dniPattern = /^[0-9]+$/; 
    if (!dniPattern.test(dni)) {
        document.getElementById('regMessage').innerText = 'DNI debe contener solo números.';
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem(usuariosKey)) || [];
    
    if (usuarios.find(u => u.dni === dni)) {
        document.getElementById('regMessage').innerText = 'DNI ya registrado.';
        return;
    }

    usuarios.push({ nombre, apellido, dni, email, materias: [] });
    localStorage.setItem(usuariosKey, JSON.stringify(usuarios));
    document.getElementById('regMessage').innerText = 'Usuario registrado exitosamente.';
};

// Función para buscar usuario
document.getElementById('btnSubmitLogin').onclick = () => {
    const dni = document.getElementById('loginDNI').value;
    let usuarios = JSON.parse(localStorage.getItem(usuariosKey)) || [];
    const usuario = usuarios.find(u => u.dni === dni);

    // Restaurar botones de añadir
    const materiasList = document.getElementById('materiasList');
    const materias = ["Matematicas", "Programacion", "Laboratorio", "Analisis Matematico", "Bases de Datos", "Organizacion Contable"];
    
    // Actualizar la lista de materias
    materiasList.innerHTML = materias.map(materia => {
        return `<li>${materia} <button class="add-button" data-materia="${materia}">Añadir</button></li>`;
    }).join('');

    if (usuario) {
        // Mostrar información del alumno
        document.getElementById('alumnoInfo').innerHTML = `
            <h3>Información del Alumno:</h3>
            <p>Nombre: ${usuario.nombre}</p>
            <p>Apellido: ${usuario.apellido}</p>
            <p>DNI: ${usuario.dni}</p>
            <p>Email: ${usuario.email}</p>
        `;
        document.getElementById('alumnoInfo').classList.remove('hidden');

        // Mostrar materias a las que el alumno ya está anotado
        mostrarMateriasInscritas(usuario);

        // Mostrar lista de materias disponibles
        document.getElementById('materiasContainer').classList.remove('hidden');
    } else {
        document.getElementById('loginMessage').innerText = 'Alumno no encontrado.';
        document.getElementById('alumnoInfo').classList.add('hidden');
        document.getElementById('materiasInscritasContainer').classList.add('hidden');
    }

    // Asignar eventos a los botones de añadir
    asignarEventosABotonesAdd();
};

// Función para actualizar la lista de materias inscritas
function mostrarMateriasInscritas(usuario) {
    const materiasInscritasContainer = document.getElementById('materiasInscritasContainer');
    materiasInscritasContainer.innerHTML = `
        <h4>Materias Inscritas:</h4>
        <ul>
            ${usuario.materias.length > 0 ? usuario.materias.map(m => `<li>${m} <button class="remove-button" data-materia="${m}">Eliminar</button></li>`).join('') : '<li>No inscrito en ninguna materia.</li>'}
        </ul>
    `;
    materiasInscritasContainer.classList.remove('hidden');

    // Agregar evento de clic a los botones de eliminación
    document.querySelectorAll('.remove-button').forEach(button => {
        button.onclick = () => {
            const materia = button.getAttribute('data-materia');
            usuario.materias = usuario.materias.filter(m => m !== materia);
            let usuarios = JSON.parse(localStorage.getItem(usuariosKey)) || [];
            const usuarioIndex = usuarios.findIndex(u => u.dni === usuario.dni);
            usuarios[usuarioIndex] = usuario; 
            localStorage.setItem(usuariosKey, JSON.stringify(usuarios));
            mostrarMateriasInscritas(usuario);
            document.getElementById('loginMessage').innerText = `Materia ${materia} eliminada exitosamente.`;
        };
    });
}

// Función para agregar materia
function asignarEventosABotonesAdd() {
    document.querySelectorAll('.add-button').forEach(button => {
        button.onclick = () => {
            const materia = button.getAttribute('data-materia');
            const dni = document.getElementById('loginDNI').value;
            let usuarios = JSON.parse(localStorage.getItem(usuariosKey)) || [];
            const usuario = usuarios.find(u => u.dni === dni);

            if (usuario) {
                if (usuario.materias.includes(materia)) {
                    document.getElementById('loginMessage').innerText = `El alumno ya está inscrito en ${materia}.`;
                } else {
                    usuario.materias.push(materia);
                    const usuarioIndex = usuarios.findIndex(u => u.dni === dni);
                    usuarios[usuarioIndex] = usuario; 
                    localStorage.setItem(usuariosKey, JSON.stringify(usuarios));
                    mostrarMateriasInscritas(usuario);
                    
                    button.parentElement.removeChild(button);
                }
            } else {
                document.getElementById('loginMessage').innerText = 'Alumno no encontrado.';
            }
        };
    });
}

// Función para darse de baja
document.getElementById('btnSubmitUnsubscribe').onclick = () => {
    const dni = document.getElementById('unsubDNI').value;
    let usuarios = JSON.parse(localStorage.getItem(usuariosKey)) || [];
    const usuario = usuarios.find(u => u.dni === dni);

    if (usuario) {
        
        document.getElementById('unsubalumnoInfo').innerHTML = `
            <h3>Información del Alumno:</h3>
            <p>Nombre: ${usuario.nombre}</p>
            <p>Apellido: ${usuario.apellido}</p>
            <p>DNI: ${usuario.dni}</p>
            <p>Email: ${usuario.email}</p>
        `;
        document.getElementById('unsubalumnoInfo').classList.remove('hidden');

        
        mostrarMateriasInscritasParaBaja(usuario);

        
        document.getElementById('btnDelete').classList.remove('hidden');

        
        document.getElementById('btnDelete').onclick = () => {
            const usuarioIndex = usuarios.findIndex(u => u.dni === dni);
            usuarios.splice(usuarioIndex, 1);
            localStorage.setItem(usuariosKey, JSON.stringify(usuarios));
            document.getElementById('unsubMessage').innerText = 'Usuario dado de baja exitosamente.';
            document.getElementById('unsubalumnoInfo').classList.add('hidden');
            document.getElementById('unsubMateriasInscritasContainer').classList.add('hidden');
            document.getElementById('btnDelete').classList.add('hidden');
            document.getElementById('unsubDNI').value = '';
        };
    } else {
        document.getElementById('unsubMessage').innerText = 'Alumno no encontrado.';
        document.getElementById('unsubalumnoInfo').classList.add('hidden');
        document.getElementById('btnDelete').classList.add('hidden');
        document.getElementById('unsubMateriasInscritasContainer').classList.add('hidden');
    }
};

// Función para actualizar materias en la sección Darse de Baja
function mostrarMateriasInscritasParaBaja(usuario) {
    const materiasInscritasContainer = document.getElementById('unsubMateriasInscritasContainer');
    materiasInscritasContainer.innerHTML = `
        <h4>Materias Inscritas:</h4>
        <ul>
            ${usuario.materias.length > 0 ? usuario.materias.map(m => `<li>${m}</li>`).join('') : '<li>No inscrito en ninguna materia.</li>'}
        </ul>
    `;
    materiasInscritasContainer.classList.remove('hidden');
}





