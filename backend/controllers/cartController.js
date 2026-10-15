import userModel from "../models/userModel.js"


// add items to user cart

const addToCart = async (req, res) => {

    try {
        let userData = await userModel.findById(req.body.userId)
        let cadData = await userData.cadData;
        if (!cadData[req.body.itemId]) {
            cadData[req.body.itemId] = 1
        }
        else {
            cadData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cadData });
        res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//remove items from user cart

const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cadData = await userData.cadData
        if (cadData[req.body.itemId] > 0) {
            cadData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cadData })
        res.json({ success: true, message: "Removed from cart" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }

}

//fetch user cart data

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cadData = await userData.cadData;
        res.json({success:true,cadData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

export {
    addToCart,
    removeFromCart,
    getCart
}