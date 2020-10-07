import React from 'react'
import './Card.scss'

// Bootstrap 
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))
const Button = React.lazy(() => import('react-bootstrap/esm/Button'))

function Card(props) {
    return (
        <Container className="card-container">
            <Container className="title">
                <h5>{props.title}</h5>  
                {
                    props.hasButton?
                    <Button variant="link" className="action-btn" onClick={props.btnAction}>
                        {props.buttonTxt}
                    </Button>
                    : null 
                }
            </Container>
            {props.children}
        </Container>
    )
}

export default Card 