import { NextResponse } from "next/server"
import { restaurantReservations } from "@/lib/data"

export async function GET() {
  return NextResponse.json(restaurantReservations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newReservation = {
    id: Math.max(...restaurantReservations.map((r) => r.id), 0) + 1,
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  restaurantReservations.push(newReservation)
  return NextResponse.json(newReservation)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = restaurantReservations.findIndex((r) => r.id === body.id)
  if (index !== -1) {
    restaurantReservations[index] = { ...restaurantReservations[index], ...body }
    return NextResponse.json(restaurantReservations[index])
  }
  return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
}
