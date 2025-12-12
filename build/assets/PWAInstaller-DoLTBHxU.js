import{r as n,j as e,C as f,B as m,X as u}from"./index-V23vquzg.js";import{S as w}from"./smartphone-0kJLY5AC.js";import{D as j}from"./download-CYNHsznw.js";import{C as v}from"./check-Bg6fztkx.js";function y(){const[s,r]=n.useState(null),[p,a]=n.useState(!1),[h,i]=n.useState(!1);n.useEffect(()=>{if(window.matchMedia("(display-mode: standalone)").matches){i(!0);return}const t=d=>{d.preventDefault(),r(d),setTimeout(()=>{localStorage.getItem("pwa-install-dismissed")||a(!0)},1e4)},l=()=>{i(!0),a(!1),r(null)};return window.addEventListener("beforeinstallprompt",t),window.addEventListener("appinstalled",l),()=>{window.removeEventListener("beforeinstallprompt",t),window.removeEventListener("appinstalled",l)}},[]);const x=async()=>{if(!s)return;await s.prompt();const{outcome:t}=await s.userChoice;r(null),a(!1)},o=()=>{a(!1),localStorage.setItem("pwa-install-dismissed","true")};return h||!p||!s?null:e.jsx("div",{className:"fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-slide-up",children:e.jsxs(f,{className:"bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-2xl",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0",children:e.jsx(w,{className:"w-6 h-6"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"font-bold mb-1",children:"Install Retail Bandhu App"}),e.jsx("p",{className:"text-sm text-white/90 mb-3",children:"Get faster access and work offline! Install our app on your home screen."}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(m,{onClick:x,className:"bg-white text-blue-600 hover:bg-blue-50 flex-1",size:"sm",children:[e.jsx(j,{className:"w-4 h-4 mr-2"}),"Install Now"]}),e.jsx(m,{onClick:o,variant:"ghost",className:"text-white hover:bg-white/20",size:"sm",children:"Later"})]})]}),e.jsx("button",{onClick:o,className:"text-white/80 hover:text-white",children:e.jsx(u,{className:"w-5 h-5"})})]}),e.jsx("div",{className:"mt-3 pt-3 border-t border-white/20 space-y-1",children:["Works offline","Faster loading","Native app experience"].map((t,l)=>e.jsxs("div",{className:"flex items-center gap-2 text-xs text-white/90",children:[e.jsx(v,{className:"w-3 h-3"}),e.jsx("span",{children:t})]},l))})]})})}const c=document.createElement("style");c.textContent=`
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
`;document.head.appendChild(c);export{y as PWAInstaller};
