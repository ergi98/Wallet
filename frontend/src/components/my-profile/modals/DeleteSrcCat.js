import React, { useState } from 'react'

// Axios
import axios from 'axios'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

// Redux
import { useSelector } from "react-redux"

function NewSrcCat(props) {

    const username = useSelector((state) => state.user.username)
    const [deleteSrcCatError, setDeleteSrcCatError] = useState(false)

    async function deleteSrcCat() {
        console.log(props.item)
        if(props.type === "Category") {
            try {
                await axios.post('/users/delete-category', { username, category_id: props.item.cat_id })

                props.deleteCatSrc(props.item)    
                props.onClose()
            }
            catch(err) {
                setDeleteSrcCatError(true)
                setTimeout(() => { setDeleteSrcCatError(false) }, 2500)
            }
        }
        else if(props.type === "Source") {
            try {
                await axios.post('/users/delete-source', { username, source_id: props.item.source_id })
                
                props.deleteCatSrc(props.item)
                props.onClose()
            }
            catch(err) {
                setDeleteSrcCatError(true)
                setTimeout(() => { setDeleteSrcCatError(false) }, 2500)
            }
        }
    }

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete {props.type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/** New Source/Category alerts */}
                <Alert show={deleteSrcCatError} variant="danger">
                    A problem occured while trying to delete {props.type.toLowerCase()}.
                </Alert>
                Are you sure you want to delete the  
                    <b>
                        {
                            props.type === "Source"?
                            ' ' + props.item.source_name
                            :
                            ' ' + props.item.cat_name
                        }
                    </b>
                    { ' ' + props.type.toLowerCase() } ?
            </Modal.Body>
            <Modal.Footer style={{justifyContent: "space-evenly" }}>
                <Button variant="secondary" onClick={props.onClose}>Cancel</Button>
                <Button 
                    variant="danger" 
                    onClick={deleteSrcCat}
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewSrcCat