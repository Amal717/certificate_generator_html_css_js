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

function generateCertificate(participantName) {
    if (!templateImage) {
        console.error('No template selected');
        return;
    }

    // Get other form data
    const institutionName = document.getElementById('institution-name').value;
    const eventName = document.getElementById('event-name').value;

    // Define the x, y coordinates for placing text (replace these values with your actual coordinates)
    const participantNameX = 682;
    const participantNameY = 707;
    const institutionNameX = 368;
    const institutionNameY = 883;
    const eventNameX = 1012;
    const eventNameY = 984;

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to the original size of the template image
    canvas.width = templateImage.naturalWidth;
    canvas.height = templateImage.naturalHeight;

    // Draw the template image on the canvas
    context.drawImage(templateImage, 0, 0, templateImage.naturalWidth, templateImage.naturalHeight);

    // Add text to the canvas at specific coordinates
    context.fillStyle = 'black'; // Set text color to black
    context.font = 'bold 50px Arial';

    // Add participant name
    context.fillText(participantName, participantNameX, participantNameY);

    // Add institution name
    context.fillText(institutionName, institutionNameX, institutionNameY);

    // Add event name
    context.fillText(eventName, eventNameX, eventNameY);

    // Convert the canvas to a data URL representing a PNG
    const imageDataURL = canvas.toDataURL('image/png');

    return { participantName, imageDataURL };
}

function compressCertificates(certificates) {
    // Use JSZip library to create a zip file
    const zip = new JSZip();

    certificates.forEach(({ participantName, imageDataURL }) => {
        const folder = zip.folder(participantName);
        folder.file(`${participantName}_certificate.png`, imageDataURL.split(';base64,')[1], { base64: true });
    });

    // Generate a blob from the zip
    return zip.generateAsync({ type: 'blob' })
        .then(blob => {
            // Create a download link for the zip file
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'certificates.zip';
            document.body.appendChild(downloadLink);

            // Trigger a click event on the link to start the download
            downloadLink.click();

            // Remove the link from the DOM
            document.body.removeChild(downloadLink);
        })
        .catch(error => {
            console.error('Error generating zip file:', error);
        });
}

function processCSV(csvData) {
    const lines = csvData.split('\n');

    const certificates = [];

    for (let i = 1; i < lines.length; i++) {
        const participantName = lines[i].trim();
        if (participantName !== '') {
            const certificate = generateCertificate(participantName);
            certificates.push(certificate);
        }
    }

    // After processing all certificates, compress them into a zip file
    compressCertificates(certificates);
}

function generateAndDownloadCertificates() {
    // Get the participant name from the CSV file
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
            // This button click triggers the CSV processing and downloading of the zip file
            generateAndDownloadCertificates();
        });
    }
});
