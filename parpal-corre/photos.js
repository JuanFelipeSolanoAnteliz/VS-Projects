// Agrega tus fotos a assets/ y una entrada aquí por cada foto.
// La primera entrada será la primera foto de la portada.
window.PARPAL_GALLERY = {
  intervalMs: 6000, // 6000 = 6 segundos. Recomendado: 5000 a 8000.
  photos: [
    {
      src: 'assets/equipo-carrera-01.jpeg',
      alt: 'El equipo PARPAL reunido con sus medallas en la Media Maratón de Bucaramanga 2026.',
      caption: 'Equipo PARPAL · Media Maratón FCV 2026',
      fit: 'contain', // contain muestra la foto completa; cover llena y recorta los bordes.
      position: 'center'
    },
    // Para añadir otra, agrega una coma después del objeto anterior y copia:
    {
      src: 'assets/Daniel.jpeg',
      alt: 'Daniel en la Media Maratón FCV 2026.',
      caption: 'Daniel Guerrero · Media Maratón FCV 2026',
      fit: 'contain',
      position: 'center'
    },
    {
      src: 'assets/Sergio_Nick_Alexis.jpeg',
      alt: 'Alexis, Nick y Sergio en la Media Maratón FCV 2026.',
      caption: 'Alexis, Nick y Sergio · Media Maratón FCV 2026',
      fit: 'contain',
      position: 'center'
    }
  ]
};
