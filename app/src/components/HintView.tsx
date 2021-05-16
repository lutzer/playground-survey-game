import React, { useState } from 'react'

import './HintView.scss'
import grassIcon from './../assets/images/icon_tile_grass.png'
import emptyIcon from './../assets/images/icon_tile_empty.png'
import closeIcon from './../assets/images/close.png'

const hints : {text: string, img?: string }[] = [
  { text: 'Hey, ich habe hier ein paar Tips für dich, wie du deinen Spielpatz baust. Klicke einfach auf Weiter.' },
  { text: 'Du darfst 6 Sachen aussuchen, die du gerne auf einem Spielplatz haben willst und uns so zeigen, was dir wichtig ist.'},
  { text: 'Wenn du auf ein leeres Feld klickst, kannst du dort etwas bauen.', img: grassIcon},
  { text: 'Wenn du auf ein bebautes Feld klickst, kannst du es entfernen oder zu etwas Anderem ändern.', img: emptyIcon},
  { text: 'Die Wasser-, Baum- und Aleefelder lassen sich nicht verändern.'},
  { text: 'Du kannst die Ansicht drehen und näher heranzoomen. Wenn du zufrieden bist, drücke oben rechts auf Fertig.'}
]

const HintView = function({onClose, avatar} : { onClose?: () => void, avatar: string}) : React.ReactElement {
  
  const [ hintIndex, setHintIndex] = useState(0)

  function onNextClicked() {
    setHintIndex(hintIndex + 1)
  }

  function onBackClicked() {
    setHintIndex(hintIndex - 1)
  }

  return (
    <div className="hint-view">
      { onClose && 
        <div className="close-button" key="close" onClick={onClose}>
          <img src={closeIcon}></img>
        </div>
      }
      {hints[hintIndex].text}
      { hints[hintIndex].img && <span className="image"><img src={hints[hintIndex].img}/></span> }
      <div className='buttons'>
        <button disabled={hintIndex < 1} onClick={onBackClicked}>Zurück</button>
        <button disabled={hintIndex > hints.length -2} onClick={onNextClicked}>Weiter</button>
      </div>
      <div className="floating-image"><img src={avatar}/></div>
    </div>
  )
}

export { HintView }
