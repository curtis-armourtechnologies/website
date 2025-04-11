const { Client } = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");

module.exports = async function (context, req) {
  context.log("Function started");

  const token = req.headers["x-ms-token-aad-access-token"];
  context.log("Token received:", token ? "yes" : "no");

  if (!token) {
    context.res = {
      status: 401,
      body: "Access token missing",
    };
    return;
  }

  try {
    const client = Client.init({
      authProvider: (done) => done(null, token)
    });

    context.log("Calling Graph API...");
    const user = await client.api('/me').get();
    const org = await client.api('/organization').get();

    context.log("Graph call complete");

    context.res = {
      status: 200,
      body: {
        user,
        organization: org.value[0]
      }
    };
  } catch (err) {
    context.log("Error:", err.message);
    context.res = {
      status: 500,
      body: `Error calling Graph API: ${err.message}`
    };
  }
};
