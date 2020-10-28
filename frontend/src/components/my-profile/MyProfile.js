import React, { useState, useEffect } from 'react'
import styles from './MyProfile.module.scss'

// Icons
import { IconContext } from 'react-icons'
import { AiFillDelete } from 'react-icons/ai'

// Axios
import axios from 'axios'

// Redux
import { logOut } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// Bootstrap
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))
const Row = React.lazy(() => import('react-bootstrap/esm/Row'))
const Col = React.lazy(() => import('react-bootstrap/esm/Col'))
const Button = React.lazy(() => import('react-bootstrap/esm/Button'))
const Image = React.lazy(() => import('react-bootstrap/esm/Image'))
const Alert = React.lazy(() => import('react-bootstrap/esm/Alert'))

// Components
const DeleteModal = React.lazy(() => import('./modals/DeleteModal'))
const PasswordModal = React.lazy(() => import('./modals/PasswordModal'))
const IncomeSources = React.lazy(() => import('./IncomeSources'))
const ExpenseCategories = React.lazy(() => import('./ExpenseCategories'))

function MyProfile() {

    const dispatch = useDispatch()
    const jwt = useSelector((state) => state.user.jwt)
    const username = useSelector((state) => state.user.username)

    const [user, setUser] = useState([])

    const [deleteModal, setDeleteModal] = useState(false)

    const [passwordModal, setPasswordModal] = useState(false)
    const [pwdSuccess, setPwdSuccess] = useState(false)
    const [pwdError, setPwdError] = useState(false)

    useEffect(() => {
        let _isMounted = true
        
        async function getUserData(username) {
            try {
                let res = await axios.post('/users/user-data', { username }, { headers: { Authorization: `Bearer ${jwt}`}})

                if (res.data.result.length > 0)
                    setUser(res.data.result[0])
            }
            catch (err) {
                // If no token is present logout
                if(err.message.includes('403'))
                    dispatch(logOut())
            }
        }

        _isMounted && getUserData(username)

        return () => {
            _isMounted = false
        }
    }, [username, jwt, dispatch])

    return (
        <React.Fragment>
            <Container className={styles["profile-container"]}>
                {/** Password alerts */}
                <Alert show={pwdSuccess} variant="success" className={styles["alert"]}>
                    Your password was successfully changed!
                </Alert>
                <Alert show={pwdError} variant="danger" className={styles["alert"]}>
                    A problem occured while trying to change your password.
                </Alert>
                <Container className={styles["image-row"]}>
                    <Button variant="link" className={styles["delete-acc-btn"]} onClick={() => setDeleteModal(true)}>
                        <IconContext.Provider value={{ size: "30", style: { verticalAlign: 'middle', marginTop: '-6px' } }}>
                            <AiFillDelete />
                        </IconContext.Provider>
                    </Button>
                    <Row className={styles["center-row"]}>
                        <Button variant="link">
                            <Image src={require("../../assets/no-avatar.png")} roundedCircle className={styles["profile-img"]} />
                        </Button>
                    </Row>
                    <Row className={styles["center-row"]}>
                        <label className={styles["name"]}>{user?.personal?.name} {user?.personal?.surname}</label>
                    </Row>
                    <Row className={styles["center-row"]}>
                        <label className={styles["occupation"]}>{user?.personal?.profession}</label>
                    </Row>
                </Container>
                <Row className={styles["personal-row"]}>
                    <div className={styles["section-title"]}>Personal Information</div>
                    <Col>
                        <Row>
                            <label className={styles["desc"]}>Name:</label>
                            <label className={styles["value"]}>{user?.personal?.name}</label>
                        </Row>
                        <Row>
                            <label className={styles["desc"]}>Age:</label>
                            <label className={styles["value"]}>{user?.personal?.age}</label>
                        </Row>
                        <Row>
                            <label className={styles["desc"]}>Gender:</label>
                            <label className={styles["value"]}>
                                {user?.personal?.gender === "M" ? "Male" : "Female"}
                            </label>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <label className={styles["desc"]}>Surname:</label>
                            <label className={styles["value"]}>{user?.personal?.surname}</label>
                        </Row>
                        <Row>
                            <label className={styles["desc"]}>Birthday:</label>
                            <label className={styles["value"]}>{user?.personal?.birthday}</label>
                        </Row>
                    </Col>
                    <Container className={styles["profession"]}>
                        <label className={styles["desc"]}>Profession</label>
                        <label className={styles["value"]}>{user?.personal?.profession}</label>
                    </Container>
                </Row>
                <Container className={styles["general-container"]}>
                    <div  className={styles["section-title"]}>General Information</div>
                    <Row>
                        <label className={styles["desc"]}>Username:</label>
                        <label className={styles["value"]}>{user?.username}</label>
                    </Row>
                    <Row>
                        <label className={styles["desc"]}>Password:</label>
                        <label className={styles["value"]}>********</label>
                    </Row>
                    <Row>
                        <label className={styles["desc"]}>Joined:</label>
                        <label className={styles["value"]}>{user?.createdAt}</label>
                    </Row>
                    <Button variant="primary" className={styles["action-btn"]} onClick={() => setPasswordModal(true)}>
                        Change Password
                    </Button>
                </Container>
                <ExpenseCategories username={username}/>
                <IncomeSources username={username} />
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
        </React.Fragment>
    )
}

export default MyProfile
