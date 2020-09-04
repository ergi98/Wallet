import React from 'react'
import './Login.scss'
import axios from "axios"
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

// Icons
import { IconContext } from "react-icons"
import { RiLoginCircleLine } from 'react-icons/ri'
import { FcGoogle, FcBusinessman } from 'react-icons/fc'

// Establish the validation schema
const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
});

class Login extends React.Component {

    constructor() {
        super()

        this.state = {
            isSubmitting: false,
            showAlert: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(event) {
        // Disable the submit button
        this.setState({
            isSubmitting: true
        })

        // Validate if the user exists, save user info in localhost and login
        try {

            let res = await axios.post(`http://localhost:5000/users/login`, {
                username: event.username,
                password: event.password
            })

            if (res.status === 200) {
                localStorage.setItem("jwt", res.data.auth_token)
                localStorage.setItem("username", res.data.info.username)

                window.location.href = "/home"
            }

        }
        catch (err) {

            // Display Alert
            this.setState({
                showAlert: true
            })

            // Hide alert after 2,5sec
            setTimeout(() => {
                this.setState({
                    showAlert: false
                })
            }, 2500)
        }

        // Enable the submit button
        this.setState({
            isSubmitting: false
        })
    }


    render() {
        return (
            <Container className="main-container" fluid="md">

                <Row className="logo-row">
                    <Alert show={this.state.showAlert} variant="danger" className="alert" as="Row">
                        <Alert.Heading className="heading">Invalid credentials</Alert.Heading>
                        The user you are trying to login does not exist or the password is not correct!
                    </Alert>
                    <img src={require('../../assets/money.svg')} alt="Wallet Logo" />
                </Row>

                <Row className="login-row">
                    <Container className="login-container">
                        <Row>
                            <label className="login-txt">Welcome to Wallet</label>
                        </Row>
                        <Row className="form-row">
                            <Formik
                                validationSchema={schema}
                                onSubmit={this.handleSubmit}
                                initialValues={{
                                    username: '',
                                    password: ''
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
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
                                            <Form.Row className="btn-row">
                                                {!this.state.isSubmitting ?
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className="login-btn"
                                                        disabled={this.state.isSubmitting}
                                                    >
                                                        LOGIN
                                                    <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginLeft: '10px' } }}>
                                                            <RiLoginCircleLine />
                                                        </IconContext.Provider>
                                                    </Button> :
                                                    <Button variant="primary" className="login-btn" disabled={this.state.isSubmitting}>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="md"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                    </Button>
                                                }
                                            </Form.Row>
                                        </Form>
                                    )}
                            </Formik>
                        </Row>
                    </Container>
                </Row>

                <Row className="forgot-row">
                    <Button variant="link" className="btn-link">Forgot Password?</Button>
                </Row>


                <Row className="signup-row">
                    <Button variant="info" className="email-btn">
                        <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginRight: '15px' } }}>
                            <FcBusinessman />
                        </IconContext.Provider>
                        Create an account
                    </Button>
                </Row>

                <Row className="seperator-row">
                    <label>OR</label>
                </Row>

                <Row className="signup-row" style={{ paddingBottom: "15px" }}>
                    <Button variant="danger" className="google-btn">
                        <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginRight: '15px' } }}>
                            <FcGoogle />
                        </IconContext.Provider>
                        Signup with Google
                    </Button>
                </Row>
            </Container>
        )
    }
}

export default Login;