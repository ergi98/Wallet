import React from 'react'
import './LoadingView.scss'
// Bootstrap
import Container from 'react-bootstrap/esm/Container'

class LoadingView extends React.Component {
    render() {
        return (
            <Container fluid className="loading">
                <h1>LOADING ...</h1>
            </Container>
        )
    }
}

export default LoadingView