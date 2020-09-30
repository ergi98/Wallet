import React from 'react'
import './TransactionList.scss'

// Axios
import axios from 'axios'

// Components
import Card from '../card/Card'
import Loading from '../statistics/income-vs-expense/Loading'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'

// Redux 
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Number Format
import NumberFormat from 'react-number-format'

class TransactionList extends React.Component {

    constructor() {
        super()

        this._isMounted = false

        this.state = {
            transactions : [],
            isLoading: true
        }
    }

    componentDidMount() {
        this._isMounted = true
        // Get todays transactions
        this._isMounted && this.getTransactions(new Date().toLocaleDateString('en-GB'))
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getTransactions(date) {
        try {
            let res = await axios.post('/transactions/list', { username: this.props.username, date })

            let transactions = res.data.result.length === 0? [] : res.data.result[0].transactions 

            this._isMounted && this.setState({
                transactions,
                isLoading: false
            })
            
        }
        catch(err){
            console.log(err)
        }
    }

    async goToViewMore() {
        window.location = '/view-more'
    }

    render() {
        return (
            <Card title="Latest Transactions" hasButton={true} buttonTxt="View More ..." btnAction={this.goToViewMore}>
                <Container className="list-container">
                    {
                        this.state.transactions.length >= 1 && !this.state.isLoading?
                        <Table responsive striped className="list-table">
                            <thead>
                                <tr className="headers-row">
                                    <th>Time</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.transactions.map(transaction => 
                                        <tr key={transaction.trans_id}> 
                                            <td>{transaction.time}</td>
                                            <td>{transaction.short_desc}</td>
                                            { 
                                                transaction.amount.$numberDecimal > 0?
                                                    <td className="earning">
                                                        <NumberFormat 
                                                            value={transaction.amount.$numberDecimal}
                                                            displayType={'text'} 
                                                            thousandSeparator={true} 
                                                            prefix={'+ ' + transaction.currency + ' ' } 
                                                        />
                                                    </td>
                                                    :
                                                    <td className="spending">
                                                        <NumberFormat 
                                                            value={transaction.amount.$numberDecimal}
                                                            displayType={'text'} 
                                                            thousandSeparator={true} 
                                                            prefix={' ' + transaction.currency + ' ' } 
                                                        />
                                                    </td>
                                            }
                                        </tr>
                                    )
                                
                                }
                            </tbody>
                        </Table> : null
                    }
                    {
                        this.state.transactions.length < 1 && !this.state.isLoading?
                        <div className="no-transactions">
                            <label className="title-label">You have not made any transactions today!</label><br/>
                            <label className="sub-label">Insert a new transaction by clicking one of the buttons above.</label>
                        </div> : null
                    }
                    { this.state.isLoading? <Loading/> : null }
                </Container>
            </Card>
        )
    }
}


const mapPropsToState = state => ({
    username: state.user.username
})

TransactionList.propTypes = {
    username: PropTypes.string.isRequired
}

export default connect(mapPropsToState, null)(TransactionList)