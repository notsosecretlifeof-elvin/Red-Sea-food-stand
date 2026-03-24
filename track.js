function loadOrder(){
  const id = localStorage.getItem("currentOrderId");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = orders.find(o => o.id == id);

  if(!order){
    document.getElementById("orderDetails").innerHTML = "Order not found";
    return;
  }

  document.getElementById("orderDetails").innerHTML = `
    <b>${order.name}</b><br><br>
    ${order.items.map(i=>`${i.name} x${i.qty}`).join("<br>")}<br><br>
    Total: UGX ${order.total}<br>
    Paid: UGX ${order.given}<br>
    Change: UGX ${order.change}
  `;

  const statusDiv = document.getElementById("orderStatus");

  if(order.status === "pending"){
    statusDiv.innerHTML = "⏳ Your food is being prepared...";
    statusDiv.className = "status-pending";
  } else {
    statusDiv.innerHTML = "✅ Your food is ready! Please come pick it up.";
    statusDiv.className = "status-done";
  }
}

setInterval(loadOrder, 1000);
loadOrder();