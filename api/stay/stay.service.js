const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const ObjectId = require("mongodb").ObjectId;

async function query(filterBy = {}) {
  // {$and:[{'price':{ $lte: 250 }},{'capacity':{$gte:5}}]}
  try {
    const criteria = _buildCriteria(filterBy);

    let collection = await dbService.getCollection("stay");
    const stays = await collection.find(criteria).toArray();
    // console.log('STAYS',stays);
    return stays;
  } catch (err) {
    logger.error("cannot find stays", err);
    throw err;
  }
}

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection("stay");
    const stay = collection.findOne({ _id: ObjectId(stayId) });
    return stay;
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err);
    throw err;
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection("stay");
    await collection.deleteOne({ _id: ObjectId(stayId) });
    return stayId;
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err);
    throw err;
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection("stay");
    const addedStay = await collection.insertOne(stay);
    const id = addedStay.insertedId.toString();
    stay._id = id;
    return stay;
  } catch (err) {
    logger.error("cannot insert stay", err);
    throw err;
  }
}
async function update(stay) {
  try {
    var id = ObjectId(stay._id);
    delete stay._id;
    const collection = await dbService.getCollection("stay");
    await collection.updateOne({ _id: id }, { $set: { ...stay } });
    const updateStay = { ...stay, _id: id };
    return updateStay;
  } catch (err) {
    logger.error(`cannot update stay ${stayId}`, err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
    console.log('filterrr',filterBy);
  // {$and:[{'price':{ $lte: 250 }},{'capacity':{$gte:5}}]}
  const criteria = {};
  if (filterBy.fromPrice && filterBy.toPrice) {
    criteria.$and = [
      { price: { $gte: +filterBy.fromPrice } },
      { price: { $lte: +filterBy.toPrice } },
    ];
  }
  if(filterBy.country){
    criteria["loc.country"]= { $regex: filterBy.country, $options:'i' }
  }
  if (filterBy.guests) {
    criteria.capacity = { $gte: filterBy.guests };
  }
  if (filterBy.bathrooms) {
    criteria.bathrooms = { $gte: filterBy.bathrooms };
}
if (filterBy.bedrooms) {
    criteria.bedroom = { $gte: filterBy.bedrooms };
}
 if(filterBy.beds){
 criteria.beds={$gte: filterBy.beds}
 }
 if(filterBy.type.length){
criteria.type = { $in: filterBy.type } }
 // db.getCollection('station').find(
  //     { songs: { $elemMatch: { title: { $regex: new RegExp('Christina Aguilera', 'i') } } } },
  //       {_id:0, "songs.$":1}
  //   )
  //   if (filterBy.country) {
  //     console.log(filterBy.country);
  //     const regex = { $regex: filterBy.country, $options: "i" };
  //     criteria.loc.country = { "loc.country": regex };
  //   }

  // if (filterBy.price) {
  //     filterBy.price = JSON.parse(filterBy.price)
  //     criteria.$and = [
  //       { price: { $gte: +(filterBy.price.minPrice)}},
  //       {price:  { $lte: +(filterBy.price.maxPrice)}}
  // ]}

  //  if(filterBy.toPrice){
  // {'price':{ $lte: 250 }}
  //     criteria.price ={$lte: filterBy.toPrice}
  //  }
  // filterby type need to be checked(come ass arary)

  console.log("updated criteria", criteria);
  return criteria;
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
  add,
  update,
};
