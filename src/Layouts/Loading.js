import React from 'react'
import ReactLoading from "react-loading";

function Loading() {
    return (
        <div className="loading-screen">
            <ReactLoading type="spin" color="#2997ff"
                height={100} width={50} />
        </div>
    )
}

export default Loading