import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import '../index.css'

const ProjectSummary: React.FC = () => {
  return (
    <div className="project-summary">
      <Container>
        <Row>
          <Col>
            <h2>Le Projet</h2>
            <p>
              Ce site propose des analyses complètes des données, des visualisations interactives et des modèles prédictifs relatifs aux Jeux Olympiques. Conçu pour être accessible
              aussi bien sur ordinateur que sur appareils mobiles, le site garantit une navigation conviviale.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ProjectSummary
