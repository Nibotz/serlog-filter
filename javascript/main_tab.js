
function filter_change(){
    const filter = {
        locally: document.getElementById("main-locally").checked ? "1" : "",
        online: document.getElementById("main-online").checked ? "1" : "",
        price1: $("#main-price1").val(),
        price2: $("#main-price2").val(),
        created1: $("#main-created1").val(),
        created2: $("#main-created2").val(),
        edited1: $("#main-edited1").val(),
        edited2: $("#main-edited2").val(),
        tree_filter: $("#main-tree").jstree(true).get_checked()
    };
    // save filter
    localStorage.setItem("filter_data", JSON.stringify(filter));
    // ajax call
    $.ajax({
        url: "php/filter_services.php",
        method: "POST",
        data: {
            get_data: 1,
            load_limit: 30,
            locally: filter.locally,
            online: filter.online,
            price1: filter.price1,
            price2: filter.price2,
            created1: filter.created1,
            created2: filter.created2,
            edited1: filter.edited1,
            edited2: filter.edited2
        },
        success:update_services
    });
}

function update_services(service_data) {
    const services = JSON.parse(service_data);
    const tree_filter = $("#main-tree").jstree(true);
    // reset service count
    const service_count = [];
    $.each(tree_filter.get_json("#", {flat: true}), function(){
        service_count[this.id] = 0;
        // remove count from the end
        if (this.text.endsWith(")")) {
            tree_filter.set_text(this, this.text.slice(0, this.text.lastIndexOf(" ")));
        }
    });
    // get selected services
    const selected_services = new Set(tree_filter.get_checked());
    let num = 0;
    // loop trough services
    let html = "";
    for (let i = 0; i < services.length; i++) {
        const val = services[i];
        service_count[val.cat_id]++;
        // filter selected services
        if (selected_services.size && !selected_services.has(val.cat_id)) {continue;}
        num++;
        // style services
        html += "<div class='service' id='ser-" + val.id + "'>";
        // title
        html += "<div class='top'><h3 class='service-name'>" + val.title + "</h3></div>";
        // description
        html += "<div class='middle'><p>" + val.description + "</p></div>";
        // category
        html += "<div class='bottom'><p class='name' style='width:fit-content;'>Categorization&ensp;</p><p>";
        if (val.cat_id == null) {html += "none";} // no category
        else {html += tree_filter.get_path(val.cat_id, " > ");} // category tree
        html += "</p></div>";
        // left side
        html += "<div class='corner'>";
        html += "<p class='name'>Price</p><p>"; // price start
        if (val.minprice === null) {html += "none";} // no price
        else if (val.minprice == val.maxprice) {html += val.minprice + " &euro;";} // same price
        else {html += val.minprice + " - " + val.maxprice + " &euro;";} // price range
        html += "</p><br>"; // price end
        html += "<p class='name'>Locality</p><p>" + val.locality + "</p><br>"; // locality
        html += "<p class='name'>Location</p><p>" + val.location + "</p><br>" // location
        html += "<p class='name'>Url</p><p>" + val.url + "</p></div>" // url
        // right side
        html += "<div class='corner'>";
        html += "<p class='name'>Created</p><p>" + val.created + "</p><br>"; // created
        html += "<p class='name'>Edited</p><p>" + val.edited + "</p><br>"; // edited
        html += "<p class='name'>Email</p><p>" + val.email_srv + "</p><br>"; // email
        html += "<p class='name'>Phone</p><p>" + val.phone_srv + "</p></div>"; // phone
        html += "</div>";
    }
    //html = "<p>services found: " + num + "</p>" + html;
    // add child services to count
    function add_childs(node){
        let child_count = 0;
        $.each(node.children, function(){
            child_count += add_childs(this);
        });
        let num = service_count[node.id] += child_count;
        tree_filter.set_text(node, node.text + " (" + num + ")");
        return num;
    }
    // total number of services
    num = 0;
    $.each(tree_filter.get_json(), function(){
        num += add_childs(this);
    });
    $("#main-all-text").html("Select all (" + num + ")");
    // add styled services
    $("#service-holder").html(html);
    // get when service is pressed
    $("#tab-main div.service").on("click", function(){
        make_new_tab(this.id.slice(4));
    });
}

function fill_filters() {
    const data = localStorage.getItem("filter_data");
    if (data) {
        const filter = JSON.parse(data);
        // checkboxes
        document.getElementById("main-locally").checked = filter.locally;
        document.getElementById("main-online").checked = filter.online;
        // normal inputs
        $("#main-price1").val(filter.price1);
        $("#main-price2").val(filter.price2);
        $("#main-created1").val(filter.created1);
        $("#main-created2").val(filter.created2);
        $("#main-edited1").val(filter.edited1);
        $("#main-edited2").val(filter.edited2);
        // tree filter
        const tree_filter = $("#main-tree").jstree(true);
        for (const id of filter.tree_filter) {
            tree_filter.select_node(id);
        }
    }
}


function init_main_tab() {
    $("#main-tree").jstree({
        core: {
            data: {
                method: "POST",
                data: {get_data: 1, _id: ""},
                url: "php/make_tree.php",
                dataType: "json"
            }
        },
        plugins: ["checkbox", "wholerow"],
        checkbox: {keep_selected_style: 0}
    });
    $("#main-tree").on("ready.jstree", function() {
        fill_filters();
        filter_change();
    });
    // callbacks
    $("#main-all").change(function(){
        if ($(this).is(":checked")) {
            $("#main-tree").jstree(true).check_all();
        } else {
            $("#main-tree").jstree(true).uncheck_all();
        }
        filter_change();
    });
    
    $("#tab-main input:not(#main-all)").on("change", filter_change);
    
    $("#main-tree").on("changed.jstree", function(n, e){
        if (e.action === "select_node" || e.action === "deselect_node") {
            filter_change();
        }
    }).jstree();

    $("button.static-tab").on("click", function(){
        open_tab(this.id.slice(9));
    });
}
