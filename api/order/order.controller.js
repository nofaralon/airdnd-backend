const logger = require('../../services/logger.service')
const orderService = require('./order.service')
    // const socketService = require('../../services/socket.service')


async function getOrders(req, res) {
    console.log(req.body);
    try {
        const orders = await orderService.query(req.body)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function deleteOrder(req, res) {
    try {
        await orderService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}


async function addOrder(req, res) {
    try {
        var order = req.body
        console.log(order, 'order');
        order = await orderService.add(order)
        res.send(order)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

module.exports = {
    getOrders,
    deleteOrder,
    addOrder
}