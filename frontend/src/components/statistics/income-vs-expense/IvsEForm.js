import React, { useState } from 'react'
import './IncomeVSExpense.scss'

// Axios
import axios from 'axios'

// Redux
import { logOut } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// Date validation
import { parse, compareAsc } from 'date-fns'

// Bootstrap
import Form from 'react-bootstrap/esm/Form'
const Button = React.lazy(() => import('react-bootstrap/esm/Button'))
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))
const Row = React.lazy(() => import('react-bootstrap/esm/Row'))
const Col = React.lazy(() => import('react-bootstrap/esm/Col'))

function IvsEForm(props) {

    const dispatch = useDispatch()
    const jwt = useSelector((state) => state.user.jwt)

    const [period, setPeriod] = useState('default')

    const [startPeriod, setStartPeriod] = useState('')
    const [endPeriod, setEndPeriod] = useState('')

    const [isInvalidStart, setInvalidStart] = useState(false)
    const [isInvalidFinish, setInvalidFinish] = useState(false)

    function handleChange(event) {
        setPeriod(event.target.value)

        // User can either supply his custom period or choose the default ones
        switch (event.target.id) {
            case "period":
                setPeriod(event.target.value)
                break;
            case "startPeriod":
                setStartPeriod(event.target.value)
                validateDate(event.target.value, event.target.id)
                setPeriod("default")
                break;
            case "endPeriod":
                setEndPeriod(event.target.value)
                validateDate(event.target.value, event.target.id)
                setPeriod("default")
                break;
            default:
                break;
        }
    }

    function validateDate(date, period) {
        let regex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)

        // Test if the format is right
        let match = regex.test(date)
        // If the format of the date entered is correct
        if (match) {
            // Check if the date is the right format
            let parsedDate = parse(date, 'dd/MM/yyyy', new Date())

            // If the date is the right format
            if (parsedDate.toJSON !== null) {
                period === "startPeriod" ? setInvalidStart(false) : setInvalidFinish(false)
            }
            else
                period === "startPeriod" ? setInvalidStart(true) : setInvalidFinish(true)
        }
        else
            period === "startPeriod" ? setInvalidStart(true) : setInvalidFinish(true)
    }

    async function getData(start, finish) {
        try {
            // Hide the date form
            props.setShowForm(false)
            // Display the loading screen
            props.setIsLoading(true)
            let res = await axios.post('/transactions/income-vs-expense', {
                username: props.username,
                start_date: transformDate(start),
                end_date: transformDate(finish)

            }, { headers: { Authorization: `Bearer ${jwt}` } })

            props.setStats([
                { value: 1 * res.data.result[0].earn_amnt.$numberDecimal, name: "Earnings" },
                { value: -1 * res.data.result[0].spend_amnt.$numberDecimal, name: "Spendings" }
            ])

            props.setRange({ start, finish })
            // Hide the loading screen
            props.setIsLoading(false)
            // Display the charts
            props.setShowChart(true)
        }
        catch (err) {
            // If no token is present logout
            if (err.message.includes('403'))
                dispatch(logOut())
            else {
                // Hide the loading screen
                props.setIsLoading(false)
                // Show date form
                props.setShowForm(true)
            }
        }
    }

    function generateChart() {
        //  If the user has selected a period 
        if (period !== "default") {
            let date = getDateRange(period)
            getData(date.start, date.finish)
        }
        // If the user has inputed a custom period
        else {
            // If the user has enterd both dates
            if (startPeriod !== '' && endPeriod !== '') {
                // If these dates have no errors
                if (isInvalidStart !== true && isInvalidFinish !== true) {
                    // Validate that the start date is smaller than the end date
                    // If the start date is less than the end date
                    if (compareAsc(parse(startPeriod, 'dd/MM/yyyy', new Date()), parse(endPeriod, 'dd/MM/yyyy', new Date())) !== 1) {
                        getData(startPeriod, endPeriod)
                    }
                    else {
                        setInvalidFinish(true)
                    }
                }
            }
        }
    }

    // Helper function to get the dates based on user selection
    function getDateRange(period) {
        let date = {
            start: '',
            finish: ''
        }
        if (period === "week") {
            date.start = new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-GB')
            date.finish = new Date().toLocaleDateString('en-GB')
        }
        else if (period === "month") {
            date.start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-GB')
            date.finish = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('en-GB')
        }
        else if (period === "year") {
            date.start = new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-GB')
            date.finish = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-GB')
        }

        return date
    }

    // Sets date in YYYY/MM/DD format for accurate querying
    function transformDate(date) {
        const pieces = date.split('/')
        return `${pieces[2]}/${pieces[1]}/${pieces[0]}`
    }

    return (
        <Container className="income-vs-expense">
            <Form.Group as={Row} className="period-selector">
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
                        <option value="week">Last 7 days</option>
                        <option value="month">This month</option>
                        <option value="year">This year</option>
                    </Form.Control>
                </Col>
            </Form.Group>

            <label className="or-label">OR</label>
            <div className="line-separator"></div>
            <label className="custom-range">Custom Range</label>

            <Form.Group as={Row}>
                <Col>
                    <Form.Control
                        style={{ textAlign: "center" }}
                        id="startPeriod"
                        type="string"
                        placeholder="Start Period"
                        value={startPeriod}
                        onChange={handleChange}
                        isInvalid={isInvalidStart}
                    />
                </Col>
                <Col>
                    <Form.Control
                        style={{ textAlign: "center" }}
                        id="endPeriod"
                        type="string"
                        placeholder="End Period"
                        value={endPeriod}
                        onChange={handleChange}
                        isInvalid={isInvalidFinish}
                    />
                </Col>
            </Form.Group>
            <Row style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                <Button
                    variant="primary"
                    style={{ margin: "0 auto", width: "50%" }}
                    onClick={generateChart}
                >
                    Generate Chart
                </Button>
            </Row>
        </Container>
    )
}

export default IvsEForm
