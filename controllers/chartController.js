const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { generateCharts } = require("../scripts/chartGenerator");

const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

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

    const userId = new ObjectId(req.user.id);

    let experimentos;

    if (filters._id) {
      if (Array.isArray(filters._id)) {
        const ids = filters._id.map((id) =>
          ObjectId.isValid(id) ? new ObjectId(id) : id
        );

        experimentos = await collection
          .find({
            userId,
            _id: {
              $in: ids,
            },
          })
          .toArray();
      } else {
        try {
          experimentos = await collection
            .find({
              userId,
              _id: new ObjectId(filters._id),
            })
            .toArray();
        } catch {
          experimentos = await collection
            .find({
              userId,
              _id: filters._id,
            })
            .toArray();
        }
      }
    } else {
      experimentos = await collection
        .find({
          userId,
        })
        .toArray();
    }

    const { _id, ...executionFilters } = filters;

    const data = experimentos.flatMap((exp) =>
      (exp.execucoes || []).filter((exec) =>
        matchesFilters(exec, executionFilters)
      )
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhuma execução encontrada.",
      });
    }

    const result = await generateCharts(charts, data);

    const parser = new Parser();
    const csv = parser.parse(data);

    const reportsDir = path.join(__dirname, "../reports");

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `report-${Date.now()}.csv`;
    const filePath = path.join(reportsDir, fileName);

    fs.writeFileSync(filePath, csv);

    return res.status(200).json({
      success: true,
      execucoes: data,
      ...result,
      csvUrl: `${req.protocol}://${req.get(
        "host"
      )}/api/charts/download/${fileName}`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

function downloadCsv(req, res) {
  try {
    const filePath = path.join(
      __dirname,
      "../reports",
      req.params.file
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Arquivo não encontrado.",
      });
    }

    return res.download(filePath);
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
  downloadCsv,
};