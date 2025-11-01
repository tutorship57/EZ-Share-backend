const {PrismaClient} = require('../generated/prisma')
const prisma = new PrismaClient()


const createMenu = async (req,res) =>{
    const {menu_name,amount}= req.body 
    const meal_id = req.params.mealId
    console.log(meal_id)
    try {
        const newMenu = await prisma.menu.create({
            data:{menu_name,amount,meal_id}
        })
        return res.status(200).json({ newMenu, message: "Menu added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message})
    }
}

const getAllMenu = async(req,res)=>{
    const meal_Id = req.params.mealId
    try {
        const menuList = await prisma.menu.findMany({
            where:{meal_id:meal_Id}
        })
        res.status(200).json({menuList})
    } catch (error) {
        console.error("Error fetching trip guests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createMenu,
    getAllMenu
}