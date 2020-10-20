import React, { useState, useEffect } from 'react'
import './SpendingForm.scss'

// Axios
import axios from 'axios'

// Redux
import { logOut } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// NanoID
import { nanoid } from 'nanoid'

// Icons
import { IconContext } from "react-icons"
import { FaMapMarkedAlt } from 'react-icons/fa'
import { AiOutlineFileDone } from 'react-icons/ai'
import { TiTick } from 'react-icons/ti'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Date Validation
import { parse } from "date-fns"

// Bootstrap
import Form from 'react-bootstrap/esm/Form'
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))
const Row = React.lazy(() => import('react-bootstrap/esm/Row'))
const Col = React.lazy(() => import('react-bootstrap/esm/Col'))
const Button = React.lazy(() => import('react-bootstrap/esm/Button'))
const Spinner = React.lazy(() => import('react-bootstrap/esm/Spinner'))
const Alert = React.lazy(() => import('react-bootstrap/esm/Alert'))

// Components
const MapModal = React.lazy(() => import('./modals/MapModal'))

// Establish the validation schema
const transaction_schema = yup.object({
    date: yup.string().required("Date is required!").transform(parseDate),
    hours: yup.string().required("Required!").max(2, "Invalid Format!"),
    minutes: yup.string().required("Required!").max(2, "Invalid Format!"),
    long: yup.string(),
    lat: yup.string(),
    amount: yup.string().required("Amount is required!").matches(/(^[1-9]{1}[0-9]*[,.]{0,1}[0-9]*$)|(^[0]{1}[,.][0-9]+$)/, { message: "Only numbers and dots or commas allowed!" }).notOneOf(["0"], "Can not be 0!"),
    currency: yup.string().required(),
    portfolio: yup.string().required("Portfolio is required!").notOneOf(["Choose portfolio to withdraw ..."], "Please select a portfolio!"),
    category: yup.string().required("Category is required!").notOneOf(["Choose category of expense ..."], "Please select an expense category!"),
    description: yup.string().required("Please provide a short description!").max(40, "Maximum is 40 characters!").matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/, { message: "Only numbers, characters, '_' '.' and ',' allowed!" }),
    long_desc: yup.string().notRequired().max(100, "Maximum is 100 characters!").matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/, { message: "Only numbers, characters, '_' '.' and ',' allowed!" })
})

function parseDate(value, originalValue) {
    const parsedDate = parse(originalValue, "dd/MM/yyyy", new Date())

    if (parsedDate.toJSON() !== null) {
        return parsedDate.toLocaleDateString('en-GB')
    }

    return false
}

function SpendingForm() {

    const dispatch = useDispatch()

    const jwt = useSelector((state) => state.user.jwt)
    const username = useSelector((state) => state.user.username)

    const [dateChecked, setDateChecked] = useState(false)
    const [timeChecked, setTimeChecked] = useState(false)
    const [locationChecked, setLocationChecked] = useState(false)

    const [categories, setCategories] = useState([])
    const [portfolios, setPortfolios] = useState([])

    const [displayError, setDisplayError] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)
    const [showMapModal, setShowMapModal] = useState(false)

    useEffect(() => {
        let _isMounted = true

        async function getValues() {
            try {
                let res = await axios.post('/users/populate-transactions', { username }, { headers: { Authorization: `Bearer ${jwt}`}})

                if (res.data.result.length > 0) {
                    let { categories, portfolios } = res.data.result[0]

                    _isMounted && setPortfolios(portfolios)
                    _isMounted && setCategories(categories)
                }
            }
            catch (err) {
                // If no token is present logout
                if(err.message.includes('403'))
                    dispatch(logOut())
            }
        }

        _isMounted && getValues()
        return () => {
            _isMounted = false
        }
    }, [username, jwt, dispatch])

    async function handleSubmit(event, { resetForm }) {
        if (event.hours < 10)
            event.hours = `0${event.hours}`
        if (event.minutes < 10)
            event.minutes = `0${event.minutes}`

        let transaction = {
            trans_id: nanoid(10),
            time: `${event.hours}:${event.minutes}`,
            trans_type: 'expense',
            amount: event.amount.replace(',', '.'),
            currency: event.currency,
            portfolio: event.portfolio,
            type: event.category,
            short_desc: event.description,
            location: {
                longitude: event.long,
                latitude: event.lat
            }
        }

        if (event.long_desc !== '')
            transaction.desc = event.long_desc

        try {
            await axios.post('/transactions/new-transaction', {
                username,
                date: event.date,
                transaction
            }, { headers: { Authorization: `Bearer ${jwt}`}})

            setDisplaySuccess(true)
            setTimeout(() => { setDisplaySuccess(false) }, 2500)
            resetForm({})
        }
        catch (err) {
            // If no token is present logout
            if(err.message.includes('403'))
                dispatch(logOut())
            else {
                setDisplayError(true)
                setTimeout(() => { setDisplayError(false) }, 2500)
            }
        }
    }

    return (
        <Row className="form-row">
            <Alert show={displaySuccess} variant="success" className="alert" as="Row">
                Successfully register transaction!
            </Alert>
            <Alert show={displayError} variant="danger" className="alert" as="Row">
                The transaction you are trying to register did not go through!
            </Alert>
            <Formik
                validationSchema={transaction_schema}
                onSubmit={handleSubmit}
                initialValues={{
                    date: '',
                    hours: '',
                    minutes: '',
                    long: '',
                    lat: '',
                    amount: '',
                    currency: 'ALL',
                    portfolio: 'Choose portfolio to withdraw ...',
                    category: 'Choose category of expense ...',
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
                            <Form.Group as={Row} controlId="date">
                                <Form.Label column md={3} sm={3} xs={3} > Date </Form.Label>
                                <Col md={6} sm={6} xs={6} style={{ padding: "0px" }}>
                                    <Form.Control
                                        value={values.date}
                                        onChange={handleChange}
                                        type="string"
                                        placeholder="Date"
                                        isInvalid={touched.date && errors.date}
                                        readOnly={dateChecked}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.date}  </Form.Control.Feedback>
                                </Col>
                                <Col md={3} sm={3} xs={3}>
                                    <Form.Check type="checkbox" label="Auto" onChange={(event) => {
                                        if (event.target.checked)
                                            setFieldValue("date", new Date().toLocaleDateString('en-GB'))
                                        else
                                            setFieldValue("date", '')
                                        setDateChecked(event.target.checked)
                                    }} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column md={3} sm={3} xs={3} > Time </Form.Label>
                                <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
                                    <Form.Control
                                        id="hours"
                                        value={values.hours}
                                        onChange={handleChange}
                                        type="string"
                                        inputMode="numeric"
                                        placeholder="Hour"
                                        isInvalid={touched.hours && errors.hours}
                                        readOnly={timeChecked}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.hours}  </Form.Control.Feedback>
                                </Col>
                                <Col md="auto" sm="auto" xs="auto" style={{ padding: "0px 5px", lineHeight: "2" }}> : </Col>
                                <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
                                    <Form.Control
                                        id="minutes"
                                        value={values.minutes}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        type="string"
                                        placeholder="Minutes"
                                        isInvalid={touched.minutes && errors.minutes}
                                        readOnly={timeChecked}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.minutes}  </Form.Control.Feedback>
                                </Col>
                                <Col md={2} sm={2} xs={2}>
                                    <Form.Check type="checkbox" id="time" label="Auto" onChange={(event) => {
                                        if (event.target.checked) {
                                            let date = new Date()
                                            setFieldValue("hours", date.getHours())
                                            setFieldValue("minutes", date.getMinutes())
                                        }
                                        else {
                                            setFieldValue("hours", '')
                                            setFieldValue("minutes", '')
                                        }
                                        setTimeChecked(event.target.checked)
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
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        variant={values.lat !== '' && values.long !== ''? "success" : "primary"}
                                        style={{ width: "100%" }}
                                        disabled={locationChecked}
                                        onClick={() => setShowMapModal(true)}
                                    >
                                    {
                                        values.lat === '' && values.long === ''?
                                            <React.Fragment>
                                                Choose
                                                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-7px' } }}>
                                                    <FaMapMarkedAlt />
                                                </IconContext.Provider>  
                                            </React.Fragment>
                                        :
                                            <React.Fragment>
                                                Located
                                                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-7px' } }}>
                                                    <TiTick />
                                                </IconContext.Provider>  
                                            </React.Fragment>
                                    } 
                                    </Button>

                                    <MapModal
                                        show={showMapModal}
                                        closeModal={() => setShowMapModal(false)}
                                        setUserLocation={setFieldValue}
                                    />
                                </Col>
                                <Col md={5} sm={5} xs={5}>
                                    <Form.Check type="checkbox" id="location" label="Current Location" onChange={(event) => {
                                        if (event.target.checked) {
                                            navigator.geolocation.getCurrentPosition(pos => {
                                                setFieldValue("lat", pos.coords.latitude)
                                                setFieldValue("long", pos.coords.longitude)
                                            })
                                        }
                                        else {
                                            setFieldValue("lat", '')
                                            setFieldValue("long", '')
                                        }
                                        setLocationChecked(event.target.checked)
                                    }} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column md={3} sm={3} xs={3}> Amount </Form.Label>
                                <Col md={6} sm={6} xs={6} style={{ padding: "0" }}>
                                    <Form.Control
                                        id="amount"
                                        type="string"
                                        inputMode="decimal"
                                        placeholder="Amount"
                                        value={values.amount}
                                        onChange={handleChange}
                                        isInvalid={touched.amount && errors.amount}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.amount} </Form.Control.Feedback>
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
                                        {/* <option value="$">$</option>
                                        <option value="€">€</option> */}
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="portfolio">
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
                                        <option disabled>Choose portfolio to withdraw ...</option>
                                        {
                                            portfolios.map(portfolio =>
                                                <option
                                                    value={portfolio.p_id}
                                                    key={portfolio.p_id}
                                                >
                                                    {portfolio.p_name}
                                                </option>
                                            )
                                        }
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid"> {errors.portfolio} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="category">
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
                                        <option disabled>Choose category of expense ...</option>
                                        {
                                            categories.map(category =>
                                                <option
                                                    value={category.cat_id}
                                                    key={category.cat_id}
                                                >
                                                    {category.cat_name}
                                                </option>
                                            )
                                        }
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid"> {errors.category} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="description">
                                <Form.Label column md={3} sm={3} xs={3}> Description </Form.Label>
                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        type="string"
                                        placeholder="Description"
                                        value={values.description}
                                        onChange={handleChange}
                                        isInvalid={touched.description && errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.description} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Container} controlId="long_desc" style={{ padding: "0px" }}>
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
                                    <Form.Control.Feedback type="invalid"> {errors.long_desc} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Row className="btn-row">
                                <Button variant="primary" type="submit" form="transaction-form" disabled={isSubmitting}>
                                    {isSubmitting ?
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        :
                                        <span>
                                            Finalize
                                            <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                                                <AiOutlineFileDone />
                                            </IconContext.Provider>
                                        </span>
                                    }
                                </Button>
                            </Form.Row>
                        </Form>
                    )}
            </Formik>
        </Row>
    )
}

export default SpendingForm