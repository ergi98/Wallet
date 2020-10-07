import React, { useState, Suspense } from 'react'
import './IncomeVSExpense.scss'

// Redux
import { useSelector } from "react-redux"

// Components
import Card from '../../card/Card'
import Loading from '../../loaders/Loading'
const IvsEForm = React.lazy(() => import('./IvsEForm'))
const IvsEChart = React.lazy(() => import('./IvsEChart'))

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
                    <Suspense fallback={<Loading/>}>
                          <IvsEForm
                            username={username}
                            setIsLoading={setIsLoading}
                            setShowForm={setShowForm}
                            setShowChart={setShowChart}
                            setStats={setStats}
                            setRange={setRange}
                        />
                    </Suspense>
                    :
                    null
            }
            {isLoading ? <Loading /> : null}
            {
                showChart ? 
                    <Suspense fallback={<Loading/>}>
                        <IvsEChart 
                            data={stats} 
                            range={range} 
                            displayForm={() => { setShowForm(true); setShowChart(false)} }
                        /> 
                    </Suspense>
                    : 
                    null
            }
        </Card>
    )
}

export default IncomeVSExpense
