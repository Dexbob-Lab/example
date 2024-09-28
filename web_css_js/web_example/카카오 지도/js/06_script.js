/*
kakao API를 활용한 지도 연동
사이트
    kakao 개발자 사이트: https://developers.kakao.com/
    kakao Maps API 사이트:  https://apis.map.kakao.com/
애플리케이션 생성:  개발자 > 내 애플리케이션 > 애플리케이션 추가하기 > 생성
애플리케이션 삭제:  개발자 > 내 애플리케이션 > 앱 선택 > 외쪽 탭 > 일반 > 앱삭제 > 앱영구 삭제
애플리케이션 API키:  개발자 > 내 애플리케이션 > 앱 선택 > 앱키 > JavaScript 키
    JavaScript 키:  ac503148bd7834dadad3522e4a215ede
앱 설정:    개발자 > 내 애플리케이션 > 앱 설정 > 플랫폼 > Web > 사이트 도메인 > 등록
    사이트 도메인:  http://localhost:5500       http://127.0.0.1:5500
앱 연동:    Maps API > Guide > 시작하기 > Javascript API를 불러오기 
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=ac503148bd7834dadad3522e4a215ede"></script>
지도 생성하기:   Maps API> Sample > 지도 > 지도 생성하기
위도경도 찾기:   Maps API> Sample > 지도 > 클릭한 위치에 마커 표시하기
마커 표시하기:   Maps API> Sample > 오버레이 > 마커 생성하기
컨트롤 올리기:   Maps API> Sample > 지도 > 지도에 컨트롤 올리기
교통정보 표시하기:   Maps API> Sample > 지도 > 지도에 교통정보 표시하기
로드뷰 생성하기:    Maps API> Sample > 로드뷰 > 로드뷰 생성하기
로드뷰 마커생성:    Maps API> Sample > 로드뷰 > 로드뷰에 마커와 인포윈도우 올리기
*/

const mapContainer = document.querySelector("#map");
const viewContainer = document.querySelector("#view");
const btnToggle = document.querySelector(".trafficToggle");
const viewToggle = document.querySelector(".viewToggle");
const btnReset = document.querySelector(".btnReset");

const mapOption = {
	center: new kakao.maps.LatLng(37.518426533457685, 127.11549286942622),
	level: 5
};
let map = new kakao.maps.Map(mapContainer, mapOption);
const marker = new kakao.maps.Marker({ position: mapOption.center });
const mapTypeControl = new kakao.maps.MapTypeControl();
const zoomControl = new kakao.maps.ZoomControl();
const view = new kakao.maps.Roadview(viewContainer);
const viewClient = new kakao.maps.RoadviewClient();

// 맵 불러오기
reflashMap();

// 로드뷰 파노ID 설정
viewClient.getNearestPanoId(mapOption.center, 50, panoId =>
	view.setPanoId(panoId, mapOption.center)
);
// 로드뷰 초기화 이벤트 처리 (마커 생성)
kakao.maps.event.addListener(view, "init", () => {
	new kakao.maps.Marker({
		position: mapOption.center,
		map: view
	});
});

// 브라우저 창 크기 변동에 따른 이벤트 처리
window.addEventListener("resize", () => reflashMap());

// 교통정보 버튼 클릭 이벤트 처리
btnToggle.addEventListener("click", e => {
	e.target.classList.toggle("on");
	setBtnToggle(e.target);
});

// 로드뷰 버튼 클릭 이벤트 처리
viewToggle.addEventListener("click", e => {
	e.target.classList.toggle("on");
	setViewToggle(e.target);
});

// 리셋 버튼 클릭 이벤트 처리
btnReset.addEventListener("click", e => map.panTo(mapOption.center));

function reflashMap() {
	mapContainer.innerHTML = "";
	map = new kakao.maps.Map(mapContainer, mapOption);
	marker.setMap(map);
	map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
	map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
	setBtnToggle(btnToggle);
}

function setBtnToggle(btnEl) {
	if (btnEl.classList.contains("on")) {
		map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
		btnEl.innerText = "Traffic OFF";
	} else {
		map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
		btnEl.innerText = "Traffic ON";
	}
}

function setViewToggle(viewEl) {
	mapContainer.classList.toggle("on");
	viewContainer.classList.toggle("on");
	if (viewEl.classList.contains("on")) {
		btnToggle.disabled = true;
		btnReset.disabled = true;
		viewEl.innerText = "Roadview OFF";
	} else {
		btnToggle.disabled = false;
		btnReset.disabled = false;
		viewEl.innerText = "Roadview ON";
	}
}
