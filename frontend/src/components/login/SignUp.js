import React, { useState, Suspense } from 'react'
import './SignUp.scss'

// Bootstrap
import Row from 'react-bootstrap/esm/Row'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'

// Icons
import { IconContext } from "react-icons"
import { IoMdArrowRoundBack } from 'react-icons/io'
import { RiLoginCircleLine } from 'react-icons/ri'

// Axios
import axios from 'axios'

// Components
import Loading from "../statistics/income-vs-expense/Loading"
const LoginInformatio = React.lazy(() => import('./information/LoginInformation'))
const PersonalInformation = React.lazy(() => import('./information/PersonalInformation'))
const PortfolioInformation = React.lazy(() => import('./information/PortfolioInformation'))
const CategoryInformation = React.lazy(() => import('./information/CategoryInformation'))
const SourcesInformation = React.lazy(() => import('./information/SourcesInformation'))

function SignUp() {

    const [activeStep, setActiveStep] = useState(0)
    const [info, setInfo] = useState({})

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [isEditing, setIsEditing] = useState(true)

    function saveInfo(obj) {
        var merge = require('lodash.merge')
        let newInfo = merge(info, obj)
        setInfo(newInfo)
    }

    function renderForm() {
        switch (activeStep) {
            case 0:
                return <LoginInformatio info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep + 1)} />
            case 1:
                return <PersonalInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep + 1)} decrement={() => setActiveStep(activeStep - 1)} />
            case 2:
                return <PortfolioInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep + 1)} decrement={() => setActiveStep(activeStep - 1)} />
            case 3:
                return <CategoryInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep + 1)} decrement={() => setActiveStep(activeStep - 1)} />
            case 4:
                return <SourcesInformation info={info} saveInfo={saveInfo} decrement={() => setActiveStep(activeStep - 1)} signup={signup} />
            default:
                return
        }
    }

    async function signup() {
        try {
            await axios.post('/users/register-user', { userData: info })
            setIsEditing(false)
            setSuccess(true)
        }
        catch (err) {
            setIsEditing(false)
            setError(true)
            setTimeout(() => { setError(false) }, 2500)
        }
    }

    return (
        <React.Fragment>
            <Container fluid className="logo-row">
                <div className="goto-login-btn">
                    {
                        !success ?
                            <Button variant="link" onClick={() => window.location.href = '/login'}>
                                <IconContext.Provider value={{ size: "25", style: { color: "white", verticalAlign: 'middle', marginRight: '5px', marginTop: '-3px' } }}>
                                    <IoMdArrowRoundBack />
                                </IconContext.Provider>
                            Login
                        </Button> : null
                    }
                </div>
                <img src={require('../../assets/logo.svg')} alt="Wallet Logo" />
            </Container>
            <Container className="main-container">
                <Row className="login-row">
                    <Container className="login-container">
                        {
                            success ?
                                <div className="success-div">
                                    <section>
                                        <label className="title">Congratulations!</label>
                                        <label className="subtitle">
                                            Your account is ready. Please click the button below to authenticate and login.
                                </label>
                                    </section>
                                    <Button variant="primary" onClick={() => window.location.href = '/login'}>
                                        LOGIN
                                    <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: "-2px" } }}>
                                            <RiLoginCircleLine />
                                        </IconContext.Provider>
                                    </Button>
                                </div> : null
                        }
                        {
                            isEditing ?
                                <Row className="signup-row">
                                    <div className="stepper">
                                        <div className={`dot ${activeStep >= 0 ? "active" : ""}`}>1</div>
                                        <div className={`dot ${activeStep >= 1 ? "active" : ""}`}>2</div>
                                        <div className={`dot ${activeStep >= 2 ? "active" : ""}`}>3</div>
                                        <div className={`dot ${activeStep >= 3 ? "active" : ""}`}>4</div>
                                        <div className={`dot ${activeStep >= 4 ? "active" : ""}`}>5</div>
                                    </div>
                                    <Suspense fallback={<Loading/>}>
                                        {renderForm()}
                                    </Suspense>
                                </Row> : null
                        }
                        {
                            error ?
                                <div className="success-div">
                                    <section>
                                        <label className="error">Unsuccessful!</label>
                                        <label className="subtitle">
                                            An error occured while trying to register your account. Press the button below to try again.
                                </label>
                                    </section>
                                    <Button variant="primary" onClick={() => window.location.href = '/sign-up'}>
                                        TRY AGAIN
                                </Button>
                                </div> : null
                        }
                    </Container>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default SignUp
