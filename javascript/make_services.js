
function make_new_service() {
    const data = localStorage.getItem("new_service");
    if (data === null) {return;}
    const service = JSON.parse(data);
    // validition
    if (!service.locality || !service.title || !service.js_tree_cat || !service.email_srv || !service.location || !service.description) {
        alert("not a valid service!");
        return;
    }
    $.ajax({
        url: "php/make_service.php",
        method: "POST",
        data: {
            set_data: 1,
            title: service.title,
            locality: service.locality,
            js_tree_cat: service.js_tree_cat,
            location: service.location,
            email_srv: service.email_srv,
            url: service.url,
            description: service.description.replaceAll("\n", "<br>")
        },
        success:function(rText) {
            //make_clear();
            alert("done!");
        }
    });
}

function make_clear() {
    document.getElementById("make-locally").checked = false;
    document.getElementById("make-online").checked = false;
    $("#make-tree").jstree(true).deselect_all(true);
    $("#make-location").val("");
    $("#make-email").val("");
    $("#make-website").val("");
    $("#make-title").val("");
    $("#make-description").val("");
    save_new_service();
}

function save_new_service() {
    // category
    const tree_data = $("#make-tree").jstree(true).get_selected();
    const js_tree_cat = !tree_data[0] ? "" : tree_data[0].slice(5);
    // locality
    var locality = "";
    if (document.getElementById("make-locally").checked) {locality += "locally,";}
    if (document.getElementById("make-online").checked) {locality += "online,";}
    // actual data
    const service = {
        locality: locality.slice(0,-1),
        title: $("#make-title").val().trim(),
        js_tree_cat: js_tree_cat,
        location: $("#make-location").val(),
        email_srv: $("#make-email").val(),
        url: $("#make-website").val(),
        description: $("#make-description").val(),
    }
    // data saved
    localStorage.setItem("new_service", JSON.stringify(service));
}


function fill_make_form() {
    const data = localStorage.getItem("new_service");
    if (data) {
        // checkboxes
        const service = JSON.parse(data);
        if (service.locality) {
            for (const id of service.locality.split(",")) {
                document.getElementById("make-" + id).checked = true;
            }
        }
        // other data
        $("#make-location").val(service.location);
        $("#make-email").val(service.email_srv);
        $("#make-website").val(service.url);
        $("#make-title").val(service.title);
        $("#make-description").val(service.description);
        // tree
        if (service.js_tree_cat) {
            $("#make-tree").jstree(true).select_node("make-" + service.js_tree_cat);
        }
    }
}

function init_make_services() {
    $("#make-tree").jstree({
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
    $("#make-tree").on("ready.jstree", function() {
        fill_make_form();
    });
    // callbacks
    $("#make-reset").on("click", make_clear);
    $("#make-upload").on("click", make_new_service);

    $("#tab-make input").on("change", save_new_service);
    $("#tab-make textarea").on("change", save_new_service);
    $("#make-tree").on("changed.jstree", function(n, e){
        if (e.action === "select_node" || e.action === "deselect_node") {
            save_new_service();
        }
    }).jstree();
}