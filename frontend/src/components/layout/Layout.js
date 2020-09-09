import React from 'react'
import './Layout.scss'

// Components
import NavBar from '../navbar/NavBar'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Dropdown from 'react-bootstrap/Dropdown'

// Icons
import { IconContext } from "react-icons"
import { RiLogoutCircleLine, RiAccountCircleFill } from 'react-icons/ri'

// Redux 
import { logOut } from '../../redux/actions/userActions'
import { useSelector, useDispatch } from 'react-redux';

function Layout(props) {

    const username = useSelector((state) => state.user.username)
    const isAuthenticated  = useSelector((state) => state.user.isAuthenticated)
    const dispatch = useDispatch()

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
                        <Dropdown.Item onClick={() => {dispatch(logOut({ username })) }}>
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
            {isAuthenticated ? <NavBar /> : null}
        </Container>
    )
}

export default Layout