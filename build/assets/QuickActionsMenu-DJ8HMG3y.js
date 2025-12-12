import{j as e,F as n,U as c}from"./index-BuzVCwG6.js";import{M as o}from"./mic-BoNq3oMb.js";import{C as m}from"./camera-dLEqmxvK.js";import{S as d}from"./scan-D43DpCqZ.js";import{B as p}from"./building-2-D8Z6J2oU.js";function k({isOpen:r,onToggle:s,onNavigate:a}){const l=[{icon:e.jsx(o,{className:"w-5 h-5"}),label:"Quick Bill",gradient:"from-blue-500 to-blue-600",onClick:()=>{a("billing"),s()}},{icon:e.jsx(m,{className:"w-5 h-5"}),label:"Quick POS",gradient:"from-purple-500 to-purple-600",onClick:()=>{a("quick-pos"),s()}},{icon:e.jsx(d,{className:"w-5 h-5"}),label:"Scan Barcode",gradient:"from-indigo-500 to-indigo-600",onClick:()=>{a("barcode-scanner"),s()}},{icon:e.jsx(n,{className:"w-5 h-5"}),label:"Add Expense",gradient:"from-pink-500 to-pink-600",onClick:()=>{a("expenses"),s()}},{icon:e.jsx(c,{className:"w-5 h-5"}),label:"Add Customer",gradient:"from-red-500 to-red-600",onClick:()=>{a("customers"),s()}},{icon:e.jsx(p,{className:"w-5 h-5"}),label:"Add Party",gradient:"from-orange-500 to-orange-600",onClick:()=>{a("parties"),s()}}];return e.jsxs(e.Fragment,{children:[r&&e.jsx("div",{className:"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity",onClick:s}),r&&e.jsx("div",{className:"fixed bottom-32 left-6 z-50 space-y-3 animate-slide-up",children:l.map((i,t)=>e.jsxs("div",{className:"flex items-center space-x-3",style:{animation:`slideInLeft 0.3s ease-out ${t*.1}s both`},children:[e.jsx("button",{onClick:i.onClick,className:`w-14 h-14 bg-gradient-to-r ${i.gradient} rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform`,children:i.icon}),e.jsx("div",{className:"bg-white px-3 py-2 rounded-lg shadow-lg",children:e.jsx("p",{className:"text-gray-900 text-sm whitespace-nowrap",children:i.label})})]},t))}),e.jsx("style",{children:`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `})]})}export{k as QuickActionsMenu};
