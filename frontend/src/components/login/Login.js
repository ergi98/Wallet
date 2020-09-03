import React from 'react';
import './Login.scss';
import axios from "axios"

// Bootstrap
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'

class Login extends React.Component {

    constructor() {
        super()

        this.state = {
            username: '',
            password: '',
        }

        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.checkCredentials = this.checkCredentials.bind(this)
    }

    updateUsername(event) {
        this.setState(
            {
                username: event.target.value
            }
        )
    }

    updatePassword(event) {
        this.setState(
            {
                password: event.target.value
            }
        )
    }

    async checkCredentials(event) {
        event.preventDefault()

        try {
            let res = await axios.post(`http://localhost:5000/users/login`, {
                username: this.state.username,
                password: this.state.password
            })

            if(res.status===200) {
                localStorage.setItem("jwt", res.data.auth_token)
                localStorage.setItem("username", res.data.info.username)

                window.location.href = "/home"
            }
            
        }
        catch(e) {
            console.log(e)
        }

        // Validate input from database
        // Display error if no user exists OR password incorrect
        // Create an entry on the sessions collection
        // Store token and user information on localstorage
        // Sign the user in AND redirect to home screen

    }


    render() {
        return (
            <Container className="main-container" fluid="md">
                <Row className="logo-row">
                    <img src={require('../../assets/money.svg')} alt="Wallet Logo" />
                </Row>

                <Row className="login-row">
                    <Container className="login-container">
                        <Row>
                            <label className="login-txt">Welcome to Wallet</label>
                        </Row>
                        <Row className="form-row">
                            <Form className="form">
                                <Form.Group controlId="username">
                                    <Form.Label className="form-label">Username</Form.Label>
                                    <Form.Control className="input-field" type="text" placeholder="Enter Username" onInput={this.updateUsername} />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label className="form-label">Password</Form.Label>
                                    <Form.Control className="input-field" type="password" placeholder="Enter Password" onInput={this.updatePassword} />
                                </Form.Group>
                                <Row className="btn-row">
                                    <Button variant="primary" type="submit" className="login-btn" onClick={this.checkCredentials}>
                                        LOGIN
                                    </Button>
                                </Row>
                            </Form>
                        </Row>
                    </Container>
                </Row>

                <Row className="forgot-row">
                    <Button variant="link" className="btn-link">Forgot Password?</Button>
                </Row>


                <Row className="signup-row">
                    <Button variant="info" className="email-btn">
                        Create an account
                    </Button>
                </Row>

                <Row className="seperator-row">
                    <label>OR</label>
                </Row>

                <Row className="signup-row">
                    <Button variant="danger" className="google-btn">
                        <Image src={require('../../assets/google.svg')} alt="google icon" rounded className="btn-icon" />
                        Signup with Google
                    </Button>
                </Row>

            </Container>
        )
    }
}

export default Login;