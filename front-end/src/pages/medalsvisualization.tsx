import React from 'react'
import Medals1 from '../components/visualisations/medals1'
import Medals2 from '../components/visualisations/medals2'
import Medals3 from '../components/visualisations/medals3' // Importer le nouveau composant
import '../index.css' // Importer le fichier CSS

const MedalsVizualisation: React.FC = () => {
  return (
    <div>
      <Medals1 />
      <Medals2 />
      <Medals3 />
    </div>
  )
}

export default MedalsVizualisation
