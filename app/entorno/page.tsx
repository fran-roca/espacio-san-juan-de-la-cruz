"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Camera, Church, TreePine, Mountain, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const EntornoPage = () => {
  const [attractions, setAttractions] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attractionsRes, eventsRes] = await Promise.all([fetch("/api/attractions"), fetch("/api/events")])

        setAttractions(await attractionsRes.json())
        setEvents(await eventsRes.json())
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-stone-800">
              Espacio San Juan de la Cruz
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-stone-700 hover:text-stone-900">
                Inicio
              </Link>
              <Link href="/hotel" className="text-stone-700 hover:text-stone-900">
                Hotel
              </Link>
              <Link href="/restaurante" className="text-stone-700 hover:text-stone-900">
                Restaurante
              </Link>
              <Link href="/entorno" className="text-amber-600 font-medium">
                Entorno
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Descubre Fontiveros y su entorno</h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Sumérgete en la historia, la espiritualidad y la naturaleza de la ruta teresiana
          </p>
        </div>

        {/* Hero Section */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-12">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Vista de Fontiveros" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Fontiveros, cuna de San Juan de la Cruz</h2>
              <p className="text-lg opacity-90">Pequeño pueblo castellano con gran historia espiritual y cultural</p>
            </div>
          </div>
        </div>

        {/* About Fontiveros */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-6 w-6 text-amber-600" />
                Historia de Fontiveros
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-stone-700 leading-relaxed mb-4">
                Fontiveros es un pequeño municipio de la provincia de Ávila, en Castilla y León, conocido principalmente
                por ser el lugar de nacimiento de San Juan de la Cruz (1542-1591), uno de los grandes místicos de la
                literatura española y doctor de la Iglesia Católica.
              </p>
              <p className="text-stone-700 leading-relaxed mb-4">
                El pueblo conserva un ambiente rural auténtico, con arquitectura tradicional castellana y un entorno
                natural privilegiado. Su ubicación en la ruta teresiana lo convierte en punto de paso obligado para
                peregrinos y visitantes interesados en el patrimonio espiritual y cultural de la región.
              </p>
              <p className="text-stone-700 leading-relaxed">
                La tranquilidad de sus calles, la hospitalidad de sus gentes y la riqueza de su patrimonio
                histórico-religioso hacen de Fontiveros un destino ideal para el turismo cultural y espiritual.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Attractions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">Qué visitar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={attraction.mainImage || "/placeholder.svg"}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{attraction.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{attraction.name}</h3>
                  <p className="text-stone-600 mb-4">{attraction.description}</p>

                  <div className="flex items-center justify-between text-sm text-stone-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {attraction.distance}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {attraction.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">Eventos y festividades</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-800">{event.name}</h3>
                      <p className="text-amber-600 font-medium">{event.date}</p>
                    </div>
                    <Calendar className="h-6 w-6 text-stone-400" />
                  </div>
                  <p className="text-stone-600">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">Actividades recomendadas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Senderismo</h3>
                <p className="text-stone-600">
                  Rutas por los alrededores del pueblo y conexión con senderos de la Sierra de Gredos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Fotografía</h3>
                <p className="text-stone-600">
                  Paisajes rurales, arquitectura tradicional y puestas de sol espectaculares
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mountain className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Turismo Cultural</h3>
                <p className="text-stone-600">Visitas guiadas, museos y lugares relacionados con San Juan de la Cruz</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-amber-50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Planifica tu estancia</h2>
          <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            Descubre todos estos lugares desde la comodidad de nuestro hotel. Te ayudamos a organizar tu visita por la
            ruta teresiana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/hotel">Reservar habitación</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
              <Link href="/restaurante">Reservar mesa</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default EntornoPage
