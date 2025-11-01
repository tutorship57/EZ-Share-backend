const { get } = require('http')
const {PrismaClient} = require('../generated/prisma')
const prisma = new PrismaClient()

const createMenuShare = async (req,res)=>{
    const { menuId,guestIds,amount,mealId} = req.body
    const amountPerEachPeople = amount / guestIds.length
    const prepareData = guestIds.map(guestId => ({
        menu_id: menuId,
        guest_id: guestId,
        amount: amountPerEachPeople,
        status: "pending",
        meal_id: mealId
    }))
    try {
        const newMenuShare = await prisma.menuShare.createMany({
            data: prepareData
        })
        res.status(201).json(newMenuShare)
    } catch (error) {
        console.error("Error creating menu share:", error)
        res.status(500).json({ error: "Failed to create menu share" })
    }
}

const getMenuShareInfo = async (req,res)=>{
    const { mealId } = req.params
    try {
        const getMenuShareInfo = await prisma.menuShare.findMany({
            where:{
                meal_id:mealId
            },
            include:{
                guest_table:{select:{guest_name:true,guest_id:true}},
                menu_table:{select:{menu_name:true,amount:true,menu_id:true}}
            },
            orderBy:{
                guest_table:{
                    guest_name:"asc"
                }
            }
        })
        console.log("Raw Menu Share Info:",getMenuShareInfo)

        const processedMenuShareInfo = getMenuShareInfo.reduce((acc, item) => {
            let meal = acc.find(m => m.meal_id === item.meal_id);
            let menu = meal?.menuItems.some(mi => mi.menu_id === item.menu_table.menu_id);
            let participant = meal?.participants.some(p => p.guest_id === item.guest_table.guest_id);
            let assignments = meal?.assignments[item.menu_table.menu_id] ;
            if(!meal){
                meal = {
                    meal_id:item.meal_id,
                    menuItems:[],
                    participants:[],
                    assignments:{}
                };
                acc.push(meal);
            }
            if(!menu){
                meal.menuItems.push({
                    menu_id: item.menu_table.menu_id,
                    menu_name: item.menu_table.menu_name,
                    amount: item.menu_table.amount
                });
            }
            if(!participant){
                meal.participants.push({
                    guest_id: item.guest_table.guest_id,
                    guest_name: item.guest_table.guest_name
                });
            }
            if(!assignments){
                meal.assignments[item.menu_table.menu_id] = [];   
            }
            meal.assignments[item.menu_table.menu_id].push(
                    item.guest_table.guest_id
            );
            return acc;
        },[]);
        
        console.log("MenuInfoFinalResult Cleaning",JSON.stringify(processedMenuShareInfo, null, 2))




        res.status(200).json({menuShareInfo:processedMenuShareInfo})
    } catch (err){
        console.error("Error fetching menu share info:", err)
        res.status(500).json({ error: "Failed to fetch menu share info" })
    }
}



module.exports = {
    createMenuShare,
    getMenuShareInfo
}