import React from 'react'
import './Login.scss'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import Row from 'react-bootstrap/esm/Row'
import Alert from 'react-bootstrap/esm/Alert'
import Spinner from 'react-bootstrap/esm/Spinner'

// Icons
import { IconContext } from "react-icons"
import { RiLoginCircleLine } from 'react-icons/ri'
import { FcBusinessman } from 'react-icons/fc'

// Redux 
import { connect } from 'react-redux'
import { logIn } from '../../redux/actions/userActions'
import PropTypes from 'prop-types'

// Establish the validation schema
const schema = yup.object({
    username: yup.string().required("Username is required!").matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,15}$/igm, { message: "Username format is not correct!" }),
    password: yup.string().required("Password is required").min(4, "Password must be more than 4 characters!").max(15, "Password can't be more than 15 characters!")
});

class Login extends React.Component {

    constructor() {
        super()

        this._isMounted = false

        this.state = {
            showAlert: false,
            isSubmitting: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this._isMounted = true
        // // If the user is already authenticated redirect
        if (this.props.isAuthenticated)
            window.location.href = '/home'
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    async handleSubmit(event) {
        // Used for the spinner login button
        this._isMounted && this.setState({
            isSubmitting: true
        })
        // Call the login function in userActions.js
        let res = this._isMounted && await this.props.logIn(event)

        if (res.success === true)
            window.location.href = '/home'
        else {
            this._isMounted && this.setState({
                showAlert: true,
                isSubmitting: false
            })
            setTimeout(() => { this._isMounted && this.setState({ showAlert: false }) }, 2500)
        }
    }

    goToSignUp() {
        window.location.href = '/sign-up'
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid className="logo-row">
                    <Alert show={this.state.showAlert} variant="danger" className="alert" as="Row">
                        <Alert.Heading className="heading">Invalid credentials</Alert.Heading>
                        The user you are trying to login does not exist or the password is not correct!
                    </Alert>
                    <img src={require('../../assets/logo.svg')} alt="Wallet Logo" />
                </Container>
                <Container>
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

                    <Row className="forgot-row">
                        <Button variant="link" className="btn-link">Forgot Password?</Button>
                    </Row>


                    <Row className="signup-row">
                        <Button variant="dark" className="email-btn" onClick={this.goToSignUp}>
                            <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginRight: '15px' } }}>
                                <FcBusinessman />
                            </IconContext.Provider>
                            Create an account
                        </Button>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated
})

Login.propTypes = {
    logIn: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { logIn })(Login)