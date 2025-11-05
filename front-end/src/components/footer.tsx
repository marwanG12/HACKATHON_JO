import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import '../index.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md="4" className="footer-section">
            <h4>Olympic Medals Prediction</h4>
            <p>Analysez et prédisez les résultats des Jeux Olympiques grâce à l'intelligence artificielle.</p>
          </Col>
          <Col md="4" className="footer-section">
            <h4>Liens Utiles</h4>
            <ul className="footer-links">
              <li><a href="/data">Données</a></li>
              <li><a href="/medalVizualisation">Visualisations</a></li>
              <li><a href="/analyses">Analyses</a></li>
              <li><a href="/prediction">Prédictions</a></li>
            </ul>
          </Col>
          <Col md="4" className="footer-section">
            <h4>Contact</h4>
            <p>Email: contact@olympics-prediction.com</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub">GitHub</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </Col>
        </Row>
        <Row className="footer-bottom">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Olympic Medals Prediction. Tous droits réservés.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
