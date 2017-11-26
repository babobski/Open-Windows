/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.OpenWindows) === 'undefined') extensions.OpenWindows = { version : '1.8' };

(function() {
	var self = this,
		prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService).getBranch("extensions.OpenWindows."),
		restartCount = 0,
		lastFocus = null;
		
	window.removeEventListener('current_project_changed', self.updateLists);
	window.removeEventListener('project_opened', self.updateLists);
	//window.removeEventListener('komodo-post-startup', self.delayedStartUp);
	window.removeEventListener('focus', self.updateLists);
	
	
	this.generateOpenWindowsList = function() {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
							.getService(Components.interfaces.nsIWindowWatcher)
							.getWindowEnumerator();
							
		var openWindows = [];
		var index = 1;
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			var windowName = 'Komodo Window ' + index;
			
			if (win.ko === undefined) {
				return;
			}
			
			var currPlacesItem = win.ko.places !== undefined && win.ko.places.manager !== undefined ? win.ko.places.manager.currentPlace : null;
			if (win.ko.projects !== undefined && win.ko.projects.manager !== undefined && win.ko.projects.manager.currentProject !== null) {
				var winCurrProject = win.ko.projects.manager.currentProject;
				windowName = winCurrProject.name.replace('.komodoproject', '');
			} else if (currPlacesItem !== null) {
				var cleanUrl = currPlacesItem.replace('file:///', '');
				var startSecString = cleanUrl.length > 20 ? cleanUrl.length - 20 : cleanUrl.length - 11;
				windowName = cleanUrl.substr(0, 7) + '...' + cleanUrl.substr(startSecString, cleanUrl.length);
			}
			index++;
			openWindows.push(windowName);
		}
		return openWindows;
	};
	
	this.focusWindow = function(windowName) {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                      .getService(Components.interfaces.nsIWindowWatcher)
                      .getWindowEnumerator();
		var index = 1;
		while (wenum.hasMoreElements()) {
		  var win = wenum.getNext();
		  if (win.name == windowName) {
			win.focus();
			return;
		  }
		  index++;
		}
	}
	
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
						console.log('not there yet');
						console.log(win[i]);
						setTimeout(function(){
							self.updateLists();
						}, 1000);
					}
					break;
				}
			}
		}
	};
	
	//this.delayedStartUp = function() {
	//	if (typeof ko !== undefined && !ko.places) {
	//		setTimeout(function(){
	//			self.delayedStartUp();
	//		}, 1000);
	//		return false;
	//	}
	//	
	//	self.updateLists();
	//};
	
	
	window.addEventListener('current_project_changed', self.updateLists);
	window.addEventListener('project_opened', self.updateLists);
	//window.addEventListener('komodo-post-startup', self.delayedStartUp);
	window.addEventListener('focus', self.updateLists);
}).apply(extensions.OpenWindows);
