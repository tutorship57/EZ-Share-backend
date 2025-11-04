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

const editMenuShare = async (req,res)=>{
    const { menuId, guestIds,amount,mealId} = req.body
    
    const deleteExistingMenuShare = await prisma.menuShare.deleteMany({
        where:{
            menu_id:menuId,
            meal_id:mealId
        }
    })
    if(!deleteExistingMenuShare){
        return res.status(400).json({ error: "Menu does not Exists !" })
    }

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
    return res.status(200).json({MenuShareExists})
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

const getParticipantSummary = async (req,res)=>{
    const { mealId } = req.params
    try {
        
        const participantSummary = await prisma.menuShare.findMany({
            select:{
                guest_id:true,
                guest_table:{
                    select:{
                        guest_name:true
                    }
                },
                menu_id:true,
                menu_table:{
                    select:{
                        menu_name:true
                    }
                },
                amount:true,
                meal_id:true
            },
            where:{
                meal_id:mealId
            },
            
        })
        console.log ("Participant Summary",participantSummary)
        const ProcessParticipantSummary = participantSummary.reduce((acc,item)=>{
            let participant = acc.find(p=>p.guest.guest_id === item.guest_id);
            console.log(participant)
            let menu = participant?.menuItems.some(mi=>mi.menu_id === item.menu_id);
            if(!participant){
                participant = {
                    guest: {
                        guest_id : item.guest_id,
                        name : item.guest_table.guest_name
                    },
                    menuItems : [],
                    total:0
                }
                acc.push(participant);
            }
            if(!menu){
                participant.menuItems.push({
                    menu_id:item.menu_id,
                    menu_name:item.menu_table.menu_name,
                    amount:item.amount
                })
            }
            participant.total += item.amount;
            return acc;
        },[])
        res.status(200).json({participantSummarySplit:ProcessParticipantSummary})
    }catch(err){
        console.error("Error fetching participant summary:", err)
        res.status(500).json({ error: "Failed to fetch participant summary" })
    }

    

}


module.exports = {
    createMenuShare,
    getMenuShareInfo,
    getParticipantSummary,
    editMenuShare
}