import React, { useState, Suspense } from 'react'
import './PortfolioModal.scss'

// Bootstrap
import Modal from 'react-bootstrap/esm/Modal'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Form from 'react-bootstrap/esm/Form'

// Components
import Loading from '../../loaders/Loading'
const WalletForm = React.lazy(() => import('../forms/WalletForm'))
const CardForm = React.lazy(() => import('../forms/CardForm'))

function PortfolioModal(props) {

    const [type, setType] = useState("placeholder")

    function setStatus(status, portfolio) {
        if(status==="success") {
            props.setPortfolioStatus("success", portfolio)
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
                            <Suspense fallback={<Loading/>}>
                                <WalletForm closeModal={props.closeModal} caller={props.caller} username={props.username} setStatus={setStatus} setPortfolio={props.setPortfolio}/>
                            </Suspense>
                        </Row> : null
                    }
                    {
                        type === "credit card"?
                        <Row>
                            <Suspense fallback={<Loading/>}>
                                <CardForm closeModal={props.closeModal} caller={props.caller} username={props.username} setStatus={setStatus} setPortfolio={props.setPortfolio}/>
                            </Suspense>
                        </Row> : null
                    }
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default PortfolioModal