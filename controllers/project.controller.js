const Project = require("../models/project.model");

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate("assignedTo").exec();
    res.status(200).json({ projects });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred!", error: error.message });
  }
};

const addProject = (req, res, next) => {
  let project = new Project({
    name: req.body.name,
    description: req.body.description,
    assignedTo: req.body.assignedTo,
    status: req.body.status,
  });

  project
    .save()
    .then((savedProject) => {
      res.status(201).json({ message: "Project added successfully" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "An error occurred!", error: error.message });
    });
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
