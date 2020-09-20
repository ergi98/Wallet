import React from 'react'
import './NewSrcCat.scss'

// Axios
import axios from 'axios'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Redux
import { useSelector } from "react-redux"

// NanoID
import { nanoid } from 'nanoid'

function NewSrcCat(props) {

    const username = useSelector((state) => state.user.username)

    // Establish the validation schema
    const pwd_schema = yup.object({
        name: yup.string().required().matches(/^[a-zA-Z0-9 ]*$/).max(15),
    })

    async function addNewSrcCat(event) {
        if(props.type === "Category") {
            try {
                let category = {
                    cat_id: nanoid(6),
                    cat_name: event.name.trim(),
                    count: 0,
                    amnt_spent: "0",
                    last_spent: null
                }

                await axios.post('/users/new-category', { username, category })
                props.setCatSrcSuccess(true)
                setTimeout(() => { props.setCatSrcSuccess(false) }, 2500)
                props.onClose()
            }
            catch(err) {
                props.setCatSrcError(true)
                setTimeout(() => { props.setCatSrcError(false) }, 2500)
            }
        }
        else if(props.type === "Source") {
            try {
                let source = {
                    source_id: nanoid(6),
                    source_name: event.name.trim(),
                    count: 0,
                    amnt_spent: "0",
                    last_spent: null
                }
    
                await axios.post('/users/new-source', { username, source })
                props.setCatSrcSuccess(true)
                setTimeout(() => { props.setCatSrcSuccess(false) }, 2500)
                props.onClose()
            }
            catch(err) {
                props.setCatSrcError(true)
                setTimeout(() => { props.setCatSrcError(false) }, 2500)
            }
        }
    }

    return (
        <Modal show={props.show} className="newSrcCat-modal" onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>New {props.type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={pwd_schema}
                    onSubmit={addNewSrcCat}
                    initialValues={{
                        name: ''
                    }}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                        isSubmitting
                    }) => (
                            <Form noValidate className="newSrcCat-form" onSubmit={handleSubmit}  id="newSrcCat-form">
                                <Form.Group controlId="name" as={Row}>
                                    <Col xs={4} className="my-col">
                                      <Form.Label className="form-label">{props.type} name: </Form.Label>  
                                    </Col>
                                    <Col xs={8} className="my-col">
                                        <Form.Control
                                            className="input-field"
                                            type="text"
                                            value={values.name}
                                            placeholder="Enter a name"
                                            onChange={handleChange}
                                            isInvalid={touched.name && errors.name}
                                        />
                                    </Col>
                                    <Form.Control.Feedback type="invalid"> Please provide your old password. </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row className="btn-row">
                                    {!isSubmitting ?
                                        <Button
                                            className="psw-btn"
                                            variant="primary"
                                            disabled={isSubmitting}
                                            form="newSrcCat-form"
                                            type="submit"
                                        >
                                            Add {props.type}
                                        </Button> 
                                        :
                                        <Button variant="primary" className="psw-btn" disabled={isSubmitting}>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        </Button>
                                    }
                                </Form.Row>
                            </Form>
                        )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default NewSrcCat