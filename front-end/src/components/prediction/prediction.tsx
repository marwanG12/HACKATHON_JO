import React, { useState } from 'react'
import '../../index.css'
import { API_BASE_URL } from '../../config'

type PredictionData = {
  sports: number
  epreuves: number
  game_part: number
  prec_game_medal: number
  prec_game_gold: number
  prec_game_silver: number
  prec_game_bronze: number
}

type PredictionResult = {
  predicted_gold: number
  predicted_silver: number
  predicted_bronze: number
}

const PredictionPage: React.FC = () => {
  const [formData, setFormData] = useState({
    sports: 43,
    epreuves: 234,
    game_part: 27,
    prec_game_medal: 113,
    prec_game_gold: 39,
    prec_game_silver: 41,
    prec_game_bronze: 33,
  } as PredictionData)

  const [prediction, setPrediction] = useState<PredictionResult>()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: parseInt(value, 10),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (response.ok) {
        setPrediction(data)
        setError(null)
      } else {
        setError(data.error)
        setPrediction({} as PredictionResult)
      }
    } catch (err) {
      setError('An error occurred while making the prediction.')
      setPrediction({} as PredictionResult)
    }
  }

  return (
    <div className="prediction-wrapper">
      <h2>Prédiction des médailles olympiques selon les anciens jeux</h2>
      <div className="prediction-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Sports joués:
              <input type="number" name="sports" value={formData.sports} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Epreuves à disputer:
              <input type="number" name="epreuves" value={formData.epreuves} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Participations précédentes aux jeux:
              <input type="number" name="game_part" value={formData.game_part} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Médailles totales aux jeux précédents:
              <input type="number" name="prec_game_medal" value={formData.prec_game_medal} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Précédentes médailles d'or:
              <input type="number" name="prec_game_gold" value={formData.prec_game_gold} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Précédentes médailles d'argent:
              <input type="number" name="prec_game_silver" value={formData.prec_game_silver} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Précédentes médailles de bronze:
              <input type="number" name="prec_game_bronze" value={formData.prec_game_bronze} onChange={handleChange} />
            </label>
          </div>
          <button type="submit">Prédire</button>
        </form>
        {prediction && (
          <div className="prediction-result">
            <h3>Résultats de la prédiction</h3>
            <p>
              Médailles d'or: <span>{Math.trunc(prediction.predicted_gold)}</span>
            </p>
            <p>
              Médailles d'argent: <span>{Math.trunc(prediction.predicted_silver)}</span>
            </p>
            <p>
              Médailles de bronze: <span>{Math.trunc(prediction.predicted_bronze)}</span>
            </p>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

export default PredictionPage
