const ordersContainer = document.getElementById("orders");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function displayOrders() {
  ordersContainer.innerHTML = "";

  orders.forEach((order, index) => {
    let orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    if (order.status === "ready") {
      orderDiv.classList.add("ready");
    }

    let content = document.createElement("p");
    content.innerHTML = `
      <strong>${order.name}</strong><br>
      ${order.items.map(i => `${i.name} x${i.qty}`).join(", ")}<br>
      Total: UGX ${order.total}<br>
      Paid: UGX ${order.given}<br>
      Change: ${order.change < 0 ? `Short UGX ${Math.abs(order.change)}` : `UGX ${order.change}`}
    `;

    orderDiv.appendChild(content);

    if (order.status === "pending") {
      let readyBtn = document.createElement("button");
      readyBtn.textContent = "Mark as Ready";
      readyBtn.onclick = () => {
        orders[index].status = "ready";
        localStorage.setItem("orders", JSON.stringify(orders));
        displayOrders();
      };
      orderDiv.appendChild(readyBtn);
    }

    if (order.status === "ready") {
      let removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove Order";
      removeBtn.onclick = () => {
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        displayOrders();
      };
      orderDiv.appendChild(removeBtn);
    }

    ordersContainer.appendChild(orderDiv);
  });
}

displayOrders();