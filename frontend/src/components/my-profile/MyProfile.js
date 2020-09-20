import React, { useState, useEffect } from 'react'
import './MyProfile.scss'

// Components
import Layout from '../layout/Layout'
import DeleteModal from './modals/DeleteModal'
import PasswordModal from './modals/PasswordModal'
import NewSrcCat from './modals/NewSrcCat'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'

// Icons
import { IconContext } from 'react-icons'
import { AiFillDelete, AiOutlinePlusCircle } from 'react-icons/ai'

// Axios
import axios from 'axios'

// Redux
import { useSelector } from 'react-redux'

function MyProfile() {


    const username = useSelector((state) => state.user.username)

    const [user, setUser] = useState([])
    const [categories, setCategories] = useState([])
    const [sources, setSources] = useState([])

    const [deleteModal, setDeleteModal] = useState(false)

    const [passwordModal, setPasswordModal] = useState(false)
    const [pwdSuccess, setPwdSuccess] = useState(false)
    const [pwdError, setPwdError] = useState(false)

    const [srcCatModal, setSrcCatModal] = useState(false)
    const [type, setType] = useState('')
    const [catSrcSuccess, setCatSrcSuccess] = useState(false)
    const [catSrcError, setCatSrcError] = useState(false)

    useEffect(() => {
        let _isMounted = true
        async function getUserData(username) {
            try {
                let res = await axios.post('/users/user-data', { username })

                if (res.data.result.length > 0) {
                    setUser(res.data.result[0])
                    setCategories(res.data.result[0].categories)
                    setSources(res.data.result[0].sources)
                }
                   
            }
            catch (err) {
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
                {/** Password alerts */}
                <Alert show={pwdSuccess} variant="success" className="alert">
                    <Alert.Heading className="heading">Password Change</Alert.Heading>
                    Your password was successfully changed!
                </Alert>
                <Alert show={pwdError} variant="danger" className="alert">
                    <Alert.Heading className="heading">Password Change</Alert.Heading>
                    A problem occured while trying to change your password.
                </Alert>
                {/** New Source/Category alerts */}
                <Alert show={catSrcSuccess} variant="success" className="alert">
                    <Alert.Heading className="heading">New {type}</Alert.Heading>
                    {type} successfully inserted.
                </Alert>
                <Alert show={catSrcError} variant="danger" className="alert">
                    <Alert.Heading className="heading">New {type}</Alert.Heading>
                    A problem occured while trying to insert new {type.toLowerCase()}.
                </Alert>
                <Container className="image-row">
                    <Button variant="link" className="delete-acc-btn" onClick={() => setDeleteModal(true)}>
                        <IconContext.Provider value={{ size: "30", style: { verticalAlign: 'middle', marginTop: '-6px' } }}>
                            <AiFillDelete />
                        </IconContext.Provider>
                    </Button>
                    <Row>
                        <Button variant="link">
                            <Image src={require("../../assets/no-avatar.png")} roundedCircle className="profile-img" />
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
                                {user?.personal?.gender === "M" ? "Male" : "Female"}
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
                    <Button variant="primary" className="action-btn" onClick={() => setPasswordModal(true)}>
                        Change Password
                    </Button>
                </Container>
                <Container className="category-row">
                    <div className="section-title">Expense Categories</div>
                    <Row className="table-row">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr><th>#</th><th colSpan="2">Category</th></tr>
                            </thead>
                            <tbody>
                                {
                                    categories.map((category, index) => 
                                        <tr key={category.cat_id}>
                                            <td>{index+1}</td>   
                                            <td>{category.cat_name}</td>
                                            <td style={{textAlign:"center"}}>
                                                <Button variant="link">
                                                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginTop: '-6px' } }}>
                                                        <AiFillDelete />
                                                    </IconContext.Provider>
                                                </Button>
                                            </td>                                          
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </Row>
                    <Row className="btn-row">
                        <Button variant="primary" onClick={() => { setType("Category"); setSrcCatModal(true)} }>
                            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' } }}>
                                <AiOutlinePlusCircle />
                            </IconContext.Provider> 
                            Expense Category
                        </Button>
                    </Row>
                </Container>
                <Container className="source-row">
                    <div className="section-title">Income Sources</div>
                    <Row className="table-row">
                        <Table striped bordered hover size="sm">
                        <thead>
                                <tr><th>#</th><th colSpan="2">Source</th></tr>
                            </thead>
                            <tbody>
                                {
                                    sources.map((source, index) => 
                                        <tr key={source.source_id}>
                                            <td>{index+1}</td>   
                                            <td>{source.source_name}</td>
                                            <td style={{textAlign:"center"}}>
                                                <Button variant="link">
                                                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginTop: '-6px' } }}>
                                                        <AiFillDelete />
                                                    </IconContext.Provider>
                                                </Button>
                                            </td>                                          
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </Row>
                    <Row className="btn-row">
                        <Button variant="primary" onClick={() => { setType("Source"); setSrcCatModal(true)} }>
                            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' } }}>
                                <AiOutlinePlusCircle />
                            </IconContext.Provider> 
                            Income Source
                        </Button>
                    </Row>
                </Container>
            </Container>
            <DeleteModal
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
            />
            <PasswordModal
                show={passwordModal}
                onClose={() => setPasswordModal(false)}
                setPwdSuccess={(value) => setPwdSuccess(value)}
                setPwdError={(value) => setPwdError(value)}
            />
            <NewSrcCat
                show={srcCatModal}
                onClose={() => setSrcCatModal(false)}
                type={type}
                setCatSrcSuccess={(value) => setCatSrcSuccess(value)}
                setCatSrcError={(value) => setCatSrcError(value)}
            />
        </Layout>
    )
}

export default MyProfile
