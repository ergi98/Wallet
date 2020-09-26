import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

// Charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Redux
import { useSelector } from 'react-redux'

// Number Format
import NumberFormat from 'react-number-format'

function IAEGraph(props) {

    const currency = useSelector((state) => state.user.pref_currency)

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
              
                    <LineChart
                        data={props.data[0]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        width={349}
                        height={240}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {props.type === "earnings" || props.type === "both" ? <Line type="monotone" dataKey="earnings" stroke="#3C800F" /> : null}
                        {props.type === "spendings" || props.type === "both" ? <Line type="monotone" dataKey="spendings" stroke="#D32A17" /> : null}
                    </LineChart>
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
