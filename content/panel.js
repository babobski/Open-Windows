(function() {
	var retryCount = 0,
		self = this,
		listBuild;
	
	window.removeEventListener('focus', self.buildList);
	window.removeEventListener('load', self.delayedStartup);
	
	this.buildList = function() {
		
		var list = document.getElementById('openWindowsList');
		var listItems = extensions.OpenWindows.generateOpenWindowsList();
		
		if (listItems === undefined) {
			inBuild = false;
			if (retryCount < 22) {
				setTimeout(function(){
					buildList();
				}, 1000);
			}
			retryCount++;
			return false;
		}
		
		// Remove old list items
		var oldItems  = list.children;
		for (var w = oldItems.length - 1; w >= 0; w--) {
			var oldItem = oldItems[w];
			if (oldItem.nodeName === 'listitem') {
				oldItem.parentNode.removeChild(oldItem);
			}
		}
		
		// Build the list
		for (var i = 0; i < listItems.length; i++) {
			var listItem = document.createElement('listitem');
			var projectCol = document.createElement('listcell');
			var placesCol = document.createElement('listcell');
			
			projectCol.setAttribute('label', listItems[i].project);
			placesCol.setAttribute('label', listItems[i].places);
			
			if (listItems[i].current) {
				listItem.classList.add('current');
			}
			
			listItem.setAttribute('data-id', listItems[i].id);
			listItem.setAttribute('onclick', 'extensions.OpenWindows.focusWindow('+ listItems[i].id +');');
			listItem.appendChild(projectCol);
			listItem.appendChild(placesCol);
			list.appendChild(listItem);
		}
		
	};
	
	this.delayedStartup = function() {
		// a bit dirty startup workarround ( need to wait till places and projects widget is loaded )
		setTimeout(function(){
			self.buildList();
			listBuild = setInterval(function(){
				var list = document.getElementById('openWindowsList');
				if (list.children.length > 0) {
					clearInterval(listBuild);
					return false;
				}
				self.buildList();
			}, 1000);
		}, 4000);
	};
	
	
	window.addEventListener('focus', self.buildList);
	window.addEventListener('load', self.delayedStartup);
}).apply();
	

