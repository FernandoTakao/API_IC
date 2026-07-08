async function generateCharts(charts, scriptData, mobileData) {
  let scriptCharts = {};
  let mobileCharts = {};

  const promises = [];

  if (scriptData.length > 0) {
    promises.push(
      fetch("https://analytics-api-zlo2.onrender.com/analytics/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          charts,
          data: scriptData,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }

        scriptCharts = await response.json();
      })
    );
  }

  if (mobileData.length > 0) {
    promises.push(
      fetch("https://analytics-api-zlo2.onrender.com/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          charts,
          data: mobileData,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }

        mobileCharts = await response.json();
      })
    );
  }

  await Promise.all(promises);

  return {
    script: scriptCharts,
    mobile: mobileCharts,
  };
}

module.exports = {
  generateCharts,
};