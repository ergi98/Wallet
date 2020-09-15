import React, { useState, useEffect } from 'react'
import './MyProfile.scss'

// Components
import Layout from '../layout/Layout'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

// Icons
import { IconContext } from "react-icons"

// Axios
import axios from 'axios'

// Redux
import { useSelector } from 'react-redux'

function MyProfile () {

    
    const username = useSelector((state) => state.user.username)
    const [user, setUser] = useState([])

    useEffect(() => {
        let _isMounted = true
        async function getUserData(username) {
            try {
                let res = await axios.post('/users/user-data', { username })

                if(res.data.result.length > 0)
                    setUser(res.data.result[0])
            }
            catch(err) {
                console.log(err)
            }
        }

        _isMounted && getUserData(username)
        return () => {
            _isMounted = false
        }
    }, [username])

    return (
        <Layout>
            <Container className="profile-container">
                <Container className="image-row">
                    <Row>
                        <Button variant="link">
                            <Image src={require("../../assets/no-avatar.png")} roundedCircle className="profile-img"/>
                        </Button>
                    </Row>
                    <Row>
                        <label className="name">{user?.personal?.name} {user?.personal?.surname}</label>
                    </Row>
                    <Row>
                        <label className="occupation">{user?.personal?.profession}</label>
                    </Row>
                </Container>
                <Row className="personal-row">
                    <div className="section-title">Personal Information</div>
                    <Col className="left-col" >
                        <Row>
                            <label className="desc">Name:</label>
                            <label className="value">{user?.personal?.name}</label>
                        </Row>
                        <Row>
                            <label className="desc">Age:</label>
                            <label className="value">{user?.personal?.age}</label>
                        </Row>
                        <Row>
                            <label className="desc">Gender:</label>
                            <label className="value">
                                {user?.personal?.gender === "M"? "Male" : "Female"}
                            </label>
                        </Row>
                    </Col>
                    <Col className="right-col">
                        <Row>
                            <label className="desc">Surname:</label>
                            <label className="value">{user?.personal?.surname}</label>
                        </Row>
                        <Row>
                            <label className="desc">Birthday:</label>
                            <label className="value">{user?.personal?.birthday}</label>
                        </Row>
                    </Col>
                    <Container className="profession">
                        <label className="desc">Profession</label>
                        <label className="value">{user?.personal?.profession}</label>
                    </Container>
                    <Button variant="primary" className="action-btn">
                        Edit Information
                    </Button>
                </Row>
                <Container className="general-container">
                    <div className="section-title">General Information</div>
                    <Row>
                        <label className="desc">Username:</label>
                        <label className="value">{user?.username}</label>
                    </Row>
                    <Row>
                        <label className="desc">Password:</label>
                        <label className="value">********</label>
                    </Row>
                    <Row>
                        <label className="desc">Joined:</label>
                        <label className="value">{user?.createdAt}</label>
                    </Row>
                    <Button variant="primary" className="action-btn">
                        Change Password
                    </Button>
                </Container>
            </Container>
        </Layout>
    )
}

export default MyProfile
