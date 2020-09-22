import React, { useState, useEffect } from 'react'
import './IncomeSources.scss'

// Components
import NewSrcCat from './modals/NewSrcCat'
import DeleteSrcCat from './modals/DeleteSrcCat'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

// Icons
import { IconContext } from 'react-icons'
import { AiFillDelete, AiOutlinePlusCircle } from 'react-icons/ai'

// Axios
import axios from 'axios'

function IncomeSources(props) {

    const [sources, setSources] = useState([])

    const [srcModal, setSrcModal] = useState(false)
    const [deleteSrcModal, setDeleteSrcModal] = useState({ state: false, source: {} })

    async function getUserSources(username) {
        try {
            let res = await axios.post('/users/user-sources', { username })

            if (res.data.result.length > 0)
                setSources(res.data.result[0].sources)
        }
        catch (err) {
            console.log(err)
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
                </Table>
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
