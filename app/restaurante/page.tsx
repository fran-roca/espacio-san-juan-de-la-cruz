"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Utensils, Star, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { ALERGENOS } from "@/lib/data"

export default function RestaurantePage() {
  const [menuData, setMenuData] = useState<any>(null)
  const [cartaData, setCartaData] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [guests, setGuests] = useState(2)
  const [zone, setZone] = useState("interior")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [scheduleInfo, setScheduleInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, cartaRes] = await Promise.all([fetch("/api/menu-del-dia"), fetch("/api/carta")])

        setMenuData(await menuRes.json())
        setCartaData(await cartaRes.json())
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true)
    try {
      const dateStr = date.toISOString().split("T")[0]
      const response = await fetch(`/api/restaurant-schedule?date=${dateStr}`)
      const schedule = await response.json()

      setScheduleInfo(schedule)
      if (schedule.isOpen) {
        setAvailableSlots(schedule.availableSlots)
      } else {
        setAvailableSlots([])
      }
      setSelectedTime("") // Reset selected time when date changes
    } catch (error) {
      console.error("Error fetching schedule:", error)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  // Remove cartaPlatos constant and use cartaData grouped by category
  const groupedCarta = cartaData.reduce(
    (acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = []
      }
      acc[item.categoria].push(item)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const handleReservationSubmit = async (formData: any) => {
    try {
      const reservationData = {
        guestName: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: selectedDate?.toISOString().split("T")[0],
        time: selectedTime,
        guests: guests,
        zone: zone,
        notes: formData.notes,
      }

      const response = await fetch("/api/restaurant-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        alert("Reserva de mesa confirmada correctamente")
        // Reset form
      } else {
        alert("Error al confirmar la reserva")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al confirmar la reserva")
    }
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
              <Link href="/hotel" className="text-stone-700 hover:text-stone-900">
                Hotel
              </Link>
              <Link href="/restaurante" className="text-amber-600 font-medium">
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
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Restaurante</h1>
          <p className="text-xl text-stone-600">Cocina casera castiza con productos locales</p>
        </div>

        <Tabs defaultValue="reserva" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reserva">Reservar Mesa</TabsTrigger>
            <TabsTrigger value="menu">Menú del Día</TabsTrigger>
            <TabsTrigger value="carta">Carta</TabsTrigger>
          </TabsList>

          {/* Reserva Tab */}
          <TabsContent value="reserva" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Reservar mesa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label>Fecha</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      {selectedDate && scheduleInfo && !scheduleInfo.isOpen && (
                        <p className="text-sm text-red-600 mt-1">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Cerrado los {scheduleInfo.dayName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Hora</Label>
                      <Select
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                        disabled={!selectedDate || loading || availableSlots.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loading
                                ? "Cargando horarios..."
                                : availableSlots.length === 0
                                  ? "No hay horarios disponibles"
                                  : "Seleccionar hora"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {scheduleInfo?.lunchSlots?.length > 0 && (
                            <>
                              <SelectItem value="lunch-header" disabled>
                                <span className="font-semibold text-amber-600">Almuerzo</span>
                              </SelectItem>
                              {scheduleInfo.lunchSlots.map((time) => (
                                <SelectItem key={`lunch-${time}`} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </>
                          )}
                          {scheduleInfo?.dinnerSlots?.length > 0 && (
                            <>
                              <SelectItem value="dinner-header" disabled>
                                <span className="font-semibold text-amber-600">Cena</span>
                              </SelectItem>
                              {scheduleInfo.dinnerSlots.map((time) => (
                                <SelectItem key={`dinner-${time}`} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="guests">Número de comensales</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Zona preferida</Label>
                      <Select value={zone} onValueChange={setZone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interior">Interior</SelectItem>
                          <SelectItem value="terraza">Terraza</SelectItem>
                          <SelectItem value="cualquiera">Sin preferencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Tu nombre completo" />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="+34 600 000 000" />
                    </div>

                    <div>
                      <Label htmlFor="email">Email (opcional)</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>

                    <div>
                      <Label htmlFor="notes">Observaciones</Label>
                      <Input id="notes" placeholder="Alergias, celebraciones, etc." />
                    </div>

                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700 mt-6"
                      disabled={!selectedDate || !selectedTime || !scheduleInfo?.isOpen}
                    >
                      Confirmar reserva
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menú del Día Tab */}
          <TabsContent value="menu" className="space-y-6">
            {menuData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Menú del Día</span>
                    <Badge className="bg-amber-600">€{menuData.precio}</Badge>
                  </CardTitle>
                  <p className="text-stone-600">{menuData.fecha}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-stone-800">Entrantes (a elegir)</h3>
                    <ul className="space-y-3">
                      {menuData.entrantes.map((plato: any, index: number) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 mr-2" />
                            <span>{plato.nombre}</span>
                          </div>
                          {plato.alergenos && plato.alergenos.length > 0 && (
                            <div className="flex gap-1">
                              {plato.alergenos.map((alergeno) => (
                                <span key={alergeno} className="text-lg" title={ALERGENOS[alergeno]?.name}>
                                  {ALERGENOS[alergeno]?.icon}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-stone-800">Principales (a elegir)</h3>
                    <ul className="space-y-3">
                      {menuData.principales.map((plato: any, index: number) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 mr-2" />
                            <span>{plato.nombre}</span>
                          </div>
                          {plato.alergenos && plato.alergenos.length > 0 && (
                            <div className="flex gap-1">
                              {plato.alergenos.map((alergeno) => (
                                <span key={alergeno} className="text-lg" title={ALERGENOS[alergeno]?.name}>
                                  {ALERGENOS[alergeno]?.icon}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-stone-800">Postres (a elegir)</h3>
                    <ul className="space-y-3">
                      {menuData.postres.map((plato: any, index: number) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 mr-2" />
                            <span>{plato.nombre}</span>
                          </div>
                          {plato.alergenos && plato.alergenos.length > 0 && (
                            <div className="flex gap-1">
                              {plato.alergenos.map((alergeno) => (
                                <span key={alergeno} className="text-lg" title={ALERGENOS[alergeno]?.name}>
                                  {ALERGENOS[alergeno]?.icon}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-stone-700">
                      <strong>Bebida incluida:</strong> {menuData.bebida}
                    </p>
                  </div>

                  {menuData.alergenosGenerales && menuData.alergenosGenerales.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Alérgenos presentes en todo el menú:</h4>
                      <div className="flex flex-wrap gap-2">
                        {menuData.alergenosGenerales.map((alergeno) => (
                          <div key={alergeno} className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded">
                            <span className="text-lg">{ALERGENOS[alergeno]?.icon}</span>
                            <span className="text-sm text-red-700">{ALERGENOS[alergeno]?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Reservar mesa para menú del día</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Carta Tab */}
          <TabsContent value="carta" className="space-y-6">
            {Object.entries(groupedCarta).map(([categoria, platos]) => (
              <Card key={categoria}>
                <CardHeader>
                  <CardTitle>{categoria}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {platos
                      .filter((plato) => plato.disponible)
                      .map((plato) => (
                        <div
                          key={plato.id}
                          className="flex justify-between items-start p-4 border border-stone-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-stone-800">{plato.nombre}</h4>
                              {plato.alergenos && plato.alergenos.length > 0 && (
                                <div className="flex gap-1">
                                  {plato.alergenos.map((alergeno) => (
                                    <span key={alergeno} className="text-lg" title={ALERGENOS[alergeno]?.name}>
                                      {ALERGENOS[alergeno]?.icon}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-stone-600 text-sm mt-1">{plato.descripcion}</p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-lg font-bold text-amber-600">€{plato.precio}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Leyenda de Alérgenos */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg">Información sobre alérgenos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                  {Object.entries(ALERGENOS).map(([key, alergeno]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-lg">{alergeno.icon}</span>
                      <span className="text-stone-700">{alergeno.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-stone-600 mt-4">
                  Si tienes alguna alergia o intolerancia alimentaria, por favor informa a nuestro personal antes de
                  realizar tu pedido.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
