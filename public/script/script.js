// thêm bản đồ nền
// var mapObject = L.map("map", { center: [10.030249, 105.772097], zoom: 14 });
var mapObject = L.map('map').setView([10.030249, 105.772097], 14);
mapObject.zoomControl.setPosition('topright');

var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapObject);


//  sự kiện xảy ra ở mỗi feature trong FeatureCollection
function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.Name);
}
//khai báo featuregroup để vẽ
var drawnItems = L.featureGroup().addTo(mapObject);	

//Các option cho công cụ vẽ
var options = {
    position: 'topleft',			//default 'topleft'
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 2
            },
            metric:true				//default true là met; false là foot
        },
        polygon: {
            shapeOptions: {
                color: '#bada55'
            },
            showArea:true,			//default false
        },
        rectangle: {
            shapeOptions: {
                color: '#bada55'
            },
            showArea:true,			//default false
        },
        marker: {
            icon: violetIcon
        },
        circle: false, 					
        circlemarker: false, 		// Turns off this drawing tool
    },
    edit: {
        featureGroup: drawnItems, 	//REQUIRED!!
        edit: false,
        remove: true,
    }
};

var layer=new L.Layer();

//Thêm điều khiển vẽ; Icon mặc nhiên trong thư mục css/images
var drawControl = new L.Control.Draw(options).addTo(mapObject);
//Khi vẽ thì thêm vào lớp drawnItems
function showText(e) {
    //drawnItems.clearLayers();
    layer = e.layer;
    // console.log(layer.toGeoJSON());
    layer.addTo(drawnItems);

    var typegeo = layer.toGeoJSON().geometry.type;
	var length = layer.toGeoJSON().geometry.coordinates.length;

	// nếu là đường thì tính chiều dài
	if (typegeo == "LineString") {
        console.log(typegeo);

		var begin = layer.toGeoJSON().geometry.coordinates[0];
		var end = layer.toGeoJSON().geometry.coordinates[length - 1];

		L.marker([begin[1], begin[0]]).addTo(drawnItems);
		L.marker([end[1], end[0]]).addTo(drawnItems);

		var tempLatLng = null;
		var totalDistance = 0.00000;
		$.each(layer._latlngs, function (i, latlng) {
			if (tempLatLng == null) {
				tempLatLng = latlng;
				return;
			}

			totalDistance += tempLatLng.distanceTo(latlng);
			tempLatLng = latlng;
		});
		if (totalDistance > 2000) {
			layer.bindPopup('Khoảng cách giữa 2 điểm là: ' + (totalDistance / 1000).toFixed(2) + ' km').openPopup();
		}
		else {
			layer.bindPopup('Khoảng cách giữa 2 điểm là: ' + (totalDistance).toFixed(2) + ' m').openPopup();
		}
	}
	// nếu là vùng thì tính diện tích
	else if (typegeo == "Polygon") {
        console.log(typegeo);
		const area = turf.area(layer.toGeoJSON().geometry);
		var total = Math.round(area * 100) / 100
		if (total > 2000) {
			layer.bindPopup('Diện tích là: ' + (total / 1000).toFixed(2) + ' km²').openPopup();
		}
		else {
			layer.bindPopup('Diện tích  là: ' + total.toFixed(2) + ' m²').openPopup();
		}
	}
    else {
        var popupContent = 
			'<form style="width:1000px">' + 
			'Name:<br><input type="text" id="input_name" name="store_name" value=""><br>' +
            'Address:<br><input type="text" id="input_address" name="store_address" value=""><br>' +
            'Ward:<br><select name="ward" id="wardOption"><option>--Please choose an option--</option><option value="Bình Thủy">Bình Thủy</option>' +
            '<option value="Ô Môn">Ô Môn</option>'+ 
            '<option value="Ninh Kiều">Ninh Kiều</option>' +
            ' <option value="Vĩnh Thạnh">Vĩnh Thạnh</option>'+ 
            '<option value="Thới Lai">Thới Lai</option>' +
            '<option value="Cờ Đỏ">Cờ Đỏ</option> '+
            '<option value="Cái Răng">Cái Răng</option>  </select><br><br>'+
			'<button type="button" class=" btn btn-danger" value="Submit" id="modal" onclick="addPoint()">Submit</button>' + 
			'</form>';
        layer.bindPopup(popupContent).openPopup();
        
    }

    //collection dạng object
    var collection = drawnItems.toGeoJSON();
    //null: không hàm xử lý, 2: thụt từng cấp là 2 khoảng trắng
    var geojson1 = JSON.stringify(collection, null, 2);	
    $("#geojsontext1").val(geojson1);
    //JSON.stringify chuyển object thành chuỗi JSON
    var geojson2 = JSON.stringify(layer.toGeoJSON().geometry, null, 2);
    $("#geojsontext2").val(geojson2);
}

//Khi một đối tượng được vẽ
mapObject.on("draw:created", showText);

$("#wardOption").on("change", function () {
    console.log($("#wardOption").val());
})
// thêm cửa hàng mới
function addPoint(){
    layer.feature={};
    layer.feature.type="Feature";
    layer.feature.properties={};
    layer.feature.properties.name=$("#input_name").val();
    layer.feature.properties.address=$("#input_address").val();
    layer.feature.properties.ward = $("#wardOption").val();
    // layer.bindPopup(popupContent).closePopup();
    var dataObject = layer.toGeoJSON();
    $.ajax({
        async:false,
        type: "POST",
        url: '/addPoint',
        data: JSON.stringify(dataObject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            console.log("yes");
            location.reload();
        },
      });
}

//Tạo nút lệnh Remove
var control = L.control({ position: "topleft" });
control.onAdd = function (map) {
	var div = L.DomUtil.create("div", "divsave");
	div.innerHTML = '<input type="button" id="btnremove" class="btn btn-danger" value="Xóa">';
	return div;
};
control.addTo(mapObject);

$("#btnremove").on("click", function () {
	drawnItems.clearLayers();
});

L.control.locate().addTo(mapObject);

// L.Control.geocoder().addTo(mapObject);
