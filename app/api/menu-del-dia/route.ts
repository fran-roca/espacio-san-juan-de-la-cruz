import { NextResponse } from "next/server"
import { menuDelDia } from "@/lib/data"

export async function GET() {
  return NextResponse.json(menuDelDia)
}

export async function PUT(request: Request) {
  const body = await request.json()
  Object.assign(menuDelDia, body)
  return NextResponse.json(menuDelDia)
}
