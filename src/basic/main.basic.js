// 각 상품에 대한 할인율을 정의하는 상수 객체
const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25
};

const ENTIRE_DISCOUNT_RATE = 0.2;
const DAY_DISCOUNT_RATE = 0.05;
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const LUCKY_SALE_INTERVAL = 30 * ONE_SECOND;
const SUGGESTION_INTERVAL = ONE_MINUTE;

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

/**
 * 상품 목록을 초기화하는 함수
 * @returns {void} 상품 리스트를 초기화합니다.
 */
function initializeProductList() {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 }
  ];
}

/**
 * HTML 요소를 생성하는 함수
 * @param {string} tag - 생성할 HTML 요소의 태그 이름
 * @param {Object} props - HTML 요소에 적용할 속성 객체 (속성명과 값의 쌍)
 * @returns {HTMLElement} 생성된 DOM 요소
 */
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

/**
 * UI를 설정하는 함수
 * @returns {void} 기본 UI 요소들을 설정하고 DOM에 추가합니다.
 */
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

/**
 * 장바구니와 관련된 이벤트 리스너를 설정하는 함수
 * @returns {void}
 */
function setupEventListeners() {
  addToCartButton.addEventListener('click', addItemToCart);
  cartDisplay.addEventListener('click', handleCartButtonClick);
}

/**
 * 상품 옵션을 업데이트하는 함수
 * @returns {void} 상품 선택 요소를 업데이트하고 재고가 없는 상품은 비활성화합니다.
 */
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

/**
 * 장바구니 총액을 계산하는 함수
 * @returns {void} 장바구니의 총액과 아이템 수를 계산하여 UI에 반영합니다.
 */
function calculateCartTotal() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let subTotal = 0;

  Array.from(cartItems).forEach((cartItem) => {
    const currentProduct = findProductById(cartItem.id);
    const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
    const itemTotal = currentProduct.price * quantity;
    const discountRate = getDiscountRate(currentProduct.id, quantity);

    itemCount += quantity;
    subTotal += itemTotal;
    totalAmount += itemTotal * (1 - discountRate);
  });

  applyDiscounts(subTotal);
  const discountInfo = calculateDiscountInfo();
  updateCartDisplay(discountInfo);
  updateStockInfo();
  renderBonusPoints();
}

/**
 * 장바구니의 할인 정보를 계산하는 함수
 * @returns {string}
 */
function calculateDiscountInfo() {
  return itemCount >= 10 ? '(10.0% 할인 적용)' : '';
}

/**
 * 상품 ID로 상품 찾기
 * @param {string} productId 상품의 ID
 * @returns {Object|undefined}
 */
function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

/**
 * 상품에 대한 할인율을 가져오는 함수
 * @param {string} productId 상품의 ID
 * @param {number} quantity 상품의 수량
 * @returns {number}
 */
function getDiscountRate(productId, quantity) {
  return quantity >= 10 ? DISCOUNT_RATES[productId] || 0 : 0;
}

/**
 * 할인을 적용하는 함수
 * @returns {void}
 */
function applyDiscounts(subTotal) {
  if (itemCount >= 30) {
    totalAmount = Math.min(totalAmount, subTotal * 0.75);
  }
  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
  }
}

/**
 * 장바구니 디스플레이를 업데이트하는 함수
 * @param {string} discountInfo 현재 할인 정보
 * @returns {void}
 */
function updateCartDisplay(discountInfo) {
  totalAmountDisplay.textContent = `총액: ${Math.round(totalAmount)}원${discountInfo}`;
}

/**
 * 재고 정보를 업데이트하는 함수
 * @returns {void}
 */
function updateStockInfo() {
  stockInfoDisplay.textContent = productList
    .filter((product) => product.stock < 5)
    .map((product) => `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}`)
    .join('\n');
}

/**
 * 장바구니 아이템에 대한 보너스 포인트를 렌더링하는 함수
 * @returns {void}
 */
function renderBonusPoints() {
  bonusPoints += Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = createElement('span', { id: 'loyalty-points', class: 'text-blue-500 ml-2' });
    totalAmountDisplay.appendChild(pointsTag);
  }
  pointsTag.textContent = `(포인트: ${bonusPoints})`;
}

/**
 * 장바구니에 아이템을 추가하는 함수
 * @returns {void} 선택한 상품을 장바구니에 추가하고 총액을 업데이트합니다.
 */
function addItemToCart() {
  const selectedProductId = selectedProductElement.value;
  const product = findProductById(selectedProductId);

  // 재고가 있을 경우
  if (product && product.stock > 0) {
    const cartItem = document.getElementById(product.id);

    if (cartItem) {
      updateCartItemQuantity(cartItem, product, 1);
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

/**
 * 장바구니 아이템의 수량을 업데이트하는 함수
 * @param {HTMLElement} cartItem 장바구니 항목에 해당하는 DOM 요소
 * @param {Product} product 장바구니에 있는 상품 객체
 * @param {number} change 수량 변화량 (+1 또는 -1)
 * @returns {void}
 */
function updateCartItemQuantity(cartItem, product, change) {
  const quantitySpan = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + change;

  if (newQuantity > 0 && newQuantity <= product.stock + currentQuantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.stock -= change;
  } else if (newQuantity <= 0) {
    cartItem.remove();
  } else {
    alert('재고가 부족합니다.');
  }
  return newQuantity;
}

/**
 * 장바구니에 새 아이템을 생성하고 추가하는 함수
 * @param {Product} product 장바구니에 추가할 상품 객체
 * @returns {void}
 */
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

/**
 * 장바구니 내 버튼 클릭 시 이벤트를 처리하는 함수
 * @param {Event} event - 클릭 이벤트 객체
 * @returns {void}
 */
function handleCartButtonClick(event) {
  const target = event.target;

  // 수량 변경 또는 삭제 버튼 클릭 시 처리
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const cartItem = document.getElementById(productId);
    const product = findProductById(productId);

    if (target.classList.contains('quantity-change')) {
      updateCartItemQuantity(cartItem, product, parseInt(target.dataset.change));
    } else if (target.classList.contains('remove-item')) {
      const removeQuantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
      product.stock += removeQuantity; // 재고 복구
      cartItem.remove(); // 장바구니에서 제거
    }

    calculateCartTotal(); // 총액 계산
  }
}

/**
 * 번개세일을 시작하는 함수
 * @returns {void}
 */
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
      }, LUCKY_SALE_INTERVAL);
    },
    Math.random() * 10 * ONE_SECOND
  );

  setTimeout(
    () => {
      setInterval(() => {
        if (lastSelectedProductId) {
          const suggestion = productList.find((item) => item.id !== lastSelectedProductId && item.stock > 0);
          if (suggestion.length > 0) {
            alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 ${DAY_DISCOUNT_RATE * 100}% 추가 할인!`);
            suggestion.price = Math.round(suggestion.price * (1 - DAY_DISCOUNT_RATE)); // 5% 할인
            updateProductOptions();
          }
        }
      }, SUGGESTION_INTERVAL);
    },
    Math.random() * 20 * ONE_SECOND
  );
}

main();
