export default {
  async fetch(request, env, ctx) {
    const targetHost = "phatpt.streamlit.app";
    const url = new URL(request.url);

    // Chuyển đích đến máy chủ Streamlit
    url.hostname = targetHost;
    url.protocol = "https:";
    url.port = "";

    // Xử lý Headers
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", targetHost);
    newHeaders.set("Origin", `https://${targetHost}`);
    newHeaders.set("X-Forwarded-Host", request.headers.get("host") || url.hostname);

    // Cấu hình request mới
    const init = {
      method: request.method,
      headers: newHeaders,
      redirect: "follow"
    };

    // Chỉ đính kèm body đối với các method có dữ liệu gửi lên (tránh crash với GET/HEAD)
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    // Xử lý WebSocket
    if (request.headers.get("Upgrade") === "websocket") {
      return fetch(url.toString(), init);
    }

    try {
      const response = await fetch(url.toString(), init);
      return response;
    } catch (err) {
      return new Response("Lỗi kết nối tới ứng dụng Streamlit: " + err.message, { status: 502 });
    }
  }
};
