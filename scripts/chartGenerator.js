async function generateCharts({
  mobileCharts,
  scriptCharts,
  mobileData,
  scriptData,
}) {
  let generatedScriptCharts = {};
  let generatedMobileCharts = {};

  const promises = [];

  if (scriptCharts.length > 0 && scriptData.length > 0) {
    const hasPareto = scriptCharts.includes("chart_pareto");

    const scriptBody = {
      charts: scriptCharts,
      data: scriptData,
    };

    if (hasPareto) {
      scriptBody.mobile_data = mobileData;
    }


    promises.push(
      fetch("https://analytics-api-zlo2.onrender.com/analytics/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scriptBody),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }

        generatedScriptCharts = await response.json();
      }),
    );
  }

  if (mobileCharts.length > 0 && mobileData.length > 0) {
    promises.push(
      fetch("https://analytics-api-zlo2.onrender.com/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          charts: mobileCharts,
          data: mobileData,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }

        generatedMobileCharts = await response.json();
      }),
    );
  }

  await Promise.all(promises);

  return {
    script: generatedScriptCharts,
    mobile: generatedMobileCharts,
  };
}

module.exports = {
  generateCharts,
};
