import{r as l,j as e,S as T,I as A,B as u,t as n}from"./index-BuzVCwG6.js";import{A as k}from"./arrow-left-Dcny2vjx.js";import{D as c}from"./download-BE2UR89B.js";import{F as I}from"./funnel-CXKY9u7n.js";import{C as D}from"./calendar-DrzEjIy2.js";import{E as R}from"./eye-COWFVUIG.js";import{S as q}from"./share-2-DNtAaL4p.js";import{P as L}from"./printer-cL35Pv_R.js";import{T as U}from"./trash-2-TQVF2hbq.js";import{R as z}from"./rotate-ccw-xeIDDkr5.js";function ie({onNavigate:b}){const[r,g]=l.useState(""),[N,y]=l.useState("all"),[h,V]=l.useState("all"),[W,_]=l.useState(!1),[O,j]=l.useState(null),[Q,w]=l.useState(!1),[p,H]=l.useState(""),[x,K]=l.useState(""),d=[{id:"1",billNumber:"RB-001234",customerName:"Ramesh Kumar",customerPhone:"+91 98765 43210",items:[{id:"1",name:"Item 1",quantity:2,price:100,total:200},{id:"2",name:"Item 2",quantity:3,price:50,total:150}],itemCount:5,total:450,paymentMethod:"upi",date:"2024-11-13",time:"10:30 AM",status:"completed"},{id:"2",billNumber:"RB-001233",customerName:"Sunita Devi",items:[{id:"3",name:"Item 3",quantity:1,price:280,total:280}],itemCount:3,total:280,paymentMethod:"cash",date:"2024-11-13",time:"09:45 AM",status:"completed"},{id:"3",billNumber:"RB-001232",customerName:"Walk-in Customer",items:[{id:"4",name:"Item 4",quantity:4,price:150,total:600},{id:"5",name:"Item 5",quantity:4,price:5,total:20}],itemCount:8,total:620,paymentMethod:"upi",date:"2024-11-12",time:"06:20 PM",status:"completed"},{id:"4",billNumber:"RB-001231",customerName:"Priya Sharma",customerPhone:"+91 98765 43213",items:[{id:"6",name:"Item 6",quantity:2,price:75,total:150}],itemCount:2,total:150,paymentMethod:"credit",date:"2024-11-12",time:"04:15 PM",status:"completed"},{id:"5",billNumber:"RB-001230",customerName:"Vijay Singh",items:[{id:"7",name:"Item 7",quantity:6,price:200,total:1200},{id:"8",name:"Item 8",quantity:6,price:5,total:30}],itemCount:12,total:1250,paymentMethod:"card",date:"2024-11-11",time:"02:30 PM",status:"completed"},{id:"6",billNumber:"RB-001229",customerName:"Amit Patel",items:[{id:"9",name:"Item 9",quantity:4,price:80,total:320}],itemCount:4,total:320,paymentMethod:"cash",date:"2024-11-11",time:"11:00 AM",status:"completed"}],f={cash:"bg-green-100 text-green-700",upi:"bg-blue-100 text-blue-700",card:"bg-purple-100 text-purple-700",credit:"bg-orange-100 text-orange-700"},v={cash:"💵",upi:"📱",card:"💳",credit:"📝"};let i=d.filter(t=>(t.billNumber.toLowerCase().includes(r.toLowerCase())||t.customerName.toLowerCase().includes(r.toLowerCase())||t.customerPhone?.includes(r))&&(h==="all"||t.paymentMethod===h));p&&x&&(i=i.filter(t=>t.date>=p&&t.date<=x));const C=()=>{const t=[["Bill Number","Customer","Phone","Items","Total","Payment Method","Date","Time","Status"],...i.map(a=>[a.billNumber,a.customerName,a.customerPhone||"",a.itemCount,a.total,a.paymentMethod,a.date,a.time,a.status])].map(a=>a.join(",")).join(`
`),s=new Blob([t],{type:"text/csv"}),o=URL.createObjectURL(s),m=document.createElement("a");m.href=o,m.download=`sales_history_${new Date().toISOString().split("T")[0]}.csv`,m.click(),n.success("Sales report exported!")},S=t=>{j(t),w(!0)},B=t=>{const s=`Bill: ${t.billNumber}%0ACustomer: ${t.customerName}%0AItems: ${t.itemCount}%0ATotal: ₹${t.total}%0APayment: ${t.paymentMethod.toUpperCase()}%0ADate: ${t.date} ${t.time}`;window.open(`https://wa.me/?text=${s}`,"_blank")},$=t=>{d.map(s=>s.id===t.id?{...s,status:"voided"}:s),n.success("Bill voided successfully!")},E=t=>{d.map(s=>s.id===t.id?{...s,status:"returned"}:s),n.success("Bill returned successfully!")},M=t=>{const s=window.open("","_blank");s&&(s.document.write(`
        <html>
          <head>
            <title>Bill: ${t.billNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 500px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header h1 { font-size: 24px; }
              .header p { font-size: 14px; }
              .details { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .details p { font-size: 14px; }
              .items { margin-bottom: 20px; }
              .items table { width: 100%; border-collapse: collapse; }
              .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items th { background-color: #f2f2f2; }
              .total { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .total p { font-size: 14px; }
              .footer { text-align: center; margin-top: 20px; }
              .footer p { font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bill: ${t.billNumber}</h1>
                <p>Customer: ${t.customerName}</p>
                <p>Phone: ${t.customerPhone||"N/A"}</p>
                <p>Date: ${t.date} ${t.time}</p>
              </div>
              <div class="details">
                <p>Payment Method: ${t.paymentMethod.toUpperCase()}</p>
                <p>Status: ${t.status.toUpperCase()}</p>
              </div>
              <div class="items">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${t.items.map(o=>`
                      <tr>
                        <td>${o.name}</td>
                        <td>${o.quantity}</td>
                        <td>₹${o.price}</td>
                        <td>₹${o.total}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
              <div class="total">
                <p>Total Items: ${t.itemCount}</p>
                <p>Total Amount: ₹${t.total}</p>
              </div>
              <div class="footer">
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `),s.document.close(),s.print(),s.close())},P=i.reduce((t,s)=>t+s.total,0),F=i.length;return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24",children:[e.jsxs("div",{className:"bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("button",{onClick:()=>b("dashboard"),className:"text-white",children:e.jsx(k,{className:"w-6 h-6"})}),e.jsx("h1",{className:"text-white text-xl",children:"Sales History"}),e.jsx("button",{className:"text-white",children:e.jsx(c,{className:"w-6 h-6"})})]}),e.jsx("p",{className:"text-white/90 text-center",children:"Apne saare bills yahan dekhein"})]}),e.jsxs("div",{className:"px-6 pt-6 space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-gradient-to-br from-[#1E88E5] to-blue-600 rounded-2xl p-4 text-white shadow-lg",children:[e.jsx("p",{className:"text-white/80 text-sm mb-1",children:"Total Sales"}),e.jsxs("p",{className:"text-2xl",children:["₹",P]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-[#FF6F00] to-orange-600 rounded-2xl p-4 text-white shadow-lg",children:[e.jsx("p",{className:"text-white/80 text-sm mb-1",children:"Total Bills"}),e.jsx("p",{className:"text-2xl",children:F})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx(T,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"}),e.jsx(A,{type:"text",placeholder:"Bill number, customer name ya phone...",value:r,onChange:t=>g(t.target.value),className:"pl-12 h-12 bg-white border-gray-200 rounded-xl"})]}),e.jsx("div",{className:"flex items-center space-x-2 overflow-x-auto pb-2",children:[{value:"all",label:"All",icon:"📋"},{value:"today",label:"Today",icon:"📅"},{value:"week",label:"This Week",icon:"📆"},{value:"month",label:"This Month",icon:"🗓️"}].map(t=>e.jsxs("button",{onClick:()=>y(t.value),className:`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${N===t.value?"bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white":"bg-white text-gray-700 border border-gray-200"}`,children:[e.jsx("span",{className:"mr-1",children:t.icon}),t.label]},t.value))})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("h3",{className:"text-gray-900",children:["All Transactions (",i.length,")"]}),e.jsxs("button",{className:"text-[#1E88E5] text-sm flex items-center space-x-1",children:[e.jsx(I,{className:"w-4 h-4"}),e.jsx("span",{children:"Filter"})]})]}),e.jsx("div",{className:"space-y-3",children:i.map(t=>e.jsx("div",{className:"bg-white rounded-xl shadow-md overflow-hidden",children:e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-start justify-between mb-3",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center space-x-2 mb-1",children:[e.jsx("h4",{className:"text-gray-900",children:t.billNumber}),e.jsxs("span",{className:`text-xs px-2 py-1 rounded-full ${f[t.paymentMethod]}`,children:[v[t.paymentMethod]," ",t.paymentMethod.toUpperCase()]})]}),e.jsx("p",{className:"text-gray-600 text-sm mb-1",children:t.customerName}),t.customerPhone&&e.jsx("p",{className:"text-gray-400 text-xs",children:t.customerPhone})]}),e.jsxs("div",{className:"text-right",children:[e.jsxs("p",{className:"text-[#1E88E5] text-lg mb-1",children:["₹",t.total]}),e.jsxs("p",{className:"text-gray-400 text-xs",children:[t.itemCount," items"]})]})]}),e.jsxs("div",{className:"flex items-center justify-between pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"flex items-center space-x-1 text-gray-500 text-xs",children:[e.jsx(D,{className:"w-3 h-3"}),e.jsxs("span",{children:[t.date," • ",t.time]})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{onClick:()=>S(t),className:"text-[#1E88E5] hover:bg-blue-50 p-2 rounded-lg transition-colors",title:"View Details",children:e.jsx(R,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>B(t),className:"text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors",title:"Share on WhatsApp",children:e.jsx(q,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>M(t),className:"text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors",title:"Print Bill",children:e.jsx(L,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>$(t),className:"text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors",title:"Void Bill",children:e.jsx(U,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>E(t),className:"text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors",title:"Return Bill",children:e.jsx(z,{className:"w-4 h-4"})})]})]})]})},t.id))})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-md p-4",children:[e.jsx("h4",{className:"text-gray-900 mb-3",children:"Export Options"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs(u,{className:"bg-gradient-to-r from-green-500 to-green-600 h-10",onClick:C,children:[e.jsx(c,{className:"w-4 h-4 mr-2"}),"Excel"]}),e.jsxs(u,{className:"bg-gradient-to-r from-red-500 to-red-600 h-10",children:[e.jsx(c,{className:"w-4 h-4 mr-2"}),"PDF"]})]})]})]})]})}export{ie as SalesHistory};
