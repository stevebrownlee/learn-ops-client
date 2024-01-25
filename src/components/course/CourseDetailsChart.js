import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { fetchIt } from '../utils/Fetch.js'
import Settings from '../Settings.js'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export const CourseDetailsChart = ({ courseId }) => {
    const [chartData, setChartData] = useState({
        labels: ["Project"],
        datasets: [
            {
                label: 'Average Start Delay (days)',
                data: [1],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    })

    useEffect(() => {
        fetchIt(`${Settings.apiHost}/courses/${courseId}/stats`)
            .then((response) => {
                const chartData = {
                    labels: response.data.map(item => item.projectname),
                    datasets: [
                        {
                            label: 'Average Start Delay (days)',
                            data: response.data.map(item => Math.round(item.averagestartdelay)),
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                    ],
                }

                setChartData(chartData)
            })
    }, [])

    return <Bar data={chartData}
        options={{
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }}
    />
}
