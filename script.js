// 로컬 스토리지용
let shops = JSON.parse(localStorage.getItem('myShops')) || [];
let categories = JSON.parse(localStorage.getItem('myCategories')) || [];
let tempPlace = null; // 등록 대기 중인 장소 임시 보관용

// 카카오 지도 설정 및 마커 표시
// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({zIndex:1});
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도 생성  
var map = new kakao.maps.Map(mapContainer, mapOption); 
// 장소 검색 객체 생성
var ps = new kakao.maps.services.Places(); 

const input = document.getElementById('shop-input');
const searchBtn = document.getElementById('search-btn');
// 검색 버튼 이벤트 로직
searchBtn.addEventListener('click', () => {
  const keyword = input.value;
  if(!keyword) return;

  // 키워드로 장소를 검색
  ps.keywordSearch(keyword, placesSearchCB);
});

const resultList = document.getElementById('result-list');

// 키워드 검색 완료 시 호출되는 콜백함수
function placesSearchCB (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        resultList.innerHTML = '';

        data.forEach(place => {
          const li = document.createElement('li');
          li.className = 'search-list';
          li.style.cursor = 'pointer';
          li.innerHTML = `
            <strong>${place.place_name}</strong><br>
            <small>${place.address_name}</small><br>
            <div class=save-btn-container>
            <button class="add-save-btn" type="button" data-bs-toggle="modal" data-bs-target="#categorySelectModal">등록</button>
            </div>
          `;

          // 지도 이동 이벤트
          li.addEventListener('click', () => {
          const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
          map.panTo(moveLatLon);
          map.setLevel(3);

          displayMarker(place);
        });
        li.classList.add('result-element');

        // 등록 버튼 이벤트
        const saveBtn = li.querySelector('.add-save-btn');
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addPlace(place);
        });
          resultList.appendChild(li);

        });
    } 
}

// 지도에 마커를 표시하는 함수
function displayMarker(place) {
    
    // 마커를 생성하고 지도에 표시
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커에 클릭이벤트를 등록
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}

const list = document.getElementById('list-container');
// 화면 렌더링(카테고리에 맞게)
function render(filterCategory = null) {
  list.innerHTML = '';

  const displayShops = filterCategory
    ? shops.filter(shop => shop.category == filterCategory)
    : [];

    if(displayShops.length === 0 && filterCategory) { // filterCategory === true 의미: 배지를 클릭했을때
      list.innerHTML = `<li>등록된 장소가 없습니다.</li>`;
      return;
    }

    displayShops.forEach((shop, index) => {
      const realIndex = shops.findIndex(s => s === shop); // 추출된 가게들에서의 인덱스가 아닌 진짜 기존 인덱스가 있어야 삭제할 때 안꼬임

      const li = document.createElement('li');
      li.innerHTML = `
      <div class="shop-item">
        <span class="badge rounded-pill category-list">${shop.category}</span>
        <strong>${shop.placeName}</strong>
        <small>${shop.placeAddress}</small>
        <button class="delete-btn" onclick="deleteShop(${realIndex})">삭제</button>
      </div>
    `;

    list.appendChild(li);
    });
}

const selectModal = new bootstrap.Modal(document.getElementById('categorySelectModal'));
function addPlace(place) {
  tempPlace = place;
  renderSelectCategories();
  selectModal.show();
}

function deleteShop(index) {
  shops.splice(index, 1); // splice(변경시작할 인덱스, 제거할 요소의 수)
  saveData();
  render(null);
}

function saveData() {
  localStorage.setItem('myShops', JSON.stringify(shops));
}

const selectCategoryList = document.getElementById('select-category-list');
// 장소 선택후 카테고리 선택시 렌더링 함수
function renderSelectCategories() {
  selectCategoryList.innerHTML = '';
  if(categories.length === 0) {
    alert('카테고리 등록 먼저 해주세요');
    return;
  }

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'badge rounded-pill category-list';
    btn.textContent = cat;

    btn.onclick = () => {
      shops.push({
        placeName: tempPlace.place_name,
        placeAddress: tempPlace.address_name,
        category: cat
      });

      saveData();
      render();
      selectModal.hide();
      alert(`${tempPlace.place_name}(이)가 [${cat}]카테고리에 등록되었습니다.`);
      tempPlace = null;
    };
    selectCategoryList.appendChild(btn);
  });
}

const categoryAddBtn = document.getElementById('categoryAddBtn');
const categoryContainer = document.getElementById('categoryContainer');
const modalCategoryContainer = document.getElementById('modalCategoryContainer');

categoryAddBtn.addEventListener('click', () => {
    const input = document.getElementById('category');
    const value = input.value.trim();
    if(!value) {
      alert('카테고리를 작성해주세요');
      return;
    }
    const div = document.createElement('div');
    div.className = 'badge rounded-pill category-list';
    div.textContent = value;
    div.style.cursor = 'pointer';
    categoryContainer.appendChild(div);
    input.value = "";

    categories.push(value);
    saveCateogories();
    renderCategories();
});

// 카테고리 렌더링
function renderCategories() {
  categoryContainer.innerHTML = '';
  if(modalCategoryContainer) modalCategoryContainer.innerHTML = '';

  categories.forEach((cat, index) => {
    const div = document.createElement('div');
    div.className = 'badge rounded-pill category-list';
    div.textContent = cat;
    div.style.cursor = 'pointer';

    div.onclick = () => {
      render(cat);
    }

    categoryContainer.appendChild(div);

    if(modalCategoryContainer) {
      const modalDiv = document.createElement('div');
      modalDiv.className = 'badge rounded-pill category-list';
      modalDiv.innerHTML = `${cat} <i class="fa-solid fa-x"></i>`;
      modalDiv.style.cursor = 'pointer';
      modalDiv.onclick = () => {
        if(confirm('해당 카테고리를 삭제하시겠습니까?')) {
          categories.splice(index, 1);
          saveCateogories();
          renderCategories(); // 삭제시 특정 요소를 지우는것이 아니라, 전체 화면을 담당하는 rednerCategories()를 재호출하는 방식
        } else {
          return;
        }
      };
      modalCategoryContainer.appendChild(modalDiv);
    }
  });
}

function saveCateogories() {
  localStorage.setItem('myCategories', JSON.stringify(categories));
}

// 실행
renderCategories();