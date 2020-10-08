import React from 'react'
import './SignupPortfolio.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Button from 'react-bootstrap/esm/Button'

// Icons
import { IconContext } from "react-icons"
import { AiFillDelete } from 'react-icons/ai'

// Number Format
import NumberFormat from 'react-number-format'

function SignupPortfolio(props) {

    return (
        <Container className="signup-portfolio">
            <Row className="main-row">
                <div className="portfolio-name">
                    <label className="name">{ props.portfolio.p_name }</label>
                    <label className="type">{ props.portfolio.type }</label>
                </div>
                <Button variant="link" className="delete-btn" onClick={() => props.deletePortfolio(props.portfolio)}>
                    <IconContext.Provider value={{ size: "30", style: { verticalAlign: 'middle', marginTop: '3px'} }}>
                        <AiFillDelete/>
                    </IconContext.Provider>
                </Button>
            </Row>
            <Row className="row-item">
                <label className="title">Valid Amount:</label> 
                <label className="amount">
                    <NumberFormat 
                        value={ props.portfolio.amount }
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={ props.portfolio.currency + ' '} 
                    />    
                </label>
            </Row>
        </Container>
    )
}

export default React.memo(SignupPortfolio)