let templateImage; // Store the selected template image globally

function selectTemplate(templateNumber) {
    const selectedTemplateImg = new Image();
    selectedTemplateImg.src = `${templateNumber}.jpg`;
    selectedTemplateImg.alt = `Template ${templateNumber}`;
    selectedTemplateImg.style.width = '250px';
    selectedTemplateImg.style.height = 'auto';

    const selectedTemplateContainer = document.getElementById('selected-template-container');
    selectedTemplateContainer.innerHTML = '';
    selectedTemplateContainer.appendChild(selectedTemplateImg);

    templateImage = selectedTemplateImg;
}

function processCSV(csvData) {
    const lines = csvData.split('\n');

    for (let i = 1; i < lines.length; i++) {
        const participantName = lines[i].trim();
        if (participantName !== '') {
            // Send data to backend for processing
            sendToBackend(participantName);
        }
    }
}

function sendToBackend(participantName) {
    // Get other form data
    const institutionName = document.getElementById('institution-name').value;
    const eventName = document.getElementById('event-name').value;

    // Prepare data to be sent to the backend
    const data = {
        participantName: participantName,
        institutionName: institutionName,
        eventName: eventName,
        templateSrc: templateImage.src,
    };

    // Send data to backend using fetch
    fetch('/process_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend response:', data);
    })
    .catch(error => {
        console.error('Error sending data to backend:', error);
    });
}

function uploadCSV() {
    const input = document.getElementById('csv-file');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;
            // Call processCSV to send data to backend
            processCSV(csvData);
            document.getElementById('selected-csv').textContent = `Selected CSV: ${file.name}`;
        };

        reader.readAsText(file);
    } else {
        alert('Please select a CSV file.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        generateButton.addEventListener('click', function () {
            // This button click triggers the CSV processing and sending data to the backend
            uploadCSV();
        });
    }
});
