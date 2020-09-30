import React, { useState } from 'react'

// Redux
import { useSelector } from "react-redux"

// Components
import Card from '../../card/Card'
import IAEForm from './IAEFrom'
import IAEGraph from './IAEGraph'
import Loading from '../income-vs-expense/Loading'

function IAEMain() {

    const username = useSelector((state) => state.user.username)

    const [showForm, setShowForm] = useState(true)
    const [showLoading, setShowLoading] = useState(false)
    const [showGraph, setShowGraph] = useState(false)

    const [range, setRange] = useState({})
    const [stats, setStats] = useState([])
    const [chartType, setChartType] = useState('')

    return (
        <Card title="Transaction Charts" style={{marginBottom: "20px !important"}}>
            {
                showForm ?
                    <IAEForm 
                        username={username}
                        setShowForm={setShowForm}
                        setIsLoading={setShowLoading}
                        setStats={setStats}
                        setRange={setRange}
                        setShowGraph={setShowGraph}
                        setChartType={setChartType}
                    />
                    :
                    null
            }
            {showLoading ? <Loading /> : null}
            {
                showGraph ? 
                    <IAEGraph 
                        data={stats} 
                        range={range}
                        type={chartType}
                        displayForm={() => { setShowForm(true); setShowGraph(false)} }
                    /> 
                    : 
                    null 
            }
        </Card>
    )
}

export default IAEMain
