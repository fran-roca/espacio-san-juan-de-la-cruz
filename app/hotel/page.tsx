"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, Wifi, Coffee, Tv, Bath, ChevronLeft, ChevronRight, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import type { DateRange } from "react-day-picker"

export default function HotelPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(2)
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms")
        const rooms = await response.json()
        setRoomTypes(rooms)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      }
    }

    fetchRooms()
  }, [])

  const handleReservation = async (room: any) => {
    if (!dateRange?.from || !dateRange?.to) {
      alert("Por favor selecciona las fechas de entrada y salida")
      return
    }

    setSelectedRoom(room)
  }

  const openGallery = (images: string[], startIndex = 0) => {
    setGalleryImages(images)
    setCurrentImageIndex(startIndex)
    setGalleryOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const confirmReservation = async (formData: any) => {
    try {
      const reservationData = {
        roomId: selectedRoom?.id,
        guestName: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkIn: dateRange?.from?.toISOString().split("T")[0],
        checkOut: dateRange?.to?.toISOString().split("T")[0],
        guests: guests,
        totalPrice: calculateTotal(selectedRoom?.price || 0),
      }

      const response = await fetch("/api/hotel-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        alert("Reserva confirmada correctamente")
        setSelectedRoom(null)
      } else {
        alert("Error al confirmar la reserva")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al confirmar la reserva")
    }
  }

  const calculateNights = () => {
    if (dateRange?.from && dateRange?.to) {
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  const calculateTotal = (roomPrice: number) => {
    return roomPrice * calculateNights()
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-stone-800">
              Espacio San Juan de la Cruz
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-stone-700 hover:text-stone-900">
                Inicio
              </Link>
              <Link href="/hotel" className="text-amber-600 font-medium">
                Hotel
              </Link>
              <Link href="/restaurante" className="text-stone-700 hover:text-stone-900">
                Restaurante
              </Link>
              <Link href="/entorno" className="text-stone-700 hover:text-stone-900">
                Entorno
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Reserva tu habitación</h1>
          <p className="text-xl text-stone-600">14 habitaciones disponibles en nuestro hotel rural</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar disponibilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Label>Fechas de estancia</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd MMM", { locale: es })} -{" "}
                            {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                          </>
                        ) : (
                          format(dateRange.from, "dd MMM yyyy", { locale: es })
                        )
                      ) : (
                        "Seleccionar fechas"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        // Validar que checkout no sea el mismo día que checkin
                        if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
                          // Si es el mismo día, no actualizar
                          return
                        }
                        setDateRange(range)
                      }}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                      locale={es}
                      modifiers={{
                        disabled: (date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="guests">Número de huéspedes</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700">Buscar habitaciones</Button>
            </div>
          </CardContent>
        </Card>

        {/* Room Results */}
        <div className="grid gap-6">
          {roomTypes.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative h-64 md:h-full group">
                  <Image
                    src={room.mainImage || room.images[0] || "/placeholder.svg"}
                    alt={room.name}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => openGallery(room.images, 0)}
                  />
                  {room.images.length > 1 && (
                    <button
                      onClick={() => openGallery(room.images, 0)}
                      className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded text-sm hover:bg-black/80 transition-colors"
                    >
                      +{room.images.length - 1} fotos
                    </button>
                  )}
                </div>

                <div className="p-6 md:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-800 mb-2">{room.name}</h3>
                      <p className="text-stone-600 mb-4">{room.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-amber-600">€{room.price}</div>
                      <div className="text-sm text-stone-500">por noche</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-stone-500" />
                      <span className="text-sm text-stone-600">Hasta {room.capacity} personas</span>
                    </div>
                    <Badge variant={room.available > 5 ? "default" : room.available > 0 ? "secondary" : "destructive"}>
                      {room.available > 0 ? `${room.available} disponibles` : "Sin disponibilidad"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center bg-stone-100 rounded-full px-3 py-1">
                        {amenity === "Wifi" && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity === "TV" && <Tv className="h-3 w-3 mr-1" />}
                        {amenity.includes("Baño") && <Bath className="h-3 w-3 mr-1" />}
                        {amenity === "Terraza" && <Coffee className="h-3 w-3 mr-1" />}
                        <span className="text-xs text-stone-600">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-stone-500">
                      {dateRange?.from && dateRange?.to && (
                        <span>
                          Total: €{calculateTotal(room.price)} ({calculateNights()} noches)
                        </span>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-amber-600 hover:bg-amber-700"
                          disabled={room.available === 0}
                          onClick={() => handleReservation(room)}
                        >
                          {room.available > 0 ? "Reservar ahora" : "Sin disponibilidad"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Confirmar reserva</DialogTitle>
                        </DialogHeader>
                        {selectedRoom && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold">{selectedRoom.name}</h4>
                              <p className="text-sm text-stone-600">{selectedRoom.description}</p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Entrada:</span>
                                <span>
                                  {dateRange?.from ? format(dateRange.from, "PPP", { locale: es }) : "No seleccionada"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Salida:</span>
                                <span>
                                  {dateRange?.to ? format(dateRange.to, "PPP", { locale: es }) : "No seleccionada"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Huéspedes:</span>
                                <span>{guests}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>€{calculateTotal(selectedRoom?.price || 0)}</span>
                              </div>
                            </div>

                            <form>
                              <div className="space-y-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <Input id="name" name="name" placeholder="Tu nombre completo" />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" placeholder="tu@email.com" />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" name="phone" placeholder="+34 600 000 000" />
                              </div>
                            </form>

                            <Button
                              className="w-full bg-amber-600 hover:bg-amber-700"
                              onClick={() => {
                                const form = document.querySelector("form") as HTMLFormElement
                                const formData = new FormData(form)
                                confirmReservation({
                                  name: formData.get("name"),
                                  email: formData.get("email"),
                                  phone: formData.get("phone"),
                                })
                              }}
                            >
                              Confirmar reserva
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white bg-black/50 px-3 py-1 rounded">
              Imagen {currentImageIndex + 1} de {galleryImages.length}
            </DialogTitle>
          </DialogHeader>
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="relative w-full h-full">
            <Image
              src={galleryImages[currentImageIndex] || "/placeholder.svg"}
              alt={`Imagen ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                } hover:bg-white/80`}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
