import React from 'react'
import './Portfolio.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/Button'

// Icons
import { IconContext } from "react-icons"
import { AiOutlineStar, AiFillStar, AiOutlineUnorderedList, AiFillEdit } from 'react-icons/ai'

// Number Format
import NumberFormat from 'react-number-format'

// Redux
import { useSelector } from 'react-redux'

// Axios
import axios from 'axios'

function Portfolio(props) {

    
    const username = useSelector((state) => state.user.username)

    async function changeFavourite(portfolio) {
        if(portfolio.favourite) 
            portfolio.favourite = false
        else 
            portfolio.favourite = true

        try {
            await axios.post('/users/change-portfolio-fav', { username, portfolio })
            props.setFavStatus("success")
        }
        catch(err) {
            props.setFavError("error")
        }
    }

    return (
        <Container className="portfolio">
            {
                props.portfolio.type === "credit card"?
                <Container>
                    <Row className="main-row">
                        <div className="portfolio-name">
                            <label className="name">{ props.portfolio.p_name }</label>
                            <label className="type">{ props.portfolio.type }</label>
                        </div>
                        <Button variant="link" className="star" onClick={() => changeFavourite(props.portfolio)}>
                            {
                                props.portfolio.favourite?
                                <IconContext.Provider value={{ size: "30", color: "#e8e40e", style: { verticalAlign: 'middle' } }}>
                                    <AiFillStar/>
                                </IconContext.Provider>
                                :
                                <IconContext.Provider value={{ size: "30", style: { verticalAlign: 'middle' } }}>
                                    <AiOutlineStar/>
                                </IconContext.Provider>
                            }
                        </Button>
                    </Row>
                    <Row className="row-item">
                        <Col xs={8} className="col1">
                            <label className="title">Card Holder:</label> <label>{ props.portfolio.card_holder }</label>
                        </Col>
                        <Col className="col2">
                            <label className="title">CVC:</label> <label>{ props.portfolio.cvc }</label>
                        </Col>
                    </Row>
                    <Row className="row-item">
                        <label className="title">Card Number:</label>  <label>{ props.portfolio.card_no }</label>
                    </Row>
                    <Row className="row-item">
                        <label className="title">Valid:</label>  <label>{ props.portfolio.valid_m } / { props.portfolio.valid_y }</label>
                    </Row>
                    <Row className="row-item">
                        <label className="title">Valid Amount:</label> 
                        <label className="amount">
                            <NumberFormat 
                                value={ props.portfolio.amount.$numberDecimal }
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={ props.portfolio.currency + ' ' } 
                            />    
                        </label>
                    </Row>
                    <Row className="row-item">
                        <Col className="btn-col">
                            <Button variant="primary" className="edit-btn">
                                <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-6px' } }}>
                                    <AiFillEdit/>
                                </IconContext.Provider>
                                Edit
                            </Button>
                        </Col>
                        <Col className="btn-col">
                            <Button variant="secondary" className="list-btn">
                                <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-6px' } }}>
                                    <AiOutlineUnorderedList/>
                                </IconContext.Provider>
                                Transactions
                            </Button>
                        </Col>
                    </Row>
                </Container>
                : 
                <Container>
                    <Row className="main-row">
                        <div className="portfolio-name">
                            <label className="name">{ props.portfolio.p_name }</label>
                            <label className="type">{ props.portfolio.type }</label>
                        </div>
                        <Button variant="link" className="star" onClick={() => changeFavourite(props.portfolio)}>
                            {
                                props.portfolio.favourite?
                                <IconContext.Provider value={{ size: "30", color: "#e8e40e", style: { verticalAlign: 'middle' } }}>
                                    <AiFillStar/>
                                </IconContext.Provider>
                                :
                                <IconContext.Provider value={{ size: "30", style: { verticalAlign: 'middle' } }}>
                                    <AiOutlineStar/>
                                </IconContext.Provider>
                            }
                        </Button>
                    </Row>
                    <Row className="row-item">
                        <label className="title">Valid Amount:</label> 
                        <label className="amount">
                            <NumberFormat 
                                value={ props.portfolio.amount.$numberDecimal }
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={ props.portfolio.currency + ' '} 
                            />    
                        </label>
                    </Row>
                    <Row className="row-item">
                        <Col className="btn-col">
                            <Button variant="primary" className="edit-btn">
                                <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-6px' } }}>
                                    <AiFillEdit/>
                                </IconContext.Provider>
                                Edit
                            </Button>
                        </Col>
                        <Col className="btn-col">
                            <Button variant="secondary" className="list-btn">
                                <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-6px' } }}>
                                    <AiOutlineUnorderedList/>
                                </IconContext.Provider>
                                Transactions
                            </Button>
                        </Col>
                    </Row>
                </Container>
            }
        </Container>
    )
}

export default Portfolio;
