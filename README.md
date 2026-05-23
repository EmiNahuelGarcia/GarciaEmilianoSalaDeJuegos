# Sala de Juegos

## Nombre

Sala de Juegos

## Deploy

Proyecto desplegado en un Vercel: https://garcia-emiliano-sala-de-juegos.vercel.app/ 

## Tecnologías

- Angular 21
- TypeScript
- HTML
- CSS
- Supabase


## Descripción del Sprint 1

En el sprint 1 se realizó la creación inicial del proyecto y la base de la aplicación. También se trabajó en la estructura principal de navegación y en los primeros componentes de la app.

### Actividades realizadas

- Creación del proyecto.
- Deploy en hosting.
- Creación de los componentes:
	- Login
	- Registro
	- Bienvenida / Home
	- Quién Soy
- Navegación entre componentes sin límites de accesibilidad.
- Implementación de la funcionalidad del componente Quién Soy:
	- Consumo de la API pública de GitHub.
	- Visualización del nombre, imagen de perfil y otros datos del alumno.
	- Explicación clara de la elección del juego propio y de su forma de jugar.
- Implementación de un favicon propio.

## Descripción del Sprint 2

En el sprint 2 se completó la funcionalidad de autenticación y se implementó el sistema de navegación condicionada. Se trabajó en la integración con Supabase para validación de usuarios, registro seguro y gestión de sesiones. También se implementaron los guards de ruta para proteger el acceso a funcionalidades según el estado de autenticación del usuario.

### Actividades realizadas

- **Funcionalidad del componente Home (Bienvenida)**:
	- Implementación de lógica condicional que muestra contenido diferente según el estado de autenticación del usuario.
	- Si el usuario **NO está logueado**: Muestra un mensaje de bienvenida: *"BIENVENIDO A LA SALA DE ESPAR GAMES"*.
	- Si el usuario **SÍ está logueado**: Muestra una galería con tarjetas de los 4 juegos disponibles.
	- Integración con el servicio de autenticación para verificar el usuario actual.

- **Funcionalidad del componente Login**:
	- Validación de credenciales contra Supabase usando email y contraseña.
	- Validaciones reactivas en tiempo real:
		- Email: Validación de formato correcto.
		- Contraseña: Alfanumérica, 8-20 caracteres.
	- **3 botones de login rápido** para facilitar pruebas ágiles de la aplicación:
		- Botón A: `pepe@gmail.com` / `123456abc`
		- Botón B: `nico@hotmail.com` / `123456Abc`
		- Botón C: `bausoneitor@outlook.com` / `123456789Abc`
	- Navegación automática a `/home` tras login exitoso.
	- Visualización de mensajes de error específicos en caso de credenciales inválidas.
	- Spinner de carga durante el proceso de autenticación.
	- Enlace a página de registro.
	- Toggle de visibilidad de contraseña.

- **Funcionalidad del componente Registro**:
	- Formulario funcional para registrar nuevos usuarios con los siguientes campos:
		- **Nombre**: Solo letras, 3-15 caracteres, obligatorio.
		- **Apellido**: Solo letras, 3-15 caracteres, obligatorio.
		- **Email**: Validación específica para Gmail, Hotmail y Outlook, obligatorio.
		- **Edad**: Solo números, rango 18-99 años, obligatorio.
		- **Contraseña**: Alfanumérica, 8-20 caracteres, obligatorio.
	- Creación de cuenta en el sistema de autenticación de Supabase.
	- Guardado de datos del usuario en la base de datos (name, surname, age).
	- Auto-login automático tras registro exitoso.
	- Detección y visualización de errores (ej: email ya registrado).
	- Spinner de carga durante el proceso de registro.

- **Implementación de Guardias de Ruta (Guards)**:
	- **Guest Guard** (`guestGuard`): Permite el acceso a rutas de login y registro solo si el usuario NO está autenticado. Si el usuario intenta acceder a estas rutas estando logueado, lo redirige a `/home`.

- **Configuración de rutas con protección**:
	- `/home` → Home (accesible para todos).
	- `/login` → Login (protegido por `guestGuard`).
	- `/registro` → Registro (protegido por `guestGuard`).
	- `/quien-soy` → Quién Soy (accesible para todos).

- **Navegación mejorada**:
	- Barra de navegación condicional que muestra diferentes opciones según el estado de autenticación:
		- **Si NO está logueado**: Botones de HOME, LOGIN y REGISTRARSE.
		- **Si SÍ está logueado**: Muestra HOME, RESULTADOS, nombre del usuario y botón CERRAR SESIÓN.
	- Funcionamiento automático del logout con redirección a `/home`.

- **Servicio de Autenticación (AuthService)**:
	- Integración completa con Supabase para manejo de autenticación.
	- Gestión de estado de usuario mediante signals de Angular.
	- Métodos implementados:
		- `login()`: Autentica usuario con email y contraseña.
		- `register()`: Registra nuevo usuario con validación de duplicados.
		- `logout()`: Cierra sesión del usuario actual.
		- `checkSession()`: Verifica si existe una sesión activa.
	- Monitoreo en tiempo real de cambios de autenticación mediante `onAuthStateChange()`.
	- Propiedades computed para estado de autenticación e información del usuario.

	## Descripción del Sprint 3

	En el sprint 3 se completó la funcionalidad Chat en tiempo real. El foco estuvo en completar los dos primeros juegos en sus versiones finales, asegurar la persistencia y visualización de estadísticas, mejorar la robustez de la aplicación, creacion de pipes y fixes pequeños.

	### Actividades realizadas

	- Implementación de los el ahorcado y mayor-menor anteriormente mostrados como placeholders en el `Home`.
	- Integración completa de rankings/estadísticas con Supabase: guardado al finalizar cada partida y listado de los mejores (top 10) en la sección `Resultados`.
	- Manejo de errores en UI (mensajes visibles para fallo de login/registro).
	- Validación visual y accesibilidad básica en pantallas críticas (login, registro, home, juegos y resultados).
	- Creacion de Chat en tiempo real con persistencia

	### Criterios de aceptación

	- **Autenticación:** Registro y login funcionan (auto-login tras registro). Los tres botones de login rápido permiten probar credenciales en desarrollo.
	- **Juegos:** Las dos primeras tarjetas en `Home` abren juegos jugables; al finalizar una partida se persisten las estadísticas (victoria/derrota, tiempo, puntos).
	- **Resultados:** La vista `Resultados` muestra correctamente el top 10 por `aciertos` para cada juego y permite cambiar entre juegos.
	- **Chat:** Creado el Chat en tiempo real, junto a su tabla con supabase, con estilo personalizado para los mensajes propios y los de otras personas, con persistencia en la base de datos
	
	

