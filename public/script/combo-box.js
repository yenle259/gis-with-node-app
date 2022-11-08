/*thêm 1 layer vào bản đồ tên layerObject để tí thêm các Point cửa hàng vào layer này, rồi gán layer này vào mapObject 
khi gỡ cũng chỉ cần gỡ or clear layer là tắt hết các đối tượng cho tiện  :)) */
var layerObject = L.layerGroup().addTo(mapObject);

$.getJSON("/allstore", function (ft) { 
    var itemView = $(".item-view");
    function onEachFeature(feature, layer) { //thêm ds các cửa hàng bách hóa xanh vào list bên cạnh
        itemView.append("<div class='item detail-item-current' id="+feature._id+"  zindex='1'><div class='info'><div class='name'>"+feature.properties.name+"</div><div class='address'>"+feature.properties.address+"</div></div></div>");
        layer.bindPopup('<h3>'+feature.properties.name+'</h3><p>Địa chỉ: '+feature.properties.address+'</p>');
        layer.setIcon(blueIcon);
    }

    var totalStore =  $("#viewList"); //thêm tổng số cửa hàng ở trên cùng
    totalStore.prepend("<div class='r-count'>Tìm được "+ft.features.length+" cửa hàng</div>");

    L.geoJson(ft, {
      onEachFeature: onEachFeature,
    }).addTo(layerObject);
  })

//Thêm điều khiển mới là combo box rỗng lên bản đồ
var control1 = L.control({ position: "topright" });
control1.onAdd = function (mapObject) {
    var div = L.DomUtil.create("div", "div1");
    div.innerHTML = '<select id="combobox1"></select>';
    return div;
};
control1.addTo(mapObject);

// thêm tên tất cả store vào combo box
$.getJSON("/allstore" , function (data) {
    var menu = $("#combobox1");
    menu.append("<option id='selectAll' value='selectAll' >Tất cả</option>");

    data.features.map((item)=>{
        var locationOp = document.createElement("option");
        locationOp.setAttribute("id",item._id);
        locationOp.setAttribute("value",item._id); //thêm value là id (để khi click on thì so sánh bằng _id và mở popup)
        var locationOptionText1 = document.createTextNode(item.properties.name);
        menu.append(locationOp);
        $(locationOp).append(locationOptionText1);
    })
});

function selectToBindPopup(feature,layer) {             
    layer.bindPopup('<h3>'+feature.properties.name+'</h3><p>Địa chỉ: '+feature.properties.address+'</p>')
    .addTo(layerObject);
}

$("#combobox1").on("change", function() {
    var idSelected = $("#combobox1").val();
    console.log(idSelected);
    if(idSelected == "selectAll"){ 
        $.getJSON('/allstore', function(data) {
            L.geoJson(data, {
                onEachFeature: selectToBindPopup
              });
    
        });
    }else{
        $.getJSON('/allstore', function(data) {
            layerObject.clearLayers();
            L.geoJson(data, {
                onEachFeature: function(feature,layer) {             
                    if(feature._id == idSelected){
                        layer.bindPopup('<h3>'+feature.properties.name+'</h3><p>Địa chỉ: '+feature.properties.address+'</p>')
                        .addTo(layerObject).openPopup();
                    }
                },
              });
    
        });
    }
});
