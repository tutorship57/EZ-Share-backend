const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();


// const getAllItems= async (req, res) => {
//         try {
//           const items = await model.findMany()
//           res.json(items)
//         } catch (error) {
//           res.status(500).json({ error: error.message })
//         }
// }
const createItem =(model) =>{ 
    return async (req, res) => {
        try {
            const data = req.body
            const newItem = await model.create(data)
            res.status(201).json(newItem)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
        }
}
// const createItem = async (req, res) => {
//     try {
//         const newItem = await model.create({ data: req.body })
//         res.status(201).json(newItem)
//       } catch (error) {
//         res.status(400).json({ error: error.message })
//       }
//     }
const getOneItem =(model)=>{
 return async (req, res) => {
    const id = Number(req.params.id)
    const item = await model.findUnique({ where: { id } })
    res.json(item)
 }
}
//     const getOneItem = async (req, res) => {
//         const id = Number(req.params.id)
//         const item = await model.findUnique({ where: { id } })
//         res.json(item)
//     }   
const updateItem =()=>{
 return async (req, res) => {
    const id = Number(req.params.id)
      await model.update(req.body, { where: { id } })
      res.json({ success: true })
 }
}
// const updateItem = async (req, res) => {
//     const id = Number(req.params.id)
//       await model.update(req.body, { where: { id } })
//       res.json({ success: true })
// }
const deleteItem =(model)=>{
 return async (req, res) => {
    const id = Number(req.params.id)
    await model.delete({ where: { id } })
    res.json({ success: true })
 }
}
// const deleteItem = async (req, res) => {
//     const id = Number(req.params.id)
//     await model.delete({ where: { id } })
//     res.json({ success: true })
// }

module.exports = {
    getAllItems,
    createItem,
    getOneItem,
    updateItem,
    deleteItem
}