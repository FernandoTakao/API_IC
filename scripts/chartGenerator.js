async function generateCharts(charts, scriptData, mobileData) {
  const [scriptResponse, mobileResponse] = await Promise.all([
    fetch("https://analytics-api-zlo2.onrender.com/analytics/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        charts,
        data: scriptData,
      }),
    }),

    fetch("https://analytics-api-zlo2.onrender.com/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        charts,
        data: mobileData,
      }),
    }),
  ]);

  if (!scriptResponse.ok) {
    throw new Error(await scriptResponse.text());
  }

  if (!mobileResponse.ok) {
    throw new Error(await mobileResponse.text());
  }

  const [scriptCharts, mobileCharts] = await Promise.all([
    scriptResponse.json(),
    mobileResponse.json(),
  ]);

  return {
    script: scriptCharts,
    mobile: mobileCharts,
  };
}

module.exports = {
  generateCharts,
};