import { NextResponse } from "next/server"
import { events } from "@/lib/data"

export async function GET() {
  return NextResponse.json(events.filter((e) => e.visible))
}

export async function POST(request: Request) {
  const body = await request.json()
  const newEvent = {
    id: Math.max(...events.map((e) => e.id)) + 1,
    ...body,
  }
  events.push(newEvent)
  return NextResponse.json(newEvent)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = events.findIndex((e) => e.id === body.id)
  if (index !== -1) {
    events[index] = body
    return NextResponse.json(body)
  }
  return NextResponse.json({ error: "Event not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number.parseInt(searchParams.get("id") || "0")
  const index = events.findIndex((e) => e.id === id)
  if (index !== -1) {
    const deleted = events.splice(index, 1)[0]
    return NextResponse.json(deleted)
  }
  return NextResponse.json({ error: "Event not found" }, { status: 404 })
}
