const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const { generateCharts } = require("../scripts/chartGenerator");

const MOBILE_CHARTS = ["chart1", "chart2", "chart3", "chart4"];
const SCRIPT_CHARTS = ["chart_f1_heatmap", "chart_metrics", "chart_pareto"];

function matchesFilters(exec, filters) {
  return Object.entries(filters).every(([field, filterValue]) => {
    const execValue = exec[field];
    if (filterValue === undefined || filterValue === null) return true;
    if (Array.isArray(filterValue)) return filterValue.includes(execValue);
    if (typeof filterValue === "object" && !Array.isArray(filterValue)) {
      if (filterValue.gte !== undefined && execValue < filterValue.gte) return false;
      if (filterValue.lte !== undefined && execValue > filterValue.lte) return false;
      if (filterValue.gt !== undefined && execValue <= filterValue.gt) return false;
      if (filterValue.lt !== undefined && execValue >= filterValue.lt) return false;
      return true;
    }
    return execValue === filterValue;
  });
}

async function getFilteredExecutions(collection, userId, filters, executionField) {
  let experimentos;
  if (filters._id) {
    if (Array.isArray(filters._id)) {
      const ids = filters._id.map((id) => ObjectId.isValid(id) ? new ObjectId(id) : id);
      experimentos = await collection.find({ userId, _id: { $in: ids } }).toArray();
    } else {
      try { experimentos = await collection.find({ userId, _id: new ObjectId(filters._id) }).toArray(); }
      catch { experimentos = await collection.find({ userId, _id: filters._id }).toArray(); }
    }
  } else {
    experimentos = await collection.find({ userId }).toArray();
  }
  const { _id, ...executionFilters } = filters;
  return experimentos.flatMap((exp) => (exp[executionField] || [])
    .filter((exec) => matchesFilters(exec, executionFilters))
    .map((exec) => ({ experimento_id: exp._id.toString(), ...exec })));
}

async function createCharts({ body, user }) {
  try {
    const { charts = [], scriptFilters = {}, mobileFilters = {} } = body;
    const mobileCharts = charts.filter((chart) => MOBILE_CHARTS.includes(chart));
    const scriptCharts = charts.filter((chart) => SCRIPT_CHARTS.includes(chart));
    const collection = getDB().collection("experimentos");
    const userId = new ObjectId(user.id);
    const [scriptData, mobileData] = await Promise.all([
      getFilteredExecutions(collection, userId, scriptFilters, "execucoesScript"),
      getFilteredExecutions(collection, userId, mobileFilters, "execucoesMobile"),
    ]);
    if (scriptData.length === 0 && mobileData.length === 0) {
      return { status: 404, body: { success: false, message: "Nenhuma execução encontrada." } };
    }
    const result = await generateCharts({ mobileCharts, scriptCharts, mobileData, scriptData });
    return { status: 200, body: { success: true, ...result, execucoesMobile: mobileData, execucoesScript: scriptData } };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { success: false, message: error.message } };
  }
}

module.exports = { createCharts };
