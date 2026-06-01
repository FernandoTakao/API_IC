async function generateCharts(charts, data) {
  const response = await fetch(
    "https://denial-leverage-facedown.ngrok-free.dev/analytics",
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
