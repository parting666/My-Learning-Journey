// import React from 'react'
// const CATS = ['全部','政治','经济','科技','文化','体育','娱乐']

// export default function Filters({category,setCategory,search,setSearch,onSearch}){
//   return (
//     <div className="mb-4">
//       <div className="flex gap-2 mb-3">
//         <input className="input flex-1 max-w-xl" placeholder="搜索新闻标题..." value={search} onChange={e=>setSearch(e.target.value)} />
//         <button className="btn btn-primary" onClick={onSearch}>搜索</button>
//       </div>
//       <div className="flex flex-wrap gap-2 items-center">
//         {CATS.map(c => (
//           <button key={c} onClick={()=>setCategory(c)}
//             className={`px-3 py-1 rounded-full border ${category===c?'bg-blue-600 text-white border-blue-600':'bg-white hover:bg-gray-100'}`}>
//             {c}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }
