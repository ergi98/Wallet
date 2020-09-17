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

// Axios
import axios from 'axios'

// Redux
import { useSelector } from 'react-redux'

// Icons
import { IconContext } from "react-icons"
import { BiWallet } from 'react-icons/bi'

function Portfolios() {

    const username = useSelector((state) => state.user.username)
    const [portfolios, setPortfolios] = useState([])
    const [displayError, setError] = useState(false)

    const [showPortfolioModal, setPortfolioModal] = useState(false)
    const [showPortfolioError, setPortfolioError] = useState(false)
    const [showPortfolioSuccess, setPortfolioSuccess] = useState(false)

    const [favSuccess, setFavSuccess] = useState(false)
    const [favError, setFavError] = useState(false)

    useEffect(() => {
        let _isMounted = true;
        async function getPortfolios() {
            try {
                let res = await axios.post('/users/portfolios', { username })

                if(res.data.result.length > 0)
                    _isMounted && setPortfolios(res.data.result[0].portfolios)
            }
            catch(err) {
                _isMounted && setError(true)

                setTimeout(() => {
                    _isMounted && setError(false)
                }, 2500);
            }
        }
        _isMounted && getPortfolios()

        return () => {
            // Clean up the subscription
            _isMounted = false
        };
        
    }, [username])

    function closePortfolioModal() {
        setPortfolioModal(false)
    }

    function addPortfolioStatus(status) {
        if(status === "success") {
            // To invoke a refetch from the database without refreshing
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
            // To invoke a refetch from the database without refreshing
            setFavSuccess(true)
            setTimeout(() => { setFavSuccess(false)}, 2500);
        }
        else {
            setFavError(true)
            setTimeout(() => { setFavError(false)}, 2500);
        }
    }

    return (
        <Layout>
            <Container className="portfolio_container">
                <Alert show={displayError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Display Porftolios</Alert.Heading>
                    An error occured while trying to get this users portfolios.
                </Alert>
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
                <Button variant="primary" className="portfolio-btn" onClick={() => setPortfolioModal(true)}>
                    Add new portfolio
                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                        <BiWallet />
                    </IconContext.Provider> 
                </Button>

                { portfolios.map(portfolio => <Portfolio key={portfolio.p_id} portfolio = { portfolio } setFavStatus={setFavStatus}/>) }
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