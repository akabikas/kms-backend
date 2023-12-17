const Notification = require("../models/notification.model");

const getNotifications = async (req, res, next) => {
  const userID = req.query.id;
  const status = req.query.status;

  const query = { assignedTo: userID };
  if (status) {
    query.status = status;
  }

  try {
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedTo")
      .exec();

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "Notifications not found" });
    }

    return res.status(200).json({ notifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred!", error: error.message });
  }
};

const updateNotification = async (req, res, next) => {
  const userID = req.query.id;
  const notificationID = req.body.id;
  const status = req.body.status;

  try {
    const notification = await Notification.findOne({
      _id: notificationID,
      assignedTo: userID,
    });

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found or unauthorized" });
    }

    notification.status = status;
    await notification.save();

    return res
      .status(200)
      .json({ message: "Notification updated successfully", notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred!", error: error.message });
  }
};

module.exports = { getNotifications, updateNotification };
