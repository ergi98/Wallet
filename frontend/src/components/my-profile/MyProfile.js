import React, { useState, useEffect, Suspense } from 'react'
import './MyProfile.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/esm/Button'
import Image from 'react-bootstrap/esm/Image'
import Alert from 'react-bootstrap/esm/Alert'

// Icons
import { IconContext } from 'react-icons'
import { AiFillDelete } from 'react-icons/ai'

// Axios
import axios from 'axios'

// Redux
import { useSelector } from 'react-redux'

// Components
import Layout from '../layout/Layout'
import InlineLoading from './InlineLoading'
import SmallLoading from '../home/SmallLoading'
import Loading from '../statistics/income-vs-expense/Loading'

const DeleteModal = React.lazy(() => import('./modals/DeleteModal'))
const PasswordModal = React.lazy(() => import('./modals/PasswordModal'))
const IncomeSources = React.lazy(() => import('./IncomeSources'))
const ExpenseCategories = React.lazy(() => import('./ExpenseCategories'))

function MyProfile() {


    const username = useSelector((state) => state.user.username)

    const [user, setUser] = useState([])

    const [deleteModal, setDeleteModal] = useState(false)

    const [passwordModal, setPasswordModal] = useState(false)
    const [pwdSuccess, setPwdSuccess] = useState(false)
    const [pwdError, setPwdError] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let _isMounted = true
        
        async function getUserData(username) {
            try {
                let res = await axios.post('/users/user-data', { username })

                if (res.data.result.length > 0)
                    setUser(res.data.result[0])
                setIsLoading(false)
            }
            catch (err) {
                console.log(err)
                setIsLoading(false)
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
                        { isLoading? <SmallLoading/> : <label className="name">{user?.personal?.name} {user?.personal?.surname}</label> }
                    </Row>
                    <Row>
                        { isLoading? null : <label className="occupation">{user?.personal?.profession}</label> }
                    </Row>
                </Container>
                <Row className="personal-row">
                    <div className="section-title">Personal Information</div>
                    <Col className="left-col" >
                        <Row>
                            <label className="desc">Name:</label>
                            { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.personal?.name}</label> }
                        </Row>
                        <Row>
                            <label className="desc">Age:</label>
                            { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.personal?.age}</label> }
                        </Row>
                        <Row>
                            <label className="desc">Gender:</label>
                            { 
                                isLoading? 
                                    <label className="value"><InlineLoading/></label> :
                                    <label className="value">
                                        {user?.personal?.gender === "M" ? "Male" : "Female"}
                                    </label>
                            }
                        </Row>
                    </Col>
                    <Col className="right-col">
                        <Row>
                            <label className="desc">Surname:</label>
                            { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.personal?.surname}</label> }
                        </Row>
                        <Row>
                            <label className="desc">Birthday:</label>
                            { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.personal?.birthday}</label> }
                        </Row>
                    </Col>
                    <Container className="profession">
                        <label className="desc">Profession</label>
                        { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.personal?.profession}</label> }
                    </Container>
                </Row>
                <Container className="general-container">
                    <div className="section-title">General Information</div>
                    <Row>
                        <label className="desc">Username:</label>
                        { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.username}</label> }
                    </Row>
                    <Row>
                        <label className="desc">Password:</label>
                        { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">********</label> }
                    </Row>
                    <Row>
                        <label className="desc">Joined:</label>
                        { isLoading? <label className="value"><InlineLoading/></label> : <label className="value">{user?.createdAt}</label> }
                    </Row>
                    <Button variant="primary" className="action-btn" onClick={() => setPasswordModal(true)}>
                        Change Password
                    </Button>
                </Container>
                <Suspense fallback={<Loading/>}><ExpenseCategories username={username}/></Suspense>
                <Suspense fallback={<Loading/>}><IncomeSources username={username} /></Suspense>
            </Container>
            <Suspense fallback={<Loading/>}>    
                <DeleteModal
                    show={deleteModal}
                    onClose={() => setDeleteModal(false)}
                />
            </Suspense>
            <Suspense fallback={<Loading/>}>    
                <PasswordModal
                    show={passwordModal}
                    onClose={() => setPasswordModal(false)}
                    setPwdSuccess={(value) => setPwdSuccess(value)}
                    setPwdError={(value) => setPwdError(value)}
                />
            </Suspense>
        </Layout>
    )
}

export default MyProfile
