const menu = [
  { id:1, name:"Rice & Chicken 🍛", price: 5000 },
  { id:2, name:"Rolex 🌯", price: 3000 },
  { id:3, name:"Chapati & Beans 🫓", price: 2500 },
  { id:4, name:"Samosa 🥟", price: 2000 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* MENU */
function showMenu(){
  document.getElementById("menu").innerHTML = menu.map(item => `
    <div class="menu-item">
      <div>
        <div class="menu-name">${item.name}</div>
        <div class="menu-price">UGX ${item.price}</div>
      </div>
      <button class="add-btn" onclick="add(${item.id})">Add</button>
    </div>
  `).join('');
}

/* ADD TO CART */
function add(id){
  const item = menu.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...item, qty:1});
  saveCart();
}

/* CHANGE QTY */
function changeQty(id, change){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += change;
  if(item.qty <=0) cart = cart.filter(c=>c.id!==id);
  saveCart();
}

/* SAVE CART */
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}

/* DISPLAY CART */
function showCart(){
  const div = document.getElementById("cartList");
  if(cart.length===0){
    div.innerHTML="<i>Cart is empty</i>";
    document.getElementById("total").textContent="";
    document.getElementById("changeBox").textContent="";
    return;
  }

  let total=0;
  div.innerHTML = cart.map(item=>{
    total += item.price*item.qty;
    return `
      <div class="cart-item">
        <div class="cart-name">${item.name}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("total").textContent = "Total: UGX " + total;
  calcChange(); // ✅ ensures change updates
}

/* CALCULATE CHANGE */
function calcChange(){
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const given = parseInt(document.getElementById("moneyGiven").value)||0;
  const box = document.getElementById("changeBox");
  if(given>0 && total>0){
    const change = given-total;
    box.textContent = change<0 
      ? `Short by UGX ${Math.abs(change)}`
      : `Change: UGX ${change}`;
    box.style.color = change<0 ? "red" : "green";
  } else { box.textContent=""; }
}

/* PLACE ORDER */
function placeOrder(){
  const name = document.getElementById("customerName").value.trim();
  if(!name || cart.length===0){ alert("Enter name and add food"); return; }

  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const order = {
    id: Date.now(),
    name,
    items: cart,
    total,
    status: "pending"
  };

  let orders = JSON.parse(localStorage.getItem("orders"))||[];
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.setItem("currentOrderId", order.id);
  localStorage.removeItem("cart"); // clear cart after order

  window.location.href = "track.html";
}

showMenu();
showCart();
