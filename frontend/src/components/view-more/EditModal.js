import React from 'react'
import './EditModal.scss'

// Components
import ProfitForm from '../transaction/ProfitForm'
import SpendingForm from '../transaction/SpendingForm'

// Bootstrap
import Modal from 'react-bootstrap/Modal'

function EditModal(props) {
    
    return (
        <Modal show={props.show} className="edit-modal" onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Transaction</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                { 
                    props.transaction.trans_type === "expense"? 
                        <SpendingForm transaction={props.transaction} date={props.date}/> 
                        : 
                        <ProfitForm transaction={props.transaction} date={props.date}/> 
                }
            </Modal.Body>
        </Modal>
    )
}

export default EditModal