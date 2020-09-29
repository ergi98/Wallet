import React from 'react'

// Bootstrap
import Spinner from 'react-bootstrap/esm/Spinner'

function InlineLoading() {
    return ( <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> )
}

export default InlineLoading
