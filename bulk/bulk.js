let templateImage; // Store the selected template image globally
let zip; // Store the zip instance

function selectTemplate(templateNumber) {
    // Create a new image element for the selected template
    const selectedTemplateImg = new Image();
    selectedTemplateImg.src = `${templateNumber}.jpg`;
    selectedTemplateImg.alt = `Template ${templateNumber}`;
    selectedTemplateImg.style.width = '250px'; // Set a specific width for the selected template image
    selectedTemplateImg.style.height = 'auto'; // Maintain aspect ratio

    // Clear any existing content in the container and append the selected template image
    const selectedTemplateContainer = document.getElementById('selected-template-container');
    selectedTemplateContainer.innerHTML = '';
    selectedTemplateContainer.appendChild(selectedTemplateImg);

    // Store the selected template image globally
    templateImage = selectedTemplateImg;

    // Initialize a new zip instance
    zip = new JSZip();
}

function processCSV(csvData, callback) {
    const lines = csvData.split('\n');

    for (let i = 1; i < lines.length; i++) {
        const participantName = lines[i].trim();
        const institutionName = document.getElementById('institution-name').value;
        const eventName = document.getElementById('event-name').value;

        // Generate certificate for each participant
        generateCertificate(participantName, institutionName, eventName);
    }

    // Execute the callback after processing the CSV
    if (callback) {
        callback();
    }
}

function uploadCSV() {
    const input = document.getElementById('csv-file');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;

            // Pass a callback to processCSV
            processCSV(csvData, function () {
                // Certificate generation is complete; you can put additional logic here if needed
            });
        };

        reader.readAsText(file);

        // Display the selected file name
        document.getElementById('selected-csv').textContent = `Selected CSV: ${file.name}`;
    } else {
        alert('Please select a CSV file.');
    }
}

function generateCertificate(participantName, institutionName, eventName) {
    if (!templateImage) {
        console.error('No template selected');
        return;
    }

    // Create a new image element for the template (to avoid modifying the original templateImage)
    const templateCopy = new Image();
    templateCopy.src = templateImage.src;

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to the original size of the template image
    canvas.width = templateCopy.naturalWidth;
    canvas.height = templateCopy.naturalHeight;

    // Draw the template image on the canvas
    context.drawImage(templateCopy, 0, 0, templateCopy.naturalWidth, templateCopy.naturalHeight);

    // Add text to the canvas at specific coordinates
    context.fillStyle = 'black'; // Set text color to black
    context.font = 'bold 50px Arial';

    // Define the x, y coordinates for placing text (replace these values with your actual coordinates)
    const participantNameX = 682;
    const participantNameY = 707;
    const institutionNameX = 295;
    const institutionNameY = 883;
    const eventNameX = 953;
    const eventNameY = 984;

    // Add participant name
    context.fillText(participantName, participantNameX, participantNameY);

    // Add institution name
    context.fillText(institutionName, institutionNameX, institutionNameY);

    // Add event name
    context.fillText(eventName, eventNameX, eventNameY);

    // Create a data URL for the canvas
    const dataUrl = canvas.toDataURL('image/png');

    // Add the generated image to the zip file
    zip.file(`${participantName}_Certificate.png`, dataUrl.split(',')[1], { base64: true });
}

function downloadZip() {
    // Generate a Blob containing the zip file
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
        // Create a data URL for the zip file
        const zipDataUrl = URL.createObjectURL(blob);

        // Open a new window
        const newWindow = window.open();
        newWindow.document.write('<html><body>');

        // Create a download link in the new window
        newWindow.document.write(`<a href="${zipDataUrl}" download="Certificates.zip">Download Certificates</a>`);

        // Close the HTML document
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    });
}
