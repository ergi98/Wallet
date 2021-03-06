import React, { useState } from 'react'
import './Information.scss'

// Bootstrap
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'

// Icons
import { IconContext } from "react-icons"
import { BiPlus } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'

// NanoID
import { nanoid } from 'nanoid'

function CategoryInformation(props) {

    const [newCategory, setNewCategory] = useState('')
    const [catValid, setCatValid] = useState(false)
    const [categories, setCategories] = useState(
        props.info.categories ||
        [
            { cat_id: nanoid(10), cat_name: "Housing", count: 0, amnt_spent: 0, last_spent: null }, 
            { cat_id: nanoid(10), cat_name: "Transportation", count: 0, amnt_spent: 0, last_spent: null },
            { cat_id: nanoid(10), cat_name: "Food", count: 0, amnt_spent: 0, last_spent: null },
            { cat_id: nanoid(10), cat_name: "Utilities", count: 0, amnt_spent: 0, last_spent: null },
            { cat_id: nanoid(10), cat_name: "Healthcare", count: 0, amnt_spent: 0, last_spent: null },
            { cat_id: nanoid(10), cat_name: "Personal Care", count: 0, amnt_spent: 0, last_spent: null },
            { cat_id: nanoid(10), cat_name: "Entertainment", count: 0, amnt_spent: 0, last_spent: null },
            { cat_id: nanoid(10), cat_name: "Electronics", count: 0, amnt_spent: 0, last_spent: null },
        ]
    )

    function addCategory() {
        if(newCategory !== '') {
            let res = categories.findIndex(cat => cat.cat_name.toLowerCase() === newCategory.toLowerCase())

            // If this category doesnt already exist
            if(res === -1) {
                setCatValid(false)
                let tempCat = {
                    cat_id: nanoid(10), 
                    cat_name: newCategory, 
                    count: 0,
                    amnt_spent: 0, 
                    last_spent: null
                }
                let temp = categories
                temp.unshift(tempCat)
                setCategories(temp)
                setNewCategory('')
            }
            else
                setCatValid(true)
        }
    }

    function deleteCategory(category) {
        let temp = categories
        temp = temp.filter(tmp => { return tmp.cat_id !== category.cat_id  })
        setCategories(temp)
    }

    function handleSubmit() {
        props.saveInfo({categories: categories})
        props.increment()
    }

    return (
        <div className="form-row">
            <section className="info">
                <label className="section-title">Categories</label>
                <label className="section-subtitle">
                    Enter the categories you think are relevant to your spending habits.
                    By default you have the following added.
                </label>
            </section>
            <div className="add-category">
                <Form.Group className="category-form-group">
                    <Form.Label className="form-label">Category</Form.Label>
                    <Form.Control
                        className="input-field"
                        type="string"
                        placeholder="Enter Category"
                        value={newCategory}
                        onChange={(event) => setNewCategory(event.target.value)}
                        isInvalid={catValid}
                    />
                    <Form.Control.Feedback type="invalid"> Category already exists! </Form.Control.Feedback> 
                </Form.Group>
                <Button variant="primary" className="portfolio-plus-btn" onClick={addCategory}>
                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '-6px' } }}>
                        <BiPlus />
                    </IconContext.Provider> 
                </Button>
            </div>
            <div className="user-categories">
                {
                    categories.map(category => 
                        <section key={category.cat_id}>
                            <label>{category.cat_name}</label>
                            <Button variant="link" className="delete-btn" onClick={() => deleteCategory(category)}>
                                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginTop: '3px'} }}>
                                    <AiFillDelete/>
                                </IconContext.Provider>
                            </Button>
                        </section>
                    )
                }
            </div>
            <div className="signup-buttons">
                <Button variant="secondary" onClick={props.decrement}> Back </Button>        
                <Button variant="primary" type="submit" onClick={handleSubmit}> Next </Button> 
            </div>
        </div>
    )
}

export default React.memo(CategoryInformation)
