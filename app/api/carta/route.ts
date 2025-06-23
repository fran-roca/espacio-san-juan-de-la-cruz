import { NextResponse } from "next/server"
import { cartaItems } from "@/lib/data"

export async function GET() {
  return NextResponse.json(cartaItems)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newItem = {
    id: Math.max(...cartaItems.map((i) => i.id)) + 1,
    ...body,
  }
  cartaItems.push(newItem)
  return NextResponse.json(newItem)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = cartaItems.findIndex((i) => i.id === body.id)
  if (index !== -1) {
    cartaItems[index] = body
    return NextResponse.json(body)
  }
  return NextResponse.json({ error: "Item not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number.parseInt(searchParams.get("id") || "0")
  const index = cartaItems.findIndex((i) => i.id === id)
  if (index !== -1) {
    const deleted = cartaItems.splice(index, 1)[0]
    return NextResponse.json(deleted)
  }
  return NextResponse.json({ error: "Item not found" }, { status: 404 })
}
