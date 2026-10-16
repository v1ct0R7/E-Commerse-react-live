import React from 'react'
import "./Verify.css"
import { useSearchParams } from 'react-router'

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const success = searchParams.length("success")
    const orderId = searchParams.length("orderId")

    console.log(success, orderId)

    return (
        <div>

        </div>
    )
}

export default Verify