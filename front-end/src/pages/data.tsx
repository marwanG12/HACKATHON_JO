import React, { useState, useEffect } from 'react'
import { Container, Table, Button } from 'reactstrap'
import '../index.css'
import axios from 'axios'
import { JOGame } from '../helpers/interface'
import { API_BASE_URL } from '../config'

interface Result {
  Unnamed: number
  athlete_full_name: string
  athlete_url: string
  athletes: string
  country_3_letter_code: string
  country_code: string
  country_name: string
  discipline_title: string
  event_title: string
  medal_type: string
  participant_type: string
  rank_equal: string
  rank_position: string
  slug_game: string
  value_type: string
  value_unit: string
}

const DataPage: React.FC = () => {
  const [JOgames, setJOGames] = useState<JOGame[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // Requêtage du serveur pour les JO
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/games`)
      .then((response) => {
        // Stockage des données récupérées dans la variable "JOGames"
        setJOGames(response.data)
      })
      .catch((error) => {
        console.error('There was an error fetching the games data!', error)
      })
  }, [])

  // Requêtage du serveur pour les résultats avec pagination
  const fetchResults = (page: number) => {
    axios
      .get(`${API_BASE_URL}/results?page=${page}&page_size=10`)
      .then((response) => {
        // Stockage des résultats et mise à jour de la pagination
        setResults(response.data.results.sort((a: Result, b: Result) => a.country_name.localeCompare(b.country_name)))
        setCurrentPage(response.data.page)
        setTotalPages(response.data.total_pages)
      })
      .catch((error) => {
        console.error('There was an error fetching the results data!', error)
      })
  }

  // Fetch results on component mount and when currentPage changes
  useEffect(() => {
    fetchResults(currentPage)
  }, [currentPage])

  return (
    <div className="data-page">
      <Container>
        <h2>Les 10 derniers hôte des JO</h2>
        <div className="table-card">
        <Table bordered responsive className="table-modern">
          <thead>
            <tr>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Localisation</th>
              <th>Nom</th>
              <th>Saison</th>
              <th>Année</th>
            </tr>
          </thead>
          <tbody>
            {JOgames.slice(0, 10).map((game) => (
              <tr key={game.index}>
                <td>{new Date(game.game_start_date).toLocaleDateString()}</td>
                <td>{new Date(game.game_end_date).toLocaleDateString()}</td>
                <td>{game.game_location}</td>
                <td>{game.game_name}</td>
                <td>
                  <span className={`badge season-badge ${game.game_season?.toLowerCase()}`}>{game.game_season}</span>
                </td>
                <td>{game.game_year}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>

        <h2>Résultats des Jeux Olympiques</h2>
        <div className="table-card">
        <Table bordered responsive className="table-modern">
          <thead>
            <tr>
              <th>Pays</th>
              <th>Discipline</th>
              <th>Événement</th>
              <th>Position</th>
              <th>Médaille</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.country_name}</td>
                <td>{result.discipline_title}</td>
                <td>{result.event_title}</td>
                <td>
                  <span className="pill rank-pill">#{result.rank_position}</span>
                </td>
                <td>
                  <span className={`badge medal-badge ${result.medal_type ? result.medal_type.toLowerCase() : 'none'}`}>
                    {result.medal_type || 'Aucune'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>

        <div className="pagination">
          <Button className="btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Précédent
          </Button>
          <span>
            {' '}
            Page {currentPage} de {totalPages}{' '}
          </span>
          <Button className="btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Suivant
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default DataPage
