import { loadEnvFile } from "process";
import foodModel from "../models/foodModel.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "../config/uploads.js";
import mongoose from "mongoose";

// add food item

const addFood = async (req, res) => {
    const name = req.body.name?.trim();
    const description = req.body.description?.trim();
    const category = req.body.category?.trim();
    const price = Number(req.body.price);
    if (!req.file || !name || !description || !category || !Number.isFinite(price) || price <= 0) {
        if (req.file) await unlink(req.file.path).catch((error) => console.error("Unable to remove rejected upload:", error));
        return res.status(400).json({ success: false, message: "Name, description, category, positive price and image are required" });
    }
    try {
        await foodModel.create({
            name,
            description,
            price: Math.round(price * 100) / 100,
            category,
            image: req.file.filename,
        });
        res.status(201).json({ success: true, message: "Food added" })
    } catch (error) {
        await unlink(req.file.path).catch((unlinkError) => console.error("Unable to remove failed upload:", unlinkError));
        console.error(error)
        res.status(500).json({ success: false, message: "Unable to add food" })
    }

}

// all food list

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load food" })
    }
}

// remove food item

const removeFood = async (req, res) => {
    try {
        const id = req.body.id;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Valid food id is required" });
        const food = await foodModel.findById(id)
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }
        await foodModel.findByIdAndDelete(id);
        try {
            await unlink(path.join(uploadsDir, path.basename(food.image)));
        } catch (error) {
            if (error.code !== "ENOENT") console.error("Unable to remove food image:", error);
        }
        res.json({ success: true, message: "Food removed" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to remove food" })
    }
}

export { addFood, listFood, removeFood }