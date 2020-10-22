import React from 'react'
import './DeleteModal.scss'

// Axios
import axios from 'axios'

// Redux
import { logOut } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// Bootstrap
import Modal from 'react-bootstrap/esm/Modal'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/esm/Button'

// Number Format
import NumberFormat from 'react-number-format'

function DeleteModal(props) {

    console.log('here')

    const dispatch = useDispatch()
    const jwt = useSelector((state) => state.user.jwt)
    
    async function deleteTransaction(username, date, transaction) {

        transaction.amount = transaction.amount.$numberDecimal

        try {
            await axios.post('/transactions/delete-transaction', { username, date, transaction }, { headers: { Authorization: `Bearer ${jwt}`}})
            props.deleteStatus("success", transaction)
        }
        catch(err) {
            // If no token is present logout
            if(err.message.includes('403'))
                dispatch(logOut())
            else
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