document.getElementById('quienes-somos-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    document.getElementById('biografia').scrollIntoView({ behavior: 'smooth' });
});
