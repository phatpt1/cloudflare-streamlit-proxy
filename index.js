export default {
  async fetch(request) {
    const targetUrl = "https://phatpt.streamlit.app";
    const url = new URL(request.url);
    const target = new URL(targetUrl);

    url.hostname = target.hostname;
    url.protocol = target.protocol;

    const modifiedRequest = new Request(url.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: "follow"
    });

    return fetch(modifiedRequest);
  }
};
