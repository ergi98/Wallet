import React from 'react'
import './Layout.scss'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'

function Layout(props) {
    return(
        <Container fluid className="layout-container">
            <Row className="user-row">
                <button className="user-btn">
                    <Image src={require('../../assets/money.svg')} roundedCircle className="user-img"/>
                </button>
            </Row>
            <Row>
                {props.children}
            </Row>

        </Container>
    )
}

export default Layout