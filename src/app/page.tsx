"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { Testimonials } from "@/components/testimonials"
import { FormWrapper } from "@/components/form/form-wrapper"

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navbar onOpenForm={() => setIsFormOpen(true)} />
      <Hero onOpenForm={() => setIsFormOpen(true)} />
      <HowItWorks />
      <Services onOpenForm={() => setIsFormOpen(true)} />
      <Testimonials />
      <FormWrapper isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </main>
  )
}
