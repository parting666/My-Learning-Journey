from flask import Flask, request

app = Flask(__name__)

@app.route("/submit", methods=["POST"])
def handle_submission():
    if request.form:
        title = request.form.get("title")
        author = request.form.get("author")
        category = request.form.get("category")
        content = request.form.get("content")

        print("--- Python 后端接收到新的提交 ---")
        print(f"标题: {title}")
        print(f"作者: {author}")
        print(f"分类: {category}")
        print(f"内容: {content[:100]}...")
        print("---------------------------------")

        return """
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>提交成功</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                <svg class="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <h2 class="text-2xl font-bold mt-4 text-gray-800">提交成功!</h2>
                <p class="text-gray-600 mt-2">感谢您的投稿，我们已在后台处理您的新闻。</p>
                <a href="http://localhost:5173" class="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                    返回首页
                </a>
            </div>
        </body>
        </html>
        """
    return "无效的请求", 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)
