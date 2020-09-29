import React, { useState } from 'react'
import './DeletePortfolio.scss'

// Axios
import axios from 'axios'


// Redux
import { useSelector } from 'react-redux'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

// Number Format
import NumberFormat from 'react-number-format'

function DeletePortfolio(props) {

    const [transferSelected, setTransferSelected] = useState(false)
    const [selectedPortfolio, setSelectedPortfolio] = useState("default")
    
    const portfolios = useSelector((state) => state.user.portfolios)

    async function deletePortfolio() {

        try {
            await axios.post('/users/delete-portfolio', { 
                username: props.username, 
                delete_id: props.portfolio.p_id, 
                transfer_amnt: props.portfolio.amount.$numberDecimal,
                transfer_id: selectedPortfolio 
            })
            props.onClose()
            props.setDeleteStatus("success", props.portfolio, selectedPortfolio)
        }
        catch(err) {
            props.setDeleteStatus("error")
        }
    }

    return (
        <Modal show={props.show} className="portfolio-delete" onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className="warning">Are you sure you want to delete this portfolio?</label>
                {
                    props.portfolio.type === "credit card" ?
                        <Container className='portfolio-field'>
                            <Row>
                                <label className="title">Name:</label>
                                <label className="value">{props.portfolio.p_name}</label>
                            </Row>
                            <Row>
                                <label className="title">Bank:</label>
                                <label className="value">{props.portfolio.bank}</label>
                            </Row>
                            <Row>
                                <label className="title">Card Number:</label>
                                <label className="value">{props.portfolio.card_no}</label>
                            </Row>
                            <Row>
                                <label className="title">Amount:</label>
                                <label className="value">
                                    <NumberFormat
                                        value={props.portfolio.amount?.$numberDecimal}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={' ' + props.portfolio.currency + ' '}
                                    />
                                </label>
                            </Row>
                        </Container>
                        :
                        <Container className='portfolio-field'>
                            <Row>
                                <label className="title">Name:</label>
                                <label className="value">{props.portfolio.p_name}</label>
                            </Row>
                            <Row>
                                <label className="title">Amount:</label>
                                <label className="value">
                                    <NumberFormat
                                        value={props.portfolio.amount?.$numberDecimal}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={' ' + props.portfolio.currency + ' '}
                                    />
                                </label>
                            </Row>
                        </Container>
                }
                {
                    props.portfolio.amount?.$numberDecimal > 0 ?
                        <Container className='transfer-container'>
                            <Form.Check
                                className="checkbox"
                                type="checkbox"
                                id="transfer"
                                checked={transferSelected}
                                onChange={(event) => setTransferSelected(event.target.checked)}
                                label="Transfer my amount to a different portfolio"
                            />
                        </Container> : null
                }
                {
                    transferSelected ?
                        <Container className='select-container'>
                            <Form.Control
                                id="portfolios"
                                as="select"
                                className="mr-sm-2"
                                custom
                                value={selectedPortfolio}
                                onChange={(event) => setSelectedPortfolio(event.target.value)}
                            >
                                <option value="default" disabled>Choose the portfolio to transfer the amount</option>
                                {
                                    portfolios !== undefined?
                                    portfolios.map(portfolio => <option key={portfolio.p_id} value={portfolio.p_id}>{portfolio.p_name}</option>) : null
                                }
                            </Form.Control>
                        </Container> : null
                }
            </Modal.Body>
            <Modal.Footer className="center-btns">
                <Button variant="secondary" onClick={props.onClose}>Cancel</Button>
                <Button 
                    variant="danger" 
                    onClick={deletePortfolio}
                    disabled={transferSelected && selectedPortfolio === "default"}
                >
                    Delete
                </Button>
            </Modal.Footer>

        </Modal>
    )
}

export default DeletePortfolio