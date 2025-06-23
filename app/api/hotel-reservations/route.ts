import { NextResponse } from "next/server"
import { hotelReservations } from "@/lib/data"

export async function GET() {
  return NextResponse.json(hotelReservations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newReservation = {
    id: Math.max(...hotelReservations.map((r) => r.id), 0) + 1,
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  hotelReservations.push(newReservation)
  return NextResponse.json(newReservation)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = hotelReservations.findIndex((r) => r.id === body.id)
  if (index !== -1) {
    hotelReservations[index] = { ...hotelReservations[index], ...body }
    return NextResponse.json(hotelReservations[index])
  }
  return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
}
