import React from 'react'

import './FinishedView.scss'

const FinishedView = function() : React.ReactElement {

  return (
    <div className='finished-view'>
      <h1>Dankeschön!</h1>
      <p className="block">
        Danke, dass du uns gezeigt hast was du gut findest und dir auf dem Spielplatz wünschst.<br/>
        Wenn viele Kinder uns sagen, was sie gerne wollen, können wir einen besseren Spielplatz für euch bauen. Also erzähle deinen Freunden und Nachbarn von dem Spiel!
      </p>
    </div>
  )
}

export { FinishedView }
