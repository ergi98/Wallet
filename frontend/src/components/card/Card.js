import React from 'react'
import './Card.scss'

// Bootstrap 
import Container from 'react-bootstrap/Container'

function Card(props) {
    return (
        <Container className="card-container">
            <Container className="title">
                <h5>{props.title}</h5>
            </Container>
            {props.children}
        </Container>
    )
}

export default Card 