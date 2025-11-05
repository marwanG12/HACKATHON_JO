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

const MedalChart: React.FC = () => {
  const [medalData, setMedalData] = useState<MedalData[]>([])

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/medals`)
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
        label: 'Nombre total de médailles gagné (Or, Argent, Bronze)',
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
      <h2 className="chart-title">Les 10 pays ayant gagné le plus de médailles olympiques depuis la création des JO (1896 - 2022)</h2>
      <div className="bar-wrapper">
        <Bar data={data} options={options} />
      </div>
      <div className="chart-description">
        <p>
          Le graphique ci-dessus montre le nombre total de médailles olympiques remportées par les 10 meilleurs pays. Les données sont basées sur les derniers enregistrements
          disponibles.
        </p>
        <p>
          Chaque barre représente le total des médailles d'un pays, y compris les médailles d'or, d'argent et de bronze. Les données sont classées par ordre décroissant, mettant en
          évidence les pays ayant obtenu les plus hauts résultats aux Jeux olympiques.
        </p>
      </div>
    </div>
  )
}

export default MedalChart
