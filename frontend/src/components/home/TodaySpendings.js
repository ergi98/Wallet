import React from 'react'
import './TodaySpendings.scss'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'

class TodaySpendings extends React.Component {

    constructor() {
        super()

        this.state = {
            today_amount: 5000,
            yesterday_amount: 2500,
            compare: 0,
            currency: "ALL"
        }
    }

    componentDidMount() {
        console.log("hey")
        let comp = (this.state.today_amount - this.state.yesterday_amount) / this.state.yesterday_amount * 100
        console.log(comp)
        this.setState({
            compare: comp
        })
    }

    render() {
        return (
            <Card title="Todays Spending">
                <Container className="amount-container">
                    <section className="amount">{this.state.currency} {this.state.today_amount}</section>
                    {
                        this.state.compare > 0?
                        <section className="cmp overspend">+{this.state.compare}%</section>
                        :
                        <section className="cmp underspend">{this.state.compare}%</section>
                    }
                </Container>
            </Card>
        )
    }
}

export default TodaySpendings