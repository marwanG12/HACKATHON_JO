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
  country_name: string
  total_medals: number
}

const MedalChartLast10: React.FC = () => {
  const [medalData, setMedalData] = useState<MedalData[]>([])

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/medals_last_10`)
      .then((response) => {
        const sortedData = response.data.sort((a: MedalData, b: MedalData) => b.total_medals - a.total_medals)
        const top10Data = sortedData.slice(0, 10)
        setMedalData(top10Data)
      })
      .catch((error) => {
        console.error('There was an error fetching the medal data!', error)
      })
  }, [])

  const data: ChartData<'bar'> = {
    labels: medalData.map((medal) => medal.country_name),
    datasets: [
      {
        label: 'Médailles (Or, Argent, Bronze)',
        data: medalData.map((medal) => medal.total_medals),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
      <h2 className="chart-title">Les 10 pays ayant gagné le plus de médailles durant les 10 dernières éditions</h2>
      <div className="bar-wrapper">
        <Bar data={data} options={options} />
      </div>
      <div className="chart-description">
        <p>Le graphique ci-dessus montre le nombre total de médailles olympiques remportées par les 10 meilleurs pays lors des 10 dernières éditions des Jeux Olympiques.</p>
        <p>
          Chaque barre représente le total des médailles d'un pays, y compris les médailles d'or, d'argent et de bronze. Les données sont classées par ordre décroissant, mettant en
          évidence les pays ayant obtenu les plus hauts résultats lors des récents Jeux olympiques.
        </p>
      </div>
    </div>
  )
}

export default MedalChartLast10
