import React from 'react'
import './Layout.scss'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Dropdown from 'react-bootstrap/Dropdown'

// Icons
import { IconContext } from "react-icons"
import { RiLogoutCircleLine, RiAccountCircleFill } from 'react-icons/ri'

function Layout(props) {
    return (
        <Container fluid className="layout-container">
            <Row className="user-row">
                <Dropdown>
                    <Dropdown.Toggle className="user-btn">
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
                            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px' } }}>
                                <RiAccountCircleFill />
                            </IconContext.Provider>
                            My Profile
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px' } }}>
                                <RiLogoutCircleLine />
                            </IconContext.Provider>
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <Row>
                {props.children}
            </Row>

        </Container>
    )
}

export default Layout