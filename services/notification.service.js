const Notification = require("../models/notification.model");

const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return { success: true, message: "Notification created successfully" };
  } catch (error) {
    return { success: false, message: "Failed to create notification", error: error.message };
  }
};

module.exports = {
  createNotification,
};