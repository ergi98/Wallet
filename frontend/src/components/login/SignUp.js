import React, { useState } from 'react'
import './SignUp.scss'

// Components
import LoginInformatio from './information/LoginInformation'
import PersonalInformation from './information/PersonalInformation'
import PortfolioInformation from './information/PortfolioInformation'
import CategoryInformation from './information/CategoryInformation'
import SourcesInformation from './information/SourcesInformation'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'


// Icons
import { IconContext } from "react-icons"
import { IoMdArrowRoundBack } from 'react-icons/io'

function SignUp() {

    const [activeStep, setActiveStep] = useState(0)
    const [info, setInfo] = useState({})

    function saveInfo(obj) {
        var merge = require('lodash.merge')

        let newInfo = merge(info, obj)

        setInfo(newInfo)
        console.log(newInfo)
    }

    function renderForm() {
        switch(activeStep) {
            case 0: 
                return <LoginInformatio info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep+1)}/>
            case 1: 
                return <PersonalInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep+1)} decrement={() => setActiveStep(activeStep-1)}/>
            case 2: 
                return <PortfolioInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep+1)} decrement={() => setActiveStep(activeStep-1)}/>
            case 3: 
                return <CategoryInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep+1)} decrement={() => setActiveStep(activeStep-1)}/>
            case 4:
                return <SourcesInformation info={info} saveInfo={saveInfo} increment={() => setActiveStep(activeStep+1)} signup={signup}/>
            default:
                return
        }
    }
    
    function signup() {

    }

    return (
        <Container className="main-container">

            <Row className="logo-row">
                <div className="goto-login-btn">
                    <Button variant="link" onClick={() =>  window.location.href = '/login'}>
                        <IconContext.Provider value={{ size: "25", style: { color: "white", verticalAlign: 'middle', marginRight: '5px', marginTop: '-3px' } }}>
                            <IoMdArrowRoundBack/>
                        </IconContext.Provider>
                        Log In
                    </Button>
                </div>
                <img src={require('../../assets/logo.svg')} alt="Wallet Logo" />
            </Row>

            <Row className="login-row">
                <Container className="login-container">
                    <Row className="signup-row">
                        <div className="stepper">
                            <div className={`dot ${activeStep >= 0? "active" : "" }`}>1</div>
                            <div className={`dot ${activeStep >= 1? "active" : "" }`}>2</div>
                            <div className={`dot ${activeStep >= 2? "active" : "" }`}>3</div>
                            <div className={`dot ${activeStep >= 3? "active" : "" }`}>4</div>
                            <div className={`dot ${activeStep >= 4? "active" : "" }`}>5</div>
                        </div>
                        { renderForm() }
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default SignUp
