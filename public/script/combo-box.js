/*thêm 1 layer vào bản đồ tên layerObject để tí thêm các Point cửa hàng vào layer này, rồi gán layer này vào mapObject 
khi gỡ cũng chỉ cần gỡ or clear layer là tắt hết các đối tượng cho tiện  :)) */
var layerObject = L.layerGroup().addTo(mapObject);
var wardObject = L.layerGroup().addTo(mapObject);
$.getJSON("/allstore", function (ft) {
    var itemView = $(".item-view");
    function onEachFeature(feature, layer) { //thêm ds các cửa hàng bách hóa xanh vào list bên cạnh
        itemView.append("<div class='item detail-item-current' id=" + feature._id + "  zindex='1'><div class='info'><div class='name'>" + feature.properties.name + "</div><div class='address'>" + feature.properties.address + "</div></div></div>");
        layer.bindPopup('<h3>' + feature.properties.name + '</h3><p>Địa chỉ: ' + feature.properties.address + '</p>');
        layer.setIcon(greenIcon);
        
    }

    var totalStore = $("#viewList"); //thêm tổng số cửa hàng ở trên cùng
    totalStore.prepend("<div class='r-count'>Tìm được " + ft.features.length + " cửa hàng</div>");

    L.geoJson(ft, {
        onEachFeature: onEachFeature,
    }).addTo(layerObject);
})

$.getJSON("/allward", function (ft) {
    var wardFilter = $("#wardCombobox"); //lọc theo quận
    wardFilter.prepend('<option value="">Chọn Quận/Huyện</option>');
    ft.map((item) => {

        wardFilter.prepend('<option value="' + item.ward + '">' + item.ward + '</option>');
    })
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
$.getJSON("/allstore", function (data) {
    var menu = $("#combobox1");
    menu.append("<option id='selectAll' value='selectAll' >Tất cả</option>");
    data.features.map((item) => {
        var locationOp = document.createElement("option");
        locationOp.setAttribute("id", item._id);
        locationOp.setAttribute("value", item._id); //thêm value là id (để khi click on thì so sánh bằng _id và mở popup)
        var locationOptionText1 = document.createTextNode(item.properties.name);
        menu.append(locationOp);
        $(locationOp).append(locationOptionText1);
    })
});

function selectToBindPopup(feature, layer) {
    layer.bindPopup('<h3>' + feature.properties.name + '</h3><p>Địa chỉ: ' + feature.properties.address + '</p>')
        .addTo(layerObject);
}

var idSelected;
$("#combobox1").on("change", function () {
    idSelected = $("#combobox1").val();
    // console.log(idSelected);

    // khai báo biến gán đối tượng nút xóa, khi click chọn item trên combobox thì enabled nút xóa
    const delBtn = document.querySelector(".leaflet-draw-edit-remove");
    delBtn.classList.replace('leaflet-disabled', 'leaflet-enabled');

    if (idSelected == "selectAll") {

        $.getJSON('/allstore', function (data) {
            L.geoJson(data, {
                onEachFeature: selectToBindPopup
            });

        });
    } else {
        $.getJSON('/allstore', function (data) {
            layerObject.clearLayers();
            L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    if (feature._id == idSelected) {
                        layer.bindPopup('<h3>' + feature.properties.name + '</h3><p>Địa chỉ: ' + feature.properties.address + '</p>' )
                            .addTo(layerObject).openPopup();
                    }
                },
            });

        });
    }
});

var l;
// Sự kiện cho nút xóa
$(".leaflet-draw-edit-remove").on("click", function () {
    l = {};
    l.id = idSelected;
    $.ajax({
        url: "/deleteStore",
        type: "DELETE",
        data: JSON.stringify(l),
        contentType: "application/json;charset=utf-8",
        success: function (message) {
            alert(message);
        }
    });
    $.getJSON('/allstore', function (data) {
        layerObject.clearLayers();
        L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                if (feature._id == idSelected) {
                    layerObject.removeLayer(layer);
                }
            },
        });
    });
    $("#combobox1").val("Tất cả");
})

var idWard;
$("#wardCombobox").on("change", function () {
    idWard = $("#wardCombobox").val();
    console.log(idWard);
    $.ajax({
        url: "/wardFilter",
        async: false,
        type: "POST",
        data: idWard,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
        }
    });
});

var control2 = L.control({ position: "topright" });
control2.onAdd = function (mapObject) {
    var div = L.DomUtil.create("div", "div1");
    div.innerHTML = '<select id="ward"></select>';
    return div;
};
control2.addTo(mapObject);

$.getJSON("/allward", function (data) {
    var menu = $("#ward");
    menu.append("<option id='all' value='all' >Chọn quận, huyện</option>");
    data.map((item) => {
        var wardOp = document.createElement("option");
        wardOp.setAttribute("id", item._id);
        wardOp.setAttribute("value", item.ward); //thêm value là id (để khi click on thì so sánh bằng _id và mở popup)
        var wardText = document.createTextNode(item.ward);
        menu.append(wardOp);
        $(wardOp).append(wardText);
    })
});

$("#ward").on("change", function () {
    wardSelected = $("#ward").val();
    console.log(wardSelected);
    if (wardSelected == "all") {
      $.getJSON("/allstore", function (data) {
        L.geoJson(data, {
          onEachFeature: selectToBindPopup,
        });
      });
    } else {
      $.getJSON("/allstore", function (data) {
        layerObject.clearLayers();
        wardObject.clearLayers();
        L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties.ward === wardSelected) {
                    layer.bindPopup('<h3>' + feature.properties.name + '</h3><p>Địa chỉ: ' + feature.properties.address + '</p>')
                        .addTo(wardObject);
                    layer.setIcon(greenIcon);
                }
            },
        });
      });
    }
  });