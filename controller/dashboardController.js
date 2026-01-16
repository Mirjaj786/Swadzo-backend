import Order from "../models/orderModle.js";
import Food from "../models/foodModle.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({});

        const paidOrders = await Order.find({ payment: true });
        const totalRevenue = paidOrders.reduce((acc, order) => acc + order.amount, 0);

        const pendingOrders = await Order.countDocuments({ status: { $ne: "Delivered" } });

        const allOrders = await Order.find({});
        const foodSales = {};

        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (foodSales[item.name]) {
                    foodSales[item.name] += item.quantity;
                } else {
                    foodSales[item.name] = item.quantity;
                }
            });
        });

        const topSelling = Object.entries(foodSales)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        const lowStockFood = await Food.find({ isAvailable: false }).limit(5);

        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                pendingOrders,
                topSelling,
                lowStock: lowStockFood
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching dashboard stats" });
    }
};
