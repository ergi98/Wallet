import React from 'react'
import './NavBar.scss'

// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class NavBar extends React.Component {
    render () {
        return (
            <Navbar fixed="bottom" expand bg="dark" variant="dark" sticky="bottom" className="my_nav">
                <Nav fill defaultActiveKey="/home">
                    <Nav.Item>
                        <Nav.Link href="/portfolios">Portfolios</Nav.Link>
                    </Nav.Item>
                    <Nav.Item> 
                        <Nav.Link href="/home">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item> 
                        <Nav.Link href="/statistics">Statistics</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}

export default NavBar;