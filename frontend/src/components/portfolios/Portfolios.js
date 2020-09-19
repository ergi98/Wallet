import React, { useState, useEffect } from 'react'
import './Portfolios.scss'

// Components
import Layout from '../layout/Layout'
import Portfolio from './Portfolio'
import PortfolioModal from './modals/PortfolioModal'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

// Redux
import { useSelector, useDispatch } from 'react-redux'

// Icons
import { IconContext } from "react-icons"
import { BiWallet } from 'react-icons/bi'

// Actions
import { getPortfolios } from '../../redux/actions/userActions'

function Portfolios() {

    const username = useSelector((state) => state.user.username)
    const dispatch = useDispatch()

    const [portfolios, setPortfolios] = useState([])

    const [showPortfolioModal, setPortfolioModal] = useState(false)
    const [showPortfolioError, setPortfolioError] = useState(false)
    const [showPortfolioSuccess, setPortfolioSuccess] = useState(false)

    const [favSuccess, setFavSuccess] = useState(false)
    const [favError, setFavError] = useState(false)

    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [deleteError, setDeleteError] = useState(false)

    useEffect(() => {
        let _isMounted = true

        _isMounted && dispatch(getPortfolios({ username })).then(res => setPortfolios(res))

        return () => {
            // Clean up the subscription
            _isMounted = false
        };
        
    }, [username, dispatch])

    function closePortfolioModal() {
        setPortfolioModal(false)
    }

    function addPortfolioStatus(status) {
        if(status === "success") {
            dispatch(getPortfolios({ username })).then(res => setPortfolios(res))
            setPortfolioSuccess(true)
            setTimeout(() => { setPortfolioSuccess(false)}, 2500);
        }
        else {
            setPortfolioError(true)
            setTimeout(() => { setPortfolioError(false)}, 2500);
        }
    }

    function setFavStatus(status) {
        if(status === "success") {
            dispatch(getPortfolios({ username })).then(res => setPortfolios(res))
            setFavSuccess(true)
            setTimeout(() => { setFavSuccess(false)}, 2500);
        }
        else {
            setFavError(true)
            setTimeout(() => { setFavError(false)}, 2500);
        }
    }

    function setDeleteStatus(status) {
        if(status === "success") {
            dispatch(getPortfolios({ username })).then(res => setPortfolios(res))
            setDeleteSuccess(true)
            setTimeout(() => { setDeleteSuccess(false) }, 2500)
        }
        else {
            setDeleteError(true)
            setTimeout(() => { setDeleteError(false) }, 2500)
        }
    }

    return (
        <Layout>
            <Container className="portfolio_container">
                { /* Add portfolio */ }
                <Alert show={showPortfolioSuccess} variant="success" className="alert" as="Row">
                    <Alert.Heading className="heading">Add Porftolio</Alert.Heading>
                    Portfolio successfully added.
                </Alert>
                <Alert show={showPortfolioError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Add Porftolios</Alert.Heading>
                    An error occured while trying to add this portfolio.
                </Alert>
                { /* Favourite status change */ }
                <Alert show={favSuccess} variant="success" className="alert" as="Row">
                    <Alert.Heading className="heading">Change Porftolio Status</Alert.Heading>
                    Portfolio status successfully changed.
                </Alert>
                <Alert show={favError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Change Porftolio Status</Alert.Heading>
                    An error occured while trying to change porftolio status.
                </Alert>
                { /* Delete portfolio */ }
                <Alert show={deleteSuccess} variant="success" className="alert" as="Row">
                    <Alert.Heading className="heading">Delete Porftolio</Alert.Heading>
                    Portfolio deleted successfully.
                </Alert>
                <Alert show={deleteError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Delete Porftolio</Alert.Heading>
                    An error occured while trying to delete porftolio.
                </Alert>
                <Button variant="primary" className="portfolio-btn" onClick={() => setPortfolioModal(true)}>
                    Add new portfolio
                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                        <BiWallet />
                    </IconContext.Provider> 
                </Button>

                {
                    portfolios === undefined? null :
                    portfolios.map(portfolio => 
                        <Portfolio 
                            key={portfolio.p_id} 
                            portfolio = { portfolio } 
                            setFavStatus={setFavStatus} 
                            setDeleteStatus={setDeleteStatus}   
                        />
                    ) 
                }
            </Container>
            <PortfolioModal 
                show={showPortfolioModal}
                username={username}
                closeModal={closePortfolioModal}
                setPortfolioStatus={addPortfolioStatus}
            />
        </Layout>
    )
}

export default Portfolios;