import React from 'react';
import './Home.scss'
import Layout from '../layout/Layout';

// Components
import TodaySpendings from './TodaySpendings'
import TransactionList from './TransactionList'

// Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/esm/Container';

// Icons
import { IconContext } from "react-icons"
import { RiAddCircleLine } from 'react-icons/ri'

class Home extends React.Component {
    render() {
        return (
            <Layout>
                <Container className="home-container">
                    <TodaySpendings></TodaySpendings>
                    <Container className="btn-container">
                        <Button variant="primary" className="transaction-btn">
                            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px' } }}>
                                <RiAddCircleLine/>
                            </IconContext.Provider>
                            New Transaction
                        </Button>
                    </Container>
                    <TransactionList></TransactionList>
                </Container>
            </Layout>
        )
    }
}

export default Home;