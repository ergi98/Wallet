import React, { useState } from 'react'
import './DeleteModal.scss'

// Bootstrap
import Modal from 'react-bootstrap/esm/Modal'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'

function DeletePortfolio(props) {   

    const [agree, setAgree] = useState(false)

    async function deleteProfile() {
        // todo
    }

    return (
        <Modal show={props.show} className="profile-delete" onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className="warning">Are you sure you want to delete this account?</label>
                <label className="detail-warning">
                    WARNING: By deleting this account you also erase all your data that this application
                    is holding for you.
                </label>

                <Form.Check
                    className="checkbox"
                    type="checkbox"
                    id="location"
                    checked={agree}
                    onChange={(event) => setAgree(event.target.checked)}
                    label="I agree to delete all my information."
                />
            </Modal.Body>
            <Modal.Footer className="center-btns">
                <Button variant="secondary" onClick={props.onClose}>Cancel</Button>
                <Button 
                    variant="danger" 
                    onClick={deleteProfile}
                    disabled={!agree}
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeletePortfolio