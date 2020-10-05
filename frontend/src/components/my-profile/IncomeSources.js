import React, { useState, useEffect } from 'react'

// Components
import NewSrcCat from './modals/NewSrcCat'
import DeleteSrcCat from './modals/DeleteSrcCat'
import Loading from '../statistics/income-vs-expense/Loading'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Button from 'react-bootstrap/esm/Button'
import Table from 'react-bootstrap/esm/Table'

// Icons
import { IconContext } from 'react-icons'
import { AiFillDelete, AiOutlinePlusCircle } from 'react-icons/ai'

// Axios
import axios from 'axios'

function IncomeSources(props) {

    const [sources, setSources] = useState([])

    const [srcModal, setSrcModal] = useState(false)
    const [deleteSrcModal, setDeleteSrcModal] = useState({ state: false, source: {} })

    const [isLoading, setIsLoading] = useState(true)

    async function getUserSources(username) {
        try {
            let res = await axios.post('/users/user-sources', { username })

            if (res.data.result.length > 0)
                setSources(res.data.result[0].sources)
            setIsLoading(false)
        }
        catch (err) {
            console.log(err)
            setIsLoading(false)
        }
    }

    function addSrc(source) {
        let newSources = sources
        newSources.push(source)
        setSources(newSources)
    }

    function deleteSrc(source) {
        let newSources = sources
        newSources = newSources.filter(curr_source => { return curr_source.source_id !== source.source_id  })
        setSources(newSources)
    }
    
    
    useEffect(() => {
        let _isMounted = true
        _isMounted && getUserSources(props.username)
        return () => {
            _isMounted = false
        }
    }, [props.username])

    return (
        <Container className="source-row">
            <div className="section-title">Income Sources</div>
            <Row className="table-row">
                {
                    sources.length >= 1 && !isLoading? 
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr><th>#</th><th colSpan="2">Source</th></tr>
                        </thead>
                        <tbody>
                            {
                                sources.map((source, index) =>
                                    <tr key={source.source_id}>
                                        <td>{index + 1}</td>
                                        <td>{source.source_name}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <Button variant="link" onClick={() => { setDeleteSrcModal({status: true, source: source })} }>
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
                    sources.length < 1 && !isLoading?                    
                    <div className="no-transactions">
                        <label className="title-label">You have no income sources.</label><br/>
                        <label className="sub-label">Click the button below to add an income source. Without income sources you can not record a profit!</label>
                    </div> : null
                }
                { isLoading? <Loading/> : null}
            </Row>
            <Row className="btn-row">
                <Button variant="primary" onClick={() => { setSrcModal(true) }}>
                    <IconContext.Provider value={{ size: "20", style: { verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' } }}>
                        <AiOutlinePlusCircle />
                    </IconContext.Provider>
                Income Source
            </Button>
            </Row>

            <NewSrcCat
                show={srcModal}
                onClose={() => setSrcModal(false)}
                type="Source"
                addCatSrc={addSrc}
            />
            <DeleteSrcCat
                show={deleteSrcModal.status}
                onClose={() => setDeleteSrcModal({status: false, source: {} }) }
                type="Source"
                item={deleteSrcModal.source}
                deleteCatSrc={deleteSrc}
            />
        </Container>
    )
}

export default IncomeSources
