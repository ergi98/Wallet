import React from 'react'
import './NavBar.scss'

import { NavLink } from 'react-router-dom'

// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

// Icons 
import { ImHome } from 'react-icons/im'
import { FaWallet } from 'react-icons/fa' 
import { BsFillBarChartFill } from 'react-icons/bs'

class NavBar extends React.Component {

    render () {
        return (
            <Navbar fixed="bottom" expand bg="dark" sticky="bottom" className="my_nav">
                <Nav fill defaultActiveKey="/home">
                    <Nav.Item>
                        <NavLink to="/portfolios" className="link" activeClassName="selected">
                            <div className="link-desc"><FaWallet className="icon"/> Portfolios </div>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item> 
                        <NavLink to="/home"  className="link" activeClassName="selected">
                            <div className="link-desc"><ImHome className="icon"/> Home</div>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item> 
                        <NavLink to="/statistics"  className="link" activeClassName="selected">
                            <div className="link-desc"><BsFillBarChartFill className="icon"/> Statistics </div>
                        </NavLink>
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}

export default NavBar;