
function filter_change(){
    // locality
    const locality = [];
    $("#filter-holder input[name='locality']:checked").each(function(){
        locality.push(this.value);
    });
    // ajax call
    $.ajax({
        url: "php/filter_services.php",
        method: "POST",
        data: {
            get_data: 1,
            load_limit: 30,
            locality: locality,
            price1: $("#filter-holder input[name='price1']").val(),
            price2: $("#filter-holder  input[name='price2']").val(),
            created1: $("#filter-holder input[name='created1']").val(),
            created2: $("#filter-holder input[name='created2']").val(),
            edited1: $("#filter-holder input[name='edited1']").val(),
            edited2: $("#filter-holder input[name='edited2']").val()
        },
        success:update_services
    });
}

function update_services(service_data) {
    const services = JSON.parse(service_data);
    const tree_filter = $("#tree-filter").jstree(true);
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
    const selected_services = new Set(tree_filter.get_selected());
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
    $("#selectAll-text").html("Select all (" + num + ")");
    // add styled services
    $("#service-holder").html(html);
    // get when service is pressed
    $("#tab-main div.service").on("click", function(){
        make_new_tab(this.id.slice(4));
    });
}


function init_main_tab() {
    $("#tree-filter").jstree({
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
    $("#tree-filter").on("ready.jstree", function() {
        filter_change();
    });
    // callbacks
    $("#selectAll").change(function(){
        if ($(this).is(":checked")) {
            $("#tree-filter").jstree(true).check_all();
        } else {
            $("#tree-filter").jstree(true).uncheck_all();
        }
        filter_change();
    });
    
    $("#tab-main input:not(#selectAll)").on("change", filter_change);
    
    $("#tree-filter").on("changed.jstree", function(n, e){
        if (e.action === "select_node" || e.action === "deselect_node") {
            filter_change();
        }
    }).jstree();

    $("button.static-tab").on("click", function(){
        open_tab(this.id.slice(9));
    });
}
