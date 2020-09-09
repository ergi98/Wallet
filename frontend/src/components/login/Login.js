import React from 'react'
import './Login.scss'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

// Icons
import { IconContext } from "react-icons"
import { RiLoginCircleLine } from 'react-icons/ri'
import { FcGoogle, FcBusinessman } from 'react-icons/fc'

// Redux 
import { connect } from 'react-redux'
import { logIn } from '../../redux/actions/userActions'
import PropTypes from 'prop-types'

// Establish the validation schema
const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
});

class Login extends React.Component {

    constructor() {
        super()

        this.state = {
            showAlert: false,
            isSubmitting: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    /** TODO: 1 - Login Component shows up before redirecting */
    componentDidMount() {
        // If the user is already authenticated redirect
        if (this.props.isAuthenticated)
            window.location.href = '/home'
    }

    /** TODO: 2 - Better way to handle the error? (through dispatch?)**/
    async handleSubmit(event) {
        // Used for the spinner login button
        this.setState({
            isSubmitting: true
        })
        // Call the login function in userActions.js
        this.props.logIn(event)
            // If successful redirect
            .then(() => {
                window.location.href = '/home'
            })
            // If not display error alert
            .catch(() => {
                this.setState({
                    showAlert: true,
                    isSubmitting: false
                })
                setTimeout(() => { this.setState({ showAlert: false }) }, 2500)
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
                    <Button variant="dark" className="email-btn">
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

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated
})

Login.propTypes = {
    logIn: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { logIn })(Login);