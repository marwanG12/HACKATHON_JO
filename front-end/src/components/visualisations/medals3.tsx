import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import '../../index.css' // Importer le fichier CSS
import { API_BASE_URL } from '../../config'

// Enregistrer les composants nécessaires
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MedalData {
  gold: number
  silver: number
  bronze: number
}

const MedalChartByCountry: React.FC = () => {
  const [medalData, setMedalData] = useState<MedalData>({ gold: 0, silver: 0, bronze: 0 })
  const [selectedCountry, setSelectedCountry] = useState<string>('USA') // Pays par défaut
  const [countries, setCountries] = useState<string[]>([])

  useEffect(() => {
    // Récupérer la liste des pays
    axios
      .get(`${API_BASE_URL}/countries`)
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.error('There was an error fetching the countries!', error)
      })
  }, [])

  useEffect(() => {
    // Récupérer les données des médailles pour le pays sélectionné
    if (selectedCountry) {
      axios
        .get(`${API_BASE_URL}/medals_by_country?country=${selectedCountry}`)
        .then((response) => {
          setMedalData(response.data)
        })
        .catch((error) => {
          console.error('There was an error fetching the medal data!', error)
        })
    }
  }, [selectedCountry])

  const data: ChartData<'bar'> = {
    labels: ['Gold', 'Silver', 'Bronze'],
    datasets: [
      {
        label: `Médailles pour ${selectedCountry}`,
        data: [medalData.gold, medalData.silver, medalData.bronze],
        backgroundColor: ['rgba(255, 215, 0, 0.6)', 'rgba(192, 192, 192, 0.6)', 'rgba(205, 127, 50, 0.6)'],
        borderColor: ['rgba(255, 215, 0, 1)', 'rgba(192, 192, 192, 1)', 'rgba(205, 127, 50, 1)'],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">Nombre de médailles total par type pour le pays sélectionné</h2>
      <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      <div className="bar-wrapper">
        <Bar data={data} options={options} />
      </div>
      <div className="chart-description">
        <p>Le graphique montre le nombre de médailles d'or, d'argent et de bronze remportées par le pays sélectionné.</p>
      </div>
    </div>
  )
}

export default MedalChartByCountry
