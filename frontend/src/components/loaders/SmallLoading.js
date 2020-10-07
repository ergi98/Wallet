import React from 'react'

// Bootstrap
import Spinner from 'react-bootstrap/esm/Spinner'

function SmallLoading() {
    return (
        <label style={{margin:"0 auto", width:"fit-content"}}>
             <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
        </label>
    )
}

export default SmallLoading
