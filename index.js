 export default {
  async fetch(request, env, ctx) {
    const targetHost = "https://phatpt.streamlit.app";
    const url = new URL(request.url);

    // Chuyển hostname và giao thức sang Streamlit Cloud
    url.hostname = targetHost;
    url.protocol = "https:";
    url.port = "";

    // Sao chép và cập nhật lại Headers cho đúng Host
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", targetHost);
    newHeaders.set("X-Forwarded-Host", request.headers.get("host") || url.hostname);

    const modifiedRequest = new Request(url.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: "follow"
    });

    return fetch(modifiedRequest);
  }
};
