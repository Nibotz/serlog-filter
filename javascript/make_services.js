
function make_new_service() {
    let locality = [];
    $("#tab-make input[name='locality']:checked").each(function(){
        locality.push(this.value);
    });
    let title = $("#tab-make input[name='title']").val().trim();
    let js_tree_cat = $("#make-tree_cat").jstree(true).get_selected()[0];
    let location = $("#tab-make input[name='location']").val();
    let email_srv = $("#tab-make input[name='email']").val();
    let url = $("#tab-make input[name='website']").val();
    let description = $("#tab-make textarea[name='description']").val().replaceAll("\n", "<br>");
    // validition
    if (!locality.length || !title || !js_tree_cat || !email_srv || !location || !description) {
        alert("not a valid service!");
        return;
    }
    $.ajax({
        url: "php/make_service.php",
        method: "POST",
        data: {
            set_data: 1,
            title: title,
            locality: locality.toString(),
            js_tree_cat: js_tree_cat.slice(5),
            location: location,
            email_srv: email_srv,
            url: url,
            description: description
        },
        success:function(rText) {
            //make_clear();
            alert("done!");
        }
    });
}

function make_clear() {
    $("#tab-make input[name='locality']:checked").each(function(){
        this.checked = false;
    });
    $("#make-tree_cat").jstree(true).deselect_all(true);
    $("#tab-make input[name='email']")[0].value = "";
    $("#tab-make input[name='website']")[0].value = "";
    $("#tab-make input[name='location']")[0].value = "";
    $("#tab-make input[name='title']")[0].value = "";
    $("#tab-make textarea[name='description']")[0].value = "";
}

function init_make_services() {
    $("#make-tree_cat").jstree({
        core: {
            multiple: 0,
            data: {
                method: "POST",
                data: {get_data: 1, _id: "make-"},
                url: "php/make_tree.php",
                dataType: "json"
            }
        },
        plugins: ["checkbox", "wholerow"],
        checkbox: {keep_selected_style: 0, three_state: 0}
    });
    // callbacks
    $("#make-reset").on("click", make_clear);
    $("#make-upload").on("click", make_new_service);
}