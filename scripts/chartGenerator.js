async function generateCharts(charts, data) {
  console.log(
    JSON.stringify(
      {
        charts,
        data: data.slice(0, 2),
      },
      null,
      2,
    ),
  );
  const response = await fetch(
    "https://analytics-api-zlo2.onrender.com/analytics",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        charts,
        data,
      }),
    },
  );

  const body = await response.text();

  console.log("Status:", response.status);

  if (!response.ok) {
    throw new Error(body);
  }

  return JSON.parse(body);
}
module.exports = {
  generateCharts,
};
