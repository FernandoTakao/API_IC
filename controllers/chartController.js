const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { generateCharts } = require("../scripts/chartGenerator");

// Gráficos de cada endpoint
const MOBILE_CHARTS = [
  "chart1",
  "chart2",
  "chart3",
  "chart4" 
];

const SCRIPT_CHARTS = [
  "chart_f1_heatmap",
  "chart_metrics",
  "chart_pareto"
];

//Filtro das execucoes
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

//fazer a filtragem das execucoes
async function getFilteredExecutions(collection, userId, filters, executionField,) {
  let experimentos;

  if (filters._id) {
    if (Array.isArray(filters._id)) {
      const ids = filters._id.map((id) =>
        ObjectId.isValid(id) ? new ObjectId(id) : id,
      );

      experimentos = await collection
        .find({
          userId,
          _id: { $in: ids },
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

  return experimentos.flatMap((exp) =>
  (exp[executionField] || [])
    .filter((exec) => matchesFilters(exec, executionFilters))
    .map((exec) => ({
      experimento_id: exp._id.toString(),
      ...exec,
    })),
);
}

//Geraar os graficos
async function createCharts(req, res) {
  try {
    const {
      charts = [],
      scriptFilters = {},
      mobileFilters = {},
    } = req.body;

    // Separa os gráficos por endpoint
    const mobileCharts = charts.filter((chart) =>
      MOBILE_CHARTS.includes(chart),
    );

    const scriptCharts = charts.filter((chart) =>
      SCRIPT_CHARTS.includes(chart),
    );

    const db = getDB();
    const collection = db.collection("experimentos");

    const userId = new ObjectId(req.user.id);

    const [scriptData, mobileData] = await Promise.all([
      getFilteredExecutions(
        collection,
        userId,
        scriptFilters,
        "execucoesScript",
      ),
      getFilteredExecutions(
        collection,
        userId,
        mobileFilters,
        "execucoesMobile",
      ),
    ]);

    if (scriptData.length === 0 && mobileData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhuma execução encontrada.",
      });
    }

    const result = await generateCharts({
      mobileCharts,
      scriptCharts,
      mobileData,
      scriptData,
    });

    return res.status(200).json({
      success: true,
      ...result,
      execucoesMobile: mobileData,
      execucoesScript: scriptData
    });
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