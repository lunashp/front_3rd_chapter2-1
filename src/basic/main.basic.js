// 각 상품에 대한 할인율을 정의하는 상수 객체
const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25
};

// 전역 변수 선언
let productList, selectedProductElement, addToCartButton, cartDisplay, totalAmountDisplay, stockInfoDisplay;
let lastSelectedProductId,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

function main() {
  initializeProductList();
  setupUI();
  setupEventListeners();
  startLuckySale();
}

// 상품 목록을 초기화하는 함수
function initializeProductList() {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 }
  ];
}

// HTML 요소를 생성하는 함수
function createElement(tag, props) {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
}

// UI를 설정하는 함수
function setupUI() {
  const root = document.getElementById('app');
  const container = createElement('div', { class: 'bg-gray-100 p-8' });
  const wrapper = createElement('div', {
    class: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  });
  const headerText = createElement('h1', { class: 'text-2xl font-bold mb-4', textContent: '장바구니' });

  cartDisplay = createElement('div', { id: 'cart-items' });
  totalAmountDisplay = createElement('div', { id: 'cart-total', class: 'text-xl font-bold my-4' });
  selectedProductElement = createElement('select', { id: 'product-select', class: 'border rounded p-2 mr-2' });
  addToCartButton = createElement('button', {
    id: 'add-to-cart',
    class: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가'
  });
  stockInfoDisplay = createElement('div', { id: 'stock-status', class: 'text-sm text-gray-500 mt-2' });

  updateProductOptions();

  // 생성한 요소들을 래퍼에 추가
  wrapper.append(
    headerText,
    cartDisplay,
    totalAmountDisplay,
    selectedProductElement,
    addToCartButton,
    stockInfoDisplay
  );
  container.appendChild(wrapper);
  root.appendChild(container);

  calculateCartTotal();
}

// 이벤트 리스너를 설정하는 함수
function setupEventListeners() {
  addToCartButton.addEventListener('click', addItemToCart);
  cartDisplay.addEventListener('click', handleCartButtonClick);
}

// 상품 옵션을 업데이트하는 함수
function updateProductOptions() {
  selectedProductElement.innerHTML = '';
  productList.forEach((product) => {
    const option = createElement('option', {
      value: product.id,
      textContent: `${product.name} - ${product.price}원`
    });
    if (product.stock === 0) option.disabled = true; // 재고가 없으면 옵션 비활성화
    selectedProductElement.appendChild(option);
  });
}

// 장바구니 총액을 계산하는 함수
function calculateCartTotal() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let subtotal = 0;

  Array.from(cartItems).forEach((cartItem) => {
    const currentProduct = findProductById(cartItem.id);
    const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
    const itemTotal = currentProduct.price * quantity;
    const discountRate = getDiscountRate(currentProduct.id, quantity);

    itemCount += quantity;
    subtotal += itemTotal;
    totalAmount += itemTotal * (1 - discountRate);
  });

  applyBulkDiscount(subtotal);
  applyTuesdayDiscount();

  const discountInfo = calculateDiscountInfo();
  updateCartDisplay(discountInfo);
  updateStockInfo();
  renderBonusPoints();
}

// 할인 정보를 계산하는 함수
function calculateDiscountInfo() {
  let discountInfo = '';
  if (itemCount >= 10) {
    discountInfo = '(10.0% 할인 적용)';
  }
  return discountInfo;
}

// 상품 ID로 상품 찾기
function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

// 할인율을 가져오는 함수
function getDiscountRate(productId, quantity) {
  return quantity >= 10 ? DISCOUNT_RATES[productId] || 0 : 0;
}

// 대량 구매 할인 적용 함수
function applyBulkDiscount(subtotal) {
  if (itemCount >= 30) {
    totalAmount = Math.min(totalAmount, subtotal * (1 - 0.25));
  }
}

// 화요일 할인 적용 함수
function applyTuesdayDiscount() {
  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
  }
}

// 장바구니 디스플레이 업데이트 함수
function updateCartDisplay(discountInfo) {
  totalAmountDisplay.textContent = `총액: ${Math.round(totalAmount)}원${discountInfo}`;
}

// 재고 정보 업데이트 함수
function updateStockInfo() {
  stockInfoDisplay.textContent = productList
    .filter((product) => product.stock < 5)
    .map((product) => `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}`)
    .join('\n');
}

// 적립 포인트 표시 함수
function renderBonusPoints() {
  bonusPoints += Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = createElement('span', { id: 'loyalty-points', class: 'text-blue-500 ml-2' });
    totalAmountDisplay.appendChild(pointsTag);
  }
  pointsTag.textContent = `(포인트: ${bonusPoints})`;
}

// 장바구니에 아이템 추가 함수
function addItemToCart() {
  const selectedProductId = selectedProductElement.value;
  const product = findProductById(selectedProductId);

  // 재고가 있을 경우
  if (product && product.stock > 0) {
    const cartItem = document.getElementById(product.id);

    if (cartItem) {
      const currentQuantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
      const newQuantity = currentQuantity + 1;

      // 새로운 수량이 재고를 초과하지 않을 경우
      if (newQuantity <= product.stock) {
        updateCartItemQuantity(cartItem, product, 1);
        product.stock--;
      } else {
        // 재고가 부족할 경우 알림 표시
        alert('재고가 부족합니다.');
      }
    } else {
      createCartItem(product);
      product.stock--;
    }

    calculateCartTotal();
    lastSelectedProductId = selectedProductId;
  } else {
    alert('해당 상품의 재고가 없습니다.');
  }
}

// 장바구니 아이템 수량 업데이트 함수
function updateCartItemQuantity(cartItem, product, change) {
  const quantitySpan = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + change;

  // 새로운 수량이 재고를 초과하지 않으며 0보다 클 경우
  if (newQuantity <= product.stock + currentQuantity && newQuantity > 0) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.stock -= change;
  } else if (newQuantity <= 0) {
    cartItem.remove();
  } else {
    alert('재고가 부족합니다.');
  }
  return newQuantity;
}

// 장바구니 아이템 생성 함수
function createCartItem(product) {
  const cartItem = createElement('div', { id: product.id, class: 'flex justify-between items-center mb-2' });
  cartItem.innerHTML = `
      <span>${product.name} - ${product.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>`;
  cartDisplay.appendChild(cartItem);
}

// 장바구니 버튼 클릭 처리 함수
function handleCartButtonClick(event) {
  const target = event.target;

  // 수량 변경 또는 삭제 버튼 클릭 시 처리
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const cartItem = document.getElementById(productId);
    const product = findProductById(productId);

    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
      const newQuantity = currentQuantity + qtyChange;

      // 재고 체크
      if (newQuantity > 0 && newQuantity <= product.stock + currentQuantity) {
        cartItem.querySelector('span').textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
        product.stock -= qtyChange; // 재고 감소
      } else if (newQuantity <= 0) {
        cartItem.remove(); // 수량이 0이 되면 장바구니에서 제거
        product.stock += currentQuantity; // 재고 복구
      } else {
        alert('재고가 부족합니다.'); // 재고 부족 알림
      }
    } else if (target.classList.contains('remove-item')) {
      const removeQuantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
      product.stock += removeQuantity; // 재고 복구
      cartItem.remove(); // 장바구니에서 제거
    }

    calculateCartTotal(); // 총액 계산
  }
}

const ENTIRE_DISCOUNT_RATE = 0.2;
const DAY_DISCOUNT_RATE = 0.05;
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * 1000;

// 번개세일 시작 함수
function startLuckySale() {
  setTimeout(
    () => {
      setInterval(() => {
        const luckyItem = productList[Math.floor(Math.random() * productList.length)];
        if (Math.random() < 0.3 && luckyItem.stock > 0) {
          luckyItem.price = Math.round(luckyItem.price * (1 - ENTIRE_DISCOUNT_RATE)); // 20% 할인
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          updateProductOptions();
        }
      }, 30 * ONE_SECOND);
    },
    Math.random() * 10 * ONE_SECOND
  );

  setTimeout(
    () => {
      setInterval(() => {
        if (lastSelectedProductId) {
          const suggestion = productList.find((item) => item.id !== lastSelectedProductId && item.stock > 0);
          if (suggestion) {
            alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 ${DAY_DISCOUNT_RATE * 100}% 추가 할인!`);
            suggestion.price = Math.round(suggestion.price * (1 - DAY_DISCOUNT_RATE)); // 5% 할인
            updateProductOptions();
          }
        }
      }, ONE_MINUTE);
    },
    Math.random() * 20 * ONE_SECOND
  );
}

// const ENTIRE_DISCOUNT_RATE = 0.2; // 20% 할인
// const DAY_DISCOUNT_RATE = 0.05; // 5% 추가 할인
// const LUCKY_SALE_INTERVAL = 30 * 1000; // 30초
// const SUGGESTION_INTERVAL = 60 * 1000; // 1분
// const INITIAL_DELAY_MIN = 0; // 초기 지연 최소값
// const INITIAL_DELAY_MAX_LUCKY = 10 * 1000; // 번개세일 초기 지연 최대값 (10초)
// const INITIAL_DELAY_MAX_SUGGESTION = 20 * 1000; // 추천 상품 초기 지연 최대값 (20초)

// // 번개세일 시작 함수
// function startLuckySale() {
//   // 번개세일 시작
//   setTimeout(() => {
//     setInterval(() => {
//       const luckyItem = productList[Math.floor(Math.random() * productList.length)];
//       if (Math.random() < 0.3 && luckyItem.stock > 0) {
//         luckyItem.price = Math.round(luckyItem.price * (1 - ENTIRE_DISCOUNT_RATE)); // 20% 할인
//         alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
//         updateProductOptions();
//       }
//     }, LUCKY_SALE_INTERVAL); // 30초마다 실행
//   }, Math.random() * INITIAL_DELAY_MAX_LUCKY); // 0~10초 후 시작

//   // 추천 상품 알림 시작
//   setTimeout(() => {
//     setInterval(() => {
//       if (lastSelectedProductId) {
//         const suggestion = productList.find((item) => item.id !== lastSelectedProductId && item.stock > 0);
//         if (suggestion) {
//           alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 ${DAY_DISCOUNT_RATE * 100}% 추가 할인!`);
//           suggestion.price = Math.round(suggestion.price * (1 - DAY_DISCOUNT_RATE)); // 5% 할인
//           updateProductOptions();
//         }
//       }
//     }, SUGGESTION_INTERVAL); // 1분마다 실행
//   }, Math.random() * INITIAL_DELAY_MAX_SUGGESTION); // 0~20초 후 시작
// }

main();
