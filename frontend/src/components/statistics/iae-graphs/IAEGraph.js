import React from 'react'

// Charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Redux
// import { useSelector } from 'react-redux'

// Number Format
// import NumberFormat from 'react-number-format'

// Bootstrap
const Button = React.lazy(() => import('react-bootstrap/esm/Button'))
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))
const Row = React.lazy(() => import('react-bootstrap/esm/Row'))

function IAEGraph(props) {

    // const currency = useSelector((state) => state.user.pref_currency)

    return (
        <Container className="income-vs-expense-chart">
            <div className="chart-stats">
                <Row>
                    <label className="ivse-title">Period:</label>
                    <label className="ivse-value">
                        {props.range.start} - {props.range.finish}
                    </label>
                </Row>
            </div>
            <div className="chart-div">
                <ResponsiveContainer width="99%">
                    <LineChart
                        data={props.data[0]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {props.type === "earnings" || props.type === "both" ? <Line type="monotone" dataKey="earnings" stroke="#3C800F" /> : null}
                        {props.type === "spendings" || props.type === "both" ? <Line type="monotone" dataKey="spendings" stroke="#D32A17" /> : null}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="chart-btn-holder">
                <Button onClick={props.displayForm}>
                    Render a new chart
                </Button>
            </div>
        </Container>
    )
}

export default IAEGraph
