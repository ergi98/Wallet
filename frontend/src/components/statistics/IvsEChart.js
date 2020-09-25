import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

// Charts
import { PieChart, Pie, Cell } from 'recharts'

// Redux
import { useSelector } from 'react-redux'

// Number Format
import NumberFormat from 'react-number-format'

function IvsEChart(props) {
    const colors = [ "#D32A17", "#3C800F" ]
    const currency = useSelector((state) => state.user.pref_currency)

    const renderCustomizedLabel = ( entry ) => {
        return ( `${entry.name} - ${(entry.percent * 100).toFixed(0)}%` )
    }

    return (
        <Container className="income-vs-expense-chart">
            <div className="chart-stats">
                <Row>
                    <label className="ivse-title">Period:</label>
                    <label className="ivse-value">
                        {props.range.start} - {props.range.finish}
                    </label>
                </Row>
                <Row>
                    <label className="ivse-title">Earnings:</label>
                    <label className="ivse-value">
                        <NumberFormat 
                            value={props.data[0].value}
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={currency + ' ' } 
                        />
                    </label>
                </Row>
                <Row>
                    <label className="ivse-title">Spendings:</label>
                    <label className="ivse-value">
                        <NumberFormat 
                            value={props.data[1].value}
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={currency + ' ' } 
                        />
                    </label>
                </Row>
            </div>
            <div className="chart-div">
                <PieChart width={350} height={240} className="pie-chart">
                    <Pie 
                        data={props.data}
                        dataKey="value" 
                        fill="#8884d8" 
                        paddingAngle={5} 
                        innerRadius={50}
                        outerRadius={70}
                        label={renderCustomizedLabel}
                        
                    >
                        {
                            props.data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]}/>)
                        }
                    </Pie>
                </PieChart>
            </div>
            <div className="chart-btn-holder">
                <Button onClick={props.displayForm}>
                    Render a new chart
                </Button>
            </div>
        </Container>
    )
}

export default IvsEChart
