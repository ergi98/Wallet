import React, { useState } from 'react'

// Bootstrap
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

// Icons
import { IconContext } from "react-icons"
import { BiPlus } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'

// NanoID
import { nanoid } from 'nanoid'

function SourcesInformation(props) {
    const [newSource, setNewSource] = useState('')
    const [sources, setSources] = useState(
        props.info.sources ||
        [
            { source_id: nanoid(10), source_name: "Family", count: 0, amount_earned: 0, last_spent: null }, 
            { source_id: nanoid(10), source_name: "Job", count: 0, amount_earned: 0, last_spent: null },
            { source_id: nanoid(10), source_name: "Investments", count: 0, amount_earned: 0, last_spent: null },
            { source_id: nanoid(10), source_name: "Tenants", count: 0, amount_earned: 0, last_spent: null },
        ]
    )

    function addSource() {
        if(newSource !== '') {
            let tempSrc = {
                source_id: nanoid(10), 
                source_name: newSource, 
                count: 0,
                amount_earned: 0, 
                last_spent: null
            }
            
            let temp = sources
            temp.unshift(tempSrc)
            setSources(temp)
            setNewSource('')
        }
    }

    function deleteSource(source) {
        let temp = sources
        temp = temp.filter(tmp => { return tmp.source_id !== source.source_id  })
        setSources(temp)
    }

    
    function handleSubmit() {
        props.saveInfo({sources: sources})
        props.signup()
    }

    return (
        <div className="form-row">
            <section className="info">
                <label className="section-title">Sources</label>
                <label className="section-subtitle">
                    Enter your current sources of income.
                    By default you have the following added.
                </label>
            </section>
            <div className="add-category">
                <Form.Group>
                    <Form.Label className="form-label">Source</Form.Label>
                    <Form.Control
                        className="input-field"
                        type="string"
                        placeholder="Enter Source"
                        onChange={(event) => setNewSource(event.target.value)}
                    />
                    <Form.Control.Feedback type="invalid"> Please provide a valid source. </Form.Control.Feedback> 
                </Form.Group>
                <Button variant="primary" className="portfolio-plus-btn" onClick={addSource}>
                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '-5px', marginTop: '6px' } }}>
                        <BiPlus />
                    </IconContext.Provider> 
                </Button>
            </div>
            <div className="user-categories">
                {
                    sources.map(source => 
                        <section key={source.source_id}>
                            <label>{source.source_name}</label>
                            <Button variant="link" className="delete-btn" onClick={() => deleteSource(source)}>
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
                <Button variant="success" type="submit" onClick={handleSubmit}> Finish </Button> 
            </div>
        </div>
    )
}

export default SourcesInformation
