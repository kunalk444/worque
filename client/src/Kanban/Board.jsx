import React from 'react'
import Columns from './Columns'

function Board() {
  return (
    <div className='board'>
        <Columns type="today" />
        <Columns type="this week" />
        <Columns type="later" />
    </div>
  )
}

export default Board