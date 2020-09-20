import React from 'react'
import './PasswordModal.scss'

// Axios
import axios from 'axios'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Redux
import { useSelector } from "react-redux"

function PasswordModal(props) {

    const username = useSelector((state) => state.user.username)
    // Establish the validation schema
    const pwd_schema = yup.object({
        old_pass: yup.string().required(),
        new_password: yup.string().required().min(4).max(15),
        confirm_pass: yup.string().required().min(4).max(15).oneOf([yup.ref('new_password')])
    })

    async function updatePassword(event) {
        try {
            await axios.post('/users/change-password', {
                username,
                old_pass: event.old_pass,
                new_pass: event.new_password
            })
            props.setPwdSuccess(true)
            setTimeout(() => { props.setPwdSuccess(false) }, 2500)
            props.onClose()
        }
        catch(err) {
            props.setPwdError(true)
            setTimeout(() => { props.setPwdError(false) }, 2500)
        }
    }

    return (
        <Modal show={props.show} className="password-modal" onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={pwd_schema}
                    onSubmit={updatePassword}
                    initialValues={{
                        old_pass: '',
                        new_password: '',
                        confirm_pass: '',
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
                            <Form noValidate className="pswd-form" onSubmit={handleSubmit}  id="pswd-form">
                                <Form.Group controlId="old_pass">
                                    <Form.Label className="form-label">Current Password</Form.Label>
                                    <Form.Control
                                        className="input-field"
                                        type="password"
                                        value={values.old_pass}
                                        placeholder="Enter existing password"
                                        onChange={handleChange}
                                        isInvalid={touched.old_pass && errors.old_pass}
                                    />
                                    <Form.Control.Feedback type="invalid"> Please provide your old password. </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="new_password">
                                    <Form.Label className="form-label">New Password</Form.Label>
                                    <Form.Control
                                        className="input-field"
                                        type="password"
                                        placeholder="Enter new password"
                                        onChange={handleChange}
                                        value={values.new_password}
                                        isInvalid={touched.new_password && errors.new_password}
                                    />
                                    <Form.Control.Feedback type="invalid"> Please provide a valid password. Between 7 and 15 characters </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="confirm_pass">
                                    <Form.Label className="form-label">Confirm Password</Form.Label>
                                    <Form.Control
                                        className="input-field"
                                        type="password"
                                        placeholder="Confirm new password"
                                        onChange={handleChange}
                                        value={values.confirm_pass}
                                        isInvalid={touched.confirm_pass && errors.confirm_pass}
                                    />
                                    <Form.Control.Feedback type="invalid"> Please provide a valid password. Between 7 and 15 characters </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row className="btn-row">
                                    {!isSubmitting ?
                                        <Button
                                            className="psw-btn"
                                            variant="primary"
                                            disabled={
                                                isSubmitting || 
                                                values.new_password !== values.confirm_pass ||
                                                values.new_password === '' ||
                                                values.confirm_pass === ''
                                            }
                                            form="pswd-form"
                                            type="submit"
                                        >
                                            Change Password
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

export default PasswordModal