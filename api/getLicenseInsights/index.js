const fetch = require("node-fetch");

module.exports = async function (context, req) {
  // Retrieve the access token from the request headers
  const accessToken = req.headers["x-ms-token-aad-access-token"];
  
  if (!accessToken) {
    context.res = {
      status: 401,
      body: "Access token missing. Please ensure you are authenticated."
    };
    return;
  }
  
  try {
    // Call Microsoft Graph to get license (subscribed SKUs) data
    const skuResponse = await fetch("https://graph.microsoft.com/v1.0/subscribedSkus", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const skuData = await skuResponse.json();

    // Check if the response contains the data
    if (!skuData.value) {
      context.res = {
        status: 500,
        body: "Failed to retrieve license data from Microsoft Graph."
      };
      return;
    }

    // Process the data: For each SKU, compute usage
    const insights = skuData.value.map(sku => {
      const skuName = sku.skuPartNumber;
      const totalPurchased = sku.prepaidUnits.enabled;
      const consumed = sku.consumedUnits;
      const unused = totalPurchased - consumed;
      const usagePercentage = totalPurchased > 0 ? ((consumed / totalPurchased) * 100).toFixed(2) : "0";

      // Determine if the SKU might be underutilized (e.g., if usage is below 50%)
      const underUtilized = totalPurchased > 0 && (consumed / totalPurchased) < 0.5;
      
      return {
        sku: skuName,
        totalPurchased: totalPurchased,
        consumed: consumed,
        unused: unused,
        usagePercentage: usagePercentage,
        recommendation: underUtilized ? "Review usage - potential cost optimization opportunity" : "Usage appears normal"
      };
    });

    // Return the aggregated insights
    context.res = {
      status: 200,
      body: { insights }
    };
  } catch (error) {
    context.log("Error fetching license data: ", error);
    context.res = {
      status: 500,
      body: `Error: ${error.message}`
    };
  }
};
