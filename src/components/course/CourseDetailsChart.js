import React, { useEffect, useState } from 'react'
import { Bar, Bubble } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { fetchIt } from '../utils/Fetch.js'
import Settings from '../Settings.js'

import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, PointElement, Title,
    Tooltip, Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale, LinearScale, BarElement,
    PointElement, Title, Tooltip,
    Legend, ChartDataLabels
)


export const CourseDetailsChart = ({ courseId }) => {
    const bubbleScale = 3

    const [barChartData, setBarChartData] = useState({
        labels: [""],
        datasets: [
            {
                label: 'Average Start Delay (days)',
                data: [0],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    })
    const [chartData, setChartData] = useState({
        labels: [""],
        datasets: [ { x: 0, y: 0, r: 0 }, ],
    })

    useEffect(() => {
        fetchIt(`${Settings.apiHost}/courses/${courseId}/stats`)
            .then((response) => {
                let chartData = {
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

                setBarChartData(chartData)

                chartData = {
                    datasets: [
                        {
                            label: ["Time on Project"],
                            data: response.data.map((item, idx, arr) => {
                                item.x = (idx + 1) * 2
                                item.y = item.averagestartdelay
                                try {
                                    item.r = 1 + Math.abs(idx < arr.length ? arr[idx + 1].averagestartdelay - arr[idx].averagestartdelay : 1)
                                } catch (error) {
                                    item.r = 1
                                }
                                item.r *= bubbleScale
                                item.label = item.projectname

                                return item
                            }),
                            backgroundColor: 'rgba(149, 183, 68, 0.5)',
                        }
                    ],
                }
                setChartData(chartData)
            })
    }, [])

    return <div style={{ display: "flex", justifyContent: 'space-between', flexDirection: "row" }}>
        <div style={{ flex: 1 }}>
            <Bar data={barChartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
        </div>
        <div style={{ flex: 1 }}>
            <Bubble data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                        x: {
                            display: false
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: true,
                            anchor: 'end',
                            align: -145,
                            rotation: 45,
                            color: '#000',
                            formatter: (value, context) => {
                                const splitName = value.projectname.split("Group:")

                                return splitName.length > 1
                                    ? splitName[1]
                                    : splitName[0].substring(0, 6)
                            }
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                    }
                                    return `${context.raw.projectname}: ${Math.round(context.raw.r / bubbleScale)} days`;
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    </div>
}
