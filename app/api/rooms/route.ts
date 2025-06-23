import { NextResponse } from "next/server"
import { rooms } from "@/lib/data"

export async function GET() {
  return NextResponse.json(rooms)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newRoom = {
    id: Math.max(...rooms.map((r) => r.id)) + 1,
    ...body,
  }
  rooms.push(newRoom)
  return NextResponse.json(newRoom)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = rooms.findIndex((r) => r.id === body.id)
  if (index !== -1) {
    rooms[index] = body
    return NextResponse.json(body)
  }
  return NextResponse.json({ error: "Room not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number.parseInt(searchParams.get("id") || "0")
  const index = rooms.findIndex((r) => r.id === id)
  if (index !== -1) {
    const deleted = rooms.splice(index, 1)[0]
    return NextResponse.json(deleted)
  }
  return NextResponse.json({ error: "Room not found" }, { status: 404 })
}
