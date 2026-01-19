import { useState } from 'react';

// 1. 定义表单数据的接口 (Interface)，提供严格的类型约束
interface FormData {
  title: string;
  author: string;
  content: string;
}

// 定义提交状态的类型
type SubmissionStatus = {
  success: boolean;
  data?: any; // httpbin 返回的数据结构不确定，用 any
  message?: string;
} | null;

function App() {
  // 2. 使用泛型为 useState 提供类型，确保 formData 的结构始终正确
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    content: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 3. 为事件处理函数的参数 `e` 提供精确的类型
  // 这使得 `e.target.name` 和 `e.target.value` 都能获得智能提示
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 4. 为表单提交事件 `e` 提供类型
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmissionStatus(null);
    
    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // `formData` 受类型保护，不会传错字段
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const result = await response.json();
      setSubmissionStatus({ success: true, data: result.json });
      setFormData({ title: '', author: '', content: '' });
    } catch (error) {
      // `error` 默认为 unknown 类型，需要进行类型断言
      const err = error as Error;
      setSubmissionStatus({ success: false, message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // JSX 部分与 JS 版本完全相同
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-2xl mx-auto p-4">
        {/* ... JSX 结构与 JS 版本完全一致 ... */}
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">新闻稿提交 (React + TS)</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
             <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">作者</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">内容</label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                {isLoading ? '提交中...' : '提交新闻'}
              </button>
            </div>
          </form>

          {submissionStatus && (
            <div className={`mt-8 p-4 rounded-lg border ${submissionStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`text-lg font-semibold ${submissionStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                {submissionStatus.success ? '提交成功！' : '提交失败！'}
              </h3>
              {submissionStatus.success ? (
                 <pre className="mt-2 p-3 bg-gray-900 text-white text-xs rounded-md overflow-x-auto">
                   <code>{JSON.stringify(submissionStatus.data, null, 2)}</code>
                 </pre>
              ) : (
                <p className="text-red-700 mt-1">{submissionStatus.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;