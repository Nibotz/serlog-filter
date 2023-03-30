
function create_tabs(text) {
    let sdata = JSON.parse(text);
    let html = "";
    // style each tab
    sdata.forEach(val => {
        html += "<div class='tab service-tab' id='tab-" + val.id + "'>";
        html += "<h2>" + val.title + "</h2>";
        html += "<p>" + val.description + "</p>";
        html += "<button class='delete-service' id='service-del-" + val.id + "'>delete service</button>";
        html += "<button class='add-subservice' id='service-del-" + val.id + "'>add subservice</button>";
        html += "</div>";
    });
    // append new tabs
    $("#tab-holder").append(html);
    // button event handlers
    $("button.delete-service").on("click", function() {
        let id = this.id.slice(12);
        if (confirm("Are you sure?\nYou cannot undo this action.")) {
            $.ajax({
                url: "php/delete_service.php",
                method: "POST",
                data: {
                    set_data: 1,
                    id: id
                },
                success:function(rText) {
                    delete_tab(id);
                    filter_change();
                }
            });
        }
    });
    $("button.add-subservice").on("click", function() {
        alert("not implemented yet...");
    });
    // make buttons for each tab
    sdata.forEach(val => {
        let id = val.id;
        // tab buttons made
        let tab = $("<button class='open-tab' id='open-tab-" + id + "'></button>").text("tab " + id); // tab button
        let del = $("<button class='del-tab' id='del-tab-" + id + "'></button>").text("X"); // delete button
        // delete tab event
        $(del).on("click", function() {delete_tab(id);});
        // open tab event
        $(tab).on("click", function() {open_tab(id);});
        // add new buttons
        $("#tab-button-holder").append(tab, del);
    });
}

function delete_tab(id) {
    $("#del-tab-" + id).remove();
    $("#open-tab-" + id).slideUp("fast", function(){
        if (id === sessionStorage.current_tab) {
            $("#tab-main").addClass("active-tab");
            $("#open-tab-main").addClass("active-tab");
            sessionStorage.current_tab = "main";
        }
        sessionStorage.other_tabs = sessionStorage.other_tabs.replace(id + ",", "");
        update_url();
        $("#open-tab-" + id).remove();
        $("#tab-" + id).remove();
    });
}

function make_new_tab(id) {
    // make a new tab
    if (!sessionStorage.other_tabs.includes(id + ",")) {
        $.ajax({
            url: "php/service_information.php",
            method: "POST",
            data: {
                get_data: 1,
                ids: id
            },
            success:function(rText) {
                create_tabs(rText);
                open_tab(id);
            }
        });
    // open the old tab
    } else {
        open_tab(id);
    }
}

function open_tab(id) {
    let tab = sessionStorage.current_tab
    if (tab !== id) {
        // old tab
        if ($("#open-tab-" + tab).hasClass("active-tab")) {
            $("#tab-" + tab).removeClass("active-tab");
            $("#open-tab-" + tab).removeClass("active-tab");
            // not a static tab
            if (!isNaN(tab)) {
                sessionStorage.other_tabs += tab + ","
            }
        }
        // new tab
        $("#tab-" + id).addClass("active-tab");
        $("#open-tab-" + id).addClass("active-tab");
        // activate the tab
        sessionStorage.other_tabs = sessionStorage.other_tabs.replace(id + ",", "");
        sessionStorage.current_tab = id;
        update_url();
    }
}

function update_url() {
    let par = new URLSearchParams(location.search);
    par.set("current_tab", sessionStorage.current_tab);
    if (!sessionStorage.other_tabs) {
        par.delete("other_tabs");
    } else {
        par.set("other_tabs", sessionStorage.other_tabs.slice(0,-1));
    }
    history.pushState(null, "", "?" + par.toString());
}

function intalize_tabs() {
    // variables from url
    let url = new URLSearchParams(location.search);
    let tab = url.has("current_tab") ? url.get("current_tab") : "main";
    sessionStorage.current_tab = tab;
    sessionStorage.other_tabs = ""
    // tab ids
    let ids = isNaN(tab) ? "" : tab + ",";
    if (url.has("other_tabs")) {
        sessionStorage.other_tabs = url.get("other_tabs") + ",";
        ids += sessionStorage.other_tabs;
    }
    // create new tabs from ids
    if (ids !== "") {
        $.ajax({
            url: "php/service_information.php",
            method: "POST",
            data: {
                get_data: 1,
                ids: ids.slice(0,-1)
            },
            success:function(rText) {
                create_tabs(rText);
                $("#tab-" + tab).addClass("active-tab");
                $("#open-tab-" + tab).addClass("active-tab");
            }
        });
    } else {
        $("#tab-" + tab).addClass("active-tab");
        $("#open-tab-" + tab).addClass("active-tab");
    }
}


function init_tab_handling() {
    intalize_tabs();
    // callbacks
    addEventListener("popstate", function() {
        // remove each button
        $("#tab-button-holder button:not(.static-tab)").each(function () {
            this.remove();
        });
        // remove each service tab
        $("#tab-holder .service-tab").each(function() {
            this.remove();
        });
        // unactive active tabs
        $(".active-tab").each(function() {
            $(this).removeClass("active-tab");
        });
        intalize_tabs();
    });
}
