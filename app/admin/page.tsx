"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, Eye, EyeOff, Clock } from "lucide-react"
import type {
  Room,
  HotelReservation,
  RestaurantReservation,
  MenuDelDia,
  CartaItem,
  Attraction,
  Event,
  GalleryImage,
  RestaurantSchedule,
} from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

const ALERGENOS = {
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

export default function AdminPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Data states
  const [rooms, setRooms] = useState<Room[]>([])
  const [hotelReservations, setHotelReservations] = useState<HotelReservation[]>([])
  const [restaurantReservations, setRestaurantReservations] = useState<RestaurantReservation[]>([])
  const [menuDelDia, setMenuDelDia] = useState<MenuDelDia | null>(null)
  const [cartaItems, setCartaItems] = useState<CartaItem[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [restaurantSchedules, setRestaurantSchedules] = useState<RestaurantSchedule[]>([])

  // Form states
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingCartaItem, setEditingCartaItem] = useState<CartaItem | null>(null)
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<RestaurantSchedule | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(username, password)
    if (!success) {
      alert("Credenciales incorrectas")
    }
  }

  const loadData = async () => {
    try {
      const [roomsRes, hotelRes, restaurantRes, menuRes, cartaRes, attractionsRes, eventsRes, galleryRes, scheduleRes] =
        await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/hotel-reservations"),
          fetch("/api/restaurant-reservations"),
          fetch("/api/menu-del-dia"),
          fetch("/api/carta"),
          fetch("/api/attractions"),
          fetch("/api/events"),
          fetch("/api/gallery"),
          fetch("/api/restaurant-schedule"),
        ])

      setRooms(await roomsRes.json())
      setHotelReservations(await hotelRes.json())
      setRestaurantReservations(await restaurantRes.json())
      setMenuDelDia(await menuRes.json())
      setCartaItems(await cartaRes.json())
      setAttractions(await attractionsRes.json())
      setEvents(await eventsRes.json())
      setGalleryImages(await galleryRes.json())
      setRestaurantSchedules(await scheduleRes.json())
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const saveRoom = async (room: Partial<Room>) => {
    try {
      const method = room.id ? "PUT" : "POST"
      const response = await fetch("/api/rooms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(room),
      })

      if (response.ok) {
        loadData()
        setEditingRoom(null)
      }
    } catch (error) {
      console.error("Error saving room:", error)
    }
  }

  const deleteRoom = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta habitación?")) {
      try {
        const response = await fetch(`/api/rooms?id=${id}`, { method: "DELETE" })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error("Error deleting room:", error)
      }
    }
  }

  const toggleRoomVisibility = async (room: Room) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...room, visible: !room.visible }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error toggling room visibility:", error)
    }
  }

  const updateReservationStatus = async (id: number, status: string, type: "hotel" | "restaurant") => {
    try {
      const endpoint = type === "hotel" ? "/api/hotel-reservations" : "/api/restaurant-reservations"
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error updating reservation:", error)
    }
  }

  const saveMenuDelDia = async (menu: Partial<MenuDelDia>) => {
    try {
      const response = await fetch("/api/menu-del-dia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error saving menu:", error)
    }
  }

  const saveCartaItem = async (item: Partial<CartaItem>) => {
    try {
      const method = item.id ? "PUT" : "POST"
      const response = await fetch("/api/carta", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })

      if (response.ok) {
        loadData()
        setEditingCartaItem(null)
      }
    } catch (error) {
      console.error("Error saving carta item:", error)
    }
  }

  const deleteCartaItem = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este plato?")) {
      try {
        const response = await fetch(`/api/carta?id=${id}`, { method: "DELETE" })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error("Error deleting carta item:", error)
      }
    }
  }

  const saveAttraction = async (attraction: Partial<Attraction>) => {
    try {
      const method = attraction.id ? "PUT" : "POST"
      const response = await fetch("/api/attractions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attraction),
      })

      if (response.ok) {
        loadData()
        setEditingAttraction(null)
      }
    } catch (error) {
      console.error("Error saving attraction:", error)
    }
  }

  const deleteAttraction = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta atracción?")) {
      try {
        const response = await fetch(`/api/attractions?id=${id}`, { method: "DELETE" })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error("Error deleting attraction:", error)
      }
    }
  }

  const toggleAttractionVisibility = async (attraction: Attraction) => {
    try {
      const response = await fetch("/api/attractions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...attraction, visible: !attraction.visible }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error toggling attraction visibility:", error)
    }
  }

  const saveEvent = async (event: Partial<Event>) => {
    try {
      const method = event.id ? "PUT" : "POST"
      const response = await fetch("/api/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        loadData()
        setEditingEvent(null)
      }
    } catch (error) {
      console.error("Error saving event:", error)
    }
  }

  const deleteEvent = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      try {
        const response = await fetch(`/api/events?id=${id}`, { method: "DELETE" })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  const toggleEventVisibility = async (event: Event) => {
    try {
      const response = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, visible: !event.visible }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error toggling event visibility:", error)
    }
  }

  const saveGalleryImage = async (image: Partial<GalleryImage>) => {
    try {
      const method = image.id ? "PUT" : "POST"
      const response = await fetch("/api/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image),
      })

      if (response.ok) {
        loadData()
        setEditingGalleryImage(null)
      }
    } catch (error) {
      console.error("Error saving gallery image:", error)
    }
  }

  const deleteGalleryImage = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      try {
        const response = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" })
        if (response.ok) {
          loadData()
        }
      } catch (error) {
        console.error("Error deleting gallery image:", error)
      }
    }
  }

  const toggleGalleryImageVisibility = async (image: GalleryImage) => {
    try {
      const response = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...image, visible: !image.visible }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error toggling gallery image visibility:", error)
    }
  }

  const saveSchedule = async (schedule: Partial<RestaurantSchedule>) => {
    try {
      const response = await fetch("/api/restaurant-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      })

      if (response.ok) {
        loadData()
        setEditingSchedule(null)
      }
    } catch (error) {
      console.error("Error saving schedule:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800">Panel de Administración</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">📊 Dashboard</Link>
            </Button>
            <Button onClick={logout} variant="outline">
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reservas-hotel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="reservas-hotel">Hotel</TabsTrigger>
            <TabsTrigger value="reservas-restaurante">Restaurante</TabsTrigger>
            <TabsTrigger value="habitaciones">Habitaciones</TabsTrigger>
            <TabsTrigger value="menu-carta">Menú/Carta</TabsTrigger>
            <TabsTrigger value="horarios">Horarios</TabsTrigger>
            <TabsTrigger value="atracciones">Atracciones</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="galeria">Galería</TabsTrigger>
          </TabsList>

          {/* Hotel Reservations */}
          <TabsContent value="reservas-hotel">
            <Card>
              <CardHeader>
                <CardTitle>Reservas de Hotel ({hotelReservations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotelReservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{reservation.guestName}</h3>
                          <p className="text-sm text-stone-600">
                            {reservation.email} | {reservation.phone}
                          </p>
                          <p className="text-sm">
                            {reservation.checkIn} - {reservation.checkOut} | {reservation.guests} huéspedes
                          </p>
                          <p className="text-sm">
                            Habitación ID: {reservation.roomId} | Total: €{reservation.totalPrice}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              reservation.status === "confirmed"
                                ? "default"
                                : reservation.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {reservation.status}
                          </Badge>
                          <Select
                            value={reservation.status}
                            onValueChange={(status) => updateReservationStatus(reservation.id, status, "hotel")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="confirmed">Confirmada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Restaurant Reservations */}
          <TabsContent value="reservas-restaurante">
            <Card>
              <CardHeader>
                <CardTitle>Reservas de Restaurante ({restaurantReservations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantReservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{reservation.guestName}</h3>
                          <p className="text-sm text-stone-600">
                            {reservation.phone} | {reservation.email}
                          </p>
                          <p className="text-sm">
                            {reservation.date} a las {reservation.time} | {reservation.guests} comensales
                          </p>
                          <p className="text-sm">Zona: {reservation.zone}</p>
                          {reservation.notes && <p className="text-sm text-stone-500">Notas: {reservation.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              reservation.status === "confirmed"
                                ? "default"
                                : reservation.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {reservation.status}
                          </Badge>
                          <Select
                            value={reservation.status}
                            onValueChange={(status) => updateReservationStatus(reservation.id, status, "restaurant")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="confirmed">Confirmada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Management */}
          <TabsContent value="habitaciones">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Habitaciones</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingRoom({} as Room)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Habitación
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingRoom?.id ? "Editar Habitación" : "Nueva Habitación"}</DialogTitle>
                      </DialogHeader>
                      <RoomForm room={editingRoom} onSave={saveRoom} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{room.name}</h3>
                          <p className="text-sm text-stone-600">{room.description}</p>
                          <p className="text-sm">
                            €{room.price}/noche | Capacidad: {room.capacity} | Disponibles: {room.available}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {room.amenities.map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleRoomVisibility(room)}
                            title={room.visible ? "Ocultar habitación" : "Mostrar habitación"}
                          >
                            {room.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingRoom(room)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Editar Habitación</DialogTitle>
                              </DialogHeader>
                              <RoomForm room={editingRoom} onSave={saveRoom} />
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="destructive" onClick={() => deleteRoom(room.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu and Carta Management */}
          <TabsContent value="menu-carta">
            <div className="space-y-6">
              {/* Menu del Dia */}
              <Card>
                <CardHeader>
                  <CardTitle>Menú del Día</CardTitle>
                </CardHeader>
                <CardContent>{menuDelDia && <MenuDelDiaForm menu={menuDelDia} onSave={saveMenuDelDia} />}</CardContent>
              </Card>

              {/* Carta */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Carta del Restaurante</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setEditingCartaItem({} as CartaItem)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Plato
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nuevo Plato</DialogTitle>
                        </DialogHeader>
                        <CartaItemForm item={editingCartaItem} onSave={saveCartaItem} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Entrantes", "Carnes", "Pescados", "Postres"].map((categoria) => (
                      <div key={categoria}>
                        <h3 className="font-semibold text-lg mb-2">{categoria}</h3>
                        <div className="grid gap-2">
                          {cartaItems
                            .filter((item) => item.categoria === categoria)
                            .map((item) => (
                              <div key={item.id} className="border rounded p-3 flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{item.nombre}</h4>
                                  <p className="text-sm text-stone-600">{item.descripcion}</p>
                                  <p className="text-sm font-semibold">€{item.precio}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={item.disponible ? "default" : "secondary"}>
                                    {item.disponible ? "Disponible" : "No disponible"}
                                  </Badge>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline" onClick={() => setEditingCartaItem(item)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Editar Plato</DialogTitle>
                                      </DialogHeader>
                                      <CartaItemForm item={editingCartaItem} onSave={saveCartaItem} />
                                    </DialogContent>
                                  </Dialog>
                                  <Button size="sm" variant="destructive" onClick={() => deleteCartaItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Restaurant Schedule Management */}
          <TabsContent value="horarios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios del Restaurante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantSchedules.map((schedule) => (
                    <div key={schedule.dayOfWeek} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{schedule.dayName}</h3>
                          <p className="text-sm text-stone-600">{schedule.isOpen ? "Abierto" : "Cerrado"}</p>
                          {schedule.isOpen && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                <strong>Almuerzo:</strong> {schedule.lunchSlots.join(", ") || "No disponible"}
                              </p>
                              <p className="text-sm">
                                <strong>Cena:</strong> {schedule.dinnerSlots.join(", ") || "No disponible"}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingSchedule(schedule)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Horario - {schedule.dayName}</DialogTitle>
                              </DialogHeader>
                              <ScheduleForm schedule={editingSchedule} onSave={saveSchedule} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attractions Management */}
          <TabsContent value="atracciones">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Atracciones Turísticas</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingAttraction({} as Attraction)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Atracción
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nueva Atracción</DialogTitle>
                      </DialogHeader>
                      <AttractionForm attraction={editingAttraction} onSave={saveAttraction} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attractions.map((attraction) => (
                    <div key={attraction.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{attraction.name}</h3>
                          <p className="text-sm text-stone-600">{attraction.description}</p>
                          <p className="text-sm">
                            {attraction.distance} | {attraction.duration} | {attraction.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleAttractionVisibility(attraction)}
                            title={attraction.visible ? "Ocultar atracción" : "Mostrar atracción"}
                          >
                            {attraction.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingAttraction(attraction)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Atracción</DialogTitle>
                              </DialogHeader>
                              <AttractionForm attraction={editingAttraction} onSave={saveAttraction} />
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="destructive" onClick={() => deleteAttraction(attraction.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Management */}
          <TabsContent value="eventos">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Eventos y Festividades</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingEvent({} as Event)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Evento
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Evento</DialogTitle>
                      </DialogHeader>
                      <EventForm event={editingEvent} onSave={saveEvent} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-amber-600">{event.date}</p>
                          <p className="text-sm text-stone-600">{event.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleEventVisibility(event)}
                            title={event.visible ? "Ocultar evento" : "Mostrar evento"}
                          >
                            {event.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingEvent(event)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Evento</DialogTitle>
                              </DialogHeader>
                              <EventForm event={editingEvent} onSave={saveEvent} />
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Management */}
          <TabsContent value="galeria">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Galería de Imágenes</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingGalleryImage({} as GalleryImage)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Imagen
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nueva Imagen</DialogTitle>
                      </DialogHeader>
                      <GalleryImageForm image={editingGalleryImage} onSave={saveGalleryImage} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["habitaciones", "restaurante", "terraza", "exterior", "entorno"].map((category) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3 capitalize">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleryImages
                          .filter((img) => img.category === category)
                          .map((image) => (
                            <div key={image.id} className="border rounded-lg overflow-hidden">
                              <div className="relative h-48">
                                <Image
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.title}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge variant={image.visible ? "default" : "secondary"}>
                                    {image.visible ? "Visible" : "Oculta"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold">{image.title}</h4>
                                <p className="text-sm text-stone-600 mb-2">{image.description}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-stone-500">Orden: {image.order}</span>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => toggleGalleryImageVisibility(image)}
                                      title={image.visible ? "Ocultar imagen" : "Mostrar imagen"}
                                    >
                                      {image.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingGalleryImage(image)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Editar Imagen</DialogTitle>
                                        </DialogHeader>
                                        <GalleryImageForm image={editingGalleryImage} onSave={saveGalleryImage} />
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteGalleryImage(image.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Form Components
function RoomForm({ room, onSave }: { room: Room | null; onSave: (room: Partial<Room>) => void }) {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    description: room?.description || "",
    price: room?.price || 0,
    capacity: room?.capacity || 2,
    available: room?.available || 1,
    amenities: room?.amenities?.join(", ") || "",
    mainImage: room?.mainImage || "",
    images: room?.images?.join("\n") || "",
    visible: room?.visible ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...room,
      ...formData,
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      images: formData.images
        .split("\n")
        .map((img) => img.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre</Label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Precio (€/noche)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label>Capacidad</Label>
          <Input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label>Disponibles</Label>
          <Input
            type="number"
            value={formData.available}
            onChange={(e) => setFormData({ ...formData, available: Number(e.target.value) })}
            required
          />
        </div>
      </div>
      <div>
        <Label>Servicios (separados por comas)</Label>
        <Input
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          placeholder="Wifi, TV, Baño privado, Calefacción"
        />
      </div>
      <div>
        <Label>Imagen Principal (URL)</Label>
        <Input
          value={formData.mainImage}
          onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      <div>
        <Label>Imágenes Adicionales (una URL por línea)</Label>
        <Textarea
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
          rows={4}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={formData.visible} onCheckedChange={(visible) => setFormData({ ...formData, visible })} />
        <Label>Habitación visible</Label>
      </div>
      <Button type="submit" className="w-full">
        Guardar Habitación
      </Button>
    </form>
  )
}

function MenuDelDiaForm({ menu, onSave }: { menu: MenuDelDia; onSave: (menu: Partial<MenuDelDia>) => void }) {
  const [formData, setFormData] = useState({
    fecha: menu.fecha,
    precio: menu.precio,
    entrantes: menu.entrantes || [],
    principales: menu.principales || [],
    postres: menu.postres || [],
    bebida: menu.bebida,
    activo: menu.activo,
    alergenosGenerales: menu.alergenosGenerales || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updatePlato = (
    categoria: "entrantes" | "principales" | "postres",
    index: number,
    field: "nombre" | "alergenos",
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [categoria]: prev[categoria].map((plato, i) => (i === index ? { ...plato, [field]: value } : plato)),
    }))
  }

  const addPlato = (categoria: "entrantes" | "principales" | "postres") => {
    setFormData((prev) => ({
      ...prev,
      [categoria]: [...prev[categoria], { nombre: "", alergenos: [] }],
    }))
  }

  const removePlato = (categoria: "entrantes" | "principales" | "postres", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [categoria]: prev[categoria].filter((_, i) => i !== index),
    }))
  }

  const toggleAlergenoGeneral = (alergeno: string) => {
    setFormData((prev) => ({
      ...prev,
      alergenosGenerales: prev.alergenosGenerales.includes(alergeno)
        ? prev.alergenosGenerales.filter((a) => a !== alergeno)
        : [...prev.alergenosGenerales, alergeno],
    }))
  }

  const toggleAlergenoPlato = (categoria: "entrantes" | "principales" | "postres", index: number, alergeno: string) => {
    const plato = formData[categoria][index]
    const newAlergenos = plato.alergenos.includes(alergeno)
      ? plato.alergenos.filter((a) => a !== alergeno)
      : [...plato.alergenos, alergeno]

    updatePlato(categoria, index, "alergenos", newAlergenos)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Fecha</Label>
          <Input
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Precio (€)</Label>
          <Input
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* Entrantes */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label className="text-lg font-semibold">Entrantes</Label>
          <Button type="button" size="sm" onClick={() => addPlato("entrantes")}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>
        {formData.entrantes.map((plato, index) => (
          <div key={index} className="border rounded p-4 mb-3">
            <div className="flex justify-between items-start mb-2">
              <Input
                placeholder="Nombre del plato"
                value={plato.nombre}
                onChange={(e) => updatePlato("entrantes", index, "nombre", e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="button" size="sm" variant="destructive" onClick={() => removePlato("entrantes", index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label className="text-sm">Alérgenos:</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {Object.entries(ALERGENOS).map(([key, alergeno]) => (
                  <div key={key} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id={`entrante-${index}-${key}`}
                      checked={plato.alergenos.includes(key)}
                      onChange={() => toggleAlergenoPlato("entrantes", index, key)}
                      className="rounded"
                    />
                    <label htmlFor={`entrante-${index}-${key}`} className="text-xs flex items-center gap-1">
                      <span>{alergeno.icon}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Principales */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label className="text-lg font-semibold">Principales</Label>
          <Button type="button" size="sm" onClick={() => addPlato("principales")}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>
        {formData.principales.map((plato, index) => (
          <div key={index} className="border rounded p-4 mb-3">
            <div className="flex justify-between items-start mb-2">
              <Input
                placeholder="Nombre del plato"
                value={plato.nombre}
                onChange={(e) => updatePlato("principales", index, "nombre", e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="button" size="sm" variant="destructive" onClick={() => removePlato("principales", index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label className="text-sm">Alérgenos:</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {Object.entries(ALERGENOS).map(([key, alergeno]) => (
                  <div key={key} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id={`principal-${index}-${key}`}
                      checked={plato.alergenos.includes(key)}
                      onChange={() => toggleAlergenoPlato("principales", index, key)}
                      className="rounded"
                    />
                    <label htmlFor={`principal-${index}-${key}`} className="text-xs flex items-center gap-1">
                      <span>{alergeno.icon}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Postres */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label className="text-lg font-semibold">Postres</Label>
          <Button type="button" size="sm" onClick={() => addPlato("postres")}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>
        {formData.postres.map((plato, index) => (
          <div key={index} className="border rounded p-4 mb-3">
            <div className="flex justify-between items-start mb-2">
              <Input
                placeholder="Nombre del plato"
                value={plato.nombre}
                onChange={(e) => updatePlato("postres", index, "nombre", e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="button" size="sm" variant="destructive" onClick={() => removePlato("postres", index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label className="text-sm">Alérgenos:</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {Object.entries(ALERGENOS).map(([key, alergeno]) => (
                  <div key={key} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id={`postre-${index}-${key}`}
                      checked={plato.alergenos.includes(key)}
                      onChange={() => toggleAlergenoPlato("postres", index, key)}
                      className="rounded"
                    />
                    <label htmlFor={`postre-${index}-${key}`} className="text-xs flex items-center gap-1">
                      <span>{alergeno.icon}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Label>Bebida incluida</Label>
        <Input value={formData.bebida} onChange={(e) => setFormData({ ...formData, bebida: e.target.value })} />
      </div>

      <div>
        <Label>Alérgenos generales del menú (aplican a todo)</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {Object.entries(ALERGENOS).map(([key, alergeno]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`general-${key}`}
                checked={formData.alergenosGenerales.includes(key)}
                onChange={() => toggleAlergenoGeneral(key)}
                className="rounded"
              />
              <label htmlFor={`general-${key}`} className="text-sm flex items-center gap-1">
                <span>{alergeno.icon}</span>
                <span>{alergeno.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch checked={formData.activo} onCheckedChange={(activo) => setFormData({ ...formData, activo })} />
        <Label>Menú activo</Label>
      </div>

      <Button type="submit" className="w-full">
        Guardar Menú del Día
      </Button>
    </form>
  )
}

function CartaItemForm({ item, onSave }: { item: CartaItem | null; onSave: (item: Partial<CartaItem>) => void }) {
  const [formData, setFormData] = useState({
    categoria: item?.categoria || "Entrantes",
    nombre: item?.nombre || "",
    descripcion: item?.descripcion || "",
    precio: item?.precio || 0,
    disponible: item?.disponible ?? true,
    alergenos: item?.alergenos || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...item, ...formData })
  }

  const toggleAlergeno = (alergeno: string) => {
    setFormData((prev) => ({
      ...prev,
      alergenos: prev.alergenos.includes(alergeno)
        ? prev.alergenos.filter((a) => a !== alergeno)
        : [...prev.alergenos, alergeno],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Categoría</Label>
        <Select value={formData.categoria} onValueChange={(categoria) => setFormData({ ...formData, categoria })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entrantes">Entrantes</SelectItem>
            <SelectItem value="Carnes">Carnes</SelectItem>
            <SelectItem value="Pescados">Pescados</SelectItem>
            <SelectItem value="Postres">Postres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Nombre del plato</Label>
        <Input
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        />
      </div>

      <div>
        <Label>Precio (€)</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label>Alérgenos</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Object.entries(ALERGENOS).map(([key, alergeno]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`carta-${key}`}
                checked={formData.alergenos.includes(key)}
                onChange={() => toggleAlergeno(key)}
                className="rounded"
              />
              <label htmlFor={`carta-${key}`} className="text-sm flex items-center gap-1">
                <span>{alergeno.icon}</span>
                <span>{alergeno.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.disponible}
          onCheckedChange={(disponible) => setFormData({ ...formData, disponible })}
        />
        <Label>Disponible</Label>
      </div>

      <Button type="submit" className="w-full">
        Guardar Plato
      </Button>
    </form>
  )
}

function ScheduleForm({
  schedule,
  onSave,
}: { schedule: RestaurantSchedule | null; onSave: (schedule: Partial<RestaurantSchedule>) => void }) {
  const [formData, setFormData] = useState({
    dayOfWeek: schedule?.dayOfWeek || 0,
    dayName: schedule?.dayName || "",
    isOpen: schedule?.isOpen ?? true,
    lunchSlots: schedule?.lunchSlots?.join(", ") || "",
    dinnerSlots: schedule?.dinnerSlots?.join(", ") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...schedule,
      ...formData,
      lunchSlots: formData.lunchSlots
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      dinnerSlots: formData.dinnerSlots
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch checked={formData.isOpen} onCheckedChange={(isOpen) => setFormData({ ...formData, isOpen })} />
        <Label>Restaurante abierto este día</Label>
      </div>

      {formData.isOpen && (
        <>
          <div>
            <Label>Horarios de almuerzo (separados por comas)</Label>
            <Input
              value={formData.lunchSlots}
              onChange={(e) => setFormData({ ...formData, lunchSlots: e.target.value })}
              placeholder="13:00, 13:30, 14:00, 14:30, 15:00"
            />
          </div>

          <div>
            <Label>Horarios de cena (separados por comas)</Label>
            <Input
              value={formData.dinnerSlots}
              onChange={(e) => setFormData({ ...formData, dinnerSlots: e.target.value })}
              placeholder="20:00, 20:30, 21:00, 21:30, 22:00"
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full">
        Guardar Horario
      </Button>
    </form>
  )
}

function AttractionForm({
  attraction,
  onSave,
}: { attraction: Attraction | null; onSave: (attraction: Partial<Attraction>) => void }) {
  const [formData, setFormData] = useState({
    name: attraction?.name || "",
    description: attraction?.description || "",
    distance: attraction?.distance || "",
    duration: attraction?.duration || "",
    type: attraction?.type || "",
    mainImage: attraction?.mainImage || "/placeholder.svg?height=200&width=300",
    images: attraction?.images?.join("\n") || "",
    visible: attraction?.visible ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...attraction,
      ...formData,
      images: formData.images
        .split("\n")
        .map((img) => img.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre</Label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Distancia</Label>
          <Input
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            placeholder="200m"
          />
        </div>
        <div>
          <Label>Duración</Label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="15 min"
          />
        </div>
        <div>
          <Label>Tipo</Label>
          <Input
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Religioso"
          />
        </div>
      </div>

      <div>
        <Label>Imagen Principal (URL)</Label>
        <Input value={formData.mainImage} onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })} />
      </div>

      <div>
        <Label>Imágenes Adicionales (una URL por línea)</Label>
        <Textarea
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch checked={formData.visible} onCheckedChange={(visible) => setFormData({ ...formData, visible })} />
        <Label>Visible en la web</Label>
      </div>

      <Button type="submit" className="w-full">
        Guardar Atracción
      </Button>
    </form>
  )
}

// === EventForm ==========================================================
function EventForm({
  event,
  onSave,
}: {
  event: Event | null
  onSave: (event: Partial<Event>) => void
}) {
  const [formData, setFormData] = useState({
    name: event?.name || "",
    date: event?.date || "",
    description: event?.description || "",
    visible: event?.visible ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...event, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre del evento</Label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>

      <div>
        <Label>Fecha</Label>
        <Input
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          placeholder="Marzo - Abril 2025"
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch checked={formData.visible} onCheckedChange={(visible) => setFormData({ ...formData, visible })} />
        <Label>Visible en la web</Label>
      </div>

      <Button type="submit" className="w-full">
        Guardar Evento
      </Button>
    </form>
  )
}

// === GalleryImageForm ====================================================
function GalleryImageForm({
  image,
  onSave,
}: {
  image: GalleryImage | null
  onSave: (image: Partial<GalleryImage>) => void
}) {
  const [formData, setFormData] = useState({
    title: image?.title || "",
    description: image?.description || "",
    url: image?.url || "",
    category: image?.category || "habitaciones",
    visible: image?.visible ?? true,
    order: image?.order || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...image, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Título</Label>
        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label>URL de la imagen</Label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
      </div>

      <div>
        <Label>Categoría</Label>
        <Select value={formData.category} onValueChange={(category) => setFormData({ ...formData, category })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="habitaciones">Habitaciones</SelectItem>
            <SelectItem value="restaurante">Restaurante</SelectItem>
            <SelectItem value="terraza">Terraza</SelectItem>
            <SelectItem value="exterior">Exterior</SelectItem>
            <SelectItem value="entorno">Entorno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Orden de visualización</Label>
        <Input
          type="number"
          min={1}
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch checked={formData.visible} onCheckedChange={(visible) => setFormData({ ...formData, visible })} />
        <Label>Visible en la web</Label>
      </div>

      <Button type="submit" className="w-full">
        Guardar Imagen
      </Button>
    </form>
  )
}
