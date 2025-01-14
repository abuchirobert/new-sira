// Create a BroadcastChannel
const channel = new BroadcastChannel('activeTabChannel');

// Listen for messages
channel.onmessage = (event) => {
    if (event.data === 'activeTab') {
        alert('This app is already open in another tab. Please switch to that tab.');
        window.location.href = 'about:blank'; // Redirect or disable this tab
    }
};

// Notify other tabs that this tab is active
channel.postMessage('activeTab');

// Clean up when the tab is closed
window.addEventListener('beforeunload', () => {
    channel.postMessage('tabClosed');
});
