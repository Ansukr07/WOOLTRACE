import React from 'react'
import Navbar from '../components/Navbar'
import MainHero from '../components/MainHero'
import Hero from '../components/Hero'
import UserProfile from '../components/UserProfile'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <>
      <Navbar />
      <MainHero />
      <Hero />
      <UserProfile />
      <div id="reviews"><Testimonials /></div>
      <div id="faq"><FAQ /></div>
      <div id="contact"><Footer /></div>
    </>
  )
}

export default LandingPage
