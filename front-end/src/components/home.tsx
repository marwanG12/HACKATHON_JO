import React from 'react'
import { Jumbotron, Container } from 'reactstrap'
import ProjectPage from '../components/projectsummary'
import TeamPage from './team'
import Layout from './layout'

const Home: React.FC = () => {
  return (
    <div id="home">
      <ProjectPage />
      <TeamPage />
    </div>
  )
}

export default Home
