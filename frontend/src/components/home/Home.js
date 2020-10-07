import React, { Suspense } from 'react'
import './Home.scss'

// Icons
import { IconContext } from "react-icons"
import { RiAddCircleLine } from 'react-icons/ri'

// Bootstrap
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'

// Components
import Loading from '../loaders/Loading'
import Layout from '../layout/Layout'
const TodayRecap = React.lazy(() => import('./TodayRecap'))
const TransactionList = React.lazy(() => import('./TransactionList'))

class Home extends React.Component {

    render() {
        return (
            <Layout>
                <Container fluid className="home-container">
                    <Suspense fallback={<Loading/>}> <TodayRecap></TodayRecap> </Suspense>
                    <Container className="btn-container">
                        <Button variant="secondary" className="transaction-btn" onClick={() => { window.location = '/expense-transaction' }}>
                            <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-6px' } }}>
                                <RiAddCircleLine/>
                            </IconContext.Provider>
                            New Expense
                        </Button>
                        <Button variant="primary" className="transaction-btn" onClick={() => { window.location = '/profit-transaction'}}>
                            <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-6px' } }}>
                                <RiAddCircleLine/>
                            </IconContext.Provider>
                            New Income
                        </Button>
                    </Container>
                    <Suspense fallback={<Loading/>}> <TransactionList></TransactionList> </Suspense>
                </Container>
            </Layout>
        )
    }
}

export default Home;