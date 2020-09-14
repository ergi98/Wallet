import React, { useState, useEffect } from 'react'
import './Portfolios.scss'

// Components
import Layout from '../layout/Layout'
import Portfolio from './Portfolio'

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


    return (
        <Layout>
            <Container className="portfolio_container">
                <Alert show={displayError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Display Porftolios</Alert.Heading>
                    An error occured while trying to get this users portfolios.
                </Alert>
                <Button variant="primary" className="portfolio-btn">
                    Add new portfolio
                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                        <BiWallet />
                    </IconContext.Provider> 
                </Button>

                { portfolios.map(portfolio => <Portfolio key={portfolio.p_id} portfolio = { portfolio } />) }
            </Container>
        </Layout>
    )
}

export default Portfolios;