const input = document.getElementById('shop-input');
const searchBtn = document.getElementById('search-btn');
const list = document.getElementById('list-container');

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({zIndex:1});

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(); 

searchBtn.addEventListener('click', () => {
  const keyword = input.value;
  if(!keyword) return;

  // 키워드로 장소를 검색합니다
  ps.keywordSearch(keyword, placesSearchCB);
});

const resultList = document.getElementById('result-list');

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        resultList.innerHTML = '';

        data.forEach(place => {
          const li = document.createElement('li');
          li.style.cursor = 'pointer';
          li.innerHTML = `
            <strong>${place.place_name}</strong><br>
            <small>${place.address_name}</small><br>
            <button class="add-save-btn">등록</button>
          `;
          li.addEventListener('click', () => {
          const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
          map.panTo(moveLatLon);
          map.setLevel(3);

          displayMarker(place);
        });

        const saveBtn = li.querySelector('.add-save-btn');
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addPlace(place);
        });
          resultList.appendChild(li);

        });
    } 
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}

let shops = JSON.parse(localStorage.getItem('myShops')) || [];

function render() {
  list.innerHTML = '';
  shops.forEach((shop, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
    <div>
      <strong>${shop.placeName}</strong>
      <small>${shop.placeAddress}</small>
      <button class="delete-btn" onclick="deleteShop(${index})">삭제</button>
    </div>
    `;
    list.appendChild(li);
  });
}

function saveData() {
  localStorage.setItem('myShops', JSON.stringify(shops));
}

function deleteShop(index) {
  shops.splice(index, 1); // splice(변경시작할 인덱스, 제거할 요소의 수)
  saveData();
  render();
}

render();

function addPlace(place) {
  shops.push({
    placeName: place.place_name,
    placeAddress: place.address_name
  })
  saveData();

  render();

  alert(`${place.place_name}이(가) 등록되었습니다.`);
}
