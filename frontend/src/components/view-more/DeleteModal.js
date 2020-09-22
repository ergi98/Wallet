import React from 'react'
import './DeleteModal.scss'

// Axios
import axios from 'axios'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

// Number Format
import NumberFormat from 'react-number-format'

function DeleteModal(props) {

    
    async function deleteTransaction(username, date, transaction) {

        transaction.amount = transaction.amount.$numberDecimal

        try {
            await axios.post('/transactions/delete-transaction', { username, date, transaction })
            props.deleteStatus("success", transaction)
        }
        catch(err) {
            props.deleteStatus("error")
        }

        props.onClose()
    }

    return (
        <Modal show={props.show} className="delete-modal" onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className="warning">Are you sure you want to delete this transaction?</label>
                <Container className='delete-container'>
                    <Row>
                        <label className="title">Description:</label>
                        <label className="value">{props.transaction.short_desc}</label>
                    </Row>
                    <Row>
                        <label className="title">Date:</label>
                        <label className="value">{props.date.toLocaleDateString('en-GB')}</label>
                    </Row>
                    <Row>
                        <Col>
                        <label className="title">Time:</label>
                        <label className="value">{props.transaction.time}</label> 
                        </Col>
                        <Col>
                        <label className="title">Type:</label>
                        <label className="value" style={{textTransform: "capitalize"}}>{props.transaction.trans_type}</label> 
                        </Col>
                    </Row>
                    <Row>
                        <label className="title">Amount:</label>
                        <label className="value">
                            <NumberFormat 
                                value={props.transaction.amount?.$numberDecimal}
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={' ' + props.transaction.currency + ' ' } 
                            />  
                        </label>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer className="center-btns"> 
                    <Button variant="secondary" onClick={props.onClose}>Cancel</Button>
                    <Button variant="danger" onClick={() => deleteTransaction(props.username, props.date.toLocaleDateString('en-GB'), props.transaction)}>Delete</Button>
            </Modal.Footer>

        </Modal>
    )
}

export default DeleteModal