import React from 'react'
import './Statistics.scss'

// Components
import Layout from '../layout/Layout'
import ExpenseByCategory from './ExpenseByCategory'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

function Statistics() {
    return (
        <Layout>
            <Container className="statistics-container">
                <Row className="expense-by-category-row">
                    <ExpenseByCategory/>
                </Row>
            </Container>
        </Layout>
    )
}

export default Statistics;

/* <Row className="buttons-row">
    <Col className="expense-col">
        <Button variant="secondary">
            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' } }}>
                <AiOutlinePlusCircle />
            </IconContext.Provider> 
            Expense Category
        </Button>
    </Col>
    <Col className="source-col">
        <Button variant="primary">
            <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' } }}>
                <AiOutlinePlusCircle />
            </IconContext.Provider> 
            Income Source
        </Button>
    </Col>
</Row> */

// .buttons-row {
//     .expense-col, .source-col {
//         .btn {
//             border-radius: 20px;
//             width: 100%;
//             font-size: 14px;
//         }
//     }
// }