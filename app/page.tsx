"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Calendar, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [galleryImages, setGalleryImages] = useState<any[]>([])

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/gallery")
        const images = await response.json()
        setGalleryImages(images)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
      }
    }

    fetchGalleryImages()
  }, [])

  // Función para obtener imágenes por categoría
  const getImagesByCategory = (category: string) => {
    return galleryImages.filter((img) => img.category === category)
  }

  // Función para obtener la primera imagen de una categoría
  const getMainImageByCategory = (category: string) => {
    const images = getImagesByCategory(category)
    return images.length > 0 ? images[0].url : "/placeholder.svg?height=400&width=600"
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-stone-800">Espacio San Juan de la Cruz</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-stone-700 hover:text-stone-900 font-medium">
                Inicio
              </Link>
              <Link href="/hotel" className="text-stone-700 hover:text-stone-900 font-medium">
                Hotel
              </Link>
              <Link href="/restaurante" className="text-stone-700 hover:text-stone-900 font-medium">
                Restaurante
              </Link>
              <Link href="/entorno" className="text-stone-700 hover:text-stone-900 font-medium">
                Entorno
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - usar imagen de categoría "exterior" */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20">
          <Image
            src={getMainImageByCategory("exterior") || "/placeholder.svg"}
            alt="Espacio San Juan de la Cruz - Vista exterior"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Espacio San Juan de la Cruz</h1>
          <p className="text-xl md:text-2xl mb-8 font-light">Comodidad, tradición y misticismo en la ruta teresiana</p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Hotel rural moderno con cocina casera castiza y trato familiar en el corazón de Fontiveros, Ávila
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
              <Link href="/hotel">
                <Calendar className="mr-2 h-5 w-5" />
                Reservar Hotel
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-stone-800 hover:bg-stone-100 border-2 border-white px-8 py-3 text-lg font-medium"
            >
              <Link href="/restaurante">
                <Utensils className="mr-2 h-5 w-5" />
                Reservar Restaurante
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Una experiencia única</h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Descubre la perfecta combinación entre tradición castellana y comodidades modernas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-stone-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-4">Hotel Rural</h3>
                <p className="text-stone-600 mb-6">
                  14 habitaciones cómodas y acogedoras, perfectas para descansar en la ruta teresiana
                </p>
                <Button asChild variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  <Link href="/hotel">Ver habitaciones</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-stone-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-4">Restaurante</h3>
                <p className="text-stone-600 mb-6">
                  Cocina casera castiza con productos locales y recetas tradicionales de la región
                </p>
                <Button asChild variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  <Link href="/restaurante">Ver carta</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-stone-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-4">Ubicación</h3>
                <p className="text-stone-600 mb-6">
                  En el corazón de Fontiveros, punto clave de la ruta teresiana y cerca de Ávila
                </p>
                <Button asChild variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  <Link href="/entorno">Descubrir entorno</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section - usar imágenes de la API */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Nuestros espacios</h2>
            <p className="text-xl text-stone-600">Cada rincón cuenta una historia</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["habitaciones", "restaurante", "terraza"].map((category) => {
              const categoryImages = getImagesByCategory(category)
              if (categoryImages.length === 0) return null

              const mainImage = categoryImages[0]
              return (
                <div key={category} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={mainImage.url || "/placeholder.svg"}
                    alt={mainImage.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white font-semibold p-4">{mainImage.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Cómo llegar</h2>
            <p className="text-xl text-stone-600">Fontiveros, Ávila - En la ruta teresiana</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-stone-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-stone-800 mb-6">Información de contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="text-stone-700">Calle Principal, 123, Fontiveros, Ávila</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="text-stone-700">+34 920 123 456</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="text-stone-700">info@espaciosanjuandelacruz.com</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-stone-800 mb-4">Distancias</h4>
                  <ul className="space-y-2 text-stone-600">
                    <li>• Ávila: 25 km (30 min)</li>
                    <li>• Salamanca: 85 km (1h 15min)</li>
                    <li>• Madrid: 150 km (1h 45min)</li>
                    <li>• Valladolid: 120 km (1h 30min)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="h-96 bg-stone-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-stone-600">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">Mapa de Google Maps</p>
                <p className="text-sm">Fontiveros, Ávila</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Espacio San Juan de la Cruz</h3>
              <p className="text-stone-300 mb-4">
                Hotel rural y restaurante en Fontiveros, Ávila. Tradición, comodidad y hospitalidad castellana.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/hotel" className="text-stone-300 hover:text-white">
                    Reservar Hotel
                  </Link>
                </li>
                <li>
                  <Link href="/restaurante" className="text-stone-300 hover:text-white">
                    Reservar Restaurante
                  </Link>
                </li>
                <li>
                  <Link href="/entorno" className="text-stone-300 hover:text-white">
                    Qué visitar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-stone-300">
                <p>Fontiveros, Ávila</p>
                <p>+34 920 123 456</p>
                <p>info@espaciosanjuandelacruz.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-400">
            <p>&copy; 2024 Espacio San Juan de la Cruz. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
