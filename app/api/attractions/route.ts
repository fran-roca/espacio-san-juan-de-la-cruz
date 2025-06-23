import { NextResponse } from "next/server"
import { attractions } from "@/lib/data"

export async function GET() {
  return NextResponse.json(attractions.filter((a) => a.visible))
}

export async function POST(request: Request) {
  const body = await request.json()
  const newAttraction = {
    id: Math.max(...attractions.map((a) => a.id)) + 1,
    ...body,
  }
  attractions.push(newAttraction)
  return NextResponse.json(newAttraction)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = attractions.findIndex((a) => a.id === body.id)
  if (index !== -1) {
    attractions[index] = body
    return NextResponse.json(body)
  }
  return NextResponse.json({ error: "Attraction not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number.parseInt(searchParams.get("id") || "0")
  const index = attractions.findIndex((a) => a.id === id)
  if (index !== -1) {
    const deleted = attractions.splice(index, 1)[0]
    return NextResponse.json(deleted)
  }
  return NextResponse.json({ error: "Attraction not found" }, { status: 404 })
}
