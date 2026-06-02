const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { generateCharts } = require("../scripts/chartGenerator");

function matchesFilters(exec, filters) {
  return Object.entries(filters).every(([field, filterValue]) => {
    const execValue = exec[field];

    if (filterValue === undefined || filterValue === null) {
      return true;
    }

    if (Array.isArray(filterValue)) {
      return filterValue.includes(execValue);
    }

    if (typeof filterValue === "object" && !Array.isArray(filterValue)) {
      if (filterValue.gte !== undefined && execValue < filterValue.gte) {
        return false;
      }

      if (filterValue.lte !== undefined && execValue > filterValue.lte) {
        return false;
      }

      if (filterValue.gt !== undefined && execValue <= filterValue.gt) {
        return false;
      }

      if (filterValue.lt !== undefined && execValue >= filterValue.lt) {
        return false;
      }

      return true;
    }

    return execValue === filterValue;
  });
}

async function createCharts(req, res) {
  try {
    const { charts, filters = {} } = req.body;

    const db = getDB();

    const collection = db.collection("experimentos");

    let experimento;

    if (filters._id) {
      if (Array.isArray(filters._id)) {
        experimentos = await collection
          .find({
            _id: {
              $in: filters._id,
            },
          })
          .toArray();
      } else {
        try {
          experimentos = await collection
            .find({
              _id: new ObjectId(filters._id),
            })
            .toArray();
        } catch {
          experimentos = await collection
            .find({
              _id: filters._id,
            })
            .toArray();
        }
      }
    } else {
      experimentos = await collection.find({}).toArray();
    }

    const { _id, ...executionFilters } = filters;

    const data = experimentos.flatMap((exp) =>
      exp.execucoes.filter((exec) => matchesFilters(exec, executionFilters)),
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhuma execução encontrada.",
      });
    }

    const result = await generateCharts(charts, data);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createCharts,
};
