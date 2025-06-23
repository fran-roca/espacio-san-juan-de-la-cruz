export interface GalleryImage {
  id: number
  title: string
  description: string
  url: string
  category: "habitaciones" | "restaurante" | "terraza" | "exterior" | "entorno"
  visible: boolean
  order: number
}

// Actualizar la interface Room para mejor gestión de imágenes
export interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  available: number
  images: string[]
  mainImage: string // Imagen principal
  visible: boolean
}

export interface HotelReservation {
  id: number
  roomId: number
  guestName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface RestaurantReservation {
  id: number
  guestName: string
  phone: string
  email?: string
  date: string
  time: string
  guests: number
  zone: string
  notes?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

// Actualizar MenuDelDia para incluir alérgenos por plato
export interface MenuDelDiaPlato {
  nombre: string
  alergenos: string[]
}

export interface MenuDelDia {
  id: number
  fecha: string
  precio: number
  entrantes: MenuDelDiaPlato[]
  principales: MenuDelDiaPlato[]
  postres: MenuDelDiaPlato[]
  bebida: string
  activo: boolean
  alergenosGenerales: string[] // Alérgenos que aplican a todo el menú
}

// Actualizar CartaItem para incluir alérgenos
export interface CartaItem {
  id: number
  categoria: string
  nombre: string
  descripcion: string
  precio: number
  disponible: boolean
  alergenos: string[] // Nuevo campo para alérgenos
}

// Actualizar Attraction para incluir múltiples imágenes
export interface Attraction {
  id: number
  name: string
  description: string
  distance: string
  duration: string
  type: string
  images: string[] // Cambiar de image a images
  mainImage: string
  visible: boolean
}

export interface Event {
  id: number
  name: string
  date: string
  description: string
  visible: boolean
}

// Nueva interface para horarios del restaurante
export interface RestaurantSchedule {
  dayOfWeek: number // 0 = Domingo, 1 = Lunes, etc.
  dayName: string
  isOpen: boolean
  lunchSlots: string[]
  dinnerSlots: string[]
}

// Definir tipos de alérgenos disponibles
export const ALERGENOS = {
  gluten: { name: "Gluten", icon: "🌾" },
  lacteos: { name: "Lácteos", icon: "🥛" },
  huevos: { name: "Huevos", icon: "🥚" },
  pescado: { name: "Pescado", icon: "🐟" },
  marisco: { name: "Marisco", icon: "🦐" },
  frutos_secos: { name: "Frutos secos", icon: "🥜" },
  soja: { name: "Soja", icon: "🫘" },
  sesamo: { name: "Sésamo", icon: "🌰" },
  sulfitos: { name: "Sulfitos", icon: "🍷" },
  mostaza: { name: "Mostaza", icon: "🌭" },
  apio: { name: "Apio", icon: "🥬" },
  altramuces: { name: "Altramuces", icon: "🫛" },
  moluscos: { name: "Moluscos", icon: "🐚" },
  cacahuetes: { name: "Cacahuetes", icon: "🥜" },
}

// Datos iniciales

// Horarios del restaurante por día
export const restaurantSchedule: RestaurantSchedule[] = [
  {
    dayOfWeek: 0, // Domingo
    dayName: "Domingo",
    isOpen: true,
    lunchSlots: ["13:00", "13:30", "14:00", "14:30", "15:00"],
    dinnerSlots: ["20:00", "20:30", "21:00", "21:30"],
  },
  {
    dayOfWeek: 1, // Lunes
    dayName: "Lunes",
    isOpen: false,
    lunchSlots: [],
    dinnerSlots: [],
  },
  {
    dayOfWeek: 2, // Martes
    dayName: "Martes",
    isOpen: true,
    lunchSlots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    dinnerSlots: ["20:00", "20:30", "21:00", "21:30", "22:00"],
  },
  {
    dayOfWeek: 3, // Miércoles
    dayName: "Miércoles",
    isOpen: true,
    lunchSlots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    dinnerSlots: ["20:00", "20:30", "21:00", "21:30", "22:00"],
  },
  {
    dayOfWeek: 4, // Jueves
    dayName: "Jueves",
    isOpen: true,
    lunchSlots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    dinnerSlots: ["20:00", "20:30", "21:00", "21:30", "22:00"],
  },
  {
    dayOfWeek: 5, // Viernes
    dayName: "Viernes",
    isOpen: true,
    lunchSlots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    dinnerSlots: ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
  },
  {
    dayOfWeek: 6, // Sábado
    dayName: "Sábado",
    isOpen: true,
    lunchSlots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    dinnerSlots: ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
  },
]

// Añadir galería de imágenes
export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    title: "Habitación Doble Superior",
    description: "Vista de nuestra habitación más popular",
    url: "/placeholder.svg?height=400&width=600",
    category: "habitaciones",
    visible: true,
    order: 1,
  },
  {
    id: 2,
    title: "Restaurante Interior",
    description: "Ambiente acogedor de nuestro restaurante",
    url: "/placeholder.svg?height=400&width=600",
    category: "restaurante",
    visible: true,
    order: 2,
  },
  {
    id: 3,
    title: "Terraza Exterior",
    description: "Terraza con vistas al campo castellano",
    url: "/placeholder.svg?height=400&width=600",
    category: "terraza",
    visible: true,
    order: 3,
  },
  {
    id: 4,
    title: "Fachada Principal",
    description: "Vista exterior del hotel",
    url: "/placeholder.svg?height=400&width=600",
    category: "exterior",
    visible: true,
    order: 4,
  },
  {
    id: 5,
    title: "Paisaje de Fontiveros",
    description: "Entorno natural que rodea el hotel",
    url: "/placeholder.svg?height=400&width=600",
    category: "entorno",
    visible: true,
    order: 5,
  },
]

// Actualizar rooms con más imágenes
export const rooms: Room[] = [
  {
    id: 1,
    name: "Habitación Doble Estándar",
    description: "Habitación acogedora con cama de matrimonio, baño privado y vistas al jardín",
    price: 75,
    capacity: 2,
    amenities: ["Wifi", "TV", "Baño privado", "Calefacción"],
    available: 8,
    images: [
      "/placeholder.svg?height=300&width=400&text=Habitación+Principal",
      "/placeholder.svg?height=300&width=400&text=Baño+Privado",
      "/placeholder.svg?height=300&width=400&text=Vista+Jardín",
      "/placeholder.svg?height=300&width=400&text=Detalle+Decoración",
    ],
    mainImage: "/placeholder.svg?height=300&width=400&text=Habitación+Principal",
    visible: true,
  },
  {
    id: 2,
    name: "Habitación Familiar",
    description: "Amplia habitación con cama de matrimonio y dos camas individuales",
    price: 95,
    capacity: 4,
    amenities: ["Wifi", "TV", "Baño privado", "Nevera", "Calefacción"],
    available: 3,
    images: [
      "/placeholder.svg?height=300&width=400&text=Habitación+Familiar",
      "/placeholder.svg?height=300&width=400&text=Zona+Niños",
      "/placeholder.svg?height=300&width=400&text=Baño+Familiar",
    ],
    mainImage: "/placeholder.svg?height=300&width=400&text=Habitación+Familiar",
    visible: true,
  },
  {
    id: 3,
    name: "Suite Rural",
    description: "Suite con salón independiente, terraza privada y vistas panorámicas",
    price: 120,
    capacity: 2,
    amenities: ["Wifi", "TV", "Baño privado", "Terraza", "Minibar", "Calefacción"],
    available: 2,
    images: [
      "/placeholder.svg?height=300&width=400&text=Suite+Principal",
      "/placeholder.svg?height=300&width=400&text=Salón+Independiente",
      "/placeholder.svg?height=300&width=400&text=Terraza+Privada",
      "/placeholder.svg?height=300&width=400&text=Vista+Panorámica",
      "/placeholder.svg?height=300&width=400&text=Baño+Suite",
    ],
    mainImage: "/placeholder.svg?height=300&width=400&text=Suite+Principal",
    visible: true,
  },
  {
    id: 4,
    name: "Habitación Adaptada PMR",
    description: "Habitación completamente adaptada para personas con movilidad reducida",
    price: 80,
    capacity: 2,
    amenities: ["Wifi", "TV", "Baño adaptado", "Acceso PMR", "Calefacción"],
    available: 1,
    images: [
      "/placeholder.svg?height=300&width=400&text=Habitación+Adaptada",
      "/placeholder.svg?height=300&width=400&text=Baño+Adaptado",
      "/placeholder.svg?height=300&width=400&text=Acceso+PMR",
    ],
    mainImage: "/placeholder.svg?height=300&width=400&text=Habitación+Adaptada",
    visible: true,
  },
]

// Datos realistas para 2025
export const hotelReservations: HotelReservation[] = [
  {
    id: 1,
    roomId: 1,
    guestName: "María García",
    email: "maria@email.com",
    phone: "+34 600 111 222",
    checkIn: "2025-06-25", // Próxima llegada
    checkOut: "2025-06-28",
    guests: 2,
    totalPrice: 225,
    status: "confirmed",
    createdAt: "2025-06-20T10:00:00Z",
  },
  {
    id: 2,
    roomId: 2,
    guestName: "Juan Pérez",
    email: "juan@email.com",
    phone: "+34 600 333 444",
    checkIn: "2025-06-26", // Próxima llegada
    checkOut: "2025-06-28",
    guests: 4,
    totalPrice: 380,
    status: "confirmed",
    createdAt: "2025-06-12T14:30:00Z",
  },
  {
    id: 3,
    roomId: 3,
    guestName: "Ana López",
    email: "ana@email.com",
    phone: "+34 600 555 666",
    checkIn: "2025-06-30", // Futura
    checkOut: "2025-07-02",
    guests: 2,
    totalPrice: 240,
    status: "pending",
    createdAt: "2025-06-18T09:15:00Z",
  },
  {
    id: 4,
    roomId: 1,
    guestName: "Carlos Ruiz",
    email: "carlos@email.com",
    phone: "+34 600 777 888",
    checkIn: "2025-06-24", // Próxima llegada
    checkOut: "2025-06-26",
    guests: 2,
    totalPrice: 150,
    status: "confirmed",
    createdAt: "2025-06-19T16:20:00Z",
  },
  {
    id: 5,
    roomId: 2,
    guestName: "Laura Martín",
    email: "laura@email.com",
    phone: "+34 600 999 000",
    checkIn: "2025-05-15",
    checkOut: "2025-05-18",
    guests: 3,
    totalPrice: 285,
    status: "confirmed",
    createdAt: "2025-05-10T11:00:00Z",
  },
  {
    id: 6,
    roomId: 3,
    guestName: "Pedro Sánchez",
    email: "pedro@email.com",
    phone: "+34 600 888 777",
    checkIn: "2025-04-20",
    checkOut: "2025-04-23",
    guests: 2,
    totalPrice: 360,
    status: "confirmed",
    createdAt: "2025-04-15T14:00:00Z",
  },
  {
    id: 7,
    roomId: 1,
    guestName: "Carmen Díaz",
    email: "carmen@email.com",
    phone: "+34 600 777 666",
    checkIn: "2025-03-10",
    checkOut: "2025-03-13",
    guests: 2,
    totalPrice: 225,
    status: "confirmed",
    createdAt: "2025-03-05T09:30:00Z",
  },
  {
    id: 8,
    roomId: 4,
    guestName: "Miguel Torres",
    email: "miguel@email.com",
    phone: "+34 600 555 444",
    checkIn: "2025-02-14",
    checkOut: "2025-02-16",
    guests: 2,
    totalPrice: 160,
    status: "confirmed",
    createdAt: "2025-02-10T16:45:00Z",
  },
]

export const restaurantReservations: RestaurantReservation[] = [
  {
    id: 1,
    guestName: "Carlos Ruiz",
    phone: "+34 600 777 888",
    email: "carlos@email.com",
    date: "2025-06-23",
    time: "14:00",
    guests: 4,
    zone: "interior",
    status: "confirmed",
    createdAt: "2025-06-20T11:00:00Z",
  },
  {
    id: 2,
    guestName: "Laura Martín",
    phone: "+34 600 999 000",
    email: "laura@email.com",
    date: "2025-06-24",
    time: "21:00",
    guests: 2,
    zone: "terraza",
    status: "confirmed",
    createdAt: "2025-06-21T16:45:00Z",
  },
  {
    id: 3,
    guestName: "Ana García",
    phone: "+34 600 111 333",
    email: "ana@email.com",
    date: "2025-06-25",
    time: "13:30",
    guests: 6,
    zone: "interior",
    status: "pending",
    createdAt: "2025-06-22T10:15:00Z",
  },
]

// Actualizar menuDelDia con alérgenos por plato
export const menuDelDia: MenuDelDia = {
  id: 1,
  fecha: "Domingo, 22 de Junio 2025",
  precio: 18,
  entrantes: [
    { nombre: "Sopa castellana tradicional", alergenos: ["gluten", "huevos"] },
    { nombre: "Ensalada mixta de temporada", alergenos: [] },
  ],
  principales: [
    { nombre: "Cochinillo asado con patatas", alergenos: [] },
    { nombre: "Merluza a la plancha con verduras", alergenos: ["pescado"] },
    { nombre: "Lentejas estofadas (vegetariano)", alergenos: ["apio"] },
  ],
  postres: [
    { nombre: "Flan casero", alergenos: ["lacteos", "huevos"] },
    { nombre: "Fruta de temporada", alergenos: [] },
    { nombre: "Helado artesano", alergenos: ["lacteos"] },
  ],
  bebida: "Agua, vino de la casa o refresco incluido",
  activo: true,
  alergenosGenerales: ["sulfitos"], // Alérgenos que aplican a todo el menú (ej: vino)
}

// Actualizar cartaItems con alérgenos
export const cartaItems: CartaItem[] = [
  {
    id: 1,
    categoria: "Entrantes",
    nombre: "Jamón ibérico de bellota",
    descripcion: "Cortado a cuchillo, con pan tostado",
    precio: 16,
    disponible: true,
    alergenos: ["gluten"],
  },
  {
    id: 2,
    categoria: "Entrantes",
    nombre: "Queso manchego curado",
    descripcion: "Con membrillo casero",
    precio: 12,
    disponible: true,
    alergenos: ["lacteos"],
  },
  {
    id: 3,
    categoria: "Entrantes",
    nombre: "Morcilla de Burgos",
    descripcion: "Con pimientos del piquillo",
    precio: 10,
    disponible: true,
    alergenos: [],
  },
  {
    id: 4,
    categoria: "Entrantes",
    nombre: "Sopa castellana",
    descripcion: "Con huevo escalfado y jamón",
    precio: 8,
    disponible: true,
    alergenos: ["gluten", "huevos"],
  },
  {
    id: 5,
    categoria: "Carnes",
    nombre: "Cochinillo asado",
    descripcion: "Especialidad de la casa, para 2 personas",
    precio: 45,
    disponible: true,
    alergenos: [],
  },
  {
    id: 6,
    categoria: "Carnes",
    nombre: "Cordero lechal",
    descripcion: "Asado en horno de leña",
    precio: 22,
    disponible: true,
    alergenos: [],
  },
  {
    id: 7,
    categoria: "Carnes",
    nombre: "Chuletón de Ávila",
    descripcion: "1kg aprox, para compartir",
    precio: 38,
    disponible: true,
    alergenos: [],
  },
  {
    id: 8,
    categoria: "Carnes",
    nombre: "Secreto ibérico",
    descripcion: "Con patatas confitadas",
    precio: 18,
    disponible: true,
    alergenos: [],
  },
  {
    id: 9,
    categoria: "Pescados",
    nombre: "Trucha del río",
    descripcion: "Con almendras y jamón",
    precio: 16,
    disponible: true,
    alergenos: ["pescado", "frutos_secos"],
  },
  {
    id: 10,
    categoria: "Pescados",
    nombre: "Bacalao al pil pil",
    descripcion: "Receta tradicional",
    precio: 19,
    disponible: true,
    alergenos: ["pescado"],
  },
  {
    id: 11,
    categoria: "Pescados",
    nombre: "Merluza en salsa verde",
    descripcion: "Con almejas y espárragos",
    precio: 20,
    disponible: true,
    alergenos: ["pescado", "moluscos"],
  },
  {
    id: 12,
    categoria: "Postres",
    nombre: "Torrijas caseras",
    descripcion: "Con helado de vainilla",
    precio: 6,
    disponible: true,
    alergenos: ["gluten", "lacteos", "huevos"],
  },
  {
    id: 13,
    categoria: "Postres",
    nombre: "Flan de huevo",
    descripcion: "Elaboración propia",
    precio: 5,
    disponible: true,
    alergenos: ["lacteos", "huevos"],
  },
  {
    id: 14,
    categoria: "Postres",
    nombre: "Tarta de queso",
    descripcion: "Con mermelada de arándanos",
    precio: 7,
    disponible: true,
    alergenos: ["lacteos", "gluten", "huevos"],
  },
  {
    id: 15,
    categoria: "Postres",
    nombre: "Ponche segoviano",
    descripcion: "Postre típico de la región",
    precio: 8,
    disponible: true,
    alergenos: ["gluten", "lacteos", "huevos"],
  },
]

// Actualizar attractions con nuevas propiedades
export const attractions: Attraction[] = [
  {
    id: 1,
    name: "Iglesia de San Juan Bautista",
    description: "Iglesia donde fue bautizado San Juan de la Cruz, poeta místico español",
    distance: "200m",
    duration: "15 min",
    type: "Religioso",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mainImage: "/placeholder.svg?height=200&width=300",
    visible: true,
  },
  {
    id: 2,
    name: "Casa Natal de San Juan de la Cruz",
    description: "Museo dedicado al santo y poeta, con objetos personales y manuscritos",
    distance: "300m",
    duration: "45 min",
    type: "Museo",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mainImage: "/placeholder.svg?height=200&width=300",
    visible: true,
  },
  {
    id: 3,
    name: "Ruta Teresiana",
    description: "Camino que conecta los lugares relacionados con Santa Teresa y San Juan",
    distance: "0km",
    duration: "Varios días",
    type: "Ruta",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mainImage: "/placeholder.svg?height=200&width=300",
    visible: true,
  },
  {
    id: 4,
    name: "Ávila - Ciudad Amurallada",
    description: "Patrimonio de la Humanidad, murallas medievales mejor conservadas",
    distance: "25km",
    duration: "Día completo",
    type: "Patrimonio",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mainImage: "/placeholder.svg?height=200&width=300",
    visible: true,
  },
  {
    id: 5,
    name: "Parque Natural Sierra de Gredos",
    description: "Naturaleza, senderismo y paisajes de montaña espectaculares",
    distance: "45km",
    duration: "Día completo",
    type: "Naturaleza",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mainImage: "/placeholder.svg?height=200&width=300",
    visible: true,
  },
  {
    id: 6,
    name: "Arévalo",
    description: "Villa histórica con arquitectura mudéjar y castillo medieval",
    distance: "35km",
    duration: "Medio día",
    type: "Histórico",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mainImage: "/placeholder.svg?height=200&width=300",
    visible: true,
  },
]

export const events: Event[] = [
  {
    id: 1,
    name: "Semana Santa en Ávila",
    date: "Marzo - Abril 2025",
    description: "Procesiones tradicionales en la ciudad amurallada",
    visible: true,
  },
  {
    id: 2,
    name: "Festival Teresiano",
    date: "Octubre 2025",
    description: "Celebración en honor a Santa Teresa de Jesús",
    visible: true,
  },
  {
    id: 3,
    name: "Mercado Medieval de Ávila",
    date: "Septiembre 2025",
    description: "Recreación histórica en el casco antiguo",
    visible: true,
  },
  {
    id: 4,
    name: "Ruta de Tapas de Fontiveros",
    date: "Todo el año",
    description: "Descubre la gastronomía local en los bares del pueblo",
    visible: true,
  },
]
