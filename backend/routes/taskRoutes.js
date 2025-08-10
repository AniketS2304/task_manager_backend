import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// ✅ Route to get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to create a new task
router.post("/tasks", async (req, res) => {
  console.log("Received task data:", req.body);
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(400).json({ error: "Failed to create task" });
  }
});

// ✅ Route to get a specific task by ID
router.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error(`Error fetching task with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to update a task (PUT - replaces entire task)
router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(`Error updating task with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to update only the task status (PATCH - partial update)
router.patch("/tasks/:id", async (req, res) => {
  
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(`Error updating task status for ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to delete a task by ID
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(`Error deleting task with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
