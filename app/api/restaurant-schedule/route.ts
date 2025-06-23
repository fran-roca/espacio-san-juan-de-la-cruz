import { NextResponse } from "next/server"
import { restaurantSchedule } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get("date")

  if (!dateStr) {
    // Devolver todos los horarios para administración
    return NextResponse.json(restaurantSchedule)
  }

  const date = new Date(dateStr)
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.

  const schedule = restaurantSchedule.find((s) => s.dayOfWeek === dayOfWeek)

  if (!schedule) {
    return NextResponse.json({
      isOpen: false,
      dayName: "Desconocido",
      lunchSlots: [],
      dinnerSlots: [],
      availableSlots: [],
    })
  }

  const availableSlots = [...schedule.lunchSlots, ...schedule.dinnerSlots]

  return NextResponse.json({
    isOpen: schedule.isOpen,
    dayName: schedule.dayName,
    lunchSlots: schedule.lunchSlots,
    dinnerSlots: schedule.dinnerSlots,
    availableSlots: availableSlots,
  })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { dayOfWeek, isOpen, lunchSlots, dinnerSlots } = body

  const scheduleIndex = restaurantSchedule.findIndex((s) => s.dayOfWeek === dayOfWeek)

  if (scheduleIndex !== -1) {
    restaurantSchedule[scheduleIndex] = {
      ...restaurantSchedule[scheduleIndex],
      isOpen,
      lunchSlots: lunchSlots || [],
      dinnerSlots: dinnerSlots || [],
    }
    return NextResponse.json(restaurantSchedule[scheduleIndex])
  }

  return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
}
