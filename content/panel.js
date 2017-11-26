(function() {
	var retryCount = 0,
		self = this,
		listBuild;
		
	clearInterval(listBuild);
	
	window.removeEventListener('focus', self.buildList);
	window.removeEventListener('load', self.delayedStartup);
	
	this.buildList = function() {
		var list = document.getElementById('openWindowsList');
		var listItems = extensions.OpenWindows.generateOpenWindowsList();
		
		if (listItems === undefined) {
			if (retryCount < 5) {
				setTimeout(function(){
					buildList();
				}, 800);
			}
			retryCount++;
			return false;
		}
		
		list.innerHTML = '';
		
		for (var i = 0; i < listItems.length; i++) {
			var listItem = document.createElement('listitem');
			listItem.setAttribute('label', listItems[i]);
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
	

