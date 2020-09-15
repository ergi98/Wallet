import React, { useState, useEffect } from 'react'
import './EditModal.scss'

// Components
import ProfitTransaction from '../transaction/ProfitTransaction'

// Bootstrap
import Modal from 'react-bootstrap/Modal'

function EditModal(props) {

    console.log(props)

    let test = true

    return (
        <Modal show={test} className="edit-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Transaction</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                hEY
            </Modal.Body>
        </Modal>
    )
}

// onHide={handleClose}

export default EditModal


// import React, { useState, useEffect } from 'react'
// import './EditModal.scss'

// // Bootstrap
// import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'
// import Form from 'react-bootstrap/Form'
// import Col from 'react-bootstrap/Col'
// import Container from 'react-bootstrap/esm/Container'
// import Row from 'react-bootstrap/esm/Row'
// import Spinner from 'react-bootstrap/esm/Spinner'

// // Form Validation
// import * as yup from "yup"
// import { Formik } from 'formik'

// // Date Validation
// import { parse } from "date-fns"

// // Icons
// import { IconContext } from "react-icons"
// import { AiOutlineFileDone } from 'react-icons/ai'

// function EditModal(props) {

//     const [isDateChecked, setDate] = useState(false)
//     const [isTimeChecked, setTime] = useState(false)
//     const [portfolios, setPortfolios] = useState([])
//     const [sources, setSources] = useState([])
//     const [categories, setCategories] = useState([])

//     // Establish the validation schema
//     const transaction_schema = yup.object({
//         date: yup.string().required().transform(parseDate),
//         hours: yup.string().required().max(2),
//         minutes: yup.string().required().max(2),
//         amount: yup.string().required().matches(/^[0-9]+[.]?[0-9]+$/).notOneOf(["0"]),
//         currency: yup.string().required(),
//         portfolio: yup.string().required(),
//         source: yup.string().required(),
//         description: yup.string().required().max(30).matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/),
//         long_desc: yup.string().notRequired().max(100).matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/)
//     });

//     function parseDate(value, originalValue) {
//         const parsedDate = parse(originalValue, "dd/MM/yyyy", new Date())

//         if (parsedDate.toJSON() !== null) {
//             return parsedDate.toLocaleDateString('en-GB')
//         }

//         return false
//     }

//     function handleSubmit() {

//     }


//     console.log(props)

//     let test = true

//     return (
//         <Modal show={test} className="edit-modal">
//             <Modal.Header closeButton>
//                 <Modal.Title>Edit Transaction</Modal.Title>
//             </Modal.Header>

//             <Modal.Body>
//                 <Container>
//                     <Formik
//                         validationSchema={transaction_schema}
//                         onSubmit={handleSubmit}
//                         initialValues={{
//                             date: '',
//                             hours: '',
//                             minutes: '',
//                             amount: '',
//                             currency: 'ALL',
//                             portfolio: 'Choose portfolio to deposit ...',
//                             source: 'Choose source of income ...',
//                             description: '',
//                             long_desc: ''
//                         }}
//                     >
//                         {({
//                             handleSubmit,
//                             handleChange,
//                             values,
//                             touched,
//                             errors,
//                             isSubmitting,
//                             setFieldValue
//                         }) => (
//                                 <Form noValidate onSubmit={handleSubmit} id="transaction-form">
//                                     <Form.Group as={Row} controlId="date" className="align-items-center">
//                                         <Form.Label column md={3} sm={3} xs={3} > Date </Form.Label>
//                                         <Col md={6} sm={6} xs={6} style={{ padding: "0px" }}>
//                                             <Form.Control
//                                                 value={values.date}
//                                                 onChange={handleChange}
//                                                 type="string"
//                                                 placeholder="Date"
//                                                 isInvalid={touched.date && errors.date}
//                                                 readOnly={isDateChecked}
//                                             />
//                                         </Col>
//                                         <Col md={3} sm={3} xs={3}>
//                                             <Form.Check type="checkbox" label="Auto" onChange={(event) => {
//                                                 if (event.target.checked) {
//                                                     setFieldValue("date", new Date().toLocaleDateString('en-GB'))
//                                                     setDate(event.target.checked)
//                                                 }
//                                                 else {
//                                                     setFieldValue("date", '')
//                                                     setDate(event.target.checked)
//                                                 }
//                                             }} />
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Group as={Row} className="align-items-center">
//                                         <Form.Label column md={3} sm={3} xs={3} > Time </Form.Label>
//                                         <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
//                                             <Form.Control
//                                                 id="hours"
//                                                 value={values.hours}
//                                                 onChange={handleChange}
//                                                 type="string"
//                                                 placeholder="Hour"
//                                                 isInvalid={touched.hours && errors.hours}
//                                                 readOnly={isTimeChecked}
//                                             />
//                                         </Col>
//                                         <Col md="auto" sm="auto" xs="auto" style={{ padding: "0px 5px" }}> : </Col>
//                                         <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
//                                             <Form.Control
//                                                 id="minutes"
//                                                 value={values.minutes}
//                                                 onChange={handleChange}
//                                                 type="string"
//                                                 placeholder="Minutes"
//                                                 isInvalid={touched.minutes && errors.minutes}
//                                                 readOnly={isTimeChecked}
//                                             />
//                                         </Col>
//                                         <Col md={2} sm={2} xs={2}>
//                                             <Form.Check type="checkbox" id="time" label="Auto" onChange={(event) => {
//                                                 if (event.target.checked) {
//                                                     let date = new Date()
//                                                     setFieldValue("hours", date.getHours())
//                                                     setFieldValue("minutes", date.getMinutes())
//                                                     setTime(event.target.checked)
//                                                 }
//                                                 else {
//                                                     setFieldValue("hours", '')
//                                                     setFieldValue("minutes", '')
//                                                     setTime(event.target.checked)
//                                                 }
//                                             }} />
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Group as={Row} className="align-items-center">
//                                         <Form.Label column md={3} sm={3} xs={3}> Amount </Form.Label>
//                                         <Col md={6} sm={6} xs={6} style={{ padding: "0" }}>
//                                             <Form.Control
//                                                 id="amount"
//                                                 type="string"
//                                                 placeholder="Amount"
//                                                 value={values.amount}
//                                                 onChange={handleChange}
//                                                 isInvalid={touched.amount && errors.amount}
//                                             />
//                                         </Col>
//                                         <Col md={3} sm={3} xs={3}>
//                                             <Form.Control
//                                                 id="currency"
//                                                 as="select"
//                                                 className="mr-sm-2"
//                                                 custom
//                                                 value={values.currency}
//                                                 onChange={handleChange}
//                                                 isInvalid={touched.currency && errors.currency}
//                                             >
//                                                 <option value="ALL">ALL</option>
//                                                 <option value="Dollar">$</option>
//                                                 <option value="Euro">€</option>
//                                             </Form.Control>
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Group as={Row} controlId="portfolio" className="align-items-center">
//                                         <Form.Label column md={3} sm={3} xs={3}> Portfolio </Form.Label>
//                                         <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
//                                             <Form.Control
//                                                 as="select"
//                                                 className="mr-sm-2"
//                                                 custom
//                                                 value={values.portfolio}
//                                                 onChange={handleChange}
//                                                 isInvalid={touched.portfolio && errors.portfolio}
//                                             >
//                                                 <option disabled>Choose portfolio to deposit ...</option>
//                                                 {
//                                                     portfolios.map(portfolio =>
//                                                         <option
//                                                             value={portfolio.p_id}
//                                                             key={portfolio.p_id}
//                                                         >
//                                                             {portfolio.p_name}
//                                                         </option>
//                                                     )
//                                                 }
//                                             </Form.Control>
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Group as={Row} controlId="source" className="align-items-center">
//                                         <Form.Label column md={3} sm={3} xs={3}> Source </Form.Label>
//                                         <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
//                                             <Form.Control
//                                                 as="select"
//                                                 className="mr-sm-2"
//                                                 custom
//                                                 value={values.source}
//                                                 onChange={handleChange}
//                                                 isInvalid={touched.source && errors.source}
//                                             >
//                                                 <option disabled>Choose source of income ...</option>
//                                                 {
//                                                     sources.map(source =>
//                                                         <option
//                                                             value={source.source_id}
//                                                             key={source.source_id}
//                                                         >
//                                                             {source.source_name}
//                                                         </option>
//                                                     )
//                                                 }
//                                             </Form.Control>
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Group as={Row} controlId="description" className="align-items-center">
//                                         <Form.Label column md={3} sm={3} xs={3}> Description </Form.Label>
//                                         <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
//                                             <Form.Control
//                                                 type="string"
//                                                 placeholder="Description"
//                                                 value={values.description}
//                                                 onChange={handleChange}
//                                                 isInvalid={touched.description && errors.description}
//                                             />
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Group as={Container} controlId="long_desc" className="align-items-center" style={{ padding: "0px" }}>
//                                         <Form.Label> Detailed Description </Form.Label>
//                                         <Col style={{ padding: "0px 0px 0px 0px" }}>
//                                             <Form.Control
//                                                 as="textarea"
//                                                 rows="4"
//                                                 name="long_desc"
//                                                 laceholder="Detailed Description"
//                                                 style={{ resize: "none" }}
//                                                 value={values.long_desc}
//                                                 onChange={handleChange}
//                                                 isInvalid={touched.long_desc && errors.long_desc}
//                                             />
//                                         </Col>
//                                     </Form.Group>

//                                     <Form.Row className="btn-row">
//                                         <Button variant="primary" type="submit" form="transaction-form" disabled={isSubmitting}>
//                                             {isSubmitting ?
//                                                 <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
//                                                 :
//                                                 <span>
//                                                     Save Changes
//                                                             <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
//                                                         <AiOutlineFileDone />
//                                                     </IconContext.Provider>
//                                                 </span>
//                                             }
//                                         </Button>
//                                     </Form.Row>
//                                 </Form>
//                             )}
//                     </Formik>
//                 </Container>
//             </Modal.Body>
//         </Modal>
//     )
// }
