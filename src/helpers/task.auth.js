const db = require("../utils/db");
const queries = require("../utils/queries");

const createTask = async (req, res) => {
  const { title, desc, tag, dt } = req.body;
  const id = req.user;

  try {
    const user = await db.query(queries.GET_USERBYID, [id]);
    const username = user.rows[0].username;
    console.log(username);
    if (user.rows != "") {
      await db.query("BEGIN");
      const response = await db.query(queries.CREATE_TASK, [
        username,
        title,
        desc,
        tag,
        dt,
      ]);
      console.log("Task Created! " + response.rows);
      await db.query("COMMIT");
      res.status(200).send("Task Created!");
    } else {
      await db.query("ROLLBACK");
      res.status(400).send("Username not Found!");
    }
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).send("Server Error!");
    throw err;
  }
};

const updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, dsc, tag, dt } = req.body;
  try {
    await db.query("BEGIN");
    const checkTaskId = await db.query(queries.CHECKTASKID, [id]);

    if (checkTaskId.rows != "") {
      const response = await db.query(queries.UPDATE_TASK, [
        title,
        dsc,
        tag,
        dt,
        id,
      ]);
      console.log(response.rows);
      res.status(200).send(`Task ${id} updated!`);
      await db.query("COMMIT");
    } else {
      await db.query("ROLLBACK");
      res.status(400).send(`Username ${id} not Found!`);
    }
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).send("Server Error!");
    throw err;
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("BEGIN");
    const checkTaskId = await db.query(queries.CHECKTASKID, [id]);

    if (checkTaskId != "") {
      const response = await db.query(queries.DELETE_TASK, [id]);
      console.log(response.rows);
      res.status(200).send(`Task ${id} deleted!`);
      await db.query("COMMIT");
    } else {
      await db.query("ROLLBACK");
      res.status(400).send(`Task ${id} not Found!`);
    }
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).send("Server Error!");
    throw err;
  }
};
module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
