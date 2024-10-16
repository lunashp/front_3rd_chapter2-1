var productList, productSelect, addBtn, cartDisplay, cartTotalDisplay, stockStatusDisplay;
var lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;
function main() {
  productList = [
    { id: 'p1', name: '상품1', value: 10000, q: 50 },
    { id: 'p2', name: '상품2', value: 20000, q: 30 },
    { id: 'p3', name: '상품3', value: 30000, q: 20 },
    { id: 'p4', name: '상품4', value: 15000, q: 0 },
    { id: 'p5', name: '상품5', value: 25000, q: 10 }
  ];

  const root = document.getElementById('app');
  const cont = document.createElement('div');
  const wrap = document.createElement('div');
  const hTxt = document.createElement('h1');

  cartDisplay = document.createElement('div');
  cartTotalDisplay = document.createElement('div');
  productSelect = document.createElement('select');
  addBtn = document.createElement('button');
  stockStatusDisplay = document.createElement('div');

  cartDisplay.id = 'cart-items';
  cartTotalDisplay.id = 'cart-total';
  productSelect.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockStatusDisplay.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  cartTotalDisplay.className = 'text-xl font-bold my-4';
  productSelect.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockStatusDisplay.className = 'text-sm text-gray-500 mt-2';

  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';

  updateProductSelectOptions();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisplay);
  wrap.appendChild(cartTotalDisplay);
  wrap.appendChild(productSelect);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockStatusDisplay);
  cont.appendChild(wrap);
  root.appendChild(cont);

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.value = Math.round(luckyItem.value * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        const suggest = productList.find(function (item) {
          return item.id !== lastSelectedProduct && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.value = Math.round(suggest.value * 0.95);
          updateProductSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateProductSelectOptions() {
  productSelect.innerHTML = '';
  productList.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;
    const { name, value, q } = item;
    option.textContent = `${name} - ${value}원`;
    if (q === 0) option.disabled = true;
    productSelect.appendChild(option);
  });
}

// 카트 계산
function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  var cartItems = cartDisplay.children;
  var subTotal = 0;
  for (var i = 0; i < cartItems.length; i++) {
    // (function () {
    for (var j = 0; j < productList.length; j++) {
      var currentItem;
      if (productList[j].id === cartItems[i].id) {
        currentItem = productList[j];
        break;
      }
    }

    var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    var itemTotal = currentItem.value * q;
    var discount = 0;
    itemCount += q;
    subTotal += itemTotal;
    if (q >= 10) {
      if (currentItem.id === 'p1') discount = 0.1;
      else if (currentItem.id === 'p2') discount = 0.15;
      else if (currentItem.id === 'p3') discount = 0.2;
      else if (currentItem.id === 'p4') discount = 0.05;
      else if (currentItem.id === 'p5') discount = 0.25;
    }
    totalAmount += itemTotal * (1 - discount);
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  cartTotalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotalDisplay.appendChild(span);
  }
  updateStockStatus();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
  var pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    cartTotalDisplay.appendChild(pointsTag);
  }
  pointsTag.textContent = `(포인트: ${bonusPoints})`;
};

function updateStockStatus() {
  var stockMessage = '';
  productList.forEach(function (item) {
    const { name, q } = item;
    if (item.q < 5) {
      stockMessage += `${name}: ${q > 0 ? `재고 부족 (${q}개 남음)` : '품절'}\n`;
    }
  });
  stockStatusDisplay.textContent = stockMessage;
}

main();

addBtn.addEventListener('click', function () {
  var selItem = productSelect.value;
  var itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.value + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.value +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    calculateCart();
    lastSelectedProduct = selItem;
  }
});

cartDisplay.addEventListener('click', function (event) {
  var tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calculateCart();
  }
});
