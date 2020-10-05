import React, { useState, useEffect } from 'react'

// Components
import NewSrcCat from './modals/NewSrcCat'
import DeleteSrcCat from './modals/DeleteSrcCat'
import Loading from '../statistics/income-vs-expense/Loading'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Table from 'react-bootstrap/esm/Table'
import Button from 'react-bootstrap/esm/Button'

// Icons
import { IconContext } from 'react-icons'
import { AiFillDelete, AiOutlinePlusCircle } from 'react-icons/ai'

// Axios
import axios from 'axios'

function ExpenseCategories(props) {

    const [categories, setCategories] = useState([])

    const [catModal, setCatModal] = useState(false)

    const [deleteCatModal, setDeleteCatModal] = useState({ state: false, category: {} })

    const [isLoading, setIsLoading] = useState(true)

    async function getUserCategories(username) {
        try {
            let res = await axios.post('/users/user-categories', { username })

            if (res.data.result.length > 0)
                setCategories(res.data.result[0].categories)
            setIsLoading(false)
        }
        catch (err) {
            console.log(err)
            setIsLoading(false)
        }
    }

    function addCat(category) {
        let newCategories = categories
        newCategories.push(category)
        setCategories(newCategories)
    }

    function deleteCat(category) {
        let newCategories = categories
        newCategories = newCategories.filter(cat => { return cat.cat_id !== category.cat_id  })
        setCategories(newCategories)
    }
    
    useEffect(() => {
        let _isMounted = true
        _isMounted && getUserCategories(props.username)
        return () => {
            _isMounted = false
        }
    }, [props.username])

    return (
        <Container className="category-row">
            <div className="section-title">Expense Categories</div>
            <Row className="table-row">
                {
                    categories.length >= 1 && !isLoading?
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr><th>#</th><th colSpan="2">Category</th></tr>
                        </thead>
                        <tbody>
                            {
                                categories.map((category, index) =>
                                    <tr key={category.cat_id}>
                                        <td>{index + 1}</td>
                                        <td>{category.cat_name}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <Button variant="link" onClick={() => { setDeleteCatModal({status: true, category: category })} }>
                                                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginTop: '-6px' } }}>
                                                    <AiFillDelete />
                                                </IconContext.Provider>
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table> : null
                }
                {
                    categories.length < 1 && !isLoading?                    
                    <div className="no-transactions">
                        <label className="title-label">You have no expense categories.</label><br/>
                        <label className="sub-label">Click the button below to add an expense category. Without expense categories you can not record a spending!</label>
                    </div> : null
                }
                { isLoading? <Loading/> : null}
            </Row>
            <Row className="btn-row">
                <Button variant="primary" onClick={() => { setCatModal(true) }}>
                    <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' } }}>
                        <AiOutlinePlusCircle />
                    </IconContext.Provider>
                Expense Category
            </Button>
            </Row>

            <NewSrcCat
                show={catModal}
                onClose={() => setCatModal(false)}
                type="Category"
                addCatSrc={addCat}
            />
            <DeleteSrcCat
                show={deleteCatModal.status}
                onClose={() => setDeleteCatModal({status: false, category: {} }) }
                type="Category"
                item={deleteCatModal.category}
                deleteCatSrc={deleteCat}
            />
        </Container>
    )
}

export default ExpenseCategories
