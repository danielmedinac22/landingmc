import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
    </main>
  )
}
