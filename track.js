const orderId = localStorage.getItem("currentOrderId");

function loadOrder() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find(o => o.id === Number(orderId));

  if (!order) {
    document.getElementById("orderDetails").innerHTML = "Order not found";
    document.getElementById("orderStatus").innerHTML = "";
    return;
  }

  // ORDER DETAILS
  document.getElementById("orderDetails").innerHTML = `
    <strong>Order #${order.id}</strong><br><br>
    ${order.items.map(i => `${i.name} x${i.qty}`).join("<br>")}<br><br>
    Total: UGX ${order.total}<br>
    Paid: UGX ${order.given || order.total}<br>
    Change: ${order.change < 0 ? `Short by UGX ${Math.abs(order.change)}` : `UGX ${order.change || 0}`}
  `;

  // STATUS BAR
  const steps = ["Preparing", "Ready"];
  let statusHTML = `<div class="status-bar">`;

  steps.forEach((step, index) => {
    const isActive = (order.status === "pending" && step === "Preparing") ||
                     (order.status === "ready" && step === "Ready");
    statusHTML += `<div class="status-step ${isActive ? "active" : ""}">${step}</div>`;
  });

  statusHTML += `</div>`;
  document.getElementById("orderStatus").innerHTML = statusHTML;
}

// AUTO REFRESH
setInterval(loadOrder, 2000);
loadOrder();
