import React, { useState } from 'react'
import './MapModal.scss'

// Leaflet
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function MapModal(props) {

    const [position, setPosition] = useState({})

    navigator.geolocation.getCurrentPosition(pos => {
        setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude 
        })
    })

    function handleDrag(event) {
        setPosition(event.target._latlng)
    }

    return (
        <Modal show={props.show} onHide={props.closeModal}>
            <Modal.Body>
                {
                    position.lat !== null || position.lng !== null?
                    <Map 
                        center={position} 
                        zoom={17} 
                        className="map-body" 
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={position} draggable onDragEnd={handleDrag}>
                            <Popup>You are here</Popup>
                        </Marker>
                    </Map>:null
                }
            </Modal.Body>
            <Modal.Footer className="center-btns">
                <Button variant="secondary" onClick={() => props.closeModal()}>Cancel</Button>
                <Button variant="primary" onClick={() => { props.getPinLocation(position); props.closeModal()}}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MapModal
