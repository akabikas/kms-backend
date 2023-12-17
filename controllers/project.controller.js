const Project = require("../models/project.model");
const User = require("../models/user.model");
const { sendEmail } = require("../services/email.service");
const notificationService = require("../services/notification.service");

const getProjects = async (req, res, next) => {
  const { role, _id } = req.body.user;

  try {
    if (req.query && req.query.id) {
      const projectId = req.query.id;
      const project = await Project.findById(projectId)
        .populate('assignedTo')
        .exec();

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (role !== 'admin' && !project.assignedTo.some(user => user._id.equals(_id))) {
        return res.status(403).json({ message: 'Authorization error' });
      }

      return res.status(200).json({ project });
    } else {
      let projectsQuery = {};

      if (role !== 'admin') {
        projectsQuery = { assignedTo: _id };
      }

      const projects = await Project.find(projectsQuery)
        .sort({ createdAt: -1 })
        .populate('assignedTo')
        .exec();

      res.status(200).json({ projects });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred!', error: error.message });
  }
};


const addProject = async (req, res, next) => {
  try {
    let project = new Project({
      name: req.body.name,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
      status: req.body.status,
    });

    if (req.files) {
      let path = "";
      req.files.forEach(function (files, index, arr) {
        path = path + files.path + ",";
      });
      path = path.substring(0, path.lastIndexOf(","));
      project.documents = path;
    }

    const savedProject = await project.save();

    const notificationData = {
      title: "A new project has been assigned to you",
      description: `Go to this project and access all the material: ${savedProject.name}`,
      project: savedProject._id,
      assignedTo: req.body.assignedTo,
      status: "Unread",
    };

    const addNotification = await notificationService.createNotification(
      notificationData
    );

    if (addNotification.success) {
      const users = await User.find({ _id: { $in: req.body.assignedTo } });

      const userList = users
        .map((user) => `<li>${user.name} : ${user.email}</li>`)
        .join("");

      users.forEach(async (user) => {
        const emailData = {
          toEmail: user.email,
          subject: "Someone assigned a project to you.",
          text: "You have been assigned to this project. Go to H&K website and access the project details",
          html: `<p>You have been assigned to ${project.name}. Go to <a href="http://localhost:3001">H&K website</a> and access the project details</p><p>Here is the list of members on this project: <ul>${userList}</ul></p>`,
        };
        await sendEmail(emailData);
      });
    }

    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred!", error: error.message });
  }
};

const updateProject = (req, res, next) => {
  const projectId = req.query.id;
  const { name, description, assignedTo, status } = req.body;

  Project.findByIdAndUpdate(
    projectId,
    { name, description, assignedTo, status },
    { new: true }
  )
    .then((updatedProject) => {
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ message: "Project updated successfully" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "An error occurred!", error: error.message });
    });
};

const deleteProject = (req, res, next) => {
  const projectId = req.query.id;

  Project.findByIdAndDelete(projectId)
    .then((deletedProject) => {
      if (!deletedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ message: "Project deleted successfully" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "An error occurred!", error: error.message });
    });
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
