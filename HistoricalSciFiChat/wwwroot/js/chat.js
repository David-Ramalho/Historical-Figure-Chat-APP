document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const playButton = document.getElementById('playButton');
    const messageBox = document.getElementById('textBox');
    const figures = document.querySelectorAll('.figure');
    const chatDisplay = document.getElementById('chatDisplay');
    let selectedFigure = null;  // We'll now select only one figure

    function toggleFigureSelection(event) {
        const clickedFigure = event.currentTarget;

        // If the clicked figure is already active, we don't need to make any changes
        if (clickedFigure.classList.contains('active')) {
            return;
        }

        // Remove the active class from the currently selected figure, if any
        if (selectedFigure) {
            selectedFigure.classList.remove('active');
        }

        // Set the clicked figure as the currently selected one and add the active class
        clickedFigure.classList.add('active');
        selectedFigure = clickedFigure;
    }

    function handlePlay() {
        if (selectedFigure) {
            document.querySelector('.figures-selection').style.display = 'none';
            document.querySelector('.chat-container').style.display = 'block';
            startChat();
        } else {
            alert("You must select a figure to chat with.");
        }
    }

    function sendMessage() {
        const message = messageBox.value.trim();
        const figureName = selectedFigure.dataset.figureName;

        if (message && figureName) {
            sendButton.disabled = true; // Disable button to prevent multiple submissions
            sendMessageToServer(message, figureName);
            messageBox.value = '';
        } else {
            alert("Please select a figure and type a message.");
        }
    }

    function sendMessageToServer(message, figureName) {
        fetch("/api/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Message: message,
                FigureName: figureName
            })
        })
            .then(response => response.json())
            .then(data => {
                displayMessage(message, 'user');
                displayMessage(data.Message, 'figure-message');
            })
            .catch(error => {
                alert("There was an error sending the message. Please try again.");
                console.error("Error:", error);
            })
            .finally(() => {
                sendButton.disabled = false; // Re-enable button after processing
            });
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    function startChat() {
        displayMessage(`Hello, I am ${selectedFigure.dataset.figureName}. Let's chat!`, 'figure-message');
    }

    function resetChat() {
        // Reset figure selection and chat messages. This can be expanded based on your requirements.
        if (selectedFigure) {
            selectedFigure.classList.remove('active');
        }
        selectedFigure = null;
        chatDisplay.innerHTML = '';
        document.querySelector('.figures-selection').style.display = 'block';
        document.querySelector('.chat-container').style.display = 'none';
    }

    // Attach event listeners
    sendButton.addEventListener('click', sendMessage);
    playButton.addEventListener('click', handlePlay);
    figures.forEach(figure => figure.addEventListener('click', toggleFigureSelection));
});
