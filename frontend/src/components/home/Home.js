import React from 'react'
import './Home.scss'

// Components
import Layout from '../layout/Layout'
import TodayRecap from './TodayRecap'
import TransactionList from './TransactionList'

// Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/esm/Container'

// Icons
import { IconContext } from "react-icons"
import { RiAddCircleLine } from 'react-icons/ri'

class Home extends React.Component {

    render() {
        return (
            <Layout>
                <Container className="home-container">
                    <TodayRecap></TodayRecap>
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
                    <TransactionList></TransactionList>
                </Container>
            </Layout>
        )
    }
}

export default Home;