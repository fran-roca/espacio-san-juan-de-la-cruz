"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users, CalendarIcon, Euro, Bed, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface DashboardData {
  hotel: {
    totalReservations: number
    confirmedReservations: number
    pendingReservations: number
    cancelledReservations: number
    totalRevenue: number
    averageStay: number
    roomOccupancy: Array<{
      roomName: string
      reservations: number
      revenue: number
      occupancyRate: number
      availableRooms: number
      totalRooms: number
    }>
    monthlyData: Array<{
      month: string
      reservations: number
      revenue: number
    }>
    upcomingArrivals: Array<{
      id: number
      guestName: string
      checkIn: string
      checkOut: string
      guests: number
      roomId: number
      roomName: string
    }>
  }
  restaurant: {
    totalReservations: number
    confirmedReservations: number
    pendingReservations: number
    averageGuests: number
  }
  summary: {
    totalRooms: number
    availableRooms: number
    totalMenuItems: number
    activeMenuItems: number
  }
  selectedDate: string
}

// Componente de gráfico de barras personalizado
function CustomBarChart({ data }: { data: Array<{ month: string; revenue: number }> }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-stone-500">
        No hay datos de ingresos para mostrar
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue))

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-8">
        {data.map((item, index) => {
          const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 0
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div
                  className="bg-amber-600 rounded-t-md transition-all duration-300 hover:bg-amber-700 min-w-[40px] cursor-pointer"
                  style={{ height: `${height}px` }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  €{item.revenue.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-stone-600 mt-2 text-center">{item.month}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente de gráfico circular personalizado
function CustomPieChart({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex items-center justify-center h-full text-stone-500">
        No hay datos de reservas para mostrar
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const paths = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    currentAngle += angle

    // Convertir ángulos a radianes
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Calcular coordenadas del arco
    const largeArcFlag = angle > 180 ? 1 : 0
    const x1 = 100 + 80 * Math.cos(startRad)
    const y1 = 100 + 80 * Math.sin(startRad)
    const x2 = 100 + 80 * Math.cos(endRad)
    const y2 = 100 + 80 * Math.sin(endRad)

    const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

    return {
      path: pathData,
      color: item.color,
      name: item.name,
      value: item.value,
      percentage: percentage.toFixed(1),
    }
  })

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-8">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {paths.map((segment, index) => (
              <g key={index}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  title={`${segment.name}: ${segment.value} (${segment.percentage}%)`}
                />
              </g>
            ))}
            {/* Centro del círculo */}
            <circle cx="100" cy="100" r="40" fill="white" />
            <text x="100" y="95" textAnchor="middle" className="text-sm font-semibold fill-stone-700">
              Total
            </text>
            <text x="100" y="110" textAnchor="middle" className="text-lg font-bold fill-stone-800">
              {total}
            </text>
          </svg>
        </div>

        {/* Leyenda */}
        <div className="space-y-3">
          {paths.map((segment, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
              <div className="text-sm">
                <div className="font-medium">{segment.name}</div>
                <div className="text-stone-600">
                  {segment.value} ({segment.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    fetchDashboardData()
  }, [selectedDate])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/dashboard?date=${dateStr}`)
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Error al cargar las estadísticas</p>
      </div>
    )
  }

  const reservationStatusData = [
    { name: "Confirmadas", value: data.hotel.confirmedReservations, color: "#d97706" },
    { name: "Pendientes", value: data.hotel.pendingReservations, color: "#92400e" },
    { name: "Canceladas", value: data.hotel.cancelledReservations, color: "#78350f" },
  ].filter((item) => item.value > 0)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-stone-800">
                Panel de Administración
              </Link>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Dashboard
              </Badge>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin">Volver al Panel</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-2">Dashboard de Estadísticas</h1>
          <p className="text-xl text-stone-600">Resumen completo del rendimiento del hotel y restaurante</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas Hotel</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.hotel.totalReservations}</div>
              <p className="text-xs text-muted-foreground">{data.hotel.confirmedReservations} confirmadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{data.hotel.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Solo reservas confirmadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estancia Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.hotel.averageStay} noches</div>
              <p className="text-xs text-muted-foreground">Por reserva</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Habitaciones Disponibles</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.availableRooms}</div>
              <p className="text-xs text-muted-foreground">De {data.summary.totalRooms} habitaciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-amber-600" />
                Ingresos por Mes
              </CardTitle>
              <p className="text-sm text-stone-600">Evolución de ingresos en los últimos 6 meses</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <CustomBarChart data={data.hotel.monthlyData} />
              </div>
            </CardContent>
          </Card>

          {/* Reservation Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-amber-600" />
                Estado de Reservas
              </CardTitle>
              <p className="text-sm text-stone-600">Distribución actual de reservas del hotel</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <CustomPieChart data={reservationStatusData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Occupancy and Upcoming Arrivals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Room Occupancy */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-amber-600" />
                    Ocupación por Habitación
                  </CardTitle>
                  <p className="text-sm text-stone-600 mt-1">Estado actual de ocupación</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="date-picker" className="text-sm">
                    Fecha:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "dd MMM yyyy", { locale: es })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.hotel.roomOccupancy.map((room, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-stone-800">{room.roomName}</span>
                      <span className="text-sm text-stone-600 bg-stone-100 px-2 py-1 rounded">
                        {room.availableRooms}/{room.totalRooms} disponibles
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500 relative"
                          style={{ width: `${room.occupancyRate}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="absolute -top-1 right-0 text-xs font-medium text-amber-700">
                        {Math.round(room.occupancyRate)}%
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        <strong>{room.reservations}</strong> reservas activas
                      </span>
                      <span className="text-green-600 font-medium">€{room.revenue.toLocaleString()} ingresos</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Arrivals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Próximas Llegadas
              </CardTitle>
              <p className="text-sm text-stone-600">Huéspedes que llegan en los próximos 7 días</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.hotel.upcomingArrivals.length > 0 ? (
                  data.hotel.upcomingArrivals.map((arrival) => (
                    <div
                      key={arrival.id}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-stone-50 to-amber-50 rounded-lg border border-stone-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-stone-800">{arrival.guestName}</p>
                        <p className="text-sm text-stone-600 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(arrival.checkIn).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            -{" "}
                            {new Date(arrival.checkOut).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </p>
                        <p className="text-xs text-amber-700 font-medium mt-1">{arrival.roomName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          {arrival.guests} huéspedes
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">No hay llegadas programadas</p>
                    <p className="text-sm text-stone-400">Los próximos huéspedes aparecerán aquí</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restaurant Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-amber-600" />
                Restaurante - Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3 text-stone-800">{data.restaurant.totalReservations}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Confirmadas:</span>
                  <span className="font-semibold text-green-600">{data.restaurant.confirmedReservations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Pendientes:</span>
                  <span className="font-semibold text-amber-600">{data.restaurant.pendingReservations}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Comensales Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 text-stone-800">{data.restaurant.averageGuests.toFixed(1)}</div>
              <p className="text-sm text-stone-600">Por reserva confirmada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-600" />
                Carta del Restaurante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 text-stone-800">{data.summary.activeMenuItems}</div>
              <p className="text-sm text-stone-600">De {data.summary.totalMenuItems} platos disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-amber-50 hover:border-amber-200">
                <Link href="/admin?tab=reservas-hotel" className="flex flex-col items-center space-y-2">
                  <CalendarIcon className="h-6 w-6 text-amber-600" />
                  <span>Ver Reservas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-amber-50 hover:border-amber-200">
                <Link href="/admin?tab=habitaciones" className="flex flex-col items-center space-y-2">
                  <Bed className="h-6 w-6 text-amber-600" />
                  <span>Gestionar Habitaciones</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-amber-50 hover:border-amber-200">
                <Link href="/admin?tab=menu-carta" className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6 text-amber-600" />
                  <span>Menú y Carta</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-amber-50 hover:border-amber-200">
                <Link href="/admin?tab=galeria" className="flex flex-col items-center space-y-2">
                  <MapPin className="h-6 w-6 text-amber-600" />
                  <span>Galería</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
