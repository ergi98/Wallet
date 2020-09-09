import React from 'react'
import './ProfitTransaction.scss'

// Axios
import axios from 'axios'

// Components
import Layout from '../layout/Layout'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button'

// Icons
import { IconContext } from "react-icons"
import { FaMapMarkedAlt } from 'react-icons/fa'
import { AiOutlineFileDone } from 'react-icons/ai'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Date Validation
import { parse } from "date-fns"

// Redux 
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


// Establish the validation schema
const transaction_schema = yup.object({
    date: yup.string().required().transform(parseDate),
    hours: yup.string().required().max(2),
    minutes: yup.string().required().max(2),
    long: yup.string(),
    lat: yup.string(),
    amount: yup.string().required().matches(/^[0-9]+[.]?[0-9]+$/),
    currency: yup.string().required(),
    portfolio: yup.string().required(),
    category: yup.string().required(),
    description: yup.string().required().max(30).matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/),
    long_desc: yup.string().notRequired().max(100).matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/)
});

function parseDate(value, originalValue) {
    const parsedDate = parse(originalValue, "dd/MM/yyyy", new Date())

    if (parsedDate.toJSON() !== null) {
        return parsedDate.toLocaleDateString('en-GB')
    }

    return false
}

class ProfitTransaction extends React.Component {

    constructor() {
        super()

        this.state = {
            isDateChecked: false,
            isTimeChecked: false,
            isLocationChecked: false,
            categories: [],
            portfolios: []
        }
    }

    componentDidMount() {
        this.getValues()
    }

    async getValues() {
        let res = await axios.post('/users/populate-transactions', { username: this.props.username })

        if (res.status === 200) {
            if (res.data.result.length > 0) {
                let { categories, portfolios } = res.data.result[0]

                this.setState({
                    categories,
                    portfolios
                })
            }
        }
    }

    async handleSubmit(event) {
        console.log(event)
        if (event.hours < 10)
            event.hours = `0${event.hours}`
        if (event.minutes < 10)
            event.minutes = `0${event.minutes}`

        event.time = `${event.hours}:${event.minutes}`

    }

    render() {
        return (
            <Layout>
                <Container className="transaction-container">
                    <Container className="pad-container">
                        <Row className="title">
                            <h4>Register Income</h4>
                        </Row>
                        <Row className="form-row">
                            <Formik
                                validationSchema={transaction_schema}
                                onSubmit={this.handleSubmit}
                                initialValues={{
                                    date: '',
                                    hours: '',
                                    minutes: '',
                                    long: '',
                                    lat: '',
                                    amount: '',
                                    currency: '',
                                    portfolio: '',
                                    category: '',
                                    description: '',
                                    long_desc: ''
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    touched,
                                    errors,
                                    isSubmitting,
                                    setFieldValue
                                }) => (
                                        <Form noValidate onSubmit={handleSubmit} id="transaction-form">
                                            <Form.Group as={Row} controlId="date" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3} > Date </Form.Label>
                                                <Col md={6} sm={6} xs={6} style={{ padding: "0px" }}>
                                                    <Form.Control
                                                        value={values.date}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Date"
                                                        isInvalid={touched.date && errors.date}
                                                        readOnly={this.state.isDateChecked}
                                                    />
                                                </Col>
                                                <Col md={3} sm={3} xs={3}>
                                                    <Form.Check type="checkbox" label="Auto" onChange={(event) => {
                                                        if (event.target.checked) {
                                                            setFieldValue("date", new Date().toLocaleDateString('en-GB'))
                                                            this.setState({
                                                                isDateChecked: event.target.checked
                                                            })
                                                        }
                                                        else {
                                                            setFieldValue("date", '')
                                                            this.setState({
                                                                isDateChecked: event.target.checked
                                                            })
                                                        }
                                                    }} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3} > Time </Form.Label>
                                                <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
                                                    <Form.Control
                                                        id="hours"
                                                        value={values.hours}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Hour"
                                                        isInvalid={touched.hours && errors.hours}
                                                        readOnly={this.state.isTimeChecked}
                                                    />
                                                </Col>
                                                <Col md="auto" sm="auto" xs="auto" style={{ padding: "0px 5px" }}> : </Col>
                                                <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
                                                    <Form.Control
                                                        id="minutes"
                                                        value={values.minutes}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Minutes"
                                                        isInvalid={touched.minutes && errors.minutes}
                                                        readOnly={this.state.isTimeChecked}
                                                    />
                                                </Col>
                                                <Col md={2} sm={2} xs={2}>
                                                    <Form.Check type="checkbox" id="time" label="Auto" onChange={(event) => {
                                                        if (event.target.checked) {
                                                            let date = new Date()
                                                            setFieldValue("hours", date.getHours())
                                                            setFieldValue("minutes", date.getMinutes())
                                                            this.setState({
                                                                isTimeChecked: event.target.checked
                                                            })
                                                        }
                                                        else {
                                                            setFieldValue("hours", '')
                                                            setFieldValue("minutes", '')
                                                            this.setState({
                                                                isTimeChecked: event.target.checked
                                                            })
                                                        }
                                                    }} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Location </Form.Label>
                                                <Col md={4} sm={4} xs={4} style={{ padding: "0" }}>
                                                    <Form.Control
                                                        id="long"
                                                        value={values.long}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Longitude"
                                                        isInvalid={touched.long && errors.long}
                                                        style={{ display: "none" }}
                                                    />
                                                    <Form.Control
                                                        id="lat"
                                                        value={values.lat}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Latitude"
                                                        isInvalid={touched.lat && errors.lat}
                                                        readOnly={this.state.isTimeChecked}
                                                        style={{ display: "none" }}
                                                    />
                                                    <Button
                                                        variant="primary"
                                                        style={{ width: "100%" }}
                                                        disabled={this.state.isLocationChecked}
                                                    >
                                                        Choose
                                                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-7px' } }}>
                                                            <FaMapMarkedAlt />
                                                        </IconContext.Provider>
                                                    </Button>
                                                </Col>
                                                <Col md={5} sm={5} xs={5}>
                                                    <Form.Check type="checkbox" id="location" label="Current Location" onChange={(event) => {
                                                        if (event.target.checked) {
                                                            navigator.geolocation.getCurrentPosition(pos => {
                                                                setFieldValue("long", pos.coords.latitude)
                                                                setFieldValue("lat", pos.coords.longitude)
                                                            })
                                                            this.setState({
                                                                isLocationChecked: event.target.checked
                                                            })
                                                        }
                                                        else {
                                                            setFieldValue("long", '')
                                                            setFieldValue("lat", '')
                                                            this.setState({
                                                                isLocationChecked: event.target.checked
                                                            })
                                                        }
                                                    }} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Amount </Form.Label>
                                                <Col md={6} sm={6} xs={6} style={{ padding: "0" }}>
                                                    <Form.Control
                                                        id="amount"
                                                        type="string"
                                                        placeholder="Amount"
                                                        value={values.amount}
                                                        onChange={handleChange}
                                                        isInvalid={touched.amount && errors.amount}
                                                    />
                                                </Col>
                                                <Col md={3} sm={3} xs={3}>
                                                    <Form.Control
                                                        id="currency"
                                                        as="select"
                                                        className="mr-sm-2"
                                                        custom
                                                        value={values.currency}
                                                        onChange={handleChange}
                                                        isInvalid={touched.currency && errors.currency}
                                                    >
                                                        <option value="ALL">ALL</option>
                                                        <option value="Dollar">$</option>
                                                        <option value="Euro">€</option>
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="portfolio" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Portfolio </Form.Label>
                                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                                    <Form.Control
                                                        as="select"
                                                        className="mr-sm-2"
                                                        custom
                                                        value={values.portfolio}
                                                        onChange={handleChange}
                                                        isInvalid={touched.portfolio && errors.portfolio}
                                                    >
                                                        {
                                                            this.state.portfolios.map(portfolio =>
                                                                <option
                                                                    value={portfolio.p_id}
                                                                    key={portfolio.p_id}
                                                                >
                                                                    {portfolio.p_name}
                                                                </option>
                                                            )
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="category" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Category </Form.Label>
                                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                                    <Form.Control
                                                        as="select"
                                                        className="mr-sm-2"
                                                        custom
                                                        value={values.category}
                                                        onChange={handleChange}
                                                        isInvalid={touched.category && errors.category}
                                                    >
                                                        {
                                                            this.state.categories.map(category =>
                                                                <option
                                                                    value={category.cat_id}
                                                                    key={category.cat_id}
                                                                >
                                                                    {category.cat_name}
                                                                </option>
                                                            )
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="description" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Description </Form.Label>
                                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                                    <Form.Control
                                                        type="string"
                                                        placeholder="Description"
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        isInvalid={touched.description && errors.description}
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Container} controlId="long_desc" className="align-items-center" style={{ padding: "0px" }}>
                                                <Form.Label> Detailed Description </Form.Label>
                                                <Col style={{ padding: "0px 0px 0px 0px" }}>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows="2"
                                                        name="long_desc"
                                                        laceholder="Detailed Description"
                                                        style={{ resize: "none" }}
                                                        value={values.long_desc}
                                                        onChange={handleChange}
                                                        isInvalid={touched.long_desc && errors.long_desc}
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Row className="btn-row">
                                                <Button variant="primary" type="submit" form="transaction-form" disabled={isSubmitting}>
                                                    Finalize
                                                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                                                        <AiOutlineFileDone />
                                                    </IconContext.Provider>
                                                </Button>
                                            </Form.Row>
                                        </Form>
                                    )}
                            </Formik>
                        </Row>
                    </Container>
                </Container>
            </Layout>
        )
    }
}


const mapPropsToState = state => ({
    username: state.user.username
})

ProfitTransaction.propTypes = {
    username: PropTypes.string.isRequired
}

export default connect(mapPropsToState, null)(ProfitTransaction)