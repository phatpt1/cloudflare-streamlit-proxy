export default {
  async fetch(request, env, ctx) {
    const targetHost = "phatpt.streamlit.app";
    const url = new URL(request.url);

    url.hostname = targetHost;
    url.protocol = "https:";
    url.port = "";

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", targetHost);
    newHeaders.set("X-Forwarded-Host", request.headers.get("host") || url.hostname);

    if (request.headers.get("Upgrade") === "websocket") {
      return fetch(url.toString(), {
        headers: newHeaders,
        cf: { resolveOverride: targetHost }
      });
    }

    const modifiedRequest = new Request(url.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: "follow"
    });

    return fetch(modifiedRequest);
  }
};
