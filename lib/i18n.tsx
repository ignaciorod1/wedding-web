"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Language = "es" | "de-CH";

type Translations = Record<string, string>;

const translations: Record<Language, Translations> = {
  es: {
    "language.label": "Idioma",
    "language.es": "Español (Castellano)",
    "language.de-CH": "Deutsch (Schweiz)",
    "loading": "Cargando...",
    "header.guest": "Invitado",
    "header.signOut": "Cerrar sesión",
    "header.inviteAccepted": "Invitación aceptada",
    "header.inviteRejected": "Invitación rechazada",
    "header.bus": "Bus",
    "header.plusOne": "+1 {name}",
    "header.allergies": "Alergias",
    "hero.tagline": "¡nos casamos!",
    "hero.helper":
      "Introduce tu código personal para ver los detalles del evento y confirmar tu asistencia.",
    "login.title": "Acceso de invitados",
    "login.description":
      "Introduce tu código personal de invitación para acceder a los detalles del evento",
    "login.label": "Código de invitación",
    "login.placeholder": "p. ej., SMITH2025",
    "login.helper": "Puedes encontrar tu código en la invitación impresa",
    "login.invalid":
      "Código de invitación no válido. Revisa tu invitación e inténtalo de nuevo.",
    "login.verifying": "Verificando...",
    "login.submit": "Acceder a los detalles del evento",
    "event.kicker": "Información del evento",
    "event.title": "Ceremonia y recepción",
    "event.ceremony": "La ceremonia",
    "event.reception": "La recepción",
    "event.following": "Después de la ceremonia",
    "event.venueTitle": "Lugar del evento",
    "event.sameVenue": "Ceremonia y recepción en el mismo lugar.",
    "event.scheduleTitle": "Horarios de la boda",
    "event.scheduleCeremony": "Ceremonia",
    "event.scheduleReception": "Recepción",
    "event.scheduleCocktail": "Cóctel",
    "event.scheduleBanquet": "Banquete",
    "event.scheduleDance": "Baile",
    "event.scheduleEnd": "Fin",
    "event.timeTbd": "Por confirmar",
    "event.dressCode": "Código de vestimenta",
    "rsvp.kicker": "Por favor, confirma",
    "rsvp.title": "Confirmación",
    "rsvp.hello": "Hola, {name}",
    "rsvp.question": "¿Nos acompañarás en nuestro día especial?",
    "rsvp.plusOne": "¿Traes acompañante? Escribe su nombre (+1)",
    "rsvp.plusOnePlaceholder":
      "Nombre completo del acompañante (déjalo en blanco si no traes a nadie)",
    "rsvp.dietary": "Restricciones alimentarias (opcional)",
    "rsvp.dietaryPlaceholder":
      "Indícanos cualquier restricción alimentaria o alergia...",
    "rsvp.message": "Mensaje para la pareja (opcional)",
    "rsvp.messagePlaceholder": "Comparte un mensaje o buenos deseos...",
    "rsvp.busTitle": "Servicio de autobús",
    "rsvp.busOptIn": "Sí, quiero usar el servicio de autobús",
    "rsvp.busYes": "Quiero autobús",
    "rsvp.busNo": "No quiero autobús",
    "rsvp.accept": "¡Con gusto acepto!",
    "rsvp.decline": "Lamento perdérme el bodorrio",
    "rsvp.submitting": "Enviando...",
    "rsvp.confirmTitle": "¡Estamos deseando verte!",
    "rsvp.confirmBody": "Gracias por confirmar tu asistencia, {name}.",
    "rsvp.saved": "Respuesta guardada",
    "rsvp.saveChanges": "Guardar cambios",
    "rsvp.confirmPlusOne":
      "Hemos anotado que traerás a {plusOne}.",
    "rsvp.confirmBus":
      "Hemos reservado un lugar para ti en el autobús lanzadera.",
    "rsvp.confirmBusDetails": "Recogida a las {time} en {location}.",
    "rsvp.confirmDate": "Reserva la fecha: {date}",
    "rsvp.addWedding": "Añadir la boda",
    "rsvp.addShuttle": "Recogida del autobús",
    "rsvp.missTitle": "¡Te echaremos de menos!",
    "rsvp.missBody":
      "Gracias por avisarnos, {name}. Estarás en nuestros pensamientos en nuestro día especial.",
    "rsvp.update": "Actualizar respuesta",
    "calendar.google": "Google Calendar",
    "calendar.apple": "Apple Calendar",
    "bus.pickup": "Recogida",
    "bus.dropoff": "Regreso",
    "calendar.busTitle": "Autobús de la boda - {label}",
    "calendar.busDetails":
      "Servicio de autobús para la boda. De {from} a {to}.",
    "calendar.weddingTitle": "Boda de {names}",
    "calendar.weddingDetails": "Ceremonia y recepción de boda",
    "defaults.couple": "La pareja",
    "defaults.weddingDate": "6 de junio de 2026",
    "defaults.venue": "Lugar de la boda",
    "defaults.weddingTitle": "Nuestra boda",
    "defaults.pickupLocation": "Lugar de recogida",
    "defaults.pickupArrivalLocation": "Lugar de la boda",
    "defaults.dropoffLocation": "Lugar de la boda",
    "defaults.dropoffArrivalLocation": "Hotel",
    "footer.message":
      "Con cariño y emoción, esperamos celebrar contigo.",
    "hotel.title": "Recomendación de alojamiento",
    "hotel.stay":
      "Recomendamos la zona de la Avenida de La Constitución o Cádiz Centro si queréis usar el autobús a la finca.",
    "hotel.discountLabel": "Código de descuento",
    "hotel.copy": "Copiar",
    "hotel.copied": "Copiado",
    "hotel.google": "Google Maps",
    "hotel.website": "Sitio web",
    "hotel.booking": "Booking.com",
    "gifts.title": "Regalos de boda",
    "gifts.message":
      "El mejor regalo es vuestra presencia. Agradecemos de corazón cualquier contribución para nuestra luna de miel y boda.",
    "gifts.ibanLabel": "IBAN",
    "gifts.ibanMissing": "IBAN pendiente",
  },
  "de-CH": {
    "language.label": "Sprach",
    "language.es": "Español (Castellano)",
    "language.de-CH": "Deutsch (Schweiz)",
    "loading": "Lädt...",
    "header.guest": "Gast",
    "header.signOut": "Abmelde",
    "header.inviteAccepted": "Iiladig akzeptiert",
    "header.inviteRejected": "Iiladig abglehnt",
    "header.bus": "Bus",
    "header.plusOne": "+1 {name}",
    "header.allergies": "Allergie",
    "hero.tagline": "Mir heirate!",
    "hero.helper":
      "Gib dis persönlich Code i, zum d'Event-Details z'seh und dini Zuesag z'bestätige.",
    "login.title": "Gäschtelogin",
    "login.description":
      "Gib di persönlich Iiladigscode i, um di Event-Details z'gseh",
    "login.label": "Iiladigscode",
    "login.placeholder": "z. B. SMITH2025",
    "login.helper": "Du findsch din Code uf dinere gedruckte Iiladig",
    "login.invalid":
      "Ungültige Iiladigscode. Bitte prüef di Iiladig und probier's nomal.",
    "login.verifying": "Am Prüefe...",
    "login.submit": "Event-Details öffne",
    "event.kicker": "Event-Info",
    "event.title": "Zeremonie & Apéro",
    "event.ceremony": "D'Zeremonie",
    "event.reception": "S'Fäscht",
    "event.following": "Noh de Zeremonie",
    "event.venueTitle": "Event-Ort",
    "event.sameVenue": "Zeremonie und Fäscht am gliiche Ort.",
    "event.scheduleTitle": "Hochzyts-Ziite",
    "event.scheduleCeremony": "Zeremonie",
    "event.scheduleReception": "Empfang",
    "event.scheduleCocktail": "Apéro",
    "event.scheduleBanquet": "Bankett",
    "event.scheduleDance": "Tanz",
    "event.scheduleEnd": "Ende",
    "event.timeTbd": "No z'bänne",
    "event.dressCode": "Dresscode",
    "rsvp.kicker": "Bitte gib Bescheid",
    "rsvp.title": "Zuesag",
    "rsvp.hello": "Hoi, {name}",
    "rsvp.question": "Bisch du an oisem spezielle Tag debii?",
    "rsvp.plusOne": "Bringsch en Begleitig? Name (+1)",
    "rsvp.plusOnePlaceholder":
      "Vollständige Name vo de Begleitig (leer lah, wenn niemer)",
    "rsvp.dietary": "Ernährig / Allergie (optional)",
    "rsvp.dietaryPlaceholder":
      "Teilet eus gärn Allergie oder Ernährigswünsche mit...",
    "rsvp.message": "Nachricht a d'Paar (optional)",
    "rsvp.messagePlaceholder": "E chliini Nachricht oder gueti Wünsch...",
    "rsvp.busTitle": "Busservice",
    "rsvp.busOptIn": "Ja, i nutz de Busservice",
    "rsvp.busYes": "Ich will de Bus",
    "rsvp.busNo": "Ich will kei Bus",
    "rsvp.accept": "Gern debii",
    "rsvp.decline": "Leider nöd",
    "rsvp.submitting": "Am Sände...",
    "rsvp.confirmTitle": "Mir freued eus riesig, dich z'gseh!",
    "rsvp.confirmBody": "Danke fürs Zuesage, {name}.",
    "rsvp.saved": "Antwort gspeichert",
    "rsvp.saveChanges": "Änderige speichere",
    "rsvp.confirmPlusOne":
      "Mir händ notiert, dass du {plusOne} mitbringisch.",
    "rsvp.confirmBus": "Mir händ dir en Platz im Shuttle reserviert.",
    "rsvp.confirmBusDetails": "Abfahrt um {time} bi {location}.",
    "rsvp.confirmDate": "Merk dir s'Datum: {date}",
    "rsvp.addWedding": "Boda i Kalender",
    "rsvp.addShuttle": "Shuttle-Abfahrt",
    "rsvp.missTitle": "Mir werded dich vermisse!",
    "rsvp.missBody":
      "Danke fürs Bsched gäh, {name}. Du bisch an oisem Tag i üsen Gedanke.",
    "rsvp.update": "Antwort aktualisiere",
    "calendar.google": "Google Calendar",
    "calendar.apple": "Apple Calendar",
    "bus.pickup": "Abfahrt",
    "bus.dropoff": "Rückfahrt",
    "calendar.busTitle": "Hochzytsbus – {label}",
    "calendar.busDetails":
      "Busservice für d'Hochzyt. Vo {from} nach {to}.",
    "calendar.weddingTitle": "Hochzyt vo {names}",
    "calendar.weddingDetails": "Zeremonie und Fäscht",
    "defaults.couple": "S'Paar",
    "defaults.weddingDate": "15. Juni 2025",
    "defaults.venue": "Hochzytsort",
    "defaults.weddingTitle": "Üsi Hochzyt",
    "defaults.pickupLocation": "Abfahrtsort",
    "defaults.pickupArrivalLocation": "Hochzytsort",
    "defaults.dropoffLocation": "Hochzytsort",
    "defaults.dropoffArrivalLocation": "Hotel",
    "footer.message":
      "Mit vill Liebe und Vorfreud, mir freued eus zum mit dir z'fiire.",
    "hotel.title": "Hotel-Empfehlig",
    "hotel.stay": "Empfohlni Unterkunft",
    "hotel.discountLabel": "Rabattcode",
    "hotel.copy": "Kopiere",
    "hotel.copied": "Kopiert",
    "hotel.google": "Google Maps",
    "hotel.website": "Hotel-Websii",
    "hotel.booking": "Booking.com",
    "gifts.title": "Hochzytsgschenk",
    "gifts.message":
      "S'bescht Gschenk isch eui Anwäseheit. Mir schätzed jede Beitrag für üsi Flitterwoche und d'Hochzyt.",
    "gifts.ibanLabel": "IBAN",
    "gifts.ibanMissing": "IBAN folgt",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

function translate(
  language: Language,
  key: string,
  params?: Record<string, string>
) {
  const table = translations[language] ?? translations.es;
  const template = table[key] ?? translations.es[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, token) => params[token] ?? "");
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const stored = localStorage.getItem("wedding-language");
    if (stored === "es" || stored === "de-CH") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wedding-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string, params?: Record<string, string>) =>
        translate(language, key, params),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
