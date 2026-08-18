export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Ghép link gốc Streamlit cùng các tham số (nếu có), thêm lệnh ẩn menu Streamlit (embed=true)
    const targetUrl = `https://phatpt.streamlit.app${url.pathname}${url.search}${url.search ? '&' : '?'}embed=true`;

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống thi trắc nghiệm</title>
    
    <!-- DÒNG NÀY ĐỂ ĐỔI ICON WEB (FAVICON) -->
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3135/3135692.png" type="image/png">
    
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: #ffffff;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="${targetUrl}" allow="clipboard-write; clipboard-read; autoplay" allowfullscreen></iframe>
</body>
</html>`;

    return new Response(html, {
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
    });
  }
};
