import React from 'react'
import LoadingScreen from '../Assets/load.gif'

function Loading() {
    return (
        <div className="loading-container">
            <img src={LoadingScreen} />
            
        </div>
    )
}

export default Loading