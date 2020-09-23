import React, { useState } from 'react'
import './IncomeVSExpense.scss'

// Components
import Card from '../card/Card'

// Bootstrap
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function IncomeVSExpense() {

    const [period, setPeriod] = useState('default')

    const [startPeriod, setStartPeriod] = useState('')
    const [endPeriod, setEndPeriod] = useState('')

    function handleChange(event) {
        setPeriod(event.target.value)
        
        // User can either supply his custom period or choose the default ones
        switch (event.target.id) {
            case "period":
                setPeriod(event.target.value)
                break;
            case "startPeriod":
                setStartPeriod(event.target.value)
                setPeriod("default")
                break;
            case "endPeriod":
                setEndPeriod(event.target.value)
                setPeriod("default")
                break;
            default:
                break;
        }
    }

    function generateChart() {
        //  If the user has selected a period 
        if(period !== "default") {
            let date = getDateRange(period)
        }
        // If the user has inputed a custom period
        else {

        }
    }

    // Helper function to get the dates based on user selection
    function getDateRange(period) {
        if(period === "week") {
            
        }
        if(period === "month") {

        }
        if(period === "year") {

        }
    }

    return (
        <Card title="Income vs. Expenses">
            <Form.Group as={Row} className="period-selector align-items-center">
                <Form.Label column lg={2} md={4} sm={4} xs={4}> By Period </Form.Label>
                <Col lg={10} md={8} sm={8} xs={8} style={{ padding: "0px 15px 0px 0px" }}>
                    <Form.Control
                        id="period"
                        as="select"
                        className="mr-sm-2"
                        custom
                        value={period}
                        onChange={handleChange}
                    >
                        <option value="default" disabled>Choose Period</option>
                        <option value="week">This week</option>
                        <option value="month">This month</option>
                        <option value="year">This year</option>
                    </Form.Control>
                </Col>
            </Form.Group>

            <label className="or-label">OR</label>
            <div className="line-separator"></div>
            <label className="custom-range">Custom Range</label>

            <Form.Group as={Row} className="align-items-center">
                <Col>
                    <Form.Control
                        style={{textAlign:"center"}}
                        id="startPeriod"
                        type="string"
                        placeholder="Start Period"
                        value={startPeriod}
                        onChange={handleChange}
                    />
                </Col>
                <Col>
                    <Form.Control
                        style={{textAlign:"center"}}
                        id="endPeriod"
                        type="string"
                        placeholder="End Period"
                        value={endPeriod}
                        onChange={handleChange}
                    />
                </Col>
            </Form.Group>
            <Row style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Button variant="primary" style={{margin:"0 auto", width:"50%"}}>
                    Generate Chart
                </Button>
            </Row>
        </Card>
    )
}

export default IncomeVSExpense
