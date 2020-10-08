import React, { useState } from 'react'
import './Information.scss'

// Components
import PortfolioModal from '../../portfolios/modals/PortfolioModal'
import SignupPortfolio from './portfolio/SignupPortfolio'

// Icons
import { IconContext } from "react-icons"
import { BiPlus } from 'react-icons/bi'

// Bootstrap
import Button from 'react-bootstrap/esm/Button'

function PortfolioInformation(props) {

    const [showPortfolioModal, setPortfolioModal] = useState(false)
    const [portfolios, setPortfolios] = useState(props.info.portfolios || [])

    function setPortfolio(portfolio) {
        setPortfolios(prevState => {
            prevState.unshift(portfolio)
            return prevState
        })
    }

    function deletePortfolio(portfolio) {
        setPortfolios(prevState => {
            return prevState.filter(tmp => { return tmp.p_id !== portfolio.p_id  })
        })
    }

    function handleSubmit() {
        props.saveInfo({portfolios:portfolios})
        props.increment()
    }

    return (
        <div className="form-row">
            <section className="info">
                <label className="section-title">Portfolios</label>
                <label className="section-subtitle">
                    Enter information about the portofolios you have. 
                    Portfolios can be any place you use to store money.
                </label>
            </section>
            <Button variant="primary" className="portfolio-plus-btn" onClick={() => setPortfolioModal(true)}>
                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '-5px' } }}>
                    <BiPlus />
                </IconContext.Provider> 
            </Button>
            <div className="user-portfolios">
                {
                    portfolios === undefined? null :
                    portfolios.map(portfolio => 
                        <SignupPortfolio
                            key={portfolio.p_id}
                            portfolio={portfolio}
                            deletePortfolio={deletePortfolio}
                        />
                    )
                }
            </div>
            <div className="signup-buttons">
                <Button variant="secondary" onClick={props.decrement}> Back </Button>        
                <Button variant="primary" type="submit" onClick={handleSubmit}> Next </Button> 
            </div>
            <PortfolioModal 
                caller="signup-portfolio"
                show={showPortfolioModal}
                closeModal={() => setPortfolioModal(false)}
                setPortfolio={setPortfolio}
            />
        </div>
    )
}

export default React.memo(PortfolioInformation)
