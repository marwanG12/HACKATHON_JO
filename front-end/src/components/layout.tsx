import React, { ReactNode } from 'react'
import { Container } from 'reactstrap'
import MyNavbar from './navbar'
import Footer from './footer'
import '../index.css'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <MyNavbar />
      <header className="jumbotron-background">
        <div className="jumbotron-overlay">
          <div className="jumbotron-content">
            <h1 className="jumbotron-title">Olympic Medals Prediction</h1>
            <p className="jumbotron-subtitle">Découvrez, analysez et prédisez les résultats des Jeux Olympiques grâce à l'IA</p>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
