import React, { useState, useEffect } from 'react'
import '../../index.css'
import { API_BASE_URL } from '../../config'

interface GameData {
  game_end_date: string
  game_location: string
  game_name: string
  game_season: string
  game_slug: string
  game_start_date: string
  game_year: number
  index: number
}

const AnalysisPage: React.FC = () => {
  const [data, setData] = useState<GameData[]>([])
  const [showRows, setShowRows] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/games`) // Replace with your actual API path
      .then((response) => response.json())
      .then((data) => setData(data))
  }, [])

  const getImpactData = () => {
    const cancelledYears = [1916, 1940, 1944] as number[]
    const postponedYear = 2020 as number

    // Adding impact information
    const allYears = Array.from(new Set(data.map((item) => item.game_year).concat(cancelledYears, [postponedYear])))
    return allYears
      .map((year) => {
        const game = data.find((item) => item.game_year === year)
        let impact = ''
        if (cancelledYears.includes(year)) {
          impact = 'Annulé en raison de la guerre'
        } else if (year === postponedYear) {
          impact = 'Repoussé en raison de la pandémie de COVID-19'
        }

        return {
          year,
          location: game ? game.game_location : 'N/A',
          name: game ? game.game_name : `Jeux Olympiques de ${year}`,
          season: game ? game.game_season : 'N/A',
          impact,
        }
      })
      .sort((a, b) => b.year - a.year)
  }

  const impactedData = getImpactData()

  return (
    <div className="prediction-wrapper">
      <h2>Un peu d'histoire</h2>
      <h4>Impact des événements mondiaux sur les Jeux olympiques</h4>
      <div className="analysis-container">
        <p>
          Tout au long de l'histoire, les Jeux olympiques ont connu d'importantes perturbations en raison d'événements mondiaux. Pendant la Première Guerre mondiale (1914-1918),
          les Jeux olympiques de 1916 ont été annulés. De même, la Seconde Guerre mondiale (1939-1945) a entraîné l'annulation des Jeux de 1940 et 1944. Plus récemment, la pandémie
          de COVID-19 a entraîné le report des Jeux olympiques de Tokyo 2020 à 2021.
        </p>
        <button onClick={() => setShowRows(!showRows)}>{showRows ? 'Cacher' : 'Afficher'} les détails</button>
        <table className="impact-table">
          <thead>
            <tr>
              <th>Année</th>
              <th>Nom et Ville</th>
              <th>Événement marquant</th>
            </tr>
          </thead>
          <tbody style={{ display: showRows ? 'table-row-group' : 'none' }}>
            {impactedData.map((item, index) => (
              <tr key={index} className={item.impact ? 'impacted' : ''}>
                <td>{item.year}</td>
                <td>{item.name}</td>
                <td>{item.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnalysisPage
