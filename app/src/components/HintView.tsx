import React, { useEffect, useState } from 'react'

import './HintView.scss'
import grassIcon from './../assets/images/icon_tile_grass.png'
import emptyIcon from './../assets/images/icon_tile_empty.png'
import closeIcon from './../assets/images/close.png'
import fertigIcon from './../assets/images/fertig.png'

const hints : {text: string, img?: string }[] = [
  { text: 'Hey, ich habe hier ein paar Tips für dich, wie du deinen Spielpatz baust. Klicke einfach auf Weiter.' },
  { text: 'Suche dir 6 Dinge aus, die du gerne auf einem Spielplatz haben willst. Klicke auf ein leeres Feld um dort etwas zu bauen.', img: grassIcon},
  { text: 'Wenn du auf ein bebautes Feld klickst, kannst du es entfernen oder zu etwas Anderem ändern. Baum-, Allee- und Wasserfelder lassen sich nicht verändern.', img: emptyIcon},
  { text: 'Du kannst die Ansicht drehen und näher heranzoomen. Wenn du zufrieden bist, drücke oben rechts auf Fertig.', img: fertigIcon}
]

const HintView = function({onClose, avatar, startHint = 0} : { onClose?: () => void, avatar: string, startHint? : number}) : React.ReactElement {
  
  const [ hintIndex, setHintIndex] = useState(0)

  useEffect(() => {
    setHintIndex(startHint)
  },[startHint])

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
