/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.OpenWindows) === 'undefined') extensions.OpenWindows = { version : '1.1' };

(function() {
	const fsPath = require('sdk/fs/path');
	var self = this,
		prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService).getBranch("extensions.OpenWindows."),
		restartCount = 0,
		lastFocus = null;
		
	window.removeEventListener('current_project_changed', self.updateLists);
	window.removeEventListener('project_opened', self.updateLists);
	window.removeEventListener('focus', self.updateLists);
	
	
	this.generateOpenWindowsList = function() {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
							.getService(Components.interfaces.nsIWindowWatcher)
							.getWindowEnumerator();
							
		var openWindows = [];
		var index = 1;
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			var project = 'None';
			var places = '...';
			var util = win.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils);
			var windowID = util.outerWindowID;
			
			if (win.ko === undefined || win.length === 0) {
				return;
			}
			
			var currPlacesItem = win.ko.places !== undefined && win.ko.places.manager !== undefined ? win.ko.places.manager.currentPlace : null;
			if (win.ko.projects !== undefined && win.ko.projects.manager !== undefined && win.ko.projects.manager.currentProject !== null) {
				var winCurrProject = win.ko.projects.manager.currentProject;
				project = winCurrProject.name.replace('.komodoproject', '');
			} 
			
			if (currPlacesItem !== null) {
				var cleanUrl = currPlacesItem.replace('file:///', '');
				places = fsPath.basename(cleanUrl);
			}
			index++;
			openWindows.push({id: windowID, project: project, places: places, current: win.isActive});
		}
		return openWindows;
	};
	
	this.focusWindow = function(windowId) {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher)
			.getWindowEnumerator();
		var index = 1;
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			var util = win.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils);
			var windowID = util.outerWindowID;
			if (windowID == windowId) {
				win.focus();
				if (typeof win.onfocus === 'function') {
					win.onfocus();
				}
				return;
			}
			index++;
		}
	};
	
	this.closeWindow = function(windowId) {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher)
			.getWindowEnumerator();
		var index = 1;
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			var util = win.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils);
			var windowID = util.outerWindowID;
			if (windowID == windowId) {
				win.close();
				return;
			}
			index++;
		}
	};
	
	this.updateLists = function() {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
							.getService(Components.interfaces.nsIWindowWatcher)
							.getWindowEnumerator();
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			for (var i = 0; i < win.length; i++) {
				if (win[i].name === 'OpenWindowsViewbox') {
					if (typeof win[i].buildList == 'function') {
						win[i].buildList();
					} else {
						setTimeout(function(){
							self.updateLists();
						}, 1000);
					}
					break;
				}
			}
		}
	};
	
	window.addEventListener('current_project_changed', self.updateLists);
	window.addEventListener('project_opened', self.updateLists);
	window.addEventListener('focus', self.updateLists);
}).apply(extensions.OpenWindows);
