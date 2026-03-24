const menu = [
  { id:1, name:"Rice & Chicken 🍛", price: 5000 },
  { id:2, name:"Rolex 🌯", price: 3000 },
  { id:3, name:"Chapati & Beans 🫓", price: 2500 },
  { id:4, name:"Samosa 🥟", price: 2000 }
];

let cart = [];

function showMenu(){
  document.getElementById("menu").innerHTML = menu.map(item => `
    <div class="menu-item">
      ${item.name} - UGX ${item.price}
      <button class="add-btn" onclick="add(${item.id})">+</button>
    </div>
  `).join('');
}

function add(id){
  const item = menu.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);

  if(existing) existing.qty++;
  else cart.push({...item, qty:1});

  showCart();
}

function remove(id){
  cart = cart.filter(c=>c.id!==id);
  showCart();
}

function showCart(){
  const div = document.getElementById("cartList");

  if(cart.length===0){
    div.innerHTML="Cart empty";
    document.getElementById("total").textContent="";
    document.getElementById("changeBox").textContent = "";
    return;
  }

  let total=0;

  div.innerHTML = cart.map(item=>{
    total+=item.price*item.qty;
    return `${item.name} x${item.qty} <button class="remove-btn" onclick="remove(${item.id})">x</button>`;
  }).join("<br>");

  document.getElementById("total").textContent="Total: UGX "+total;
  calcChange();
}

function calcChange(){
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const given = parseInt(document.getElementById("moneyGiven").value)||0;
  const box = document.getElementById("changeBox");

  if(given>0 && total>0){
    const change = given-total;
    if(change<0){
      box.textContent = `Short by UGX ${Math.abs(change)}`;
      box.style.color = "red";
    } else {
      box.textContent = `Change: UGX ${change}`;
      box.style.color = "goldenrod";
    }
  } else {
    box.textContent="";
  }
}

function placeOrder(){
  const name = document.getElementById("customerName").value.trim();

  if(!name || cart.length===0){
    alert("Enter name and add food");
    return;
  }

  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const given = parseInt(document.getElementById("moneyGiven").value)||0;
  const change = given-total;

  const order = {
    id: Date.now(),
    name,
    items: cart,
    total,
    given,
    change,
    status: "pending"
  };

  let orders = JSON.parse(localStorage.getItem("orders"))||[];
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.setItem("currentOrderId", order.id);

  window.location.href = "track.html";
}

showMenu();
showCart();