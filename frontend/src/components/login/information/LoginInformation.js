import React, { useState, useEffect } from 'react'
import './Information.scss'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import Spinner from 'react-bootstrap/esm/Spinner'

// Axios
import axios from 'axios'

function LoginInformation(props) {
    
    const [usernames, setUsernames] = useState([])

    // Establish the validation schema
    const schema = yup.object({
        username: yup.string().required("Username is required!").matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,15}$/igm, { message: "Username format is not correct!" }).notOneOf(usernames, "This username already exists!"),
        password: yup.string().required("Password is required!").min(4, "Password must be more than 4 characters!").max(15, "Password can't be more than 15 characters!"),
        confirm: yup.string().required("Please confirm your passsword!").min(4).max(15).oneOf([yup.ref('password')], "Passwords must match!")
    })

    async function getUsernames() {
        try {
            let res = await axios.get('/users/used-usernames')
            let temp = res.data.result.map(res => { return res.username })
            setUsernames(temp)
        }
        catch(err){
        }
    }

    useEffect(() => {
        let _isMounted = true

        _isMounted && getUsernames()
        return () => {
            _isMounted = false
        }
    }, [])

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
                                <Form.Control.Feedback type="invalid"> {errors.username} </Form.Control.Feedback>
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
                                <Form.Control.Feedback type="invalid"> {errors.password} </Form.Control.Feedback>
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
                                <Form.Control.Feedback type="invalid"> {errors.confirm} </Form.Control.Feedback>
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

export default React.memo(LoginInformation)

