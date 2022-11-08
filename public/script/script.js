// thêm bản đồ nền
var mapObject = L.map("map", { center: [10.030249, 105.772097], zoom: 14 });

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
                color: 'green',
                weight:2,
                fillColor:'blue',
                fillOpacity:0.2		//độ mờ, default 0.2
            }
        },
        marker: {
            icon: violetIcon
        },
        circle: true, 					
        circlemarker: false, 		// Turns off this drawing tool
    },
    edit: {
        featureGroup: drawnItems, 	//REQUIRED!!
        edit:true,
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
    console.log(layer.toGeoJSON());
    layer.addTo(drawnItems);
    var popupContent = 
			'<form style="width:500px">' + 
			'Name:<br><input type="text" id="input_name" name="store_name" value=""><br>' +
            'Address:<br><input type="text" id="input_address" name="store_address" value=""><br> <br>' +
			'<button type="button" class="btn btn-primary" value="Submit" id="addNewPoint" onclick="addPoint()">Submit</button>' + 
			'</form>';
    layer.bindPopup(popupContent).openPopup();

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

function addPoint(){
    layer.feature={};
    layer.feature.type="Feature";
    layer.feature.properties={};
    layer.feature.properties.name=$("#input_name").val();
    layer.feature.properties.address=$("#input_address").val();
    layer.closePopup();
    
    var dataObject = layer.toGeoJSON();
    $.ajax({
        async:false,
        type: "POST",
        url: '/addPoint',
        data: JSON.stringify(dataObject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(){
            console.log("gg");
        },
      });

}



