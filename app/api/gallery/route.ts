import { NextResponse } from "next/server"
import { galleryImages } from "@/lib/data"

export async function GET() {
  return NextResponse.json(galleryImages.filter((img) => img.visible).sort((a, b) => a.order - b.order))
}

export async function POST(request: Request) {
  const body = await request.json()
  const newImage = {
    id: Math.max(...galleryImages.map((img) => img.id)) + 1,
    ...body,
    order: galleryImages.length + 1,
  }
  galleryImages.push(newImage)
  return NextResponse.json(newImage)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = galleryImages.findIndex((img) => img.id === body.id)
  if (index !== -1) {
    galleryImages[index] = body
    return NextResponse.json(body)
  }
  return NextResponse.json({ error: "Image not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = Number.parseInt(searchParams.get("id") || "0")
  const index = galleryImages.findIndex((img) => img.id === id)
  if (index !== -1) {
    const deleted = galleryImages.splice(index, 1)[0]
    return NextResponse.json(deleted)
  }
  return NextResponse.json({ error: "Image not found" }, { status: 404 })
}
