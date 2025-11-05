import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import '../index.css'

const TeamPresentation: React.FC = () => {
  return (
    <div className="team-presentation">
      <Container>
        <Row>
          <Col>
            <h2>Membres de l'équipe</h2>
            <Row>
              <Col sm="6">
                <div className="team-member">
                  <img
                    src="https://avataaars.io/?avatarStyle=Transparent&amp;topType=ShortHairShortFlat&amp;accessoriesType=Prescription02&amp;hairColor=Black&amp;facialHairType=Blank&amp;clotheType=BlazerSweater&amp;eyeType=Default&amp;eyebrowType=DefaultNatural&amp;mouthType=Default&amp;skinColor=Light"
                    alt="Team Member 1"
                    className="img-fluid rounded-circle"
                  />
                  <h3>Marwan GHRAIRI</h3>
                  <p>Développeur Full Stack & Data Scientist</p>
                </div>
              </Col>
              <Col sm="6">
                <div className="team-member">
                  <img
                    src="https://avataaars.io/?avatarStyle=Circle&topType=WinterHat1&accessoriesType=Blank&hatColor=Blue02&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Default&eyebrowType=Default&mouthType=Grimace&skinColor=Tanned"
                    alt="Team Member 2"
                    className="img-fluid rounded-circle"
                  />
                  <h3>Khalil JAOUANI</h3>
                  <p>Développeur Full Stack & Machine Learning Engineer</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TeamPresentation
