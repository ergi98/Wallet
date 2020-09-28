import React from 'react'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

// Establish the validation schema
const schema = yup.object({
    username: yup.string().required().matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm),
    password: yup.string().required().min(4).max(15),
    confirm: yup.string().required().min(4).max(15).oneOf([yup.ref('password')])
})

function LoginInformation(props) {
    // TODO : VALIDATE THAT THE USERNAME IS UNIQUE
    let initial = {
        username: props.info.username || '',
        password: props.info.password || '',
        confirm: props.info.password || ''
    }

    let date = new Date()

    function handleSubmit(event) {
        props.saveInfo({
            username: event.username,
            password: event.password,
            createdAt: date.toLocaleDateString("en-GB")
        })
        props.increment()
    }

    return (
        <div className="form-row">
            <section className="info">
                <label className="section-title">Login Information</label>
                <label className="section-subtitle">This is the information you will be using to login to your account.</label>
            </section>
            <Formik
                enableReinitialize
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={ initial }
            >
                {({
                    handleSubmit,
                    handleChange,
                    isSubmitting,
                    values,
                    touched,
                    errors
                }) => (
                        <Form noValidate className="form" onSubmit={handleSubmit}>
                            <Form.Group controlId="username">
                                <Form.Label className="form-label">Username</Form.Label>
                                <Form.Control
                                    className="input-field"
                                    type="text"
                                    value={values.username}
                                    placeholder="Enter Username"
                                    onChange={handleChange}
                                    isInvalid={touched.username && errors.username}
                                />
                                <Form.Control.Feedback type="invalid"> Please provide a username. </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label className="form-label">Password</Form.Label>
                                <Form.Control
                                    className="input-field"
                                    type="password"
                                    placeholder="Enter Password"
                                    onChange={handleChange}
                                    value={values.password}
                                    isInvalid={touched.password && errors.password}
                                />
                                <Form.Control.Feedback type="invalid"> Please provide a password. </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="confirm">
                                <Form.Label className="form-label">Confirm Password</Form.Label>
                                <Form.Control
                                    className="input-field"
                                    type="password"
                                    value={values.confirm}
                                    placeholder="Confirm password"
                                    onChange={handleChange}
                                    isInvalid={touched.confirm && errors.confirm}
                                />
                                <Form.Control.Feedback type="invalid"> Please provide a matching confirm. </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Row className="signup-buttons">
                                {!isSubmitting ?
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Next
                                    </Button>
                                    :
                                    <Button variant="primary" className="login-btn" disabled={isSubmitting}>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="spinner-signup" />
                                    </Button>
                                }
                            </Form.Row>
                        </Form>
                    )}
            </Formik>
        </div>
    )
}

export default LoginInformation

