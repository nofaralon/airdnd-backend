const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {

    try {
        const criteria = _buildCriteria(filterBy)
            // const criteria = {}

        let collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function getByUserId(userId) {
    // console.log('userId in service', userId);
    try {
        const collection = await dbService.getCollection('stay')
        console.log("collection in service",collection);
        const stays = collection.find({ 'host._id': userId }).toArray()
        console.log('stays in service', stays);
        return stays
    } catch (err) {
        logger.error(`while finding stay ${userId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        const id = addedStay.insertedId.toString()
        stay._id = id
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}
async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ "_id": id }, { $set: {...stay } })
        const updateStay = {...stay, _id: id }
        return updateStay
    } catch (err) {
        logger.error(`cannot update stay ${stayId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {

    return filterBy ? { 'host._id': filterBy } : {}
}

// function _buildCriteria(filterBy) {
//     // const criteria = {}
//     // if (filterBy.txt) {
//     //     const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
//     //     criteria.name = txtCriteria
//     // }
//     // if (filterBy.select) {
//     //     if (filterBy.select === 'In stock') {
//     //         criteria.inStock = { $eq: true }
//     //     } else if (filterBy.select === 'Out of stock') {
//     //         criteria.inStock = { $eq: false }
//     //     }

//     //     // criteria.inStock = { $eq: filterBy.select }
//     // }
//     // if (filterBy.lable && filterBy.lable.length) {
//     //     criteria.labels = { $in: filterBy.lable }
//     // }
//     // console.log('criteria:', criteria);
//     // return criteria
// }

module.exports = {
    remove,
    query,
    getById,
    getByUserId,
    add,
    update,
}