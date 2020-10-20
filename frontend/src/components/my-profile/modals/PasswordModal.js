import React from 'react'
import './NewModal.scss'

// Axios
import axios from 'axios'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Redux
import { logOut } from '../../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// Bootstrap
import Modal from 'react-bootstrap/esm/Modal'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Spinner from 'react-bootstrap/esm/Spinner'

function PasswordModal(props) {
    
    const dispatch = useDispatch()

    const jwt = useSelector((state) => state.user.jwt)
    const username = useSelector((state) => state.user.username)
    
    // Establish the validation schema
    const pwd_schema = yup.object({
        old_pass: yup.string().required("Old password is required!").min(4, "Password must be more than 4 characters!").max(15, "Password can't be more than 15 characters!"),
        new_password: yup.string().required("Password is required!").min(4, "Password must be more than 4 characters!").max(15, "Password can't be more than 15 characters!"),
        confirm_pass: yup.string().required("Confirm is required!").min(4, "Password must be more than 4 characters!").max(15, "Password can't be more than 15 characters!").oneOf([yup.ref('new_password')], "Passwords do not match!")
    })

    async function updatePassword(event) {
        try {
            await axios.post(
                '/users/change-password', 
                {
                    username,
                    old_pass: event.old_pass,
                    new_pass: event.new_password
                },
                { headers: { Authorization: `Bearer ${jwt}`}}
            )
            props.setPwdSuccess(true)
            setTimeout(() => { props.setPwdSuccess(false) }, 2500)
            props.onClose()
        }
        catch(err) {
            // If no token is present logout
            if(err.message.includes('403'))
                dispatch(logOut())
            else {
                props.setPwdError(true)
                setTimeout(() => { props.setPwdError(false) }, 2500)
            }
        }
    }

    return (
        <Modal show={props.show} className="new-modal" onHide={props.onClose}>
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
                            <Form noValidate className="new-form" onSubmit={handleSubmit}  id="pswd-form">
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
                                    <Form.Control.Feedback type="invalid"> {errors.old_pass} </Form.Control.Feedback>
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
                                    <Form.Control.Feedback type="invalid"> {errors.new_password} </Form.Control.Feedback>
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
                                    <Form.Control.Feedback type="invalid"> {errors.confirm_pass} </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row className="btn-row">
                                    {!isSubmitting ?
                                        <Button
                                            className="psw-btn"
                                            variant="primary"
                                            disabled={ isSubmitting }
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