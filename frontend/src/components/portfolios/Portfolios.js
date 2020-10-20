import React, { useState, useEffect, Suspense} from 'react'
import './Portfolios.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Alert from 'react-bootstrap/esm/Alert'
import Button from 'react-bootstrap/esm/Button'

// Redux
import { useSelector, useDispatch } from 'react-redux'

// Icons
import { IconContext } from "react-icons"
import { BiWallet, BiTransfer } from 'react-icons/bi'

// Actions
import { getPortfolios, updatePortfolios } from '../../redux/actions/userActions'

// Components
import Layout from '../layout/Layout'
import Loading from '../loaders/Loading'

const Portfolio = React.lazy(() => import('./Portfolio'))
const PortfolioModal = React.lazy(() => import('./modals/PortfolioModal'))
const TransferModal = React.lazy(() => import('./modals/TransferModal'))

function Portfolios() {

    const username = useSelector((state) => state.user.username)
    const jwt = useSelector((state) => state.user.jwt)
    const dispatch = useDispatch()

    const [portfolios, setPortfolios] = useState([])

    const [showPortfolioModal, setPortfolioModal] = useState(false)
    const [showPortfolioError, setPortfolioError] = useState(false)
    const [showPortfolioTransfer, setShowPortfolioTransfer] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const [favError, setFavError] = useState(false)
    const [deleteError, setDeleteError] = useState(false)
    const [transferError, setTransferError] = useState(false)

    useEffect(() => {
        let _isMounted = true

        _isMounted && dispatch(getPortfolios({ username, jwt })).then(res => { setPortfolios(res); setIsLoading(false)})

        return () => {
            // Clean up the subscription
            _isMounted = false
        };
        
    }, [username, jwt, dispatch])

    function closePortfolioModal() {
        setPortfolioModal(false)
    }

    function addPortfolioStatus(status, portfolio) {
        if(status === "success") {
            let temp = portfolios.concat()
            let amount = portfolio.amount
            delete portfolio.amount
            portfolio.amount = { $numberDecimal: amount }
            temp.push(portfolio)

            setPortfolios(temp)
            dispatch(updatePortfolios({ portfolios: temp }))
        }
        else {
            setPortfolioError(true)
            setTimeout(() => { setPortfolioError(false)}, 2500);
        }
    }

    function setTransferStatus(status, from, to, amount) {
        if(status === "success") {
            let temp = portfolios.map(portfolio => {
                if(portfolio.p_id === to){
                    let current = parseFloat(portfolio.amount.$numberDecimal)
                    current = current + parseFloat(amount)
                    portfolio.amount.$numberDecimal = current.toFixed(2).toString()
                }
                if(portfolio.p_id === from) {
                    let current = parseFloat(portfolio.amount.$numberDecimal)
                    current = current - parseFloat(amount)
                    portfolio.amount.$numberDecimal = current.toFixed(2).toString()
                }
                return portfolio
            })

            setPortfolios(temp)
            dispatch(updatePortfolios({ portfolios: temp }))
        }
        else {
            setTransferError(true)
            setTimeout(() => { setTransferError(false)}, 2500);
        }
    }

    function setFavStatus(status, portfolio) {
        if(status === "success") {
            let temp
            // If this is to be the new favourite portfolio
            if(portfolio.favourite) {
                // Unfavourite the previous portfolio
                temp = portfolios.map(tmp => {
                    // Favourite the new portfolio
                    if(tmp.p_id === portfolio.p_id)
                        tmp.favourite = portfolio.favourite
                    else if(tmp.p_id !== portfolio.p_id && tmp.favourite)
                        tmp.favourite = !tmp.favourite
                    return tmp
                })
            }
            // If you only need to remove the favourite status
            else {
                temp = portfolios.map(tmp => {
                    // Favourite the new portfolio
                    if(tmp.favourite)
                        tmp.favourite = !tmp.favourite 
                    return tmp
                })
            }
            setPortfolios(temp)
            dispatch(updatePortfolios({ portfolios: temp }))
        }
        else {
            setFavError(true)
            setTimeout(() => { setFavError(false)}, 2500);
        }
    }

    function setDeleteStatus(status, portfolio, transfer_id) {
        if(status === "success") {
            let temp

            // Deleting the portfolio
            temp = portfolios.filter(tmp => { return tmp.p_id !== portfolio.p_id  })

            // Transfering amount if a recieving portfolio is defined
            if(transfer_id !== "default") {
                let index = temp.findIndex(tmp => tmp.p_id === transfer_id)
                let currAmnt = parseInt(temp[index].amount.$numberDecimal)
                let addAmnt = parseInt(portfolio.amount.$numberDecimal)
                temp[index].amount.$numberDecimal = (currAmnt + addAmnt).toString()
            }

            setPortfolios(temp)
            dispatch(updatePortfolios({ portfolios: temp }))
        }
        else {
            setDeleteError(true)
            setTimeout(() => { setDeleteError(false) }, 2500)
        }
    }

    return (
        <Layout>
            <Container fluid className="portfolio_container">
                <Alert show={showPortfolioError} variant="danger" className="alert" as="Row">
                    An error occured while trying to add this portfolio.
                </Alert>
                <Alert show={favError} variant="danger" className="alert" as="Row">
                    An error occured while trying to change porftolio status.
                </Alert>
                <Alert show={deleteError} variant="danger" className="alert" as="Row">
                    An error occured while trying to delete porftolio.
                </Alert>
                <Alert show={transferError} variant="danger" className="alert" as="Row">
                    An error occured while trying to transfer amount.
                </Alert>
                <div className="container portfolio-btn-holder">
                    <Button variant="primary" className="portfolio-btn" onClick={() => setPortfolioModal(true)}>
                        New Portfolio
                        <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                            <BiWallet />
                        </IconContext.Provider> 
                    </Button>
                    <Button variant="secondary" className="portfolio-btn" onClick={() => setShowPortfolioTransfer(true)}>
                        Transfer
                        <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                            <BiTransfer />
                        </IconContext.Provider> 
                    </Button>
                </div>
                <Suspense fallback={<Loading/>}>
                    {
                        portfolios.length >= 1 && !isLoading? 
                            portfolios.map(portfolio => 
                                <Portfolio  
                                    key={portfolio.p_id}
                                    portfolio = { portfolio } 
                                    setFavStatus={setFavStatus} 
                                    setDeleteStatus={setDeleteStatus}   
                                />
                            ) 
                            :
                            null
                    }
                </Suspense>
                {
                    portfolios.length < 1 && !isLoading?
                    <div className="no-transactions">
                        <label className="title-label">You have no portfolios!</label><br/>
                        <label className="sub-label">Insert a new portfolio by clicking the button above. Without a portfolio you can not record a spending or an earning!</label>
                    </div> : null
                }
                { isLoading? <Loading/> : null }
            </Container>
            
            <Suspense fallback={""}>
                <PortfolioModal 
                    caller="portfolio"
                    show={showPortfolioModal}
                    username={username}
                    closeModal={closePortfolioModal}
                    setPortfolioStatus={addPortfolioStatus}
                />
            </Suspense>
            <Suspense fallback={""}>
                <TransferModal
                    show={showPortfolioTransfer}
                    username={username}
                    closeModal={() => setShowPortfolioTransfer(false)}
                    setTransferStatus={setTransferStatus}
                    portfolios = {portfolios}
                />
            </Suspense>
        </Layout>
    )
}

export default Portfolios;