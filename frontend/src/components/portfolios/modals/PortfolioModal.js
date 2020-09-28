import React, { useState } from 'react'
import './PortfolioModal.scss'

// Components
import WalletForm from '../forms/WalletForm'
import CardForm from '../forms/CardForm'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

function PortfolioModal(props) {

    const [type, setType] = useState("placeholder")

    function setStatus(status) {
        if(status==="success") {
            props.setPortfolioStatus("success")
            props.closeModal()
        }
        else if(status==="error") {
            props.setPortfolioStatus("error")
        }
    }

    return (
        <Modal show={props.show} className="portfolio-modal" onHide={props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add Portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className='portfolio-container'>
                    <Row>
                        <label className="warning">Please select the type of portfolio you want to add.</label>
                    </Row>
                    <Form.Group as={Row} controlId="portfolio-type" className="align-items-center">
                        <Form.Control
                            as="select"
                            className="mr-sm-2"
                            value={type}
                            custom
                            onChange={(event) => setType(event.target.value)}
                        >
                            <option value="placeholder" disabled>Choose type of portfolio</option>
                            <option value="wallet">Wallet</option>
                            <option value="credit card">Credit Card</option>
                        </Form.Control>
                    </Form.Group>
                    {
                        type === "wallet"?
                        <Row>
                            <WalletForm closeModal={props.closeModal} caller={props.caller} username={props.username} setStatus={setStatus} setPortfolio={props.setPortfolio}/>
                        </Row> : null
                    }
                    {
                        type === "credit card"?
                        <Row>
                            <CardForm closeModal={props.closeModal} caller={props.caller} username={props.username} setStatus={setStatus} setPortfolio={props.setPortfolio}/>
                        </Row> : null
                    }
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default PortfolioModal