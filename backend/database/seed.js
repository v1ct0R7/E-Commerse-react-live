import "dotenv/config";
import bcrypt from "bcrypt";
import { copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool, { connectDB } from "../config/database.js";
import { uploadsDir } from "../config/uploads.js";

// Mbush databazen me menune fillestare dhe (opsionalisht) krijon nje administrator.
// Perdorimi:  npm run seed
// Fotot kopjohen nga food-del/src/assets/frontend_assets ne backend/uploads.

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = process.env.SEED_IMAGES_DIR || path.resolve(currentDir, "../../food-del/src/assets/frontend_assets");
const description = "Food provides essential nutrients for overall health and well-being";

const foods = [
    { name: "Greek salad", price: 12, category: "Salad", image: "food_1.png" },
    { name: "Veg salad", price: 18, category: "Salad", image: "food_2.png" },
    { name: "Clover Salad", price: 16, category: "Salad", image: "food_3.png" },
    { name: "Chicken Salad", price: 24, category: "Salad", image: "food_4.png" },
    { name: "Lasagna Rolls", price: 14, category: "Rolls", image: "food_5.png" },
    { name: "Peri Peri Rolls", price: 12, category: "Rolls", image: "food_6.png" },
    { name: "Chicken Rolls", price: 20, category: "Rolls", image: "food_7.png" },
    { name: "Veg Rolls", price: 15, category: "Rolls", image: "food_8.png" },
    { name: "Ripple Ice Cream", price: 14, category: "Deserts", image: "food_9.png" },
    { name: "Fruit Ice Cream", price: 22, category: "Deserts", image: "food_10.png" },
    { name: "Jar Ice Cream", price: 10, category: "Deserts", image: "food_11.png" },
    { name: "Vanilla Ice Cream", price: 12, category: "Deserts", image: "food_12.png" },
    { name: "Chicken Sandwich", price: 12, category: "Sandwich", image: "food_13.png" },
    { name: "Vegan Sandwich", price: 18, category: "Sandwich", image: "food_14.png" },
    { name: "Grilled Sandwich", price: 16, category: "Sandwich", image: "food_15.png" },
    { name: "Bread Sandwich", price: 24, category: "Sandwich", image: "food_16.png" },
    { name: "Cup Cake", price: 14, category: "Cake", image: "food_17.png" },
    { name: "Vegan Cake", price: 12, category: "Cake", image: "food_18.png" },
    { name: "Butterscotch Cake", price: 20, category: "Cake", image: "food_19.png" },
    { name: "Sliced Cake", price: 15, category: "Cake", image: "food_20.png" },
    { name: "Garlic Mushroom ", price: 14, category: "Pure Veg", image: "food_21.png" },
    { name: "Fried Cauliflower", price: 22, category: "Pure Veg", image: "food_22.png" },
    { name: "Mix Veg Pulao", price: 10, category: "Pure Veg", image: "food_23.png" },
    { name: "Rice Zucchini", price: 12, category: "Pure Veg", image: "food_24.png" },
    { name: "Cheese Pasta", price: 12, category: "Pasta", image: "food_25.png" },
    { name: "Tomato Pasta", price: 18, category: "Pasta", image: "food_26.png" },
    { name: "Creamy Pasta", price: 16, category: "Pasta", image: "food_27.png" },
    { name: "Chicken Pasta", price: 24, category: "Pasta", image: "food_28.png" },
    { name: "Buttter Noodles", price: 14, category: "Noodles", image: "food_29.png" },
    { name: "Veg Noodles", price: 12, category: "Noodles", image: "food_30.png" },
    { name: "Somen Noodles", price: 20, category: "Noodles", image: "food_31.png" },
    { name: "Cooked Noodles", price: 15, category: "Noodles", image: "food_32.png" },
];

const seedFoods = async () => {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM foods");
    if (rows[0].total > 0) {
        console.log(`Menu already has ${rows[0].total} items, skipping food seed`);
        return;
    }
    let added = 0;
    for (const food of foods) {
        const source = path.join(imagesDir, food.image);
        try {
            await access(source);
        } catch {
            console.warn(`Image not found, skipping ${food.name}: ${source}`);
            continue;
        }
        const fileName = `seed_${food.image}`;
        await copyFile(source, path.join(uploadsDir, fileName));
        await pool.query(
            "INSERT INTO foods (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
            [food.name, description, food.price, fileName, food.category]
        );
        added++;
    }
    console.log(`Added ${added} menu items`);
};

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin account");
        return;
    }
    if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')
         AS incoming
         ON DUPLICATE KEY UPDATE role = 'admin', password = incoming.password`,
        ["Administrator", email, hashedPassword]
    );
    console.log(`Admin account ready: ${email}`);
};

try {
    await connectDB();
    await seedFoods();
    await seedAdmin();
} catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
