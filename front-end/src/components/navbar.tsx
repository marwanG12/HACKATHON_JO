import React, { useState, useEffect } from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container, NavbarToggler, Collapse } from 'reactstrap'
import '../index.css' // Importer un fichier CSS pour les styles supplémentaires

const MyNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar expand="md" className={`navbar-transparent fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <Container>
        <NavbarBrand href="/" className="navbar-logo">
          <img src="/images/logo_jo.png" alt="Logo JO" className="logo-img" />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/data">Données</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/medalVizualisation">Visualisations</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/analyses">Analyses</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/prediction">Prédictions</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
