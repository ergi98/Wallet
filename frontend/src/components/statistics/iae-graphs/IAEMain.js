import React, { useState, Suspense } from 'react'

// Redux
import { useSelector } from "react-redux"

// Components
import Card from '../../card/Card'
import Loading from '../../loaders/Loading'
const IAEForm = React.lazy(() => import('./IAEFrom'))
const IAEGraph = React.lazy(() => import('./IAEGraph'))

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
                    <Suspense fallback={<Loading/>}>
                        <IAEForm 
                            username={username}
                            setShowForm={setShowForm}
                            setIsLoading={setShowLoading}
                            setStats={setStats}
                            setRange={setRange}
                            setShowGraph={setShowGraph}
                            setChartType={setChartType}
                        />
                    </Suspense>
                    :
                    null
            }
            {showLoading ? <Loading /> : null}
            {
                showGraph ? 
                    <Suspense fallback={<Loading/>}>
                        <IAEGraph 
                            data={stats} 
                            range={range}
                            type={chartType}
                            displayForm={() => { setShowForm(true); setShowGraph(false)} }
                        /> 
                    </Suspense>
                    : 
                    null 
            }
        </Card>
    )
}

export default IAEMain
