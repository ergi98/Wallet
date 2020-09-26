import React, { useState } from 'react'
import './IncomeVSExpense.scss'

// Components
import Card from '../../card/Card'
import IvsEForm from './IvsEForm'
import IvsEChart from './IvsEChart'
import Loading from './Loading'

// Redux
import { useSelector } from "react-redux"

function IncomeVSExpense() {

    const username = useSelector((state) => state.user.username)

    const [isLoading, setIsLoading] = useState(false)
    const [showForm, setShowForm] = useState(true)
    const [showChart, setShowChart] = useState(false)

    const [stats, setStats] = useState([])
    const [range, setRange] = useState({})

    return (
        <Card title="Income vs. Expenses">
            {
                showForm ?
                    <IvsEForm
                        username={username}
                        setIsLoading={setIsLoading}
                        setShowForm={setShowForm}
                        setShowChart={setShowChart}
                        setStats={setStats}
                        setRange={setRange}
                    />
                    :
                    null
            }
            {isLoading ? <Loading /> : null}
            {
                showChart ? 
                    <IvsEChart 
                        data={stats} 
                        range={range} 
                        displayForm={() => { setShowForm(true); setShowChart(false)} }
                    /> 
                    : 
                    null
            }
        </Card>
    )
}

export default IncomeVSExpense
