import { NextResponse } from "next/server"
import { hotelReservations, restaurantReservations, rooms, cartaItems } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const selectedDate = searchParams.get("date") || new Date().toISOString().split("T")[0]

  // Calcular estadísticas del hotel
  const confirmedHotelReservations = hotelReservations.filter((r) => r.status === "confirmed")
  const pendingHotelReservations = hotelReservations.filter((r) => r.status === "pending")
  const cancelledHotelReservations = hotelReservations.filter((r) => r.status === "cancelled")

  const totalRevenue = confirmedHotelReservations.reduce((sum, r) => sum + r.totalPrice, 0)
  const averageStay =
    confirmedHotelReservations.length > 0
      ? confirmedHotelReservations.reduce((sum, r) => {
          const checkIn = new Date(r.checkIn)
          const checkOut = new Date(r.checkOut)
          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
          return sum + nights
        }, 0) / confirmedHotelReservations.length
      : 0

  // Generar datos mensuales realistas para los últimos 6 meses
  const monthlyData = [
    { month: "Ene 2025", reservations: 8, revenue: 1200 },
    { month: "Feb 2025", reservations: 12, revenue: 1800 },
    { month: "Mar 2025", reservations: 15, revenue: 2250 },
    { month: "Abr 2025", reservations: 18, revenue: 2700 },
    { month: "May 2025", reservations: 22, revenue: 3300 },
    { month: "Jun 2025", reservations: 25, revenue: 3750 },
  ]

  // Ocupación por habitación para la fecha seleccionada
  const roomOccupancy = rooms.map((room) => {
    const roomReservations = confirmedHotelReservations.filter((r) => {
      const checkIn = new Date(r.checkIn)
      const checkOut = new Date(r.checkOut)
      const selected = new Date(selectedDate)
      return r.roomId === room.id && selected >= checkIn && selected < checkOut
    })

    const occupiedRooms = roomReservations.length
    const availableRooms = Math.max(0, room.available - occupiedRooms)
    const occupancyRate = room.available > 0 ? (occupiedRooms / room.available) * 100 : 0
    const revenue = roomReservations.reduce((sum, r) => sum + r.totalPrice, 0)

    return {
      roomName: room.name,
      reservations: roomReservations.length,
      revenue: revenue,
      occupancyRate: occupancyRate,
      availableRooms: availableRooms,
      totalRooms: room.available,
    }
  })

  // Próximas llegadas (próximos 7 días)
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcomingArrivals = confirmedHotelReservations
    .filter((r) => {
      const checkIn = new Date(r.checkIn)
      return checkIn >= today && checkIn <= nextWeek
    })
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .map((r) => {
      const room = rooms.find((room) => room.id === r.roomId)
      return {
        ...r,
        roomName: room?.name || `Habitación ${r.roomId}`,
      }
    })

  // Estadísticas del restaurante
  const confirmedRestaurantReservations = restaurantReservations.filter((r) => r.status === "confirmed")
  const pendingRestaurantReservations = restaurantReservations.filter((r) => r.status === "pending")
  const averageGuests =
    restaurantReservations.length > 0
      ? restaurantReservations.reduce((sum, r) => sum + r.guests, 0) / restaurantReservations.length
      : 0

  const dashboardData = {
    hotel: {
      totalReservations: hotelReservations.length,
      confirmedReservations: confirmedHotelReservations.length,
      pendingReservations: pendingHotelReservations.length,
      cancelledReservations: cancelledHotelReservations.length,
      totalRevenue: totalRevenue,
      averageStay: Math.round(averageStay * 10) / 10,
      roomOccupancy: roomOccupancy,
      monthlyData: monthlyData,
      upcomingArrivals: upcomingArrivals,
    },
    restaurant: {
      totalReservations: restaurantReservations.length,
      confirmedReservations: confirmedRestaurantReservations.length,
      pendingReservations: pendingRestaurantReservations.length,
      averageGuests: Math.round(averageGuests * 10) / 10,
    },
    summary: {
      totalRooms: rooms.reduce((sum, room) => sum + room.available, 0),
      availableRooms: rooms.reduce((sum, room) => sum + room.available, 0) - confirmedHotelReservations.length,
      totalMenuItems: cartaItems.length,
      activeMenuItems: cartaItems.filter((item) => item.disponible).length,
    },
    selectedDate: selectedDate,
  }

  return NextResponse.json(dashboardData)
}
