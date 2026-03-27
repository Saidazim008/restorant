document.addEventListener("DOMContentLoaded", function () {
    // 1. O'ZGARUVCHILAR
    const btnSaboy = document.querySelector(".btn");
    const btnStol = document.querySelector(".button");
    const loginlar = document.querySelector(".loginlar");
    const menuKurish = document.querySelector(".menu-kurish");
    const mainContent = document.getElementById("mainContent");
    const backBtn = document.getElementById("backBtn");
    const cartBtn = document.getElementById("cartBtn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let selectedTable = null;

    // 2. NAVIGATSIYA (Tugmalar dizayni va ishlashi)
    btnSaboy.onclick = () => {
        loginlar.style.display = "none";
        mainContent.style.display = "block";
        cartBtn.style.display = "flex";
        backBtn.style.display = "block";
    };

    btnStol.onclick = () => {
        loginlar.style.display = "none";
        menuKurish.style.display = "flex";
        backBtn.style.display = "block";
    };

    document.querySelector(".btn-menu").onclick = () => {
        menuKurish.style.display = "none";
        mainContent.style.display = "block";
        cartBtn.style.display = "flex";
    };

    // Orqaga qaytishni to'g'ri ishlashi
    backBtn.onclick = () => {
        location.reload();
    };

    // 3. SAVAT MANTIQI (RASM BILAN!)
    window.addToCart = function (name, price, img) {
        // MUHIM: img argumenti HTMLdan kelishi shart!
        let found = cart.find(item => item.name === name);
        if (found) {
            found.qty++;
        } else {
            // Rasmni obyekt ichiga saqlaymiz
            cart.push({ name, price, img, qty: 1 });
        }
        updateCart();
    };

    function updateCart() {
        const cartItems = document.getElementById("cartItems");
        const cartCount = document.getElementById("cartCount");
        const totalPrice = document.getElementById("totalPrice");

        cartItems.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach((item, i) => {
            total += item.price * item.qty;
            count += item.qty;

            // SAVATDI RASM VA DIZAYN (Mana shu joyi o'zgardi)
            cartItems.innerHTML += `
                <div class="cart-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                    <img src="${item.img}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                    <div style="flex: 1;">
                        <p style="font-size: 14px; font-weight: bold; margin: 0;">${item.name}</p>
                        <p style="font-size: 12px; margin: 0;">${item.price.toLocaleString()} so'm</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <button onclick="changeQty(${i}, -1)" style="width: 25px; height: 25px; cursor: pointer;">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${i}, 1)" style="width: 25px; height: 25px; cursor: pointer;">+</button>
                        <button onclick="deleteItem(${i})" style="color: red; border: none; background: none; cursor: pointer; font-size: 18px;">🗑️</button>
                    </div>
                </div>`;
        });

        cartCount.innerText = count;
        totalPrice.innerText = total.toLocaleString();
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    window.changeQty = (index, val) => {
        if (cart[index].qty + val > 0) cart[index].qty += val;
        else cart.splice(index, 1);
        updateCart();
    };

    window.deleteItem = (index) => {
        if (confirm("O'chirilsinmi?")) {
            cart.splice(index, 1);
            updateCart();
        }
    };

    // 4. MODALLARNI YOPISH (Xatolar to'g'rilandi)
    cartBtn.onclick = () => document.getElementById("cartModal").classList.add("show");

    // Yopish tugmalari uchun IDlar
    document.getElementById("closeCart").onclick = () => document.getElementById("cartModal").classList.remove("show");
    document.getElementById("closeTableModal").onclick = () => document.getElementById("tableModal").style.display = "none";

    document.querySelector(".btn-joy").onclick = () => document.getElementById("tableModal").style.display = "flex";

    window.selectTable = (num) => {
        selectedTable = num;
        alert(num + "-stol tanlandi");
        document.getElementById("tableModal").style.display = "none";
        document.querySelector(".btn-menu").click();
    };

    // 5. BUYURTMA VA QIDIRUV
    document.getElementById("saveBtn").onclick = () => {
        if (cart.length === 0) return alert("Savat bo'sh!");
        document.getElementById("orderModal").style.display = "flex";
    };

    document.getElementById("confirmOrder").onclick = () => {
        const phone = document.getElementById("userPhone").value;
        if (phone.length < 13) return alert("Telefon raqami noto'g'ri!");

        alert("Buyurtma qabul qilindi! Stol: " + (selectedTable || "Dastavka"));
        cart = [];
        updateCart();
        location.reload();
    };

    document.getElementById("cancelOrder").onclick = () => {
        document.getElementById("orderModal").style.display = "none";
    };

    // Qidiruv
    document.getElementById("searchInput").oninput = function () {
        let val = this.value.toLowerCase();
        let cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            let title = card.querySelector("p").innerText.toLowerCase();
            card.style.display = title.includes(val) ? "block" : "none";
        });
    };

    updateCart();
});