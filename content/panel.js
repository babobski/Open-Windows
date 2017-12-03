(function() {
	var retryCount = 0,
		self = this,
		listBuild;
	
	window.removeEventListener('focus', self.focusClickHandler);
	window.removeEventListener('load', self.delayedStartup);
	
	this.buildList = function() {
		
		var list = document.getElementById('openWindowsList');
		var listItems = extensions.OpenWindows.generateOpenWindowsList();
		
		if (listItems === undefined) {
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
			if (oldItem.nodeName === 'richlistitem') {
				oldItem.parentNode.removeChild(oldItem);
			}
		}
		
		// Build the list
		for (var i = 0; i < listItems.length; i++) {
			var listItem = document.createElement('richlistitem');
			var projectLabel = document.createElement('label');
			var placesLabel = document.createElement('label');
			var winImg = document.createElement('image');
			var closeBtn = document.createElement('toolbarbutton');
			var spacer = document.createElement('spacer');
			var closeImg = document.createElement('image');
			
			
			winImg.setAttribute('src', 'koicon://ko-svg/chrome/icomoon/skin/screen.svg?size=12');
			winImg.classList.add('window-icon');
			closeImg.setAttribute('src', 'koicon://ko-svg/chrome/icomoon/skin/close2.svg?size=12');
			closeBtn.classList.add('closeWindow');
			closeBtn.setAttribute('onclick', 'extensions.OpenWindows.closeWindow('+ listItems[i].id +');');
			closeBtn.appendChild(closeImg);
			closeBtn.classList.add('close-btn');
			projectLabel.setAttribute('value', listItems[i].project);
			placesLabel.setAttribute('value', listItems[i].places);
			projectLabel.setAttribute('flex', '1');
			placesLabel.setAttribute('flex', '1');
			placesLabel.setAttribute('crop', 'start');
			projectLabel.setAttribute('crop', 'start');
			spacer.setAttribute('flex', '1');
			if (listItems[i].current) {
				listItem.classList.add('current');
			}
			
			listItem.setAttribute('align', 'center');
			listItem.setAttribute('onclick', 'extensions.OpenWindows.focusWindow('+ listItems[i].id +');');
			listItem.setAttribute('data-id', listItems[i].id);
			listItem.appendChild(winImg);
			listItem.appendChild(projectLabel);
			listItem.appendChild(placesLabel);
			listItem.appendChild(spacer);
			listItem.appendChild(closeBtn);
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
	
	// Trigger click on focus
	this.focusClickHandler = function(event) {
		console.log(event);
		
		if (event.explicitOriginalTarget.localName !== 'toolbarbutton' && event.explicitOriginalTarget.parentNode.localName !== 'toolbarbutton') {
			if (event.explicitOriginalTarget.localName === 'richlistitem') {
				event.explicitOriginalTarget.onclick();
			}
			
			if (event.explicitOriginalTarget.parentNode.localName === 'richlistitem') {
				event.explicitOriginalTarget.parentNode.onclick();
			}
		}
	};
	
	window.addEventListener('focus', self.focusClickHandler);
	window.addEventListener('load', self.delayedStartup);
}).apply();
	

