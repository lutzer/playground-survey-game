import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import './ImpressumView.scss'

import lighttowerImg from './../assets/images/lighttower.png'

const ImpressumView = function() : React.ReactElement {
  const history = useHistory()

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className='impressum-view'>
      <h1>Impressum</h1>
      <div className="image"><img src={lighttowerImg}/></div>
      <p className="block">
        <h2>Auftraggeber des Projektes</h2>

        <span className="paragraph">
          Diakonisches Werk Berlin Stadtmitte e.V.<br/>
          Geschäftsstelle, Wilhelmstraße 115, 10963 Berlin
        </span>

        <span className="paragraph">
          geschaeftsstelle@diakonie.de<br/>
          <a href="https://www.diakonie-stadtmitte.de">www.diakonie-stadtmitte.de</a><br/>
        </span>

        <span className="paragraph">
        Geschäftsführung: Monika Lüke
        </span>

        <span className="paragraph">
        Design und Implementierung: <br/> 
        Sidra Ashraf: <a href="https://www.sidra-ashraf.com/">www.sidra-ashraf.com</a><br/>
        Lutz Reiter: <a href="http://www.lu-re.de/">www.lu-re.de</a>
        </span>
      </p>
      <div className="center" onClick={() => history.push('/')}><button>Zurück zum Spiel</button></div>
      
    </div>
  )
}

export { ImpressumView }
