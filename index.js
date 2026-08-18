export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const target = "phatpt.streamlit.app";
      
      // Chuyển hướng domain
      url.hostname = target;
      url.protocol = "https:";
      
      // Xử lý Headers chuẩn để qua mặt lớp bảo vệ của Streamlit
      const headers = new Headers(request.headers);
      headers.set("Host", target);
      headers.delete("Origin");
      headers.delete("Referer");

      const init = {
        method: request.method,
        headers: headers,
        redirect: "follow"
      };

      // Chỉ gán body khi method hợp lệ (tránh lỗi ngầm 1101 của Cloudflare)
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
        init.body = request.body;
      }

      // Thực hiện gửi Request tới Streamlit
      const response = await fetch(url.toString(), init);

      // --- XỬ LÝ ĐẶC BIỆT CHO STREAMLIT ---
      
      // 1. Nếu là kết nối WebSocket, tuyệt đối không can thiệp để tránh đứt gãy
      if (response.status === 101 || response.headers.get("Upgrade") === "websocket") {
        return response; 
      }

      // 2. Nếu là HTTP bình thường, tạo response mới và gỡ bỏ các khóa chặn Proxy
      const modResponse = new Response(response.body, response);
      modResponse.headers.delete("X-Frame-Options");
      modResponse.headers.delete("Content-Security-Policy");
      
      return modResponse;

    } catch (error) {
      // Ép Worker in thẳng nguyên nhân gây lỗi ra màn hình (Không hiện trang 1101 nữa)
      return new Response("🔥 Lỗi Worker nội bộ: " + error.message + "\n\n" + error.stack, { 
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};
