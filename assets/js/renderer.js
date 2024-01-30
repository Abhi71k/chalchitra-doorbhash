const openSettingsBtn = document.querySelector('#system-preferences');
const screenPicker = document.querySelector('#electron-screen-picker');
let iframe = null; 

const openIframeButton = document.getElementById("toggleIframeBtn");
const closeIframeButton = document.getElementById("closeIframeBtn");
const openDashboard = document.getElementById("openDashboard");

closeIframeButton.style.display = "none";

  window.api.weblink((weblink) => {
	let brightchampsLink = weblink;
	openIframe(brightchampsLink);
	// openIframeButton.style.display = "none";
	closeIframeButton.style.display = "inline-block";
	openDashboard.style.display = "none";
})

openIframeButton.addEventListener("click", function () {
	let meetLink = "https://meet.google.com/xor-sdzy-rvv";
	openIframe(meetLink)
	openIframeButton.style.display = "none";
    closeIframeButton.style.display = "inline-block";
	openDashboard.style.display = "none";
  });

closeIframeButton.addEventListener("click", function () {
    closeIframe();
	openIframeButton.style.display = "inline-block";
    closeIframeButton.style.display = "none";
	openDashboard.style.display = "inline-block";
});

window.api.source(0);

window.api.showPopup((sources) => {
	let source;
	screenPickerShow(sources, async (id) => {
		console.log(id);
		try {
			source = sources.find(source => source.id == id);
			sendSource(source);
			if (!source) {
				return 'none';
			}
		}
		catch (err) {
			console.log(err.innerText)
		}
	}, {});
	
})

function sendSource(source) {
  window.api.sourceScreen(source.id); 
  console.log('sent to source');
}

let screenPickerOptions = {
	system_preferences: false
};

function screenPickerShow(sources, onselect) {
	const list = document.querySelector('#sources');
	list.innerHTML = '';

	sources.forEach(source => {
		const item = document.createElement('div');
		item.classList = '__electron-list';

		const wrapper = document.createElement('div');
		wrapper.classList = 'thumbnail __electron-screen-thumbnail';

		const thumbnail = document.createElement('img');
		thumbnail.src = source.thumbnailURL;

		const label = document.createElement('div');
		label.classList = '__electron-screen-name';
		label.innerText = source.name;

		wrapper.append(thumbnail);
		wrapper.append(label);
		item.append(wrapper);
		item.onclick = () => {
			console.log('itemclicked');
			onselect(source.id);
			MicroModal.close('electron-screen-picker');
		};
		list.append(item);
	});
	
	if (!screenPickerOptions.system_preferences) {
		openSettingsBtn.classList = 'hidden';
	}

	MicroModal.show('electron-screen-picker');
}

function openIframe(link) {
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'webview';
		iframe.style = "height: 100%; width: 100%;";
		iframe.allow = "camera; microphone; display-capture";
        document.body.appendChild(iframe);
    }
    iframe.src = link;
}

function closeIframe() {
    if (iframe) {
        document.body.removeChild(iframe);
        iframe = null;
    }
}
